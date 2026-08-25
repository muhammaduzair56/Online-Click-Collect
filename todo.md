# Online Click & Collect — Revision Tasks

- [ ] Search bar ko homepage product catalogue ke saath fully connect karke clear empty state dikhani hai.
- [ ] Category filters ko mobile-friendly horizontal controls aur active state ke saath polish karna hai.
- [ ] Cart add action par loading state aur success toast add karna hai.
- [ ] WhatsApp checkout action par short loading state, disabled state, aur success confirmation add karni hai.
- [ ] FAQ accordion section add karna hai.
- [ ] Contact Us route/page add karna hai.
- [ ] Contact page par delivery, COD, return aur exchange details clearly show karni hain.
- [ ] FAQ aur Contact navigation ko header/footer se connect karna hai.
- [ ] Desktop aur mobile screenshots ke saath final flows verify karne hain.

## Next revision

- [x] Product detail route aur related-products section add karna hai.
- [x] FastAPI adapter mein product detail, customer orders aur saved addresses contracts add karne hain.
- [x] Customer profile route mein order history aur address management states add karni hain.
- [x] Profile navigation aur customer auth/connection states clearly show karni hain.
- [x] Header mein dark-mode toggle add karke theme persistence verify karni hai.
- [x] Dark mode mein contrast, product images, forms, FAQ aur Contact pages polish karni hain.
- [x] Product detail, profile aur dark mode ko desktop/mobile previews mein verify karna hai.

## Navigation, favorites, and gallery revision

- [x] Navbar ko sticky/frosted state ke saath set karna hai.
- [x] Wishlist/favorites ko local persistence aur active heart state ke saath add karna hai.
- [x] Mobile floating WhatsApp button aur sticky cart bar add karna hai.
- [x] Product detail page par multiple image gallery aur thumbnail selection add karni hai.
- [x] Product image zoom modal/interaction aur close behavior add karna hai.
- [x] Desktop aur mobile interaction previews verify karne hain.

## FastAPI connection revision

- [ ] Central FastAPI base URL, auth headers, error handling aur API health state define karni hai.
- [ ] Favorites ko local-only se authenticated FastAPI GET/PUT sync flow par move karna hai.
- [ ] Admin product gallery upload input, previews, reorder aur remove states add karni hain.
- [ ] Product gallery save/update endpoints ke frontend adapter methods add karne hain.
- [ ] Frontend ko live API configured/unconfigured/error states ke saath connect karna hai.
- [ ] Vercel environment variables aur FastAPI endpoint contract document karna hai.
- [ ] Favorites, gallery management aur API states desktop/mobile par test karne hain.

## JWT + Neon backend alignment

- [x] API requests mein JWT Bearer token support add karna hai.
- [x] Token save/clear helpers aur unauthorized state define karni hai.
- [x] Favorites sync ko authenticated request ke saath verify karna hai.
- [x] Admin gallery uploads aur order/product requests ko JWT header ke saath wire karna hai.
- [x] Neon PostgreSQL ko frontend se connect na karke FastAPI API boundary document karni hai.
- [x] FastAPI base URL missing/configured states ko clearly handle karna hai.

## Loading and status feedback revision

- [x] Profile order history aur saved addresses ke liye skeleton loading states add karni hain.
- [x] Favorites data ke liye loading/error/empty states add karni hain.
- [x] Admin order status options Pending, Confirmed, Packed, Shipped, Delivered aur Cancelled karni hain.
- [x] Status update ke baad toast, disabled/loading state aur UI reflection add karna hai.
- [x] Login mein spinner, field validation aur invalid-credentials error mapping add karni hai.
- [x] Signup page aur FastAPI signup adapter add karna hai.
- [x] Responsive states aur production build verify karna hai.

## Notifications, session recovery, and recommendations revision

- [x] JWT expiry/401 response par token clear, toast aur login redirect flow add karna hai.
- [x] Redirect ke baad intended path preserve karna hai.
- [x] Admin order-status update ke baad FastAPI notification endpoint call karna hai.
- [x] WhatsApp notification payload, sent/pending/error states aur retry feedback add karna hai.
- [x] Homepage par favorites aur order-history based Recommended for You section add karna hai.
- [x] Recommendation loading, signed-out, no-history aur API-error states add karni hain.
- [x] Responsive flows, TypeScript aur production build verify karna hai.

