"""Railway-ready FastAPI backend for Online Click & Collect.

Set DATABASE_URL, JWT_SECRET, CORS_ORIGINS and optionally ADMIN_EMAILS before starting.
The API uses Neon PostgreSQL through SQLAlchemy and JWT Bearer authentication.
"""
from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import os
import re
import secrets
from pathlib import Path
from typing import Generator

import jwt
from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60 * 24 * 7
    cors_origins: str = "http://localhost:3000"
    admin_emails: str = ""
    media_dir: str = "uploads"
    public_base_url: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings(database_url=os.getenv("DATABASE_URL", ""), jwt_secret=os.getenv("JWT_SECRET", ""))
if not settings.database_url or not settings.jwt_secret:
    raise RuntimeError("DATABASE_URL and JWT_SECRET are required")

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
media_path = Path(settings.media_dir)
media_path.mkdir(parents=True, exist_ok=True)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: secrets.token_urlsafe(16))
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class Product(Base):
    __tablename__ = "products"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(120), index=True, nullable=False)
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)


class Category(Base):
    __tablename__ = "categories"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class GalleryImage(Base):
    __tablename__ = "gallery_images"
    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: secrets.token_urlsafe(16))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    alt: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Favorite(Base):
    __tablename__ = "favorites"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_favorite_user_product"),)


class CartItem(Base):
    __tablename__ = "cart_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_cart_user_product"),)


class Address(Base):
    __tablename__ = "addresses"
    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: secrets.token_urlsafe(16))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    label: Mapped[str] = mapped_column(String(80), nullable=False)
    recipient_name: Mapped[str] = mapped_column(String(160), nullable=False)
    phone: Mapped[str] = mapped_column(String(32), nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=False)
    address_line: Mapped[str] = mapped_column(Text, nullable=False)
    landmark: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class Order(Base):
    __tablename__ = "orders"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    customer_name: Mapped[str] = mapped_column(String(160), nullable=False)
    phone: Mapped[str] = mapped_column(String(32), nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=False)
    address_line: Mapped[str] = mapped_column(Text, nullable=False)
    subtotal: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    delivery_charge: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    total: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(32), index=True, nullable=False, default="Pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cancellation_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)


class OrderItem(Base):
    __tablename__ = "order_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(64), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    unit_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)


class Review(Base):
    __tablename__ = "reviews"
    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: secrets.token_urlsafe(16))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    __table_args__ = (UniqueConstraint("user_id", "order_id", name="uq_review_user_order"),)


class AuthPayload(BaseModel):
    name: str | None = None
    email: str
    password: str = Field(min_length=8)


class FavoritePayload(BaseModel):
    product_ids: list[str]


class AddressPayload(BaseModel):
    label: str
    recipient_name: str
    phone: str
    city: str
    address_line: str
    landmark: str | None = None
    is_default: bool = False


class CartPayload(BaseModel):
    product_id: str
    quantity: int = Field(ge=1, le=99)


class CheckoutItem(BaseModel):
    product_id: str
    quantity: int = Field(ge=1, le=99)


class CheckoutPayload(BaseModel):
    customer_name: str
    phone: str
    city: str
    address_line: str
    items: list[CheckoutItem]
    delivery_charge: float = Field(ge=0)


class StatusPayload(BaseModel):
    status: str


class CancelPayload(BaseModel):
    reason: str | None = None


class ReviewPayload(BaseModel):
    order_number: str
    rating: int = Field(ge=1, le=5)
    text: str = Field(min_length=10, max_length=3000)


app = FastAPI(title="Online Click & Collect API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=[x.strip() for x in settings.cors_origins.split(",") if x.strip()], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.mount("/uploads", StaticFiles(directory=str(media_path)), name="uploads")


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 210_000)
    return f"pbkdf2_sha256$210000${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, rounds, salt_hex, digest_hex = encoded.split("$")
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), int(rounds)).hex()
        return algorithm == "pbkdf2_sha256" and hmac.compare_digest(actual, digest_hex)
    except (ValueError, TypeError):
        return False


