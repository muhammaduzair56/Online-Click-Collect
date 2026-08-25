/*
  Online Click & Collect — Bazaar Atelier page.
  Design reminder: warm Pakistani editorial commerce, cream breathing room, rose-clay accents,
  ink-brown typography, brass details, asymmetrical product storytelling, and calm interactions.
*/
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  MessageCircle,
  LogIn,
  LogOut,
  UserPlus,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { auth, fastApi } from "@/lib/api";
import MobileMenu from "@/components/MobileMenu";

const heroImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/eNpEabmfOdEnGTeq.jpg";
const heroLeftImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/eEPuschtzmcFwIin.jpg";
const kitchenImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/ciyYfUTXATlEKsow.jpg";
const packingImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/yDDyfGzmRkLHLGqp.jpg";
const markImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/HNQkrrBgCofwNJAF.png";
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "923001234567";

const productImages = {
  chopper: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/AftGDRZRuMFQWuUQ.jpg",
  organiser: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/RyETWvrwonSCGcoV.jpg",
  bottle: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/AfirCwLfVymcpEwt.jpg",
  lamp: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
  earbuds: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85",
  stitch: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85",
};

const categories = [
  { name: "Kitchen", note: "Little helpers", image: kitchenImage },
  { name: "Beauty & Care", note: "Everyday rituals", image: productImages.organiser },
  { name: "Home Living", note: "Make space feel good", image: packingImage },
  { name: "Gadgets", note: "Useful by design", image: productImages.earbuds },
];

const products = [
  { id: "OCC-001", name: "Pull & Chop Kitchen Helper", category: "Kitchen", price: 1290, oldPrice: 1690, tag: "Useful find", image: productImages.chopper, color: "rose", stock: 12 },
  { id: "OCC-002", name: "Desk & Vanity Organiser", category: "Beauty & Care", price: 1850, oldPrice: 2290, tag: "New in", image: productImages.organiser, color: "cream", stock: 4 },
  { id: "OCC-003", name: "Gradient Daily Water Bottle", category: "Home Living", price: 1490, oldPrice: 1890, tag: "Bestseller", image: productImages.bottle, color: "sage", stock: 0 },
  { id: "OCC-004", name: "Warm Glow Table Lantern", category: "Home Living", price: 2190, oldPrice: 2790, tag: "Giftable", image: productImages.lamp, color: "gold", stock: 8 },
  { id: "OCC-005", name: "Pocket Wireless Earbuds Case", category: "Gadgets", price: 2490, oldPrice: 2990, tag: "Everyday tech", image: productImages.earbuds, color: "ink", stock: 2 },
  { id: "OCC-006", name: "Handy Stitch Mini Machine", category: "Home Living", price: 2890, oldPrice: 3490, tag: "Smart buy", image: productImages.stitch, color: "blue", stock: 6 },
];

