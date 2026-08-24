# Online Click & Collect — Vercel deployment

The repository is configured for a Vite frontend deployment on Vercel. Import the GitHub repository `muhammaduzair56/Online-Click-Collect`, keep the project root at the repository root, and use the committed `vercel.json` settings.

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `pnpm build` |
| Output directory | `dist/public` |
| Install command | Vercel automatic pnpm install |

Add these variables in Vercel Project Settings → Environment Variables:

| Variable | Value | Required |
|---|---|---|
| `VITE_FASTAPI_URL` | Deployed Railway API URL, without a trailing slash | For live products, orders, auth, favorites and tracking |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number in international format, e.g. `923001234567` | Recommended |

After the first deployment, verify `/`, `/product/OCC-001`, `/profile`, `/favorites`, `/track-order`, `/faq`, `/contact`, `/login`, and `/signup`. The SPA rewrite in `vercel.json` is included so direct links to these client-side routes resolve correctly.

The FastAPI service remains a separate Railway deployment. Set its CORS origins to the final Vercel domain and then set that Railway URL as `VITE_FASTAPI_URL` in Vercel. Do not place Neon credentials or JWT secrets in Vercel frontend variables; those remain backend-only on Railway.
