/*
  Online Click & Collect — mobile navigation.
  Design reminder: a calm, rounded paper panel with an obvious three-line trigger,
  generous touch targets, and concise routes for phone-first browsing.
*/
import { useEffect, useState } from "react";
import { LogIn, LogOut, Menu, ShoppingBag, UserPlus, X } from "lucide-react";
import { auth } from "@/lib/api";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(() => Boolean(auth.token));
  useEffect(() => { if (!open) return; const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; document.addEventListener("keydown", closeOnEscape); return () => document.removeEventListener("keydown", closeOnEscape); }, [open]);
  const close = () => setOpen(false);
  const logout = () => { auth.clear(); setAuthenticated(false); close(); window.location.assign("/"); };
  return <div className="lg:hidden"><button type="button" onClick={() => { setAuthenticated(Boolean(auth.token)); setOpen((current) => !current); }} className="fixed right-4 top-[4.45rem] z-[75] flex h-12 w-12 items-center justify-center rounded-full border border-[#d8c7b8] bg-[#fffaf3]/95 text-[#231f20] shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#c95b63]" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation menu" : "Open navigation menu"}>{open ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}</button>{open && <><button type="button" onClick={close} className="fixed inset-0 z-[68] bg-[#231f20]/20" aria-label="Close navigation overlay" /><nav id="mobile-navigation" className="fixed right-4 top-[8.2rem] z-[70] w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-[#d8c7b8] bg-[#fffaf3] p-4 shadow-2xl" aria-label="Mobile navigation"><div className="grid gap-1 text-sm font-bold text-[#4f413b]"><a onClick={close} className="rounded-xl px-4 py-3 transition hover:bg-[#f5ede3]" href="/#shop">Shop all</a><a onClick={close} className="rounded-xl px-4 py-3 transition hover:bg-[#f5ede3]" href="/#categories">Categories</a><a onClick={close} className="rounded-xl px-4 py-3 transition hover:bg-[#f5ede3]" href="/track-order">Track order</a><a onClick={close} className="rounded-xl px-4 py-3 transition hover:bg-[#f5ede3]" href="/faq">FAQs</a><a onClick={close} className="rounded-xl px-4 py-3 transition hover:bg-[#f5ede3]" href="/contact">Contact</a><a onClick={close} className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#f7dfd8] px-4 py-3 text-[#a8434d]" href={authenticated ? "/profile" : "/login"}>{authenticated ? <ShoppingBag size={16} /> : <LogIn size={16} />}{authenticated ? "Profile" : "Login"}</a>{authenticated ? <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-left text-[#a8434d] hover:bg-[#f7dfd8]"><LogOut size={16} /> Logout</button> : <a onClick={close} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-[#a8434d] hover:bg-[#f7dfd8]" href="/signup"><UserPlus size={16} /> Create account</a>}</div></nav></>}</div>;
}
