/* Online Click & Collect — design template showroom. Four distinct directions are shown as visual concepts for approval before applying one to the live storefront. */
import { useState } from "react";
import { ArrowLeft, Check, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

const templates = [
  {
    id: "01",
    name: "Bazaar Editorial",
    mood: "Warm · premium · Karachi bazaar",
    image: "/manus-storage/occ-template-01-bazaar-editorial_641eecf4.png",
    colors: "Cream, rose clay, ink brown, brass",
    description: "A calm editorial storefront with generous whitespace, refined serif headlines and a warm lifestyle-led hero. Best if the brand should feel premium, trustworthy and thoughtfully curated.",
    bestFor: "Premium everyday finds",
    accent: "bg-[#c95b63]",
    soft: "bg-[#f7dfd8]",
  },
  {
    id: "02",
    name: "Modern Mosaic",
    mood: "Bold · energetic · product-first",
    image: "/manus-storage/occ-template-02-modern-mosaic_b10d52b7.png",
    colors: "Terracotta, sand, olive, charcoal",
    description: "A more energetic modular layout built around product tiles, category chips and quick scanning. Best for a mixed catalogue with many products and frequent new arrivals.",
    bestFor: "Fast-moving variety store",
    accent: "bg-[#9b543b]",
    soft: "bg-[#e9d9c5]",
  },
  {
    id: "03",
    name: "Soft Commerce",
    mood: "Friendly · clean · approachable",
    image: "/manus-storage/occ-template-03-soft-commerce_f88a4c84.png",
    colors: "Pistachio, ivory, powder blue, apricot",
    description: "A softer D2C direction with friendly rounded cards, colorful categories and a simple search-led navigation. Best for a broad Pakistani audience and social-media traffic.",
    bestFor: "Family-friendly shopping",
    accent: "bg-[#d97761]",
    soft: "bg-[#e5f0df]",
  },
  {
    id: "04",
    name: "Night Market",
    mood: "Dramatic · luxurious · evening",
    image: "/manus-storage/occ-template-04-night-market_dbb2af05.png",
    colors: "Ink navy, saffron, copper, ivory",
    description: "A distinctive dark evening-shopping concept with copper details and high-contrast product storytelling. Best if the brand wants to stand apart from typical light e-commerce stores.",
    bestFor: "Giftable and lifestyle products",
    accent: "bg-[#c8863b]",
    soft: "bg-[#d9e5df]",
  },
];

export default function DesignTemplates() {
  const [selected, setSelected] = useState("01");
  const active = templates.find((item) => item.id === selected) ?? templates[0];

  const chooseTemplate = (name: string) => {
    toast.success(`${name} selected`, { description: "Ab is direction ko live website par apply kiya ja sakta hai." });
  };

  return (
    <div className="min-h-screen bg-[#f7f1e9] text-[#231f20]">
      <header className="sticky top-0 z-40 border-b border-[#decfc1] bg-[#fdf9f3]/95 backdrop-blur-xl">
        <div className="container flex min-h-20 items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#6c5d54]"><ArrowLeft size={16} /> Back to store</a>
          <div className="hidden items-center gap-2 sm:flex"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7dfd8] text-[#c95b63]"><Sparkles size={17} /></div><span className="font-serif text-xl">Design showroom</span></div>
          <a href="https://wa.me/923001234567?text=I%20want%20to%20discuss%20the%20Online%20Click%20%26%20Collect%20website%20design" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#2c9b70] px-3 py-2 text-xs font-bold text-white sm:px-4"><MessageCircle size={15} /> <span className="hidden sm:inline">Discuss on WhatsApp</span><span className="sm:hidden">WhatsApp</span></a>
        </div>
      </header>

      <main className="container py-10 sm:py-14 lg:py-20">
        <section className="max-w-3xl">
          <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#b06f56]">Online Click & Collect · 04 directions</p>
          <h1 className="mt-4 font-serif text-[clamp(2.8rem,7vw,6.8rem)] leading-[.86] tracking-[-.06em]">Choose the feeling<br /><em className="font-normal text-[#c95b63]">before we build it.</em></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#75675f] sm:text-lg">Yeh chaar actual visual concepts hain. Har template mein brand name, product presentation, navbar aur hero direction alag hai. Kisi ek ko choose karne ke baad usi style ko complete website par apply karenge.</p>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((item) => <button key={item.id} onClick={() => setSelected(item.id)} className={`group overflow-hidden rounded-[1.35rem] border text-left transition duration-200 hover:-translate-y-1 ${selected === item.id ? "border-[#c95b63] bg-white shadow-[0_18px_40px_rgba(83,49,35,.15)]" : "border-[#dfd1c4] bg-[#fdf9f3]"}`}><div className="relative aspect-[16/10] overflow-hidden bg-[#eadfd5]"><img src={item.image} alt={`${item.name} website template preview`} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" /><span className="absolute left-3 top-3 rounded-full bg-[#fffaf3]/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#6c5d54]">Option {item.id}</span>{selected === item.id && <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#c95b63] text-white"><Check size={15} /></span>}</div><div className="p-4"><h2 className="font-serif text-xl">{item.name}</h2><p className="mt-1 text-xs font-bold text-[#b06f56]">{item.mood}</p></div></button>)}
        </section>

        <section className="mt-8 overflow-hidden rounded-[1.6rem] border border-[#dfd1c4] bg-[#fdf9f3] shadow-[0_20px_50px_rgba(83,49,35,.08)]">
          <div className="border-b border-[#eadfd3] p-5 sm:p-7"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#b06f56]">Selected direction · Option {active.id}</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">{active.name}</h2><p className="mt-2 text-sm font-bold text-[#7d6b60]">{active.mood}</p></div><button onClick={() => chooseTemplate(active.name)} className={`inline-flex items-center justify-center gap-2 rounded-full ${active.accent} px-5 py-3 text-sm font-bold text-white transition hover:brightness-95 active:scale-[.98]`}><Check size={16} /> Choose this direction</button></div></div>
          <div className="grid lg:grid-cols-[1.45fr_.55fr]"><div className="bg-[#eadfd5] p-3 sm:p-6"><img src={active.image} alt={`${active.name} enlarged website template preview`} className="w-full rounded-xl shadow-[0_14px_30px_rgba(48,31,23,.14)]" /></div><aside className={`${active.soft} p-6 sm:p-8`}><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#765b4f]">Direction notes</p><p className="mt-4 text-sm leading-7 text-[#5f5049]">{active.description}</p><div className="mt-7 border-t border-[#8f796b]/25 pt-5"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#765b4f]">Color language</p><p className="mt-2 text-sm font-bold text-[#493d38]">{active.colors}</p></div><div className="mt-5 border-t border-[#8f796b]/25 pt-5"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#765b4f]">Best for</p><p className="mt-2 text-sm font-bold text-[#493d38]">{active.bestFor}</p></div></aside></div>
        </section>
      </main>
    </div>
  );
}
