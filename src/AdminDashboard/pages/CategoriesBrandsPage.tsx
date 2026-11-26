import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutGrid,
  LoaderCircle,
  Package,
  Search,
  Shapes,
  Image as ImageIcon,
  List,
  Plus,
  Pencil,
  X,
  Save,
} from "lucide-react";
import {
  BrandInput,
  CategoryInput,
  SubcategoryInput,
  TaxonomyBrand,
  TaxonomyCategory,
  TaxonomySubcategory,
  useGetTaxonomyBrandsQuery,
  useGetTaxonomyCategoriesQuery,
  useGetTaxonomySubcategoriesQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
} from "@/redux/features/admin/taxonomyApi";

type Tab = "categories" | "subcategories" | "brands";
type StatusFilter = "all" | "active" | "inactive";
type ViewMode = "cards" | "table";
const PAGE_SIZE = 10;
const apiBase = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";
const serverOrigin = apiBase.replace(/\/api\/v\d+\/?$/, "");
const countQuery = { page: 1, limit: 1 };

function getTaxonomyLoadError(error: unknown) {
  const apiError = error as {
    status?: string | number;
    error?: string;
    data?: { message?: string };
  } | undefined;

  if (apiError?.status === 401) {
    return "Your admin session is missing or expired. Sign in again, then retry.";
  }
  if (apiError?.status === 403) {
    return "This account does not have permission to view catalog data. Sign in with an admin account.";
  }
  if (apiError?.status === 404) {
    return "The running backend does not have this catalog route. Restart the backend from the current source.";
  }
  if (apiError?.status === "FETCH_ERROR") {
    return "The backend could not be reached. Check that it is running and that VITE_API_ENDPOINT points to it.";
  }
  return apiError?.data?.message || apiError?.error || `Catalog request failed (HTTP ${apiError?.status ?? "unknown"}).`;
}

function imageUrl(path?: string | null) {
  if (!path) return undefined;
  return path.startsWith("http")
    ? path
    : `${serverOrigin}${path.startsWith("/") ? "" : "/"}${path}`;
}

