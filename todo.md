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