## Neon recommendations, reviews, and WhatsApp provider revision

- [ ] Neon-backed FastAPI recommendation query contract define karna hai.
- [ ] Favorites aur delivered order-line/category data ko recommendation response se connect karna hai.
- [ ] Profile mein delivered orders filter, one-review-per-order state aur rating form add karna hai.
- [ ] Review submission ko FastAPI approval endpoint se connect karna hai.
- [ ] WhatsApp provider selection, credentials aur notification endpoint contract confirm karna hai.
- [ ] Admin status update ke baad provider-backed notification request, queued/error/retry states add karni hain.
- [ ] End-to-end configured/unconfigured API states aur production build verify karna hai.

## Simplified owner-contact workflow

- [x] Real WhatsApp provider notification call remove/disable karni hai.
- [x] Admin order status update ko internal-only status tracking rakhna hai.
- [x] Customer-facing copy mein direct owner WhatsApp contact clear karna hai.
- [x] Status update ke baad owner-contact CTA aur simple feedback verify karna hai.

## Orders and delivery pricing revision

- [x] FastAPI orders endpoint loading, auth aur error states verify karne hain.
- [x] Admin order status update ko real endpoint response ke saath reflect karna hai.
- [x] Delivery pricing rule define karni hai: Karachi aur Pakistan-wide rates.
- [x] Checkout/cart summary mein subtotal, delivery charge aur grand total show karna hai.
- [x] Free-delivery threshold ya unavailable-area message handle karna hai.
- [x] Sticky navbar desktop/mobile aur checkout totals test karne hain.

## Tracking, filters, city pricing, and GitHub revision

- [x] Public Track Order route aur order-ID form add karna hai.
- [x] FastAPI order-tracking endpoint contract aur loading/error/not-found states add karni hain.
- [x] Admin orders mein status filter, search field aur empty state add karna hai.
- [x] Checkout city dropdown aur city-specific delivery rates define karni hain.
- [x] Subtotal, city delivery charge aur grand total WhatsApp message mein preserve karna hai.
- [x] TypeScript, production build, responsive previews aur GitHub repository push verify karna hai.

## Quick View and order cancellation revision

- [x] FastAPI cancel-order endpoint contract add karna hai.
- [x] Homepage product cards par Quick View action aur accessible modal add karna hai.
- [x] Quick View mein image, price, product details, favorites aur add-to-bag action dikhana hai.
- [x] Profile mein sirf Pending orders ke liye cancel confirmation aur loading/error/success states add karni hain.
- [x] Responsive modal/profile flows, TypeScript aur production build verify karna hai.

## Quick View gallery, FastAPI cancellation, and owner-contact revision

- [x] Quick View ke liye gallery metadata aur frontend image thumbnails contract add karna hai.
- [x] Product stock status ko in-stock, low-stock, out-of-stock states mein show karna hai.
- [x] FastAPI backend directory, Neon DATABASE_URL, JWT_SECRET aur migration/schema documentation add karni hai.
- [x] Protected POST /api/me/orders/{order_id}/cancel endpoint pending-owner order check ke saath implement karna hai.
- [x] Cancelled order ke baad direct owner WhatsApp CTA show karna hai.
- [x] Navbar ko desktop/mobile par sticky, visible aur non-overlapping verify karna hai.
- [x] Frontend/backend tests, build aur GitHub push verify karna hai.

## Complete FastAPI + Neon backend revision

- [x] Frontend api.ts ke tamam endpoints aur request/response types inventory karni hain.
- [x] Neon schema mein users, products, gallery_images, favorites, carts, addresses, orders, order_items, reviews aur status history tables add karni hain.
- [x] JWT signup, login, current-user aur expiry-safe auth dependencies add karni hain.
- [x] Product listing/detail, gallery upload/delete aur admin product management APIs add karni hain.
- [x] Favorites, cart, saved addresses aur delivered-order review APIs add karni hain.
- [x] Checkout/order creation, customer order history, tracking, cancellation, recommendations aur admin order status APIs add karni hain.
- [x] Railway start command, environment template, migrations/schema instructions aur health check document karna hai.
- [x] Frontend API paths ko completed backend contracts ke saath align karna hai.
- [x] Navbar sticky/fixed behavior desktop aur mobile par verify karke final polish karni hai.
- [x] Frontend build, backend syntax/tests aur GitHub push verify karna hai.