function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`grid place-items-center bg-pink-50 text-pink-400 ${className}`}>
      <ImageIcon className="h-6 w-6" />
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function CategoryCard({
  category,
  selected,
  onSelect,
  onEdit,
}: {
  category: TaxonomyCategory;
  selected: boolean;
  onSelect: () => void;
  onEdit: (category: TaxonomyCategory) => void;
}) {
  const src = imageUrl(category.image);
  return (
    <article className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selected ? "border-primary ring-2 ring-pink-100" : "border-pink-100"}`}>
      <div className="flex items-center gap-3 p-4">
        <button type="button" onClick={onSelect} aria-expanded={selected} className="flex min-w-0 flex-1 items-center gap-4 text-left">
          {src ? <img src={src} alt={category.name} className="h-16 w-16 shrink-0 rounded-xl border border-pink-100 bg-pink-50 object-cover" /> : <ImagePlaceholder className="h-16 w-16 shrink-0 rounded-xl border border-pink-100" />}
          <span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><span className="min-w-0"><span className="block truncate font-bold text-slate-900">{category.name}</span><span className="block truncate text-xs text-slate-500">Slug: /{category.slug}</span></span><StatusBadge active={category.isActive} /></span><span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span>{category._count?.products ?? 0} products</span><span>{category._count?.subCategories ?? category.subCategories?.length ?? 0} subcategories</span></span></span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${selected ? "rotate-180" : ""}`} />
        </button>
        <button type="button" onClick={() => onEdit(category)} aria-label={`Edit ${category.name}`} className="rounded-lg border border-pink-100 p-2 text-slate-500 hover:border-primary hover:text-primary"><Pencil className="h-4 w-4" /></button>
      </div>
      {(category.subCategories?.length ?? 0) > 0 && (
        <div className="border-t border-pink-100 px-4 py-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Subcategories ({category.subCategories.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {category.subCategories.map((sub) => (
              <span key={sub.id} title={sub.name} className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-pink-50/80 py-1 pl-1 pr-2 text-xs text-slate-700">
                {imageUrl(sub.image) ? (
                  <img src={imageUrl(sub.image)} alt="" className="h-5 w-5 rounded object-cover" />
                ) : (
                  <span className="grid h-5 w-5 place-items-center rounded bg-white text-pink-400"><Shapes className="h-3 w-3" /></span>
                )}
                <span className="max-w-40 truncate">{sub.name}</span>
                <span className="text-slate-400">({sub._count?.products ?? 0})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function SubcategoryCard({ subcategory, onEdit }: { subcategory: TaxonomySubcategory; onEdit: (subcategory: TaxonomySubcategory) => void }) {
  const src = imageUrl(subcategory.image);
  return (
    <article className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {src ? <img src={src} alt={subcategory.name} className="h-36 w-full bg-pink-50 object-cover" /> : <ImagePlaceholder className="h-36 w-full" />}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0"><h3 className="truncate font-bold text-slate-900">{subcategory.name}</h3><p className="mt-0.5 truncate text-xs text-slate-500">{subcategory.category?.name ?? "Category unavailable"}</p></div>
          <div className="flex shrink-0 items-center gap-2"><StatusBadge active={subcategory.isActive} /><button type="button" onClick={() => onEdit(subcategory)} aria-label={`Edit ${subcategory.name}`} className="rounded-lg border border-pink-100 p-2 text-slate-500 hover:border-primary hover:text-primary"><Pencil className="h-4 w-4" /></button></div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-pink-100 pt-3 text-xs text-slate-500"><span className="truncate">/{subcategory.slug}</span><span className="inline-flex shrink-0 items-center gap-1"><Package className="h-3.5 w-3.5" />{subcategory._count?.products ?? 0}</span></div>
      </div>
    </article>
  );
}

function BrandCard({ brand, onEdit }: { brand: TaxonomyBrand; onEdit: (brand: TaxonomyBrand) => void }) {
  const src = imageUrl(brand.logo);
  return (
    <article className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        {src ? <img src={src} alt={`${brand.name} logo`} className="h-14 w-14 shrink-0 rounded-xl border border-pink-100 bg-white p-1.5 object-contain" /> : <ImagePlaceholder className="h-14 w-14 shrink-0 rounded-xl border border-pink-100" />}
        <div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><h3 className="truncate font-bold text-slate-900">{brand.name}</h3>{brand.verificationStatus === "VERIFIED" && <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />}</div><p className="truncate text-xs text-slate-500">{brand.country || "Country not set"}</p></div>
        <button type="button" onClick={() => onEdit(brand)} aria-label={`Edit ${brand.name}`} title="Edit brand" className="rounded-lg border border-pink-100 p-2 text-slate-500 transition hover:border-primary hover:text-primary"><Pencil className="h-4 w-4" /></button>
      </div>
      {brand.description && <p className="mt-3 line-clamp-2 min-h-9 text-xs leading-5 text-slate-600">{brand.description}</p>}
      <div className="mt-3 flex items-center justify-between border-t border-pink-100 pt-3 text-xs"><StatusBadge active={brand.isActive} /><span className="text-slate-500">{brand._count?.products ?? 0} products</span></div>
    </article>
  );
}

function CategoryTable({
  categories,
  selectedId,
  onSelect,
  onEdit,
}: {
  categories: TaxonomyCategory[];
  selectedId?: string;
  onSelect: (category: TaxonomyCategory) => void;
  onEdit: (category: TaxonomyCategory) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-pink-100 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-pink-50/60 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Products</th><th className="px-4 py-3">Subcategories</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Details</th><th className="px-4 py-3 text-right">Action</th></tr></thead>
        <tbody className="divide-y divide-pink-50">
          {categories.map((category) => (
            <tr key={category.id} onClick={() => onSelect(category)} className={`cursor-pointer transition hover:bg-pink-50/40 ${selectedId === category.id ? "bg-pink-50/60" : ""}`}>
              <td className="px-4 py-3"><span className="flex items-center gap-3">{imageUrl(category.image) ? <img src={imageUrl(category.image)} alt="" className="h-10 w-10 rounded-lg border border-pink-100 object-cover" /> : <ImagePlaceholder className="h-10 w-10 rounded-lg border border-pink-100" />}<span className="font-semibold text-slate-800">{category.name}</span></span></td>
              <td className="px-4 py-3 text-slate-500">/{category.slug}</td><td className="px-4 py-3 text-slate-600">{category._count?.products ?? 0}</td><td className="px-4 py-3 text-slate-600">{category._count?.subCategories ?? category.subCategories?.length ?? 0}</td><td className="px-4 py-3"><StatusBadge active={category.isActive} /></td>
              <td className="px-4 py-3"><button type="button" onClick={(event) => { event.stopPropagation(); onSelect(category); }} className="font-semibold text-primary hover:underline">View subcategories</button></td><td className="px-4 py-3 text-right"><button type="button" onClick={(event) => { event.stopPropagation(); onEdit(category); }} className="inline-flex items-center gap-1.5 rounded-lg border border-pink-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary"><Pencil className="h-3.5 w-3.5" />Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubcategoryTable({ subcategories, onEdit }: { subcategories: TaxonomySubcategory[]; onEdit: (subcategory: TaxonomySubcategory) => void }) {
  return <div className="overflow-x-auto rounded-2xl border border-pink-100 bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-pink-50/60 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Subcategory</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Products</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-pink-50">{subcategories.map((sub) => <tr key={sub.id} className="hover:bg-pink-50/40"><td className="px-4 py-3"><span className="flex items-center gap-3">{imageUrl(sub.image) ? <img src={imageUrl(sub.image)} alt="" className="h-10 w-10 rounded-lg border border-pink-100 object-cover" /> : <ImagePlaceholder className="h-10 w-10 rounded-lg border border-pink-100" />}<span className="font-semibold text-slate-800">{sub.name}</span></span></td><td className="px-4 py-3 text-slate-600">{sub.category?.name ?? "-"}</td><td className="px-4 py-3 text-slate-500">/{sub.slug}</td><td className="px-4 py-3 text-slate-600">{sub._count?.products ?? 0}</td><td className="px-4 py-3"><StatusBadge active={sub.isActive} /></td><td className="px-4 py-3 text-right"><button type="button" onClick={() => onEdit(sub)} className="inline-flex items-center gap-1.5 rounded-lg border border-pink-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary"><Pencil className="h-3.5 w-3.5" />Edit</button></td></tr>)}</tbody></table></div>;
}

function BrandTable({ brands, onEdit }: { brands: TaxonomyBrand[]; onEdit: (brand: TaxonomyBrand) => void }) {
  return <div className="overflow-x-auto rounded-2xl border border-pink-100 bg-white shadow-sm"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-pink-50/60 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Brand</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Products</th><th className="px-4 py-3">Verification</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-pink-50">{brands.map((brand) => <tr key={brand.id} className="hover:bg-pink-50/40"><td className="px-4 py-3"><span className="flex items-center gap-3">{imageUrl(brand.logo) ? <img src={imageUrl(brand.logo)} alt={`${brand.name} logo`} className="h-10 w-10 rounded-lg border border-pink-100 bg-white p-1 object-contain" /> : <ImagePlaceholder className="h-10 w-10 rounded-lg border border-pink-100" />}<span className="font-semibold text-slate-800">{brand.name}</span></span></td><td className="px-4 py-3 text-slate-600">{brand.country || "-"}</td><td className="px-4 py-3 text-slate-600">{brand._count?.products ?? 0}</td><td className="px-4 py-3 text-slate-600">{brand.verificationStatus}</td><td className="px-4 py-3"><StatusBadge active={brand.isActive} /></td><td className="px-4 py-3 text-right"><button type="button" onClick={() => onEdit(brand)} className="inline-flex items-center gap-1.5 rounded-lg border border-pink-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary"><Pencil className="h-3.5 w-3.5" />Edit</button></td></tr>)}</tbody></table></div>;
}

function getMutationMessage(error: unknown, resource = "record") {
  const data = (error as { data?: { message?: string | string[]; errors?: { message?: string }[] } })?.data;
  if (Array.isArray(data?.message)) return data.message.join(" ");
  return data?.message || data?.errors?.map((item) => item.message).filter(Boolean).join(" ") || `Could not save ${resource}. Check the fields and backend connection.`;
}

function TaxonomyImagePicker({
  currentImage,
  onChange,
  selectedFile,
}: {
  currentImage?: string | null;
  selectedFile?: File;
  onChange: (file?: File) => void;
}) {
  const preview = useMemo(() => selectedFile ? URL.createObjectURL(selectedFile) : imageUrl(currentImage), [selectedFile, currentImage]);
  useEffect(() => () => { if (selectedFile && preview) URL.revokeObjectURL(preview); }, [selectedFile, preview]);
  return <div className="rounded-xl border border-dashed border-pink-200 p-3"><label className="block text-sm font-medium text-slate-700">Image <span className="text-xs font-normal text-slate-500">(optional; JPEG, PNG, WebP or SVG, max 2 MB)</span><input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={(event) => onChange(event.target.files?.[0])} className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-3 file:py-2 file:font-semibold file:text-primary" /></label>{preview && <div className="mt-3 flex items-center gap-3"><img src={preview} alt="Image preview" className="h-14 w-14 rounded-lg border border-pink-100 bg-white object-cover" /><p className="text-xs text-slate-500">{selectedFile ? "New image selected. Saving replaces the current image." : "Current image. Leave upload empty to keep it."}</p>{selectedFile && <button type="button" onClick={() => onChange(undefined)} className="ml-auto text-xs font-semibold text-rose-600 hover:underline">Clear selection</button>}</div>}</div>;
}

function CategoryFormModal({
  category,
  onClose,
  onSave,
  saving,
  error,
}: {
  category: TaxonomyCategory | null;
  onClose: () => void;
  onSave: (input: CategoryInput) => Promise<void>;
  saving: boolean;
  error?: string;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(category ? String(category.sortOrder) : "");
  const [image, setImage] = useState<File>();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave({ name, isActive, ...(sortOrder ? { sortOrder: Number(sortOrder) } : {}), ...(image ? { image } : {}) });
  }
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="category-form-title" className="my-auto max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-pink-100 bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-pink-100 px-5 py-4"><div><h2 id="category-form-title" className="text-lg font-bold text-slate-900">{category ? "Edit category" : "Create category"}</h2><p className="mt-1 text-xs text-slate-500">Slug is generated from the name. Leave order empty to assign it automatically.</p></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-pink-50"><X className="h-5 w-5" /></button></header><form onSubmit={submit} className="space-y-4 p-5"><label className="block text-sm font-medium text-slate-700">Category name <span className="text-rose-500">*</span><input required maxLength={150} value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-pink-100 px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. Skincare" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Display order <span className="text-xs font-normal text-slate-500">(optional)</span><input type="number" min={1} step={1} value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="mt-1.5 w-full rounded-xl border border-pink-100 px-3 py-2.5 outline-none focus:border-primary" placeholder="Auto" /></label><label className="block text-sm font-medium text-slate-700">Status<select value={String(isActive)} onChange={(event) => setIsActive(event.target.value === "true")} className="mt-1.5 w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 outline-none focus:border-primary"><option value="true">Active</option><option value="false">Inactive</option></select></label></div><TaxonomyImagePicker currentImage={category?.image} selectedFile={image} onChange={setImage} />{error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}<footer className="flex justify-end gap-2 border-t border-pink-50 pt-4"><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-pink-100 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : category ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? "Saving…" : category ? "Save changes" : "Create category"}</button></footer></form></section></div>;
}

function SubcategoryFormModal({
  subcategory,
  categories,
  initialCategoryId,
  onClose,
  onSave,
  saving,
  error,
}: {
  subcategory: TaxonomySubcategory | null;
  categories: TaxonomyCategory[];
  initialCategoryId?: string;
  onClose: () => void;
  onSave: (input: SubcategoryInput) => Promise<void>;
  saving: boolean;
  error?: string;
}) {
  const [name, setName] = useState(subcategory?.name ?? "");
  const [categoryId, setCategoryId] = useState(subcategory?.categoryId ?? initialCategoryId ?? categories[0]?.id ?? "");
  const [isActive, setIsActive] = useState(subcategory?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(subcategory ? String(subcategory.sortOrder) : "");
  const [image, setImage] = useState<File>();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave({ name, categoryId, isActive, ...(sortOrder ? { sortOrder: Number(sortOrder) } : {}), ...(image ? { image } : {}) });
  }
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="subcategory-form-title" className="my-auto max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-pink-100 bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-pink-100 px-5 py-4"><div><h2 id="subcategory-form-title" className="text-lg font-bold text-slate-900">{subcategory ? "Edit subcategory" : "Create subcategory"}</h2><p className="mt-1 text-xs text-slate-500">Choose the parent category. Slug is generated from the name.</p></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-pink-50"><X className="h-5 w-5" /></button></header><form onSubmit={submit} className="space-y-4 p-5"><label className="block text-sm font-medium text-slate-700">Parent category <span className="text-rose-500">*</span><select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 outline-none focus:border-primary"><option value="" disabled>Select category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}{item.isActive ? "" : " (inactive)"}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Subcategory name <span className="text-rose-500">*</span><input required maxLength={150} value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-pink-100 px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. Serums" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Display order <span className="text-xs font-normal text-slate-500">(optional)</span><input type="number" min={1} step={1} value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="mt-1.5 w-full rounded-xl border border-pink-100 px-3 py-2.5 outline-none focus:border-primary" placeholder="Auto" /></label><label className="block text-sm font-medium text-slate-700">Status<select value={String(isActive)} onChange={(event) => setIsActive(event.target.value === "true")} className="mt-1.5 w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 outline-none focus:border-primary"><option value="true">Active</option><option value="false">Inactive</option></select></label></div><TaxonomyImagePicker currentImage={subcategory?.image} selectedFile={image} onChange={setImage} />{error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}<footer className="flex justify-end gap-2 border-t border-pink-50 pt-4"><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-pink-100 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={saving || categories.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : subcategory ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? "Saving…" : subcategory ? "Save changes" : "Create subcategory"}</button></footer></form></section></div>;
}

function BrandFormModal({
  brand,
  onClose,
  onSave,
  saving,
  error,
}: {
  brand: TaxonomyBrand | null;
  onClose: () => void;
  onSave: (input: BrandInput) => Promise<void>;
  saving: boolean;
  error?: string;
}) {
  const [name, setName] = useState(brand?.name ?? "");
  const [country, setCountry] = useState(brand?.country ?? "");
  const [website, setWebsite] = useState(brand?.website ?? "");
  const [description, setDescription] = useState(brand?.description ?? "");
  const [verificationStatus, setVerificationStatus] = useState<BrandInput["verificationStatus"]>(brand?.verificationStatus ?? "UNVERIFIED");
  const [isActive, setIsActive] = useState(brand?.isActive ?? true);
  const [logo, setLogo] = useState<File>();
  const preview = useMemo(() => logo ? URL.createObjectURL(logo) : imageUrl(brand?.logo), [logo, brand?.logo]);

  useEffect(() => () => { if (logo) URL.revokeObjectURL(preview ?? ""); }, [logo, preview]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave({
      name,
      country,
      website,
      description,
      verificationStatus,
      isActive,
      ...(logo ? { logo } : {}),
    });
  }

  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="brand-form-title" className="my-auto max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-pink-100 bg-white shadow-2xl">
      <header className="flex items-start justify-between border-b border-pink-100 px-5 py-4 sm:px-6"><div><h2 id="brand-form-title" className="text-lg font-bold text-slate-900">{brand ? "Edit brand" : "Create brand"}</h2><p className="mt-1 text-xs text-slate-500">Slug is generated automatically from the brand name.</p></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-pink-50"><X className="h-5 w-5" /></button></header>
      <form onSubmit={submit} className="space-y-4 p-5 sm:p-6">
        <label className="block text-sm font-medium text-slate-700">Brand name <span className="text-rose-500">*</span><input required maxLength={150} value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-pink-100 px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. COSRX" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Country<input maxLength={100} value={country} onChange={(event) => setCountry(event.target.value)} className="mt-1.5 w-full rounded-xl border border-pink-100 px-3 py-2.5 outline-none focus:border-primary" placeholder="e.g. South Korea" /></label><label className="block text-sm font-medium text-slate-700">Official website<input type="url" maxLength={500} value={website} onChange={(event) => setWebsite(event.target.value)} className="mt-1.5 w-full rounded-xl border border-pink-100 px-3 py-2.5 outline-none focus:border-primary" placeholder="https://example.com" /></label></div>
        <label className="block text-sm font-medium text-slate-700">Description<textarea maxLength={5000} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 w-full resize-y rounded-xl border border-pink-100 px-3 py-2.5 outline-none focus:border-primary" placeholder="Brand information" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Verification<select value={verificationStatus} onChange={(event) => setVerificationStatus(event.target.value as BrandInput["verificationStatus"])} className="mt-1.5 w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 outline-none focus:border-primary"><option value="UNVERIFIED">Unverified</option><option value="VERIFIED">Verified</option></select></label><label className="block text-sm font-medium text-slate-700">Status<select value={String(isActive)} onChange={(event) => setIsActive(event.target.value === "true")} className="mt-1.5 w-full rounded-xl border border-pink-100 bg-white px-3 py-2.5 outline-none focus:border-primary"><option value="true">Active</option><option value="false">Inactive</option></select></label></div>
        <div className="rounded-xl border border-dashed border-pink-200 p-3"><label className="block text-sm font-medium text-slate-700">Brand logo <span className="text-xs font-normal text-slate-500">(optional; JPEG, PNG or WebP)</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setLogo(event.target.files?.[0])} className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-3 file:py-2 file:font-semibold file:text-primary" /></label>{preview && <div className="mt-3 flex items-center gap-3"><img src={preview} alt="Brand logo preview" className="h-14 w-14 rounded-lg border border-pink-100 bg-white p-1 object-contain" /><p className="text-xs text-slate-500">{logo ? "New logo selected. Saving replaces the current logo." : "Current logo. Leave the upload empty to keep it."}</p></div>}</div>
        {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <footer className="flex justify-end gap-2 border-t border-pink-50 pt-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-pink-100 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-pink-50">Cancel</button><button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : brand ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? "Saving…" : brand ? "Save changes" : "Create brand"}</button></footer>
      </form>
    </section>
  </div>;
}

const CategoriesBrandsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("categories");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<TaxonomyCategory | null>(null);
  const [editingCategory, setEditingCategory] = useState<TaxonomyCategory | null>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState<string>();
  const [editingSubcategory, setEditingSubcategory] = useState<TaxonomySubcategory | null>(null);
  const [subcategoryInitialCategoryId, setSubcategoryInitialCategoryId] = useState<string>();
  const [subcategoryFormOpen, setSubcategoryFormOpen] = useState(false);
  const [subcategoryFormError, setSubcategoryFormError] = useState<string>();
  const [editingBrand, setEditingBrand] = useState<TaxonomyBrand | null>(null);
  const [brandFormOpen, setBrandFormOpen] = useState(false);
  const [brandFormError, setBrandFormError] = useState<string>();
  const [createBrand, createBrandState] = useCreateBrandMutation();
  const [updateBrand, updateBrandState] = useUpdateBrandMutation();
  const [createCategory, createCategoryState] = useCreateCategoryMutation();
  const [updateCategory, updateCategoryState] = useUpdateCategoryMutation();
  const [createSubcategory, createSubcategoryState] = useCreateSubcategoryMutation();
  const [updateSubcategory, updateSubcategoryState] = useUpdateSubcategoryMutation();
  const isActive = status === "all" ? undefined : status === "active";
  const commonQuery = { page, limit: PAGE_SIZE, ...(debouncedSearch ? { search: debouncedSearch } : {}), ...(isActive === undefined ? {} : { isActive }) };

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    setPage(1);
    setSelectedCategory(null);
  }, [activeTab, debouncedSearch, status]);

  const categoriesQuery = useGetTaxonomyCategoriesQuery(commonQuery, { skip: activeTab !== "categories" });
  const subcategoriesQuery = useGetTaxonomySubcategoriesQuery(commonQuery, { skip: activeTab !== "subcategories" });
  const brandsQuery = useGetTaxonomyBrandsQuery(commonQuery, { skip: activeTab !== "brands" });
  const categoryCountQuery = useGetTaxonomyCategoriesQuery(countQuery);
  const categoryOptionsQuery = useGetTaxonomyCategoriesQuery({ page: 1, limit: 100 });
  const subcategoryCountQuery = useGetTaxonomySubcategoriesQuery(countQuery);
  const brandCountQuery = useGetTaxonomyBrandsQuery(countQuery);
  const categoryActiveQuery = useGetTaxonomyCategoriesQuery({ ...countQuery, isActive: true });
  const subcategoryActiveQuery = useGetTaxonomySubcategoriesQuery({ ...countQuery, isActive: true });
  const brandActiveQuery = useGetTaxonomyBrandsQuery({ ...countQuery, isActive: true });

  const current = activeTab === "categories" ? categoriesQuery : activeTab === "subcategories" ? subcategoriesQuery : brandsQuery;
  const rows = current.data?.data ?? [];
  const categoryOptions = categoryOptionsQuery.data?.data ?? [];
  const meta = current.data?.meta;
  const totalCategories = categoryCountQuery.data?.meta.total;
  const totalSubcategories = subcategoryCountQuery.data?.meta.total;
  const totalBrands = brandCountQuery.data?.meta.total;
  const activeCountQuery = activeTab === "categories" ? categoryActiveQuery : activeTab === "subcategories" ? subcategoryActiveQuery : brandActiveQuery;
  const selectedTotal = activeTab === "categories" ? totalCategories : activeTab === "subcategories" ? totalSubcategories : totalBrands;
  const selectedActive = activeCountQuery.data?.meta.total;
  // Active and inactive form a complete two-state set; derive the latter from the same total
  // to keep the summary consistent even if a provider mishandles a false query parameter.
  const selectedInactive = selectedTotal !== undefined && selectedActive !== undefined
    ? Math.max(0, selectedTotal - selectedActive)
    : undefined;
  const selectedLabel = activeTab === "categories" ? "Categories" : activeTab === "subcategories" ? "Subcategories" : "Brands";
  const tabs: { key: Tab; label: string; icon: typeof Layers; count?: number }[] = [
    { key: "categories", label: "Categories", icon: Layers, count: totalCategories },
    { key: "subcategories", label: "Subcategories", icon: Shapes, count: totalSubcategories },
    { key: "brands", label: "Brands", icon: Award, count: totalBrands },
  ];
  const selectedOnPage = selectedCategory && (rows as TaxonomyCategory[]).find((category) => category.id === selectedCategory.id);
  const showPagination = !!meta && meta.total > meta.limit;

  async function saveBrand(input: BrandInput) {
    setBrandFormError(undefined);
    try {
      if (editingBrand) await updateBrand({ id: editingBrand.id, changes: input }).unwrap();
      else await createBrand(input).unwrap();
      setBrandFormOpen(false);
      setEditingBrand(null);
    } catch (error) {
      setBrandFormError(getMutationMessage(error));
    }
  }

  async function saveCategory(input: CategoryInput) {
    setCategoryFormError(undefined);
    try {
      if (editingCategory) await updateCategory({ id: editingCategory.id, changes: input }).unwrap();
      else await createCategory(input).unwrap();
      setCategoryFormOpen(false);
      setEditingCategory(null);
      setSelectedCategory(null);
    } catch (error) {
      setCategoryFormError(getMutationMessage(error, "category"));
    }
  }

  async function saveSubcategory(input: SubcategoryInput) {
    setSubcategoryFormError(undefined);
    try {
      if (editingSubcategory) await updateSubcategory({ id: editingSubcategory.id, changes: input }).unwrap();
      else await createSubcategory(input).unwrap();
      setSubcategoryFormOpen(false);
      setEditingSubcategory(null);
      setSubcategoryInitialCategoryId(undefined);
      setSelectedCategory(null);
    } catch (error) {
      setSubcategoryFormError(getMutationMessage(error, "subcategory"));
    }
  }

  function openCreateCategory() {
    setEditingCategory(null);
    setCategoryFormError(undefined);
    setCategoryFormOpen(true);
  }

  function openEditCategory(category: TaxonomyCategory) {
    setEditingCategory(category);
    setCategoryFormError(undefined);
    setCategoryFormOpen(true);
  }

  function openCreateSubcategory(categoryId?: string) {
    setEditingSubcategory(null);
    setSubcategoryFormError(undefined);
    setSubcategoryInitialCategoryId(categoryId);
    setSubcategoryFormOpen(true);
  }

  function openEditSubcategory(subcategory: TaxonomySubcategory) {
    setEditingSubcategory(subcategory);
    setSubcategoryFormError(undefined);
    setSubcategoryInitialCategoryId(undefined);
    setSubcategoryFormOpen(true);
  }

  function openCreateBrand() {
    setEditingBrand(null);
    setBrandFormError(undefined);
    setBrandFormOpen(true);
  }

  function openEditBrand(brand: TaxonomyBrand) {
    setEditingBrand(brand);
    setBrandFormError(undefined);
    setBrandFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div><h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"><Layers className="h-7 w-7 text-primary" />Categories, Subcategories &amp; Brands</h1><p className="mt-1 text-sm text-slate-500">Browse your live catalog taxonomy and brand partners.</p></div>
        <div className="flex flex-wrap items-center gap-2"><div className="flex flex-wrap gap-1 rounded-xl bg-pink-50 p-1">
          {tabs.map(({ key, label, icon: Icon, count }) => <button key={key} onClick={() => setActiveTab(key)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 ${activeTab === key ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}><Icon className="h-4 w-4" />{label}{count !== undefined && <span>({count})</span>}</button>)}
        </div>{activeTab === "brands" ? <button type="button" onClick={openCreateBrand} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"><Plus className="h-4 w-4" />Add Brand</button> : activeTab === "categories" ? <button type="button" onClick={openCreateCategory} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"><Plus className="h-4 w-4" />Add Category</button> : <button type="button" onClick={() => openCreateSubcategory()} disabled={categoryOptionsQuery.isLoading || categoryOptions.length === 0} title={categoryOptions.length === 0 ? "Create a category first" : undefined} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"><Plus className="h-4 w-4" />Add Subcategory</button>}</div>
      </header>

      <section aria-label="Catalog summary" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: `Total ${selectedLabel}`, value: selectedTotal, icon: activeTab === "categories" ? Layers : activeTab === "subcategories" ? Shapes : Award, color: "text-pink-600", bg: "bg-pink-50" },
          { label: "Active", value: selectedActive, icon: BadgeCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Inactive", value: selectedInactive, icon: Package, color: "text-slate-600", bg: "bg-slate-100" },
        ].map(({ label, value, icon: Icon, color, bg }) => <article key={`${activeTab}-${label}`} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span><span className={`grid h-9 w-9 place-items-center rounded-xl ${bg} ${color}`}><Icon className="h-4 w-4" /></span></div><p className={`mt-2 text-2xl font-extrabold ${color}`}>{value ?? <span className="inline-block h-7 w-10 animate-pulse rounded bg-slate-100" />}</p></article>)}
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold text-slate-900">{activeTab === "categories" ? "Store Categories" : activeTab === "subcategories" ? "Store Subcategories" : "Brand Partners"}</h2><p className="mt-0.5 text-xs text-slate-500">{meta ? `${meta.total} records` : "Loading record count..."}{status !== "all" ? ` | ${status}` : " | all statuses"}</p></div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-52 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${activeTab}...`} className="w-full rounded-xl border border-pink-100 bg-pink-50/40 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>
          <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} aria-label="Filter status" className="rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
          <div role="group" aria-label="View mode" className="flex rounded-xl border border-pink-100 bg-white p-1"><button type="button" aria-pressed={viewMode === "cards"} onClick={() => setViewMode("cards")} className={`rounded-lg p-2 ${viewMode === "cards" ? "bg-primary text-white" : "text-slate-500 hover:bg-pink-50"}`} title="Card view"><LayoutGrid className="h-4 w-4" /></button><button type="button" aria-pressed={viewMode === "table"} onClick={() => setViewMode("table")} className={`rounded-lg p-2 ${viewMode === "table" ? "bg-primary text-white" : "text-slate-500 hover:bg-pink-50"}`} title="Table view"><List className="h-4 w-4" /></button></div>
        </div>
      </section>

      {current.isError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{getTaxonomyLoadError(current.error)}<button onClick={() => void current.refetch()} className="ml-2 font-semibold underline">Retry</button></div>}
      {current.isLoading ? <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin text-primary" />Loading {activeTab}...</div>
        : rows.length === 0 ? <div className="rounded-2xl border border-dashed border-pink-200 bg-white py-16 text-center"><Layers className="mx-auto h-8 w-8 text-pink-300" /><p className="mt-3 font-semibold text-slate-700">No {activeTab} found</p><p className="mt-1 text-sm text-slate-500">Try another search or status filter.</p></div>
        : activeTab === "categories" ? viewMode === "cards" ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">{(rows as TaxonomyCategory[]).map((category) => <CategoryCard key={category.id} category={category} selected={selectedCategory?.id === category.id} onSelect={() => setSelectedCategory((currentCategory) => currentCategory?.id === category.id ? null : category)} onEdit={openEditCategory} />)}</div> : <CategoryTable categories={rows as TaxonomyCategory[]} selectedId={selectedCategory?.id} onSelect={(category) => setSelectedCategory((currentCategory) => currentCategory?.id === category.id ? null : category)} onEdit={openEditCategory} />
        : activeTab === "subcategories" ? viewMode === "cards" ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">{(rows as TaxonomySubcategory[]).map((sub) => <SubcategoryCard key={sub.id} subcategory={sub} onEdit={openEditSubcategory} />)}</div> : <SubcategoryTable subcategories={rows as TaxonomySubcategory[]} onEdit={openEditSubcategory} />
        : viewMode === "cards" ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{(rows as TaxonomyBrand[]).map((brand) => <BrandCard key={brand.id} brand={brand} onEdit={openEditBrand} />)}</div> : <BrandTable brands={rows as TaxonomyBrand[]} onEdit={openEditBrand} />}

      {activeTab === "categories" && selectedOnPage && <section className="overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm"><div className="flex flex-col gap-1 border-b border-pink-100 bg-pink-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-bold text-slate-900">Subcategories in {selectedOnPage.name}</h3><p className="text-xs text-slate-500">{selectedOnPage._count?.subCategories ?? selectedOnPage.subCategories?.length ?? 0} total subcategories</p></div><div className="flex items-center gap-3"><button type="button" onClick={() => openCreateSubcategory(selectedOnPage.id)} className="text-xs font-semibold text-primary hover:underline">Add subcategory</button><button type="button" onClick={() => setSelectedCategory(null)} className="text-xs font-semibold text-slate-500 hover:underline">Close details</button></div></div>{selectedOnPage.subCategories?.length ? <div className="divide-y divide-pink-50">{selectedOnPage.subCategories.map((sub) => <div key={sub.id} className="flex items-center gap-3 px-4 py-3">{imageUrl(sub.image) ? <img src={imageUrl(sub.image)} alt="" className="h-10 w-10 rounded-lg border border-pink-100 object-cover" /> : <ImagePlaceholder className="h-10 w-10 rounded-lg border border-pink-100" />}<div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{sub.name}</p><p className="truncate text-xs text-slate-500">/{sub.slug}</p></div><span className="hidden text-xs text-slate-500 sm:block">{sub._count?.products ?? 0} products</span><StatusBadge active={sub.isActive} /><button type="button" onClick={() => openEditSubcategory(sub)} aria-label={`Edit ${sub.name}`} className="rounded-lg border border-pink-100 p-2 text-slate-500 hover:border-primary hover:text-primary"><Pencil className="h-4 w-4" /></button></div>)}</div> : <p className="px-4 py-8 text-center text-sm text-slate-500">This category has no subcategories yet.</p>}</section>}

      {meta && meta.total > 0 && <footer className="flex flex-col items-center justify-between gap-3 rounded-xl border border-pink-100 bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row">
        <span>Showing {rows.length ? (meta.page - 1) * meta.limit + 1 : 0}-{(meta.page - 1) * meta.limit + rows.length} of {meta.total}</span>
        {showPagination && <div className="flex items-center gap-3"><button disabled={!meta.hasPreviousPage || current.isFetching} onClick={() => { setPage((value) => Math.max(1, value - 1)); setSelectedCategory(null); }} className="inline-flex items-center gap-1 rounded-lg border border-pink-100 px-3 py-2 disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button><span>Page {meta.page} of {meta.totalPages}</span><button disabled={!meta.hasNextPage || current.isFetching} onClick={() => { setPage((value) => value + 1); setSelectedCategory(null); }} className="inline-flex items-center gap-1 rounded-lg border border-pink-100 px-3 py-2 disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button></div>}
      </footer>}
      {brandFormOpen && <BrandFormModal brand={editingBrand} onClose={() => { if (!createBrandState.isLoading && !updateBrandState.isLoading) { setBrandFormOpen(false); setEditingBrand(null); setBrandFormError(undefined); } }} onSave={saveBrand} saving={createBrandState.isLoading || updateBrandState.isLoading} error={brandFormError} />}
      {categoryFormOpen && <CategoryFormModal category={editingCategory} onClose={() => { if (!createCategoryState.isLoading && !updateCategoryState.isLoading) { setCategoryFormOpen(false); setEditingCategory(null); setCategoryFormError(undefined); } }} onSave={saveCategory} saving={createCategoryState.isLoading || updateCategoryState.isLoading} error={categoryFormError} />}
      {subcategoryFormOpen && <SubcategoryFormModal subcategory={editingSubcategory} categories={categoryOptions} initialCategoryId={subcategoryInitialCategoryId} onClose={() => { if (!createSubcategoryState.isLoading && !updateSubcategoryState.isLoading) { setSubcategoryFormOpen(false); setEditingSubcategory(null); setSubcategoryInitialCategoryId(undefined); setSubcategoryFormError(undefined); } }} onSave={saveSubcategory} saving={createSubcategoryState.isLoading || updateSubcategoryState.isLoading} error={subcategoryFormError} />}
    </div>
  );
};

export default CategoriesBrandsPage;
