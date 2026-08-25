/*
  Online Click & Collect — Admin category management.
  Design reminder: keep the warm paper panels, terracotta actions, quiet borders,
  and explicit confirmation for destructive catalog changes.
*/
import { useState } from "react";
import { Check, Edit3, Loader2, Plus, Tag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { fastApi, type Category } from "@/lib/api";

type Props = { categories: Category[]; onSaved: (category: Category, editingId: string | null) => void; onDeleted: (id: string, replacement?: string) => void };

export default function CategoryManager({ categories, onSaved, onDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [replacement, setReplacement] = useState("");
  const openAdd = () => { setEditingId(null); setName(""); setIsActive(true); setOpen(true); };
  const openEdit = (category: Category) => { setEditingId(category.id); setName(category.name); setIsActive(category.is_active); setOpen(true); };
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) { toast.error("Enter a category name"); return; }
    setSaving(true);
    try {
      const saved = editingId ? await fastApi.updateCategory(editingId, { name: name.trim(), is_active: isActive }) : await fastApi.createCategory({ name: name.trim(), is_active: isActive });
      onSaved(saved, editingId); setOpen(false); toast.success(editingId ? "Category updated" : "Category created");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save category"); } finally { setSaving(false); }
  };
  const remove = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try { await fastApi.deleteCategory(deleteTarget.id, replacement || undefined); onDeleted(deleteTarget.id, replacement || undefined); setDeleteTarget(null); setReplacement(""); toast.success("Category removed"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not remove category"); }
    finally { setSaving(false); }
  };
  return <section id="category-manager" className="mt-6 rounded-2xl border border-[#dfc9b8] bg-[#fffaf3] p-5 lg:p-7">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="eyebrow">Catalog structure</p><h2 className="mt-1 font-serif text-2xl">Categories</h2><p className="mt-2 text-sm text-[#796b62]">Create and organize the collections used by your storefront products.</p></div><button type="button" onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c95b63] px-4 py-2.5 text-xs font-bold text-white"><Plus size={15} /> Add category</button></div>
    {open && <form onSubmit={save} className="mt-6 rounded-2xl border border-[#eadfd3] bg-[#f5ede3] p-5" aria-label={editingId ? "Edit category" : "Add category"}><div className="flex items-center justify-between"><div><p className="eyebrow">{editingId ? "Edit collection" : "New collection"}</p><h3 className="mt-1 font-serif text-xl">{editingId ? "Update category" : "Add a category"}</h3></div><button type="button" onClick={() => setOpen(false)} className="icon-button" aria-label="Close category form"><X size={17} /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"><label className="text-xs font-bold text-[#6b5e56]">Category name<input required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Kitchen Essentials" className="admin-field" /></label><label className="inline-flex items-center gap-2 pb-3 text-xs font-bold text-[#6b5e56]"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="h-4 w-4 accent-[#c95b63]" /> Active</label></div><div className="mt-5 flex flex-wrap gap-2"><button disabled={saving} aria-busy={saving} className="primary-button" type="submit">{saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> {editingId ? "Save changes" : "Create category"}</>}</button><button type="button" onClick={() => setOpen(false)} className="text-link">Cancel</button></div></form>}
    <div className="mt-6 grid gap-3">{categories.length ? categories.map((category) => <article key={category.id} className="flex flex-col gap-4 rounded-xl border border-[#eadfd3] bg-[#f5ede3] p-4 sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7dfd8] text-[#c95b63]"><Tag size={18} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-bold">{category.name}</p><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] ${category.is_active ? "bg-[#e7f5eb] text-[#2f8060]" : "bg-[#f7dfd8] text-[#a8434d]"}`}>{category.is_active ? "Active" : "Hidden"}</span></div><p className="mt-1 text-xs text-[#796b62]">{category.product_count || 0} linked product{category.product_count === 1 ? "" : "s"}</p></div><div className="flex gap-2"><button type="button" onClick={() => openEdit(category)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8c7b8] px-3 py-2 text-xs font-bold text-[#6b5e56] hover:bg-[#fffaf3]"><Edit3 size={14} /> Edit</button><button type="button" onClick={() => { setDeleteTarget(category); setReplacement(""); }} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e8c1c5] px-3 py-2 text-xs font-bold text-[#a8434d] hover:bg-[#f7dfd8]"><Trash2 size={14} /> Remove</button></div></article>) : <div className="rounded-xl border border-dashed border-[#d8c7b8] p-8 text-center text-sm text-[#796b62]">No categories loaded. Connect FastAPI or add your first category.</div>}</div>
    {deleteTarget && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#231f20]/45 p-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="delete-category-title" className="w-full max-w-md rounded-2xl border border-[#dfc9b8] bg-[#fffaf3] p-6 shadow-2xl"><p className="eyebrow">Catalog structure</p><h2 id="delete-category-title" className="mt-2 font-serif text-2xl">Remove “{deleteTarget.name}”?</h2><p className="mt-3 text-sm leading-6 text-[#796b62]">This category has {deleteTarget.product_count || 0} linked product{deleteTarget.product_count === 1 ? "" : "s"}. Choose a replacement to move them, or cancel to keep the category.</p>{(deleteTarget.product_count || 0) > 0 && <label className="mt-4 block text-xs font-bold text-[#6b5e56]">Move linked products to<select value={replacement} onChange={(event) => setReplacement(event.target.value)} className="admin-field" required><option value="">Choose replacement category</option>{categories.filter((item) => item.id !== deleteTarget.id && item.is_active).map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>}<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" disabled={saving} onClick={() => setDeleteTarget(null)} className="rounded-full border border-[#d8c7b8] px-4 py-2.5 text-sm font-bold text-[#6b5e56]">Cancel</button><button type="button" disabled={saving || ((deleteTarget.product_count || 0) > 0 && !replacement)} onClick={() => void remove()} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#a8434d] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? <><Loader2 size={15} className="animate-spin" /> Removing...</> : "Remove category"}</button></div></div></div>}
  </section>;
}

// Keep the component self-contained so category operations remain easy to audit.
void Tag;