## WhatsApp share and navbar search revision

- [x] Quick View modal mein product-specific WhatsApp share message aur public product link add karna hai.
- [x] Sticky navbar mein responsive search input add karna hai.
- [x] Search input ke neeche product-name/category suggestions aur keyboard-friendly selection add karni hai.
- [x] Suggestion select karne par shop results filter/scroll karne hain.
- [x] Mobile/desktop preview, TypeScript aur production build verify karna hai.

## Live FastAPI navbar search

- [x] FastAPI products endpoint se live catalog state load karni hai.
- [x] Live products ko navbar suggestion shape mein normalize karna hai.
- [x] Loading, API error, empty catalog aur local fallback states handle karni hain.
- [x] Suggestion selection ko live product data, filtering aur shop scroll ke saath connect karna hai.
- [x] TypeScript, production build aur responsive preview verify karna hai.

## FastAPI endpoint audit

- [x] GitHub backend ke actual routes aur frontend api.ts contracts compare karne hain.
- [x] Backend import, OpenAPI route registration, auth dependencies aur schema consistency test karni hai.
- [x] Dead/incomplete routes, wrong methods, missing response fields aur frontend mismatches fix karne hain.
- [x] Corrected backend ko verify karke GitHub main branch par push karna hai.

## Fixed navbar correction

- [x] Sticky header ko true fixed header mein convert karna hai.
- [x] Announcement bar ko scroll par collapse/hide karna hai.
- [x] Main content ke liye fixed-header spacer aur anchor offset add karna hai.
- [x] Mobile menu/search/cart ko fixed navbar ke neeche correctly position karna hai.
- [x] Actual scroll, mobile aur desktop previews verify karne hain.

## Design template showcase

- [x] Four clearly different Online Click & Collect design directions define karna.
- [x] Friend ko compare karne ke liye template showcase route banana.
- [x] Har template mein distinct colors, typography, hero composition, nav treatment aur product cards dikhana.
- [x] Template selection interaction aur mobile responsive preview add karna.
- [x] Showcase page verify karke checkpoint save karna.

## Bazaar Editorial complete rebuild

- [x] Attached Bazaar Editorial reference ko ground-truth visual spec ke taur par record karna.
- [x] Current pages/components aur shared CSS system ka audit complete karna.
- [x] Shared cream, terracotta, ink, serif typography, borders aur spacing system rebuild karna.
- [x] Fixed announcement bar, editorial navbar aur reference-matched hero shell rebuild karna.
- [x] Browse by mood category rail, product cards, trust strip aur footer ko reference direction mein rebuild karna.
- [x] Product detail, cart/checkout, profile, favorites, auth, tracking, FAQ, contact aur admin pages ko same theme dena.
- [x] Existing FastAPI/JWT/Neon/WhatsApp functionality ko preserve karke regression test karna.
- [x] Desktop aur mobile screenshots, TypeScript, production build aur final checkpoint verify karna.

## Exact screenshot copy revision

- [x] User-provided screenshot ko homepage ka pixel-faithful ground truth record karna.
- [x] Current homepage ke mismatches identify karke hero, navbar aur offer bar proportions correct karna.
- [x] Screenshot jaisa 3-card horizontal product strip with image/details/actions rebuild karna.
- [x] Screenshot jaisa eight-item Browse by mood rail aur four-item trust strip rebuild karna.
- [x] Functional search, favorites, quick view, cart aur WhatsApp actions ko exact visual composition mein preserve karna.
- [x] Mobile adaptation, desktop visual comparison, TypeScript/build aur final checkpoint verify karna.

## Vercel deployment preparation

