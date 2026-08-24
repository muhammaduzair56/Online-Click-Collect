"""Online Click & Collect FastAPI service.

Production contract:
- Neon PostgreSQL through DATABASE_URL
- JWT access tokens issued by the existing auth service and validated with JWT_SECRET
- Protected POST /api/me/orders/{order_id}/cancel
"""
from datetime import datetime, timezone
import os
from typing import Generator

import jwt
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import DateTime, Integer, Numeric, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    cors_origins: str = "http://localhost:3000"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings(
    database_url=os.environ.get("DATABASE_URL", ""),
    jwt_secret=os.environ.get("JWT_SECRET", ""),
)
if not settings.database_url or not settings.jwt_secret:
    raise RuntimeError("DATABASE_URL and JWT_SECRET are required")

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


class Order(Base):
    __tablename__ = "orders"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    customer_name: Mapped[str] = mapped_column(String(160), nullable=False)
    phone: Mapped[str] = mapped_column(String(32), nullable=False)
    total: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(32), index=True, nullable=False, default="Pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cancellation_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)


class CancellationRequest(BaseModel):
    reason: str | None = None


app = FastAPI(title="Online Click & Collect API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def current_user_id(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc
    user_id = payload.get("sub") or payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has no user subject")
    return str(user_id)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/me/orders/{order_id}/cancel")
def cancel_order(
    order_id: str,
    body: CancellationRequest | None = None,
    user_id: str = Depends(current_user_id),
    db: Session = Depends(get_db),
) -> Order:
    order = db.scalar(select(Order).where(Order.id == order_id, Order.user_id == user_id))
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if order.status.lower() != "pending":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Only pending orders can be cancelled")
    order.status = "Cancelled"
    order.cancelled_at = datetime.now(timezone.utc)
    order.cancellation_reason = (body.reason.strip() if body and body.reason else None)
    db.commit()
    db.refresh(order)
    return order


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(engine)
