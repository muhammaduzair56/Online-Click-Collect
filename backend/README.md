# Online Click & Collect — FastAPI + Neon backend

This is the separate API service for the Vercel React storefront. It is designed for Railway deployment and uses Neon PostgreSQL through SQLAlchemy. The service creates the tables on startup and also includes `schema.sql` for a controlled Neon setup.

## Railway variables

Add these variables in Railway; no secret values are committed to GitHub:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon connection string, preferably `postgresql+psycopg://...?...sslmode=require` |
| `JWT_SECRET` | Long random secret used to sign access tokens |
| `JWT_ALGORITHM` | Normally `HS256` |
| `CORS_ORIGINS` | Comma-separated Vercel URL and local development URL |
| `ADMIN_EMAILS` | Comma-separated owner/admin email addresses |
| `ACCESS_TOKEN_MINUTES` | Token lifetime; default is 10080 minutes |
| `MEDIA_DIR` | Upload directory; default is `uploads` |
| `PUBLIC_BASE_URL` | Railway public API URL so gallery image links work from Vercel |

Set Railway’s root directory to `backend`, or use the start command `uvicorn main:app --host 0.0.0.0 --port $PORT`. After deployment, set Vercel’s `VITE_FASTAPI_URL` to the Railway public URL. Replace the frontend fallback WhatsApp number with `VITE_WHATSAPP_NUMBER` in Vercel.

## Implemented API surface

| Area | Endpoints |
|---|---|
| Health | `GET /health` |
| Authentication | `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me` |
| Products | `GET /api/products`, `GET /api/products/{id}`, `POST /api/products`, `PATCH /api/products/{id}` |
| Gallery | `GET/POST /api/products/{id}/gallery`, `DELETE /api/products/{id}/gallery/{image_id}`, `PUT /api/products/{id}/gallery/reorder` |
| Favorites | `GET/PUT /api/me/favorites` |
| Cart | `GET /api/me/cart`, `POST /api/me/cart`, `DELETE /api/me/cart/{product_id}` |
| Addresses | `GET/POST /api/me/addresses`, `DELETE /api/me/addresses/{address_id}` |
| Orders | `POST /api/orders`, `GET /api/orders`, `GET /api/me/orders`, `GET /api/orders/{id}/tracking`, `PATCH /api/orders/{id}/status` |
| Cancellation | `POST /api/me/orders/{id}/cancel` for the authenticated owner’s Pending order only |
| Reviews | `POST /api/reviews` for a delivered order owned by the current user; `GET /api/reviews` approved reviews; `PATCH /api/reviews/{id}/approval` admin moderation |
| Recommendations | `GET /api/me/recommendations` ranked from favorites and order history |

All customer/admin endpoints use `Authorization: Bearer <access_token>`. Admin endpoints require the email to be listed in `ADMIN_EMAILS` at signup/login time.

## WhatsApp behavior

There is no Meta Cloud API, Twilio, webhook, or automatic provider messaging in this backend. The storefront creates a direct `wa.me` link containing the cart lines, city, delivery charge, and total. The customer opens WhatsApp and presses Send; the owner then confirms the order manually. After cancellation, the profile also shows a direct owner WhatsApp link with the order ID and a reason prompt.

## Storage note

Gallery uploads currently save under `MEDIA_DIR` and are served from `/uploads`. Railway’s local filesystem should be treated as temporary. For permanent product images, connect an object-storage provider later and replace the upload handler with S3 or Cloudinary storage; no provider credentials are required for the current code to start.