- [x] Vercel build root, output directory aur framework configuration audit karna.
- [x] SPA route rewrites aur deployment configuration add karna.
- [x] Vercel environment variables aur FastAPI contract document karna.
- [x] Production build aur direct deep-link routes verify karna.
- [x] Deployment-ready frontend ko GitHub main branch par push karke checkpoint save karna.

## Vercel image loading fix

- [x] Deployed Vercel page par broken image requests identify karna.
- [x] `/manus-storage` production-only references ko deployable public asset URLs se replace karna.
- [x] Hero, logo, product, category aur supporting images ke load states verify karna.
- [ ] Production build, public URL aur GitHub update complete karna.

## Navbar account actions

- [x] Existing navbar auth state aur token handling inspect karna.
- [x] Desktop navbar mein visible Login/Signup ya authenticated Profile/Logout controls add karna.
- [x] Mobile menu mein same account actions add karna.
- [x] Auth navigation, responsive layout, build aur checkpoint verify karna.

## Protected checkout flow

- [x] Cart aur current WhatsApp checkout flow inspect karna.
- [x] Guest ko Add to Cart allow karke Buy/Checkout par Login/Signup requirement add karna.
- [x] Login/Signup ke baad checkout return path aur cart persistence implement karna.
- [x] Delivery details, WhatsApp order preparation, responsive UI aur build verify karna.

## Auth feedback and profile history

- [x] Existing Login/Signup spinner aur disabled submit state audit karna.
- [x] Login/Signup loading, error aur success feedback ko robust banana.
- [x] Logged-in Profile mein FastAPI order history loading, empty, error aur populated states verify/add karna.
- [x] Responsive UI, TypeScript/build aur authenticated flow push/checkpoint verify karna.

## Browser favicon

- [x] Document head aur brand mark asset audit karna.
- [x] Brand mark favicon aur theme metadata add karna.
- [x] Build, favicon URL aur deployment readiness verify karke push/checkpoint save karna.

## Admin product manager

- [x] Existing Admin UI aur FastAPI product create/update contracts audit karna.
- [x] Add Product aur Edit Product reusable form banana.
- [x] Product fields, validation, active status, loading/error/success states connect karna.
- [x] Product list, edit actions aur existing gallery manager ko preserve karke verify karna.
- [x] Responsive admin UI, TypeScript/build, GitHub push aur checkpoint verify karna.

## Direct product image upload

- [x] ProductManager ke current URL/image fields aur gallery upload contract audit karna.
- [x] Add/Edit form mein direct image picker, type/size validation aur preview add karna.
- [x] Create ke baad upload karke returned gallery URL ko main image set karna.
- [x] Edit flow mein uploaded image se main image replace karna aur old gallery behavior preserve karna.
- [x] Upload progress/error states, build, responsive UI, GitHub push aur checkpoint verify karna.

## Bulk gallery image upload

- [x] Existing gallery picker aur upload API contract audit karna.
- [x] Multiple file selection, image type/size validation aur upload queue add karna.
- [x] Progress, success/failure counts aur partial failure feedback add karna.
- [x] Gallery refresh, responsive UI, build, GitHub push aur checkpoint verify karna.

## Gallery delete confirmation

- [x] Existing gallery delete handler aur dialog component audit karna.
- [x] Confirmation popup mein image context, Cancel aur Delete actions add karna.
- [x] Explicit confirmation ke baad hi FastAPI delete request run karna.
- [x] Cancel/delete behavior, responsive UI, build, GitHub push aur checkpoint verify karna.

## Admin category management

- [x] Current product categories, Admin navigation aur FastAPI contracts audit karna.
- [x] Category CRUD backend model/endpoints add karna agar missing hon.
- [x] Dedicated Category Manager UI mein add, edit aur list states banana.
- [x] Product form ko live categories ke saath integrate karna.
- [x] Linked-product safe delete confirmation aur validation add karna.
- [x] Responsive UI, build, GitHub push aur checkpoint verify karna.

## Open Graph social image

- [x] Bazaar Editorial OG image brief aur 1200x630 social format lock karna.
- [x] Branded OG image generate karke public web asset upload karna.
- [x] `og:image` aur Twitter card metadata connect karna.
- [x] Asset URL, metadata, build, GitHub push aur checkpoint verify karna.
