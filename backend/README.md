# Online Click & Collect FastAPI backend

This service is intentionally separate from the Vercel React frontend. It uses Neon PostgreSQL for persistence and validates the same JWT access tokens used by the frontend.

## Required environment variables

```env
DATABASE_URL=postgresql+psycopg://...
JWT_SECRET=...
JWT_ALGORITHM=HS256
CORS_ORIGINS=https://your-vercel-domain.vercel.app,http://localhost:3000
```

Never commit `.env` or database credentials. Run `schema.sql` once against Neon, then start the service with `uvicorn main:app --host 0.0.0.0 --port 8000` from this directory. Set the Vercel variable `VITE_FASTAPI_URL` to the deployed API URL.

## Cancellation contract

`POST /api/me/orders/{order_id}/cancel` requires `Authorization: Bearer <jwt>` and accepts an optional JSON body such as `{ "reason": "Changed my mind" }`. The endpoint only updates an order when the authenticated JWT subject matches `orders.user_id` and the current status is `Pending`. It returns `409` for non-pending orders, `404` when the order is not owned by the user or does not exist, and the updated order on success.

The frontend intentionally shows a direct owner WhatsApp button after cancellation so the customer can explain the reason without adding an automated provider integration.