const formatPrice = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;
const deliveryRates: Record<string, { label: string; charge: number }> = { Karachi: { label: "Karachi", charge: 150 }, Lahore: { label: "Lahore", charge: 250 }, Islamabad: { label: "Islamabad", charge: 250 }, Rawalpindi: { label: "Rawalpindi", charge: 250 }, Faisalabad: { label: "Faisalabad", charge: 250 }, Multan: { label: "Multan", charge: 250 }, Peshawar: { label: "Peshawar", charge: 300 }, Quetta: { label: "Quetta", charge: 300 }, Other: { label: "Other city", charge: 300 } };

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All finds");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>(() => { try { return JSON.parse(localStorage.getItem("occ-cart") || "[]") as { id: string; quantity: number }[]; } catch { return []; } });
  const [cartOpen, setCartOpen] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState("Karachi");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(auth.token));
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<(typeof products)[number] | null>(null);
  const [quickViewGallery, setQuickViewGallery] = useState<string[]>([]);
  const [quickViewLoading, setQuickViewLoading] = useState(false);
  const [selectedQuickImage, setSelectedQuickImage] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("occ-favorites") || "[]") as string[]; } catch { return []; } });
  const [recommended, setRecommended] = useState<typeof products>([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<typeof products>(products);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  useEffect(() => { localStorage.setItem("occ-favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("occ-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { const syncAuth = () => setIsAuthenticated(Boolean(auth.token)); window.addEventListener("storage", syncAuth); return () => window.removeEventListener("storage", syncAuth); }, []);
  useEffect(() => { if (auth.token && new URLSearchParams(window.location.search).get("checkout") === "1") { setCartOpen(true); window.history.replaceState({}, "", window.location.pathname); } }, []);
  useEffect(() => { const onScroll = () => setIsScrolled(window.scrollY > 12); window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { if (fastApi.isConfigured) void fastApi.favorites.then((remote) => { if (remote.length) setFavorites(remote); }).catch(() => undefined); }, []);
  useEffect(() => { if (!fastApi.isConfigured) return; setCatalogLoading(true); setCatalogError(""); void fastApi.products.then((remote) => { const normalized = remote.map((item) => { const local = products.find((product) => product.id === item.id); return { ...local, ...item, oldPrice: local?.oldPrice ?? item.price, tag: local?.tag ?? "Live catalog", image: item.image_url || local?.image || productImages.organiser, color: local?.color ?? "cream" }; }); setCatalogProducts(normalized); }).catch((error) => { setCatalogError(error instanceof Error ? error.message : "Live catalog is unavailable"); setCatalogProducts(products); }).finally(() => setCatalogLoading(false)); }, []);
  useEffect(() => { if (!fastApi.isConfigured) return; setRecommendationLoading(true); void fastApi.getRecommendations().then((remote) => { setRecommended(remote.map((item) => ({ ...item, oldPrice: item.price, tag: "Picked for you", image: item.image_url || productImages.organiser, color: "cream" }))); }).catch(() => setRecommended([])).finally(() => setRecommendationLoading(false)); }, []);
  const handleLogout = () => { fastApi.logout(); setIsAuthenticated(false); toast.success("You have been signed out"); };
  const toggleFavorite = (id: string) => { setFavorites((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; if (fastApi.isConfigured) void fastApi.syncFavorites(next).catch(() => toast.error("Could not sync favorites")); return next; }); toast.success(favorites.includes(id) ? "Removed from favorites" : "Saved to favorites"); };
  const openQuickView = async (product: (typeof products)[number]) => { setQuickViewProduct(product); setQuickViewGallery([product.image]); setSelectedQuickImage(product.image); if (!fastApi.isConfigured) return; setQuickViewLoading(true); try { const gallery = await fastApi.getProductGallery(product.id); if (gallery.length) setQuickViewGallery([product.image, ...gallery.sort((a, b) => a.sort_order - b.sort_order).map((image) => image.url)]); } catch { /* The primary product image remains available when gallery API is not configured. */ } finally { setQuickViewLoading(false); } };

  const searchSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return catalogProducts.slice(0, 4);
    return catalogProducts.filter((product) => `${product.name} ${product.category} ${product.id}`.toLowerCase().includes(query)).slice(0, 5);
  }, [catalogProducts, searchTerm]);

  const chooseSearchSuggestion = (product: (typeof products)[number]) => {
    setSearchTerm(product.name);
    setActiveCategory("All finds");
    setSearchSuggestionsOpen(false);
    window.setTimeout(() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const visibleProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
      const categoryMatch = activeCategory === "All finds" || product.category === activeCategory;
      const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, catalogProducts, searchTerm]);

  const cartItems = cart.map((item) => ({
    ...item,
    product: catalogProducts.find((product) => product.id === item.id)!,
  }));
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const deliveryCharge = cartTotal >= 5000 ? 0 : deliveryRates[deliveryCity].charge;
  const grandTotal = cartTotal + deliveryCharge;

  const addToCart = async (id: string) => {
    setAddingId(id);
    await new Promise((resolve) => window.setTimeout(resolve, 380));
    setCart((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) return current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...current, { id, quantity: 1 }];
    });
    const product = catalogProducts.find((item) => item.id === id);
    setAddingId(null);
    toast.success(`${product?.name} added to your bag`, { description: "You can review it before ordering." });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + change;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const startWhatsAppOrder = async () => {
    if (!auth.token) { setCartOpen(false); toast.info("Please sign in before checkout", { description: "Your cart is saved. We will return you here after login." }); window.location.href = "/login?next=%2F%3Fcheckout%3D1"; return; }
    if (!cartItems.length) {
      toast("Your bag is waiting", { description: "Add a product first and we’ll prepare the order message." });
      return;
    }
    setCheckoutLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    const lines = cartItems.map((item) => `${item.product.id} — ${item.product.name} x${item.quantity} (${formatPrice(item.product.price * item.quantity)})`);
    const message = encodeURIComponent(`Assalam-o-alaikum, I would like to order:\n${lines.join("\n")}\n\nSubtotal: ${formatPrice(cartTotal)}\nDelivery: ${deliveryCharge ? formatPrice(deliveryCharge) : "Free"}\nGrand total: ${formatPrice(grandTotal)}\nDelivery city: ${deliveryRates[deliveryCity].label}\nPlease confirm availability.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
    setCheckoutLoading(false);
    toast.success("WhatsApp order message is ready", { description: "Please send the prepared message to confirm your order." });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffaf3] text-[#231f20] selection:bg-[#f3c5be] selection:text-[#231f20]">
      <div className="h-9 overflow-hidden whitespace-nowrap bg-[#231f20] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#fffaf3] sm:text-[11px] sm:tracking-[0.24em]">
        <span className="sm:hidden">Free delivery over Rs. 2,500 in Karachi</span><span className="hidden sm:inline">Free delivery on orders above Rs. 2,500 in Karachi <span className="mx-2 text-[#e6af62]">•</span> Cash on delivery <span className="mx-2 text-[#e6af62]">•</span> Easy returns</span>
      </div>

      <header className={`fixed inset-x-0 z-[60] border-b border-[#eadfd3] backdrop-blur-xl transition-[top,background-color,box-shadow] duration-200 ${isScrolled ? "top-0 bg-[#fffaf3]/98 shadow-[0_10px_30px_rgba(74,47,35,.14)]" : "top-[36px] bg-[#fffaf3]/95 shadow-[0_8px_24px_rgba(74,47,35,.06)]"}`} style={{ WebkitBackdropFilter: "blur(18px)" }}>
        <div className="container relative flex h-[84px] items-center justify-between gap-3 sm:gap-6">
          <a href="#top" className="flex min-w-0 shrink items-center gap-3" aria-label="Online Click & Collect home">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#dbb1a4] bg-[#f7dfd8] p-1 shadow-[0_7px_20px_rgba(35,31,32,0.08)]">
              <img src={markImage} alt="" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 leading-none">
              <p className="truncate font-serif text-[17px] font-semibold tracking-[-0.045em] text-[#2c1e1a] sm:text-[22px]">Online Click & Collect</p>
              <p className="mt-1 truncate text-[8px] font-serif uppercase tracking-[0.16em] text-[#947b6c] sm:text-[10px] sm:tracking-[0.2em]">— Your bazaar, one click away —</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-[12px] font-bold uppercase tracking-[0.14em] text-[#5d514b] lg:flex">
            <a className="font-serif text-[15px] font-medium normal-case tracking-normal transition-colors hover:text-[#b76559]" href="#shop">Shop</a>
            <a className="font-serif text-[15px] font-medium normal-case tracking-normal transition-colors hover:text-[#b76559]" href="#categories">Categories <ChevronDown size={13} className="ml-1 inline" /></a>
            <a className="font-serif text-[15px] font-medium normal-case tracking-normal transition-colors hover:text-[#b76559]" href="/track-order">Track Order</a>{isAuthenticated ? <><a className="font-serif text-[15px] font-medium normal-case tracking-normal transition-colors hover:text-[#b76559]" href="/profile">Profile</a><button onClick={handleLogout} className="inline-flex items-center gap-1.5 font-serif text-[15px] font-medium normal-case tracking-normal text-[#b76559] transition-colors hover:text-[#8f4e46]" title="Log out"><LogOut size={15} /> Logout</button></> : <><a className="inline-flex items-center gap-1.5 font-serif text-[15px] font-medium normal-case tracking-normal text-[#b76559] transition-colors hover:text-[#8f4e46]" href="/login"><LogIn size={15} /> Login</a><a className="inline-flex items-center gap-1.5 rounded-[.25rem] border border-[#b76559] px-3 py-2 font-serif text-[15px] font-medium normal-case tracking-normal text-[#b76559] transition-colors hover:bg-[#b76559] hover:text-[#fffaf3]" href="/signup"><UserPlus size={15} /> Sign up</a></>}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen((open) => !open)} className="icon-button hidden sm:flex" aria-label="Search products"><Search size={19} strokeWidth={1.8} /></button>
            <button onClick={() => setCartOpen(true)} className="relative hidden h-12 items-center gap-2 rounded-[.3rem] border border-[#b76559] bg-[#b76559] px-5 text-[13px] font-serif text-[#fffaf3] transition-all hover:-translate-y-0.5 hover:bg-[#9f584e] sm:flex">
              <ShoppingBag size={18} strokeWidth={1.8} /> <span className="hidden sm:inline">My bag</span>
              {cartCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c95b63] px-1 text-[10px] text-white">{cartCount}</span>}
            </button>
          </div>
          <MobileMenu embedded />
        </div>
        {searchOpen && <div className="border-t border-[#eadfd3] bg-[#fffdf8] px-4 py-3"><div className="container relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b8980]" size={18} /><input autoFocus value={searchTerm} onFocus={() => setSearchSuggestionsOpen(true)} onChange={(event) => { setSearchTerm(event.target.value); setSearchSuggestionsOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") setSearchSuggestionsOpen(false); if (event.key === "Enter" && searchSuggestions[0]) chooseSearchSuggestion(searchSuggestions[0]); }} placeholder="Search useful finds..." aria-label="Search products with suggestions" className="w-full rounded-full border border-[#d8c7b8] bg-[#fffaf3] py-3 pl-11 pr-4 text-sm outline-none ring-[#c95b63] transition focus:ring-2" />{searchSuggestionsOpen && <div className="absolute left-4 right-4 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-[#dfc9b8] bg-[#fffaf3] p-2 shadow-[0_18px_38px_rgba(74,47,35,.16)]">{catalogLoading ? <div className="px-3 py-4 text-sm text-[#796b62]">Loading live products...</div> : catalogError ? <div className="px-3 py-4 text-sm text-[#b4444d]">Live catalog unavailable. Showing saved product data.</div> : searchSuggestions.length ? <><p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#9a796b]">{searchTerm.trim() ? "Matching finds" : "Live product catalogue"}</p>{searchSuggestions.map((product) => <button key={product.id} onClick={() => chooseSearchSuggestion(product)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[#f5ede3]"><img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[#231f20]">{product.name}</span><span className="block text-[11px] text-[#9a796b]">{product.category} · {formatPrice(product.price)}</span></span><ArrowRight size={15} className="text-[#c95b63]" /></button>)}</> : <div className="px-3 py-4 text-sm text-[#796b62]">No products match this search.</div>}</div>}</div></div>}
        {menuOpen && <div className="border-t border-[#eadfd3] bg-[#fffdf8] px-4 py-4 lg:hidden"><div className="container grid gap-3 text-sm font-bold"><a href="#shop" onClick={() => setMenuOpen(false)}>Shop all</a><a href="#categories" onClick={() => setMenuOpen(false)}>Categories</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><a href="/track-order" onClick={() => setMenuOpen(false)}>Track order</a><a href={isAuthenticated ? "/profile" : "/login"} onClick={() => setMenuOpen(false)}>{isAuthenticated ? "Profile" : "Login"}</a>{!isAuthenticated && <a href="/signup" onClick={() => setMenuOpen(false)}>Create account</a>}{isAuthenticated && <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left text-[#b76559]">Logout</button>}<a href="/faq" onClick={() => setMenuOpen(false)}>FAQs</a><a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a></div></div>}
      </header>
      <div aria-hidden="true" className="h-[84px]" />

      <main id="top" className="scroll-pt-24">
        <section className="relative isolate overflow-hidden border-b border-[#eadfd3]">
          <div className="absolute inset-y-0 right-0 -z-10 hidden w-[60%] overflow-hidden lg:block"><img src={heroImage} alt="Curated everyday products on a warm table" className="h-full w-full object-cover object-center" /></div><div className="absolute inset-y-0 left-0 -z-10 hidden w-[13%] overflow-hidden lg:block"><img src={heroLeftImage} alt="Decorative Mughal illustration" className="h-full w-full object-cover object-right" /></div>
          <div className="container grid min-h-[330px] items-center gap-6 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 lg:py-0">
            <div className="relative max-w-[560px]">
              <h1 className="max-w-[600px] font-serif text-[clamp(3.2rem,4vw,5rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-[#231f20]">Small finds.<br /><em className="font-normal text-[#c95b63]">Good feeling.</em></h1>
              <p className="mt-6 max-w-[440px] text-[15px] leading-6 text-[#6b5e56]">A thoughtful edit of useful, giftable things for everyday living—picked for Pakistani homes and delivered from Karachi.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3"><a href="#shop" className="primary-button">Explore the edit <ArrowRight size={17} /></a><a href="#how-it-works" className="text-link">How ordering works <ChevronDown size={15} /></a></div>
              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#dfcfc1] pt-4 text-[12px] font-bold uppercase tracking-[0.12em] text-[#76655b]"><span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-[#c95b63]" /> Honest prices</span><span className="inline-flex items-center gap-2"><Truck size={17} className="text-[#c95b63]" /> COD ready</span></div>
            </div>
            <div className="relative h-[350px] overflow-hidden rounded-[2rem] border border-[#dfc6b3] bg-[#f4dfd0] shadow-[18px_22px_60px_rgba(104,67,48,0.14)] lg:hidden"><img src={heroImage} alt="Curated everyday products on a warm table" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#231f20]/40 to-transparent" /><span className="absolute bottom-5 left-5 rounded-full bg-[#fffaf3]/90 px-4 py-2 text-xs font-bold text-[#231f20]">A considered little collection</span></div>
            <div className="hidden h-full min-h-[330px] lg:block" />
          </div>
          <div className="absolute -bottom-20 left-[44%] -z-10 h-56 w-56 rounded-full border border-[#e6cdbb]" />
        </section>

        <section id="categories" className="border-b border-[#dfcbbb] bg-[#fbf5ed] py-8 lg:py-10">
          <div className="container"><div className="flex items-center justify-between gap-5"><div><p className="eyebrow">Browse by mood</p><h2 className="mt-1 font-serif text-2xl sm:text-3xl">Find your little something.</h2></div><a href="#shop" className="hidden items-center gap-2 text-sm font-serif text-[#947b6c] transition hover:text-[#b76559] sm:inline-flex">View all categories <ArrowRight size={15} /></a></div><div className="mt-7 grid grid-cols-2 divide-x divide-[#dfcbbb] overflow-hidden border-y border-[#dfcbbb] sm:grid-cols-4 lg:grid-cols-8">{[...categories, { name: "Gifting", note: "Made easy", image: packingImage }, { name: "Decor", note: "Light & lovely", image: kitchenImage }, { name: "Everyday", note: "Daily wear", image: productImages.bottle }, { name: "Deals", note: "Worth a look", image: productImages.lamp }].map((category) => <a href="#shop" key={category.name} onClick={() => setActiveCategory(categories.some((item) => item.name === category.name) ? category.name : "All finds")} className="group flex min-h-[112px] flex-col items-center justify-center gap-3 px-2 py-4 text-center transition hover:bg-[#f1ddd3]"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8c5b4] bg-[#fffaf3] font-serif text-2xl text-[#b76559] transition group-hover:border-[#b76559]">{category.name === "Kitchen" ? "⌁" : category.name === "Beauty & Care" ? "✿" : category.name === "Home Living" ? "⌂" : category.name === "Gadgets" ? "✦" : category.name === "Gifting" ? "□" : category.name === "Decor" ? "◌" : category.name === "Everyday" ? "◇" : "%"}</span><span><strong className="block font-serif text-[15px] font-medium text-[#2c1e1a]">{category.name}</strong><small className="mt-1 block text-[10px] uppercase tracking-[.08em] text-[#947b6c]">{category.note}</small></span></a>)}</div></div>
        </section>

        <section id="shop" className="border-y border-[#eadfd3] bg-[#f5ede3] py-10 lg:py-0">
          <div className="container">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">The current edit</p><h2 className="section-title">Useful things, chosen well.</h2></div><div className="flex w-full max-w-[520px] flex-col gap-3"><label className="relative block"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a58f83]" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search products by name..." aria-label="Search products" className="w-full rounded-full border border-[#d9c5b5] bg-[#fffaf3] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#c95b63] focus:ring-2 focus:ring-[#f0c4be]" /></label><div className="flex flex-wrap items-center justify-end gap-2"><button onClick={() => setActiveCategory("All finds")} className={activeCategory === "All finds" ? "filter-pill active" : "filter-pill"}>All finds</button>{["Kitchen", "Beauty & Care", "Home Living", "Gadgets"].map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={activeCategory === category ? "filter-pill active" : "filter-pill"}>{category}</button>)}</div></div></div>
            {visibleProducts.length ? <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{visibleProducts.map((product) => <article key={product.id} className="group"><div className="product-image"><img src={product.image} alt={product.name} /><span className="product-tag">{product.tag}</span><button onClick={() => toggleFavorite(product.id)} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#fffaf3]/90 transition hover:bg-[#c95b63] hover:text-white ${favorites.includes(product.id) ? "text-[#c95b63]" : "text-[#6b5e56]"}`} aria-label={`${favorites.includes(product.id) ? "Remove" : "Save"} ${product.name}`}><Heart size={16} fill={favorites.includes(product.id) ? "currentColor" : "none"} /></button><button onClick={() => void openQuickView(product)} className="absolute bottom-3 left-3 rounded-full bg-[#fffaf3]/95 px-3 py-2 text-[11px] font-bold text-[#6b5e56] shadow-sm transition hover:bg-[#c95b63] hover:text-white">Quick view</button><button disabled={addingId === product.id} onClick={() => void addToCart(product.id)} className="add-button">{addingId === product.id ? <><span className="loading-dot" /> Adding...</> : <>Add to bag <Plus size={16} /></>}</button></div><div className="mt-4 flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a796b]">{product.category} <span className="mx-1 text-[#c95b63]">/</span> {product.id}</p><a href={`/product/${product.id}`} className="mt-1 block font-serif text-[21px] leading-tight text-[#231f20] transition hover:text-[#c95b63]">{product.name}</a></div><div className="shrink-0 text-right"><p className="font-bold text-[#231f20]">{formatPrice(product.price)}</p><p className="text-xs text-[#a58f83] line-through">{formatPrice(product.oldPrice)}</p></div></div></article>)}</div> : <div className="rounded-3xl border border-dashed border-[#d4beaa] bg-[#fffaf3] p-12 text-center"><p className="font-serif text-2xl">Nothing in this edit yet.</p><button onClick={() => { setSearchTerm(""); setActiveCategory("All finds"); }} className="mt-4 text-sm font-bold text-[#c95b63]">Reset the view</button></div>}
          </div>
        </section>

        <section className="container border-b border-[#eadfd3] py-20 lg:py-24"><div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">A considered next step</p><h2 className="section-title">Recommended for You</h2></div><p className="max-w-[340px] text-sm leading-6 text-[#796b62]">A personal edit shaped by the things you save and the orders you have made.</p></div>{recommendationLoading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading recommendations">{[1,2,3].map((item) => <div key={item} className="overflow-hidden rounded-2xl border border-[#dfc9b8] bg-[#fffaf3]"><div className="skeleton-line aspect-[4/3]" /><div className="grid gap-3 p-5"><div className="skeleton-line h-3 w-1/3" /><div className="skeleton-line h-6 w-4/5" /><div className="skeleton-line h-4 w-1/4" /></div></div>)}</div> : recommended.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{recommended.slice(0, 3).map((product) => <a href={`/product/${product.id}`} key={product.id} className="group overflow-hidden rounded-2xl border border-[#dfc9b8] bg-[#fffaf3]"><div className="product-image aspect-[4/3]"><img src={product.image} alt={product.name} /><span className="product-tag">Picked for you</span></div><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9a796b]">{product.category} / {product.id}</p><h3 className="mt-1 font-serif text-2xl">{product.name}</h3><p className="mt-3 font-bold">{formatPrice(product.price)}</p></div></a>)}</div> : <div className="rounded-2xl border border-dashed border-[#d4beaa] bg-[#fffaf3] p-8 text-center"><p className="font-serif text-2xl">Your personal edit is taking shape.</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#796b62]">Sign in and save a few finds or complete an order to unlock recommendations chosen around your taste.</p><a href="/login" className="primary-button mx-auto mt-5">Sign in to personalize <ArrowRight size={16} /></a></div>}</section>

        <section id="how-it-works" className="container grid gap-14 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-28">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#dcc8b8] bg-[#ead8ca] shadow-[14px_18px_50px_rgba(104,67,48,0.1)]"><img src={packingImage} alt="A thoughtfully packed Online Click & Collect parcel" className="aspect-[4/3] w-full object-cover" /><div className="absolute left-5 top-5 rounded-full bg-[#fffaf3]/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7f6154]">Packed with care</div></div>
          <div><p className="eyebrow">The easy part</p><h2 className="section-title max-w-[600px]">From a small click to a parcel at your door.</h2><p className="mt-6 max-w-[520px] leading-7 text-[#796b62]">No confusing checkout maze. Pick your find, send us your details, and our team confirms availability and delivery before dispatch.</p><div className="mt-9 grid gap-5 sm:grid-cols-3">{[{ icon: ShoppingBag, title: "Choose", text: "Find something useful and add it to your bag." }, { icon: Check, title: "Confirm", text: "We confirm stock, total and delivery on WhatsApp." }, { icon: PackageCheck, title: "Receive", text: "Pay safely with Cash on Delivery at your door." }].map(({ icon: Icon, title, text }, index) => <div key={title} className="relative border-t border-[#d7c2b3] pt-4"><span className="absolute -top-3 right-0 font-serif text-sm italic text-[#c95b63]">0{index + 1}</span><Icon size={21} className="text-[#c95b63]" strokeWidth={1.6} /><h3 className="mt-4 font-bold text-[#231f20]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#796b62]">{text}</p></div>)}</div><button onClick={startWhatsAppOrder} className="mt-9 inline-flex items-center gap-2 text-sm font-bold text-[#c95b63] transition hover:gap-3">Start a WhatsApp order <ArrowRight size={16} /></button></div>
        </section>

        <section id="reviews" className="border-y border-[#eadfd3] bg-[#f7dfd8]/45 py-20 lg:py-24"><div className="container grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end"><div><p className="eyebrow">From our customers</p><h2 className="section-title max-w-[650px]">Good things should be earned, not announced.</h2><p className="mt-6 max-w-[540px] leading-7 text-[#796b62]">We are building this wall one real order at a time. Reviews are published only after a genuine purchase and a quick approval check.</p><div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#9a796b]"><Star size={17} fill="currentColor" /> <span>No ratings yet</span><span className="font-normal text-[#b49b8c]">— be the first to share your experience.</span></div></div><div className="rounded-[1.75rem] border border-[#dcb9ad] bg-[#fffaf3]/80 p-7 shadow-[0_14px_35px_rgba(104,67,48,.06)]"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Your honest note</p><h3 className="mt-2 font-serif text-2xl">Ordered from us?</h3></div><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7dfd8] text-[#c95b63]"><Star size={19} /></div></div>{reviewSent ? <div className="mt-6 rounded-2xl bg-[#f5ede3] p-5 text-sm leading-6 text-[#6b5e56]"><p className="font-bold text-[#231f20]">Thank you for sharing.</p><p className="mt-1">Your review has been sent for approval. We never publish unverified testimonials.</p></div> : reviewFormOpen ? <form className="mt-6 grid gap-3" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); try { if (fastApi.isConfigured) await fastApi.submitReview({ order_number: String(form.get("orderNumber") || ""), rating: reviewRating, text: String(form.get("reviewText") || "") }); setReviewSent(true); toast.success("Review sent for approval", { description: fastApi.isConfigured ? "Thank you for sharing a genuine experience." : "Connect FastAPI to save this review for approval." }); } catch (error) { toast.error(error instanceof Error ? error.message : "Review could not be sent"); } }}>
<label className="text-xs font-bold text-[#6b5e56]">Order number<input name="orderNumber" required placeholder="OCC-000" className="mt-1 w-full rounded-xl border border-[#d8c7b8] bg-[#fffaf3] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c95b63]" /></label><div><span className="text-xs font-bold text-[#6b5e56]">Your rating</span><div className="mt-2 flex gap-1">{[1,2,3,4,5].map((star) => <button type="button" key={star} onClick={() => setReviewRating(star)} aria-label={`Rate ${star} out of 5`} className={`rounded p-1 ${star <= reviewRating ? "text-[#b98942]" : "text-[#d9c5b5]"}`}><Star size={19} fill="currentColor" /></button>)}</div></div><label className="text-xs font-bold text-[#6b5e56]">Your review<textarea name="reviewText" required minLength={10} placeholder="Tell us what you genuinely liked or what we can improve..." className="mt-1 min-h-24 w-full resize-none rounded-xl border border-[#d8c7b8] bg-[#fffaf3] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c95b63]" /></label><div className="flex gap-2"><button type="submit" className="primary-button">Send for approval <ArrowRight size={16} /></button><button type="button" onClick={() => setReviewFormOpen(false)} className="text-link">Cancel</button></div></form> : <button onClick={() => setReviewFormOpen(true)} className="primary-button mt-6">Share a real review <ArrowRight size={16} /></button>}</div></div></section>

        <section id="story" className="border-y border-[#eadfd3] bg-[#231f20] py-20 text-[#fffaf3] lg:py-24"><div className="container grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end"><div><p className="eyebrow text-[#e6af62]">A note from the shop</p><h2 className="max-w-[720px] font-serif text-[clamp(2.6rem,5vw,5.2rem)] leading-[0.94] tracking-[-0.06em]">The good stuff is often<br /><em className="font-normal text-[#e9a29c]">the useful stuff.</em></h2></div><div><p className="leading-7 text-[#d7c9bf]">Online Click & Collect is a Karachi-based online variety store for thoughtful little upgrades, everyday helpers and easy gifts. We keep the edit moving, the prices clear, and the ordering simple.</p><a href="#shop" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#f4c978] transition hover:gap-3">See what’s in the edit <ArrowRight size={16} /></a></div></div></section>

        <section className="container grid gap-5 py-14 sm:grid-cols-3"><div className="trust-card"><ShieldCheck size={23} /><div><h3>Clear & honest</h3><p>Real product details and simple prices.</p></div></div><div className="trust-card"><Truck size={23} /><div><h3>Delivery ready</h3><p>City-based delivery with COD available.</p></div></div><div className="trust-card"><Heart size={23} /><div><h3>Helpful support</h3><p>Message us when you need a hand.</p></div></div></section>
      </main>

      <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#2f9b68] text-white shadow-[0_10px_24px_rgba(47,155,104,.3)] transition hover:-translate-y-1 lg:hidden" aria-label="Chat on WhatsApp"><MessageCircle size={22} /></a>
      {cartCount > 0 && <button onClick={() => setCartOpen(true)} className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-full bg-[#231f20] px-5 py-3.5 text-sm font-bold text-[#fffaf3] shadow-[0_14px_30px_rgba(35,31,32,.22)] lg:hidden"><span>{cartCount} item{cartCount > 1 ? "s" : ""} in your bag</span><span className="text-[#f4c978]">{formatPrice(grandTotal)} →</span></button>}

      <footer className="border-t border-[#eadfd3] bg-[#f5ede3] py-12"><div className="container grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]"><div><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f7dfd8] p-1"><img src={markImage} alt="" className="h-full w-full object-contain" /></div><p className="font-serif text-xl">Online Click & Collect</p></div><p className="mt-4 max-w-[260px] text-sm leading-6 text-[#796b62]">Thoughtful everyday finds, selected for Pakistani homes and delivered from Karachi.</p></div><div><p className="footer-heading">Explore</p><div className="grid gap-3 text-sm text-[#62554d]"><a href="#shop">Shop all</a><a href="#categories">Categories</a><a href="#story">Our story</a><a href="/faq">FAQs</a></div></div><div><p className="footer-heading">Help</p><div className="grid gap-3 text-sm text-[#62554d]"><a href="#how-it-works">How to order</a><a href="/contact">Delivery & COD</a><a href="/contact">Returns</a><a href="/contact">Contact us</a><a href="/track-order">Track order</a></div></div><div><p className="footer-heading">Stay close</p><p className="text-sm leading-6 text-[#796b62]">Questions, product codes, or just browsing? We’re one message away.</p><a className="mt-4 inline-flex items-center gap-2 font-bold text-[#c95b63]" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">Chat on WhatsApp <ArrowRight size={16} /></a></div></div><div className="container mt-12 flex flex-col justify-between gap-3 border-t border-[#ddc9b8] pt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#927c6d] sm:flex-row"><span>© 2026 Online Click & Collect</span><span>Karachi, Pakistan</span></div></footer>

      {quickViewProduct && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><button className="absolute inset-0 bg-[#231f20]/45 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} aria-label="Close quick view" /><article role="dialog" aria-modal="true" aria-labelledby="quick-view-title" className="relative z-10 grid w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[#dfc9b8] bg-[#fffaf3] shadow-[0_24px_80px_rgba(35,31,32,.25)] sm:grid-cols-2"><div className="relative bg-[#f5ede3] p-3 sm:aspect-auto"><div className="aspect-square overflow-hidden rounded-[1.4rem]"><img src={selectedQuickImage || quickViewProduct.image} alt={quickViewProduct.name} className="h-full w-full object-cover" /></div><span className="product-tag absolute left-6 top-6">{quickViewProduct.tag}</span>{quickViewLoading && <span className="absolute bottom-5 left-5 rounded-full bg-[#fffaf3]/90 px-3 py-1.5 text-[10px] font-bold text-[#6b5e56]">Loading gallery...</span>}{quickViewGallery.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{quickViewGallery.map((image, index) => <button key={`${image}-${index}`} onClick={() => setSelectedQuickImage(image)} className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 ${selectedQuickImage === image ? "border-[#c95b63]" : "border-transparent"}`} aria-label={`View image ${index + 1}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}</div><div className="p-6 sm:p-8"><button onClick={() => setQuickViewProduct(null)} className="icon-button float-right" aria-label="Close quick view"><X size={18} /></button><p className="eyebrow">{quickViewProduct.category} / {quickViewProduct.id}</p><h2 id="quick-view-title" className="mt-3 pr-8 font-serif text-3xl leading-tight">{quickViewProduct.name}</h2><p className="mt-4 text-sm leading-6 text-[#796b62]">A useful everyday find selected for Pakistani homes. Check the full product page for gallery images, details and ordering support.</p><div className="mt-6 flex items-end gap-3"><strong className="font-serif text-3xl">{formatPrice(quickViewProduct.price)}</strong><span className="text-sm text-[#a58f83] line-through">{formatPrice(quickViewProduct.oldPrice)}</span></div><p className={`mt-4 text-sm font-bold ${quickViewProduct.stock === 0 ? "text-[#b4444d]" : quickViewProduct.stock <= 3 ? "text-[#b98942]" : "text-[#2f8060]"}`}>{quickViewProduct.stock === 0 ? "Currently out of stock" : quickViewProduct.stock <= 3 ? `Only ${quickViewProduct.stock} left in stock` : `${quickViewProduct.stock} available in stock`}</p><div className="mt-7 grid gap-3"><button disabled={quickViewProduct.stock === 0} onClick={() => { void addToCart(quickViewProduct.id); setQuickViewProduct(null); }} className="primary-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"><Plus size={17} /> {quickViewProduct.stock === 0 ? "Out of stock" : "Add to bag"}</button><button onClick={() => { const shareUrl = `${window.location.origin}/product/${quickViewProduct.id}`; const message = encodeURIComponent(`I found this on Online Click & Collect:\n${quickViewProduct.name}\n${formatPrice(quickViewProduct.price)}\n${shareUrl}`); window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer"); toast.success("WhatsApp share is ready"); }} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b8d9c6] bg-[#eef8f1] px-5 py-3 text-sm font-bold text-[#2f8060] transition hover:-translate-y-0.5"><MessageCircle size={16} /> Share on WhatsApp</button><a href={`/product/${quickViewProduct.id}`} className="text-link justify-center">View full details <ArrowRight size={16} /></a></div></div></article></div>}
      {cartOpen && <div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-[#231f20]/30 backdrop-blur-sm" onClick={() => setCartOpen(false)} /><aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fffaf3] shadow-[-20px_0_70px_rgba(35,31,32,0.2)]"><div className="flex items-center justify-between border-b border-[#eadfd3] px-6 py-5"><div><p className="eyebrow">Your selection</p><h2 className="font-serif text-3xl">My bag <span className="text-[#c95b63]">({cartCount})</span></h2></div><button onClick={() => setCartOpen(false)} className="icon-button" aria-label="Close bag"><X size={20} /></button></div><div className="flex-1 overflow-y-auto px-6 py-6">{cartItems.length ? <div className="grid gap-5">{cartItems.map(({ product, quantity }) => <div key={product.id} className="flex gap-4 border-b border-[#eadfd3] pb-5"><img src={product.image} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" /><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a796b]">{product.id}</p><h3 className="mt-1 font-serif text-lg leading-tight">{product.name}</h3><p className="mt-1 font-bold">{formatPrice(product.price)}</p><div className="mt-3 inline-flex items-center gap-3 rounded-full border border-[#d8c7b8] px-2 py-1"><button onClick={() => updateQuantity(product.id, -1)} aria-label="Decrease quantity"><Minus size={14} /></button><span className="min-w-4 text-center text-sm font-bold">{quantity}</span><button onClick={() => updateQuantity(product.id, 1)} aria-label="Increase quantity"><Plus size={14} /></button></div></div></div>)}</div> : <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingBag size={38} strokeWidth={1.3} className="text-[#c95b63]" /><h3 className="mt-5 font-serif text-2xl">Your bag is quiet.</h3><p className="mt-2 max-w-[250px] text-sm leading-6 text-[#796b62]">Add a few useful finds and we’ll take it from there.</p><button onClick={() => setCartOpen(false)} className="mt-6 text-sm font-bold text-[#c95b63]">Continue browsing <ArrowRight size={15} className="ml-1 inline" /></button></div>}</div>{cartItems.length > 0 && <div className="border-t border-[#eadfd3] px-6 py-6"><label className="block text-xs font-bold uppercase tracking-[.12em] text-[#796b62]">Delivery city<select value={deliveryCity} onChange={(event) => setDeliveryCity(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8c7b8] bg-[#fffaf3] px-3 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:ring-2 focus:ring-[#c95b63]">{Object.entries(deliveryRates).map(([value, rate]) => <option key={value} value={value}>{rate.label} — Rs. {rate.charge}</option>)}</select></label><div className="mt-5 grid gap-2 text-sm"><div className="flex items-center justify-between text-[#796b62]"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div><div className="flex items-center justify-between text-[#796b62]"><span>Delivery</span><span>{deliveryCharge ? formatPrice(deliveryCharge) : "Free"}</span></div><div className="mt-2 flex items-center justify-between border-t border-[#eadfd3] pt-3"><span className="font-bold">Grand total</span><strong className="text-lg">{formatPrice(grandTotal)}</strong></div></div><p className="mt-3 text-xs leading-5 text-[#927c6d]">Free delivery on orders above Rs. 5,000. Final availability and delivery timing will be confirmed directly on WhatsApp.</p><button disabled={checkoutLoading} onClick={() => void startWhatsAppOrder()} className="primary-button mt-5 w-full justify-center">{checkoutLoading ? <><span className="loading-spinner" /> Preparing message...</> : <>Order on WhatsApp <ArrowRight size={17} /></>}</button></div>}</aside></div>}
    </div>
  );
}
