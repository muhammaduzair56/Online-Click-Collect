/*
  Online Click & Collect — Track Order page.
  Design reminder: warm paper surfaces, rose-clay actions, calm Pakistani commerce support,
  and clear operational status language without fabricated order data.
*/
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, PackageCheck, Search, Truck } from "lucide-react";
import { toast } from "sonner";
import { fastApi, type Order } from "@/lib/api";

const statuses = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];
const formatPrice = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const track = async (event: FormEvent) => {
    event.preventDefault();
    if (!orderId.trim()) { setError("Please enter your order ID."); return; }
    setLoading(true); setError(""); setOrder(null);
    try { setOrder(await fastApi.trackOrder(orderId)); toast.success("Order status loaded"); }
    catch (err) { setError(err instanceof Error ? err.message : "We could not find this order. Please check the ID."); }
    finally { setLoading(false); }
  };

  const currentIndex = order ? statuses.findIndex((status) => status.toLowerCase() === order.status.toLowerCase()) : -1;
  return <main className="min-h-screen bg-[#fffaf3] px-4 py-8 text-[#231f20] sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><a href="/" className="text-link inline-flex items-center gap-2 text-sm"><ArrowLeft size={16} /> Back to store</a><div className="mt-14 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><section><p className="eyebrow">Order support</p><h1 className="mt-3 font-serif text-5xl leading-[.95] sm:text-6xl">Where is your <em className="text-[#c95b63]">parcel?</em></h1><p className="mt-6 max-w-md text-base leading-7 text-[#796b62]">Enter the order ID shared by our team to see the latest delivery status. If you need help, contact the owner directly on WhatsApp.</p><a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "923001234567"}`} className="mt-7 inline-flex text-sm font-bold text-[#c95b63]" target="_blank" rel="noreferrer">Need help? Chat on WhatsApp →</a></section><section className="rounded-3xl border border-[#dfc9b8] bg-[#f7eee5] p-6 shadow-[0_18px_50px_rgba(74,47,35,.08)] sm:p-8"><form onSubmit={track}><label className="eyebrow" htmlFor="order-id">Order ID</label><div className="mt-3 flex flex-col gap-3 sm:flex-row"><input id="order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Example: OCC-1024" className="min-w-0 flex-1 rounded-full border border-[#d8c7b8] bg-[#fffaf3] px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#c95b63]" /><button className="primary-button justify-center" disabled={loading}>{loading ? <><span className="loading-spinner" /> Checking...</> : <><Search size={16} /> Track order</>}</button></div>{error && <p className="mt-4 rounded-xl bg-[#f8dedd] px-4 py-3 text-sm text-[#8d343b]">{error}</p>}</form>{order && <div className="mt-8 border-t border-[#dfc9b8] pt-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">Order {order.id}</p><h2 className="mt-1 font-serif text-3xl">{order.status}</h2></div><p className="text-sm font-bold">{formatPrice(order.total)}</p></div><div className="mt-8 grid gap-5">{statuses.map((status, index) => { const done = index <= currentIndex; const active = index === currentIndex; return <div key={status} className={`flex items-center gap-4 ${done ? "text-[#231f20]" : "text-[#a89588]"}`}><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${done ? "border-[#c95b63] bg-[#c95b63] text-white" : "border-[#d8c7b8] bg-[#fffaf3]"}`}>{status === "Shipped" ? <Truck size={17} /> : status === "Delivered" ? <PackageCheck size={17} /> : done ? <CheckCircle2 size={17} /> : <span className="text-xs font-bold">{index + 1}</span>}</div><div><p className={`text-sm font-bold ${active ? "text-[#c95b63]" : ""}`}>{status}</p><p className="text-xs text-[#927c6d]">{active ? "Current status" : done ? "Completed" : "Waiting for update"}</p></div></div>; })}</div></div>}</section></div></div></main>;
}