def token_for(user: User) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode({"sub": user.id, "email": user.email, "is_admin": user.is_admin, "iat": now, "exp": now + timedelta(minutes=settings.access_token_minutes)}, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = jwt.decode(authorization.split(" ", 1)[1].strip(), settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc
    user = db.get(User, str(user_id)) if user_id else None
    if user is None:
        raise HTTPException(status_code=401, detail="User no longer exists")
    return user


def optional_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)) -> User | None:
    if not authorization:
        return None
    return current_user(authorization, db)


def admin_user(user: User = Depends(current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


def product_out(product: Product) -> dict:
    return {"id": product.id, "name": product.name, "category": product.category, "price": float(product.price), "stock": product.stock, "image_url": product.image_url, "is_active": product.is_active, "description": product.description}


def order_out(order: Order) -> dict:
    return {"id": order.id, "customer_name": order.customer_name, "phone": order.phone, "city": order.city, "address_line": order.address_line, "subtotal": float(order.subtotal), "delivery_charge": float(order.delivery_charge), "total": float(order.total), "status": order.status, "created_at": order.created_at.isoformat()}


def address_out(address: Address) -> dict:
    return {"id": address.id, "label": address.label, "recipient_name": address.recipient_name, "phone": address.phone, "city": address.city, "address_line": address.address_line, "landmark": address.landmark, "is_default": address.is_default}


def category_out(category: Category, product_count: int = 0) -> dict:
    return {"id": category.id, "name": category.name, "is_active": category.is_active, "product_count": product_count}


def gallery_out(image: GalleryImage) -> dict:
    url = image.url if image.url.startswith("http") or not settings.public_base_url else f"{settings.public_base_url.rstrip('/')}{image.url}"
    return {"id": image.id, "url": url, "alt": image.alt, "sort_order": image.sort_order}


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        existing = {name.casefold() for name in db.scalars(select(Category.name)).all()}
        product_names = db.scalars(select(Product.category).distinct()).all()
        for name in product_names:
            if name and name.casefold() not in existing:
                slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or secrets.token_hex(4)
                db.add(Category(id=f"CAT-{slug[:48].upper()}", name=name.strip()))
        db.commit()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/auth/signup")
def signup(payload: AuthPayload, db: Session = Depends(get_db)) -> dict:
    email = payload.email.strip().lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    admin_emails = {x.strip().lower() for x in settings.admin_emails.split(",") if x.strip()}
    user = User(name=(payload.name or email.split("@")[0]).strip(), email=email, password_hash=hash_password(payload.password), is_admin=email in admin_emails)
    db.add(user); db.commit(); db.refresh(user)
    return {"access_token": token_for(user), "token_type": "bearer", "user": {"id": user.id, "name": user.name, "email": user.email, "is_admin": user.is_admin}}


@app.post("/api/auth/login")
def login(payload: AuthPayload, db: Session = Depends(get_db)) -> dict:
    email = payload.email.strip().lower()
    user = db.scalar(select(User).where(User.email == email))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    admin_emails = {x.strip().lower() for x in settings.admin_emails.split(",") if x.strip()}
    if email in admin_emails and not user.is_admin:
        user.is_admin = True
        db.commit()
        db.refresh(user)
    return {"access_token": token_for(user), "token_type": "bearer", "user": {"id": user.id, "name": user.name, "email": user.email, "is_admin": user.is_admin}}


@app.get("/api/auth/me")
def me(user: User = Depends(current_user)) -> dict:
    return {"id": user.id, "name": user.name, "email": user.email, "is_admin": user.is_admin}


@app.get("/api/categories")
def categories(db: Session = Depends(get_db)) -> list[dict]:
    return [{"id": item.id, "name": item.name, "is_active": item.is_active} for item in db.scalars(select(Category).where(Category.is_active.is_(True)).order_by(Category.name)).all()]


@app.get("/api/admin/categories")
def admin_categories(db: Session = Depends(get_db), _: User = Depends(admin_user)) -> list[dict]:
    items = db.scalars(select(Category).order_by(Category.name)).all()
    return [category_out(item, db.query(Product).filter(Product.category == item.name).count()) for item in items]


@app.post("/api/categories")
def create_category(payload: dict, db: Session = Depends(get_db), _: User = Depends(admin_user)) -> dict:
    name = str(payload.get("name") or "").strip()
    if not name or len(name) > 120:
        raise HTTPException(status_code=422, detail="Category name is required and must be 120 characters or fewer")
    if db.scalar(select(Category).where(Category.name.ilike(name))):
        raise HTTPException(status_code=409, detail="A category with this name already exists")
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or secrets.token_hex(4)
    category = Category(id=f"CAT-{slug[:48].upper()}-{secrets.token_hex(2).upper()}", name=name, is_active=payload.get("is_active", True))
    db.add(category); db.commit(); db.refresh(category)
    return category_out(category)


@app.patch("/api/categories/{category_id}")
def update_category(category_id: str, payload: dict, db: Session = Depends(get_db), _: User = Depends(admin_user)) -> dict:
    category = db.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    new_name = str(payload.get("name", category.name)).strip()
    if not new_name or len(new_name) > 120:
        raise HTTPException(status_code=422, detail="Category name is required and must be 120 characters or fewer")
    duplicate = db.scalar(select(Category).where(Category.name.ilike(new_name), Category.id != category_id))
    if duplicate:
        raise HTTPException(status_code=409, detail="A category with this name already exists")
    old_name = category.name
    category.name = new_name
    if old_name != new_name:
        for product in db.scalars(select(Product).where(Product.category == old_name)).all():
            product.category = new_name
    if "is_active" in payload:
        category.is_active = bool(payload["is_active"])
    db.commit(); db.refresh(category)
    return category_out(category, db.query(Product).filter(Product.category == category.name).count())


@app.delete("/api/categories/{category_id}")
def delete_category(category_id: str, replacement_category: str | None = None, db: Session = Depends(get_db), _: User = Depends(admin_user)) -> dict:
    category = db.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    linked = db.scalars(select(Product).where(Product.category == category.name)).all()
    if linked and not replacement_category:
        raise HTTPException(status_code=409, detail=f"{len(linked)} product(s) use this category. Rename it or provide a replacement category first.")
    if linked:
        replacement = db.scalar(select(Category).where(Category.name.ilike(replacement_category.strip()), Category.id != category_id, Category.is_active.is_(True)))
        if replacement is None:
            raise HTTPException(status_code=422, detail="Choose an existing active replacement category")
        for product in linked:
            product.category = replacement.name
    db.delete(category); db.commit()
    return {"ok": True}


@app.get("/api/products")
def products(db: Session = Depends(get_db)) -> list[dict]:
    return [product_out(item) for item in db.scalars(select(Product).where(Product.is_active.is_(True)).order_by(Product.name)).all()]


@app.get("/api/products/{product_id}")
def product(product_id: str, db: Session = Depends(get_db)) -> dict:
    item = db.get(Product, product_id)
    if item is None or not item.is_active:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_out(item)


@app.post("/api/products")
def create_product(payload: dict, db: Session = Depends(get_db), _: User = Depends(admin_user)) -> dict:
    item = Product(id=str(payload.get("id") or f"OCC-{secrets.token_hex(3).upper()}"), name=payload["name"], category=payload["category"], price=payload["price"], stock=payload.get("stock", 0), image_url=payload.get("image_url"), is_active=payload.get("is_active", True), description=payload.get("description"))
    db.add(item); db.commit(); db.refresh(item)
    return product_out(item)


@app.patch("/api/products/{product_id}")
def update_product(product_id: str, payload: dict, db: Session = Depends(get_db), _: User = Depends(admin_user)) -> dict:
    item = db.get(Product, product_id)
    if item is None: raise HTTPException(status_code=404, detail="Product not found")
    for key in ("name", "category", "price", "stock", "image_url", "is_active", "description"):
        if key in payload: setattr(item, key, payload[key])
    db.commit(); db.refresh(item)
    return product_out(item)


@app.get("/api/products/{product_id}/gallery")
def get_gallery(product_id: str, db: Session = Depends(get_db)) -> list[dict]:
    return [gallery_out(image) for image in db.scalars(select(GalleryImage).where(GalleryImage.product_id == product_id).order_by(GalleryImage.sort_order)).all()]


@app.post("/api/products/{product_id}/gallery")
def upload_gallery(product_id: str, file: UploadFile = File(...), db: Session = Depends(get_db), _: User = Depends(admin_user)) -> dict:
    if db.get(Product, product_id) is None: raise HTTPException(status_code=404, detail="Product not found")
    extension = Path(file.filename or "image.jpg").suffix.lower() or ".jpg"
    if extension not in {".jpg", ".jpeg", ".png", ".webp"}: raise HTTPException(status_code=400, detail="Only JPG, PNG, and WEBP images are allowed")
    filename = f"{product_id}-{secrets.token_hex(8)}{extension}"
    destination = media_path / filename
    destination.write_bytes(file.file.read())
    next_order = len(db.scalars(select(GalleryImage).where(GalleryImage.product_id == product_id)).all())
    image = GalleryImage(product_id=product_id, url=f"/uploads/{filename}", alt=file.filename, sort_order=next_order)
    db.add(image); db.commit(); db.refresh(image)
    return gallery_out(image)


@app.delete("/api/products/{product_id}/gallery/{image_id}")
def delete_gallery(product_id: str, image_id: str, db: Session = Depends(get_db), _: User = Depends(admin_user)) -> dict:
    image = db.scalar(select(GalleryImage).where(GalleryImage.id == image_id, GalleryImage.product_id == product_id))
    if image is None: raise HTTPException(status_code=404, detail="Gallery image not found")
    db.delete(image); db.commit(); return {"ok": True}


@app.put("/api/products/{product_id}/gallery/reorder")
def reorder_gallery(product_id: str, payload: dict, db: Session = Depends(get_db), _: User = Depends(admin_user)) -> list[dict]:
    image_ids = payload.get("image_ids", [])
    images = {image.id: image for image in db.scalars(select(GalleryImage).where(GalleryImage.product_id == product_id)).all()}
    for index, image_id in enumerate(image_ids):
        if image_id in images: images[image_id].sort_order = index
    db.commit()
    return [gallery_out(image) for image in sorted(images.values(), key=lambda value: value.sort_order)]


@app.get("/api/me/favorites")
def get_favorites(user: User = Depends(current_user), db: Session = Depends(get_db)) -> list[str]:
    return [item.product_id for item in db.scalars(select(Favorite).where(Favorite.user_id == user.id)).all()]


@app.put("/api/me/favorites")
def sync_favorites(payload: FavoritePayload, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    current = db.scalars(select(Favorite).where(Favorite.user_id == user.id)).all()
    for item in current: db.delete(item)
    for product_id in dict.fromkeys(payload.product_ids):
        product_item = db.get(Product, product_id)
        if product_item and product_item.is_active:
            db.add(Favorite(user_id=user.id, product_id=product_id))
    db.commit(); return {"ok": True}


@app.get("/api/me/cart")
def get_cart(user: User = Depends(current_user), db: Session = Depends(get_db)) -> list[dict]:
    return [{"product": product_out(db.get(Product, item.product_id)), "quantity": item.quantity} for item in db.scalars(select(CartItem).where(CartItem.user_id == user.id)).all() if db.get(Product, item.product_id)]


@app.post("/api/me/cart")
def add_cart(payload: CartPayload, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    product_item = db.get(Product, payload.product_id)
    if product_item is None or not product_item.is_active: raise HTTPException(status_code=404, detail="Product not found")
    if payload.quantity > product_item.stock: raise HTTPException(status_code=409, detail="Not enough stock")
    item = db.scalar(select(CartItem).where(CartItem.user_id == user.id, CartItem.product_id == payload.product_id))
    if item: item.quantity = min(item.quantity + payload.quantity, product_item.stock)
    else: db.add(CartItem(user_id=user.id, product_id=payload.product_id, quantity=payload.quantity))
    db.commit(); return {"ok": True}


@app.delete("/api/me/cart/{product_id}")
def remove_cart(product_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    item = db.scalar(select(CartItem).where(CartItem.user_id == user.id, CartItem.product_id == product_id))
    if item: db.delete(item); db.commit()
    return {"ok": True}


@app.get("/api/me/addresses")
def get_addresses(user: User = Depends(current_user), db: Session = Depends(get_db)) -> list[dict]:
    return [address_out(item) for item in db.scalars(select(Address).where(Address.user_id == user.id)).all()]


@app.post("/api/me/addresses")
def save_address(payload: AddressPayload, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    if payload.is_default:
        for item in db.scalars(select(Address).where(Address.user_id == user.id)).all(): item.is_default = False
    item = Address(user_id=user.id, **payload.model_dump())
    db.add(item); db.commit(); db.refresh(item); return address_out(item)


@app.delete("/api/me/addresses/{address_id}")
def delete_address(address_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    item = db.scalar(select(Address).where(Address.id == address_id, Address.user_id == user.id))
    if item: db.delete(item); db.commit()
    return {"ok": True}


CITY_RATES = {"Karachi": 150, "Lahore": 250, "Islamabad": 250, "Rawalpindi": 250, "Faisalabad": 250, "Multan": 250, "Peshawar": 300, "Quetta": 300}


@app.post("/api/orders")
def create_order(payload: CheckoutPayload, user: User | None = Depends(optional_user), db: Session = Depends(get_db)) -> dict:
    # Checkout can be created through WhatsApp without login; authenticated checkout may be added by sending a Bearer token.
    subtotal = 0.0; rows: list[tuple[Product, int]] = []
    for line in payload.items:
        item = db.get(Product, line.product_id)
        if item is None or not item.is_active: raise HTTPException(status_code=404, detail=f"Product {line.product_id} not found")
        if line.quantity > item.stock: raise HTTPException(status_code=409, detail=f"Not enough stock for {item.name}")
        rows.append((item, line.quantity)); subtotal += float(item.price) * line.quantity
    delivery = 0.0 if subtotal >= 5000 else CITY_RATES.get(payload.city, payload.delivery_charge)
    order = Order(id=f"OCC-{secrets.token_hex(4).upper()}", user_id=user.id if user else None, customer_name=payload.customer_name, phone=payload.phone, city=payload.city, address_line=payload.address_line, subtotal=subtotal, delivery_charge=delivery, total=subtotal + delivery, status="Pending")
    db.add(order)
    for item, quantity in rows:
        item.stock -= quantity; db.add(OrderItem(order_id=order.id, product_id=item.id, product_name=item.name, unit_price=item.price, quantity=quantity))
    db.commit(); db.refresh(order); return order_out(order)


@app.get("/api/orders")
def all_orders(_: User = Depends(admin_user), db: Session = Depends(get_db)) -> list[dict]:
    return [order_out(order) for order in db.scalars(select(Order).order_by(Order.created_at.desc())).all()]


@app.get("/api/me/orders")
def my_orders(user: User = Depends(current_user), db: Session = Depends(get_db)) -> list[dict]:
    return [order_out(order) for order in db.scalars(select(Order).where(Order.user_id == user.id).order_by(Order.created_at.desc())).all()]


@app.get("/api/orders/{order_id}/tracking")
def tracking(order_id: str, db: Session = Depends(get_db)) -> dict:
    order = db.get(Order, order_id)
    if order is None: raise HTTPException(status_code=404, detail="Order not found")
    return {"id": order.id, "total": float(order.total), "status": order.status, "created_at": order.created_at.isoformat()}


@app.patch("/api/orders/{order_id}/status")
def update_status(order_id: str, payload: StatusPayload, _: User = Depends(admin_user), db: Session = Depends(get_db)) -> dict:
    allowed = {"Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"}
    if payload.status not in allowed: raise HTTPException(status_code=400, detail="Invalid order status")
    order = db.get(Order, order_id)
    if order is None: raise HTTPException(status_code=404, detail="Order not found")
    if payload.status == "Cancelled" and order.status != "Cancelled":
        for line in db.scalars(select(OrderItem).where(OrderItem.order_id == order.id)).all():
            product_item = db.get(Product, line.product_id)
            if product_item: product_item.stock += line.quantity
        order.cancelled_at = datetime.now(timezone.utc)
    order.status = payload.status
    db.commit(); db.refresh(order); return order_out(order)


@app.post("/api/me/orders/{order_id}/cancel")
def cancel_order(order_id: str, body: CancelPayload | None = None, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    order = db.scalar(select(Order).where(Order.id == order_id, Order.user_id == user.id))
    if order is None: raise HTTPException(status_code=404, detail="Order not found")
    if order.status.lower() != "pending": raise HTTPException(status_code=409, detail="Only pending orders can be cancelled")
    for line in db.scalars(select(OrderItem).where(OrderItem.order_id == order.id)).all():
        product_item = db.get(Product, line.product_id)
        if product_item: product_item.stock += line.quantity
    order.status = "Cancelled"; order.cancelled_at = datetime.now(timezone.utc); order.cancellation_reason = body.reason.strip() if body and body.reason else None
    db.commit(); db.refresh(order); return order_out(order)


@app.post("/api/reviews")
def submit_review(payload: ReviewPayload, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    order = db.scalar(select(Order).where(Order.id == payload.order_number, Order.user_id == user.id, Order.status == "Delivered"))
    if order is None: raise HTTPException(status_code=400, detail="Only delivered orders can be reviewed")
    if db.scalar(select(Review).where(Review.user_id == user.id, Review.order_id == order.id)): raise HTTPException(status_code=409, detail="This order already has a review")
    db.add(Review(user_id=user.id, order_id=order.id, rating=payload.rating, text=payload.text.strip())); db.commit(); return {"ok": True}


@app.get("/api/reviews")
def public_reviews(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.scalars(select(Review).where(Review.approved.is_(True)).order_by(Review.created_at.desc())).all()
    return [{"id": row.id, "order_number": row.order_id, "rating": row.rating, "text": row.text, "created_at": row.created_at.isoformat()} for row in rows]


@app.patch("/api/reviews/{review_id}/approval")
def review_approval(review_id: str, payload: dict, _: User = Depends(admin_user), db: Session = Depends(get_db)) -> dict:
    review = db.get(Review, review_id)
    if review is None: raise HTTPException(status_code=404, detail="Review not found")
    review.approved = bool(payload.get("approved", False)); db.commit()
    return {"ok": True, "approved": review.approved}


@app.get("/api/me/recommendations")
def recommendations(user: User = Depends(current_user), db: Session = Depends(get_db)) -> list[dict]:
    favorite_ids = {item.product_id for item in db.scalars(select(Favorite).where(Favorite.user_id == user.id)).all()}
    ordered_categories = {product.category for product in db.scalars(select(Product).join(OrderItem, Product.id == OrderItem.product_id).join(Order, Order.id == OrderItem.order_id).where(Order.user_id == user.id)).all()}
    all_products = db.scalars(select(Product).where(Product.is_active.is_(True))).all()
    ranked = sorted(all_products, key=lambda item: (item.id in favorite_ids, item.category in ordered_categories), reverse=True)
    return [product_out(item) for item in ranked[:12]]
