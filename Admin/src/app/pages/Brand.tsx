import { useState, useMemo } from "react";
import { 
  Search, Plus, Edit2, Trash2, Image as ImageIcon, AlertTriangle, 
  Package, Eye, DollarSign, Layers, Calendar, X, Tag, ArrowUp, ArrowDown,
  Instagram, Twitter, Globe, Bold, Italic, Code, Heading
} from "lucide-react";

const RS = "₹";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#030213]" : "bg-neutral-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
  coverPhoto?: string;
  description: string;
  status: "active" | "inactive";
  productCount: number;
  totalRevenue: number;
  avgPrice: number;
  founded: string;
  collections: number;
  categories: string[];
  collectionTags?: string[];
  sortOrder: number;
  instagram?: string;
  twitter?: string;
  website?: string;
}

const initialBrands: Brand[] = [
  { 
    id: 1, 
    name: "Drip Doggy", 
    slug: "drip-doggy",
    logo: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=120&h=120&fit=crop", 
    coverPhoto: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&fit=crop",
    description: "Luxury **streetwear** label. Est 2024. `Premium Heavyweight` collections only.", 
    status: "active", 
    productCount: 24, 
    totalRevenue: 24476747, 
    avgPrice: 10874, 
    founded: "2024", 
    collections: 8, 
    categories: ["Outerwear", "Knitwear", "Tops", "Bottoms", "Accessories"],
    collectionTags: ["RAW-DENIM", "OVERSIZED", "HEAVY-COTTON"],
    sortOrder: 1,
    instagram: "dripdoggy",
    twitter: "dripdoggy_hq",
    website: "https://dripdoggy.com"
  },
  { 
    id: 2, 
    name: "Syndicate", 
    slug: "syndicate",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=120&fit=crop", 
    coverPhoto: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&fit=crop",
    description: "Premium **urban** collection tailored for warm climates.", 
    status: "active", 
    productCount: 14, 
    totalRevenue: 12850000, 
    avgPrice: 9178, 
    founded: "2025", 
    collections: 4, 
    categories: ["Outerwear", "Tops", "Accessories"],
    collectionTags: ["GOTH-CHIC", "MONOCHROME"],
    sortOrder: 2,
    instagram: "syndicate_style",
    website: "https://syndicate.in"
  },
  { 
    id: 3, 
    name: "Archive", 
    slug: "archive",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=120&fit=crop", 
    coverPhoto: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&fit=crop",
    description: "Limited edition archive pieces & *seasonal* vault collection.", 
    status: "active", 
    productCount: 8, 
    totalRevenue: 8200000, 
    avgPrice: 14500, 
    founded: "2024", 
    collections: 3, 
    categories: ["Outerwear", "Knitwear", "Bottoms"],
    collectionTags: ["VINTAGE", "DISTRESSED"],
    sortOrder: 3,
    instagram: "archive_vault"
  }
];

const mockProducts = [
  { id: "P001", name: "Structured Canvas Jacket", sku: "DD-STR-001", price: 12999, category: "Outerwear", brandId: 1 },
  { id: "P002", name: "Sartorial Trench Coat", sku: "DD-SAT-001", price: 24999, category: "Outerwear", brandId: 1 },
  { id: "P003", name: "Cashmere Blend Crew", sku: "DD-CAS-001", price: 8999, category: "Knitwear", brandId: 1 },
  { id: "P004", name: "Merino Wool Cardigan", sku: "DD-MER-001", price: 11999, category: "Knitwear", brandId: 2 },
  { id: "P005", name: "Signature Silk Blouse", sku: "DD-SIL-001", price: 6999, category: "Tops", brandId: 2 },
  { id: "P006", name: "Relaxed Linen Shirt", sku: "DD-LIN-001", price: 5499, category: "Tops", brandId: 3 }
];

export function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Associated products drawer
  const [selectedBrandForProducts, setSelectedBrandForProducts] = useState<Brand | null>(null);
  const [brandProducts, setBrandProducts] = useState(mockProducts);
  const [newProductForm, setNewProductForm] = useState({ name: "", sku: "", price: 0, category: "Outerwear" });

  // Add/Edit Form State
  const [form, setForm] = useState({ 
    name: "", 
    slug: "",
    logo: "", 
    coverPhoto: "", 
    description: "", 
    status: "active" as "active" | "inactive",
    founded: "2026",
    collectionTagsString: "",
    sortOrder: 1,
    instagram: "",
    twitter: "",
    website: ""
  });

  const sortedBrands = useMemo(() => {
    return [...brands].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [brands]);

  const filtered = useMemo(() => {
    return sortedBrands.filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase()));
  }, [sortedBrands, search]);

  const kpis = useMemo(() => [
    { label: "Total Brands", value: brands.length.toString(), icon: Layers, color: "text-[#030213]" },
    { label: "Active", value: brands.filter(b => b.status === "active").length.toString(), icon: Eye, color: "text-[#030213]" },
    { label: "Total Products", value: brands.reduce((s, b) => s + b.productCount, 0).toString(), icon: Package, color: "text-[#030213]" },
    { label: "Total Revenue", value: RS + brands.reduce((s, b) => s + b.totalRevenue, 0).toLocaleString("en-IN"), icon: DollarSign, color: "text-[#030213]" },
  ], [brands]);

  const openAdd = () => { 
    setEditBrand(null); 
    setForm({ 
      name: "", 
      slug: "",
      logo: "", 
      coverPhoto: "", 
      description: "", 
      status: "active",
      founded: "2026",
      collectionTagsString: "",
      sortOrder: brands.length + 1,
      instagram: "",
      twitter: "",
      website: ""
    }); 
    setShowModal(true); 
  };

  const openEdit = (b: Brand) => { 
    setEditBrand(b); 
    setForm({ 
      name: b.name, 
      slug: b.slug,
      logo: b.logo, 
      coverPhoto: b.coverPhoto || "",
      description: b.description, 
      status: b.status,
      founded: b.founded || "2026",
      collectionTagsString: b.collectionTags ? b.collectionTags.join(", ") : "",
      sortOrder: b.sortOrder || 1,
      instagram: b.instagram || "",
      twitter: b.twitter || "",
      website: b.website || ""
    }); 
    setShowModal(true); 
  };

  // Helper to generate slug dynamically
  const handleNameChange = (nameVal: string) => {
    const slugVal = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm(prev => ({ ...prev, name: nameVal, slug: slugVal }));
  };

  // Rich Text Editor Simulator helpers
  const insertRichTextFormat = (tag: "bold" | "italic" | "code" | "heading") => {
    let wrap = "";
    if (tag === "bold") wrap = "**";
    if (tag === "italic") wrap = "*";
    if (tag === "code") wrap = "`";
    if (tag === "heading") wrap = "# ";

    setForm(prev => ({
      ...prev,
      description: prev.description + wrap + "text" + (tag !== "heading" ? wrap : "")
    }));
  };

  const save = () => {
    if (!form.name.trim()) return;

    const tags = form.collectionTagsString
      ? form.collectionTagsString.split(",").map(t => t.trim().toUpperCase()).filter(Boolean)
      : [];

    if (editBrand) {
      setBrands(brands.map(b => b.id === editBrand.id ? { 
        ...b, 
        name: form.name,
        slug: form.slug,
        logo: form.logo,
        coverPhoto: form.coverPhoto,
        description: form.description,
        status: form.status,
        founded: form.founded,
        collectionTags: tags,
        sortOrder: form.sortOrder,
        instagram: form.instagram,
        twitter: form.twitter,
        website: form.website
      } : b));
    } else {
      setBrands([...brands, { 
        id: Date.now(), 
        name: form.name,
        slug: form.slug,
        logo: form.logo,
        coverPhoto: form.coverPhoto,
        description: form.description,
        status: form.status,
        founded: form.founded,
        collectionTags: tags,
        sortOrder: form.sortOrder,
        instagram: form.instagram,
        twitter: form.twitter,
        website: form.website,
        productCount: 0, 
        totalRevenue: 0, 
        avgPrice: 0, 
        collections: 0, 
        categories: [] 
      }]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: number) => {
    setBrands(brands.map(b => b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b));
  };

  const confirmDelete = () => { 
    if (deleteId) { 
      setBrands(brands.filter(b => b.id !== deleteId)); 
      setDeleteId(null); 
    } 
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "coverPhoto") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const currentBrandProducts = useMemo(() => {
    if (!selectedBrandForProducts) return [];
    return brandProducts.filter(p => p.brandId === selectedBrandForProducts.id);
  }, [brandProducts, selectedBrandForProducts]);

  const handleAddProductToBrand = () => {
    if (!selectedBrandForProducts || !newProductForm.name || !newProductForm.sku) return;
    const newProd = {
      id: "P" + (brandProducts.length + 1),
      name: newProductForm.name,
      sku: newProductForm.sku,
      price: newProductForm.price,
      category: newProductForm.category,
      brandId: selectedBrandForProducts.id
    };
    setBrandProducts(prev => [...prev, newProd]);
    
    setBrands(prev => prev.map(b => b.id === selectedBrandForProducts.id ? { ...b, productCount: b.productCount + 1 } : b));
    setNewProductForm({ name: "", sku: "", price: 0, category: "Outerwear" });
  };

  const handleRemoveProductFromBrand = (prodId: string) => {
    setBrandProducts(prev => prev.filter(p => p.id !== prodId));
    if (selectedBrandForProducts) {
      setBrands(prev => prev.map(b => b.id === selectedBrandForProducts.id ? { ...b, productCount: Math.max(0, b.productCount - 1) } : b));
    }
  };

  // Reorder sorting
  const moveBrand = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= brands.length) return;

    const listCopy = [...filtered];
    const temp = listCopy[index].sortOrder;
    listCopy[index].sortOrder = listCopy[newIndex].sortOrder;
    listCopy[newIndex].sortOrder = temp;

    setBrands(brands.map(b => {
      const updated = listCopy.find(u => u.id === b.id);
      return updated ? { ...b, sortOrder: updated.sortOrder } : b;
    }));
  };

  // Render basic markdown wrapper for editor descriptions
  const renderDescriptionHTML = (text: string) => {
    if (!text) return "";
    let html = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code class='bg-neutral-200 text-neutral-800 px-1 py-0.5 rounded-none font-mono'>$1</code>")
      .replace(/#(.*?)/g, "<h3>$1</h3>");
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="space-y-8 font-sans text-[#030213]">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest">Brands</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy collections, labels &amp; designers
          </p>
        </div>
        <button onClick={openAdd} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none">
          <Plus className="w-3.5 h-3.5" /> Add Brand
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[105px] rounded-none hover:shadow-sm">
            <div>
              <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">{kpi.label}</span>
            </div>
            <div className="mt-3">
              <span className="text-xl font-bold tracking-tight text-[#030213]">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-card border border-neutral-200/80 p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input type="text" placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-card border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-64 rounded-none" />
        </div>
      </div>

      {/* ── Brand Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b, index) => (
          <div key={b.id} className="bg-card border border-neutral-200/80 flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <div>
              {/* Cover Photo */}
              <div className="h-28 w-full bg-neutral-100 relative overflow-hidden">
                {b.coverPhoto ? (
                  <img src={b.coverPhoto} alt={`${b.name} Cover`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                    <ImageIcon className="w-8 h-8 text-neutral-400" />
                  </div>
                )}
                
                {/* Reordering sorting controls Overlay */}
                <div className="absolute top-2 right-2 bg-[#030213]/90 text-white p-1 flex flex-col gap-1 border border-neutral-700/80">
                  <button onClick={() => moveBrand(index, "up")} disabled={index === 0} className="hover:text-amber-500 disabled:opacity-30 cursor-pointer p-0.5 bg-transparent border-none text-white">
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button onClick={() => moveBrand(index, "down")} disabled={index === filtered.length - 1} className="hover:text-amber-500 disabled:opacity-30 cursor-pointer p-0.5 bg-transparent border-none text-white">
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Logo Overlaid */}
                <div className="absolute bottom-2 left-4 w-12 h-12 bg-card border border-neutral-200/80 p-0.5 overflow-hidden">
                  {b.logo ? <img src={b.logo} alt={b.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-neutral-300" />}
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Title and Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider">{b.name}</h3>
                      <span className={`text-[6px] font-semibold px-1.5 py-0.5 border uppercase ${b.status === "active" ? "border-green-500/20 bg-green-50 text-green-700" : "border-neutral-200 bg-neutral-100 text-neutral-500"}`}>{b.status}</span>
                    </div>
                    
                    <p className="text-[7.5px] font-bold text-neutral-400 font-mono tracking-wider mt-0.5 uppercase">
                      slug: /{b.slug} (Order: #{b.sortOrder})
                    </p>

                    <div className="text-[9px] text-neutral-500 font-bold mt-2 uppercase tracking-wide leading-relaxed">
                      {renderDescriptionHTML(b.description)}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(b)} className="text-neutral-400 hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteId(b.id)} className="text-neutral-400 hover:text-red-700 p-1 bg-transparent border-none cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                {/* Subinfo (Founded / Collections) */}
                <div className="flex items-center gap-3 text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" /> Est. {b.founded}
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-neutral-400" /> {b.collections} Collections
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 py-3 border-y border-neutral-200/60 text-center">
                  <div>
                    <p className="text-[11px] font-bold">{b.productCount}</p>
                    <p className="text-[6px] font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">Products</p>
                  </div>
                  <div className="border-x border-neutral-200/60">
                    <p className="text-[11px] font-bold text-neutral-700">{b.totalRevenue > 0 ? RS + (b.totalRevenue / 100000).toFixed(1) + "L" : "—"}</p>
                    <p className="text-[6px] font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">Revenue</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">{b.avgPrice > 0 ? RS + b.avgPrice.toLocaleString("en-IN") : "—"}</p>
                    <p className="text-[6px] font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">Avg Price</p>
                  </div>
                </div>

                {/* Social links row */}
                <div className="flex items-center gap-3 pt-1">
                  {b.instagram && (
                    <a href={`https://instagram.com/${b.instagram}`} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-[#030213] flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider decoration-none">
                      <Instagram className="w-3 h-3" /> @{b.instagram}
                    </a>
                  )}
                  {b.twitter && (
                    <a href={`https://twitter.com/${b.twitter}`} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-[#030213] flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider decoration-none">
                      <Twitter className="w-3 h-3" /> @{b.twitter}
                    </a>
                  )}
                  {b.website && (
                    <a href={b.website} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-[#030213] flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider decoration-none">
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  )}
                </div>

                {/* Collection Tags */}
                {b.collectionTags && b.collectionTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {b.collectionTags.map(tag => (
                      <span key={tag} className="text-[6.5px] font-bold tracking-widest bg-neutral-100 px-1.5 py-0.5 uppercase border border-neutral-200/40 text-neutral-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-neutral-100">
              <button 
                onClick={() => setSelectedBrandForProducts(b)}
                className="text-[8px] font-bold tracking-widest uppercase hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
              >
                <Package className="w-3.5 h-3.5" /> Associated Products
              </button>
              <div className="flex items-center gap-2">
                <ToggleSwitch enabled={b.status === "active"} onClick={() => toggleStatus(b.id)} />
                <span className={`text-[7px] font-bold tracking-widest ${b.status === "active" ? "text-green-700" : "text-neutral-400"}`}>
                  {b.status === "active" ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add/Edit Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-neutral-300 w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest">{editBrand ? "Edit Brand" : "Add Brand"}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Brand Name</label>
                  <input value={form.name} onChange={e => handleNameChange(e.target.value)}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="e.g. Drip Doggy" />
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">URL Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="drip-doggy" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Logo Image</label>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, "logo")} className="w-full text-[8px] uppercase tracking-wider border border-neutral-200/80 p-1" />
                  {form.logo && <img src={form.logo} alt="Logo Preview" className="mt-2 h-10 object-contain border" />}
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Cover Photo</label>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, "coverPhoto")} className="w-full text-[8px] uppercase tracking-wider border border-neutral-200/80 p-1" />
                  {form.coverPhoto && <img src={form.coverPhoto} alt="Cover Preview" className="mt-2 h-10 object-contain border" />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Founded Year</label>
                  <select value={form.founded} onChange={e => setForm({ ...form, founded: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card">
                    {["2023", "2024", "2025", "2026", "2027"].map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Sort Order Priority</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" />
                </div>
              </div>

              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Collection Tags (Comma separated)</label>
                <input value={form.collectionTagsString} onChange={e => setForm({ ...form, collectionTagsString: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="e.g. OVERSIZED, MONOCHROME, RAW-DENIM" />
              </div>

              {/* Social links Inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[7.5px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Instagram handle</label>
                  <input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })}
                    className="w-full border border-neutral-200/80 px-2 py-1.5 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="e.g. dripdoggy" />
                </div>
                <div>
                  <label className="text-[7.5px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Twitter Handle</label>
                  <input value={form.twitter} onChange={e => setForm({ ...form, twitter: e.target.value })}
                    className="w-full border border-neutral-200/80 px-2 py-1.5 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="e.g. drip_hq" />
                </div>
                <div>
                  <label className="text-[7.5px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Website Link</label>
                  <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
                    className="w-full border border-neutral-200/80 px-2 py-1.5 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="https://..." />
                </div>
              </div>

              {/* Rich text simulator toolbar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase block">Description</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => insertRichTextFormat("bold")} className="p-1 border border-neutral-200 text-neutral-500 hover:text-black cursor-pointer bg-card text-[8px] font-bold flex items-center gap-0.5"><Bold className="w-2.5 h-2.5" /> Bold</button>
                    <button type="button" onClick={() => insertRichTextFormat("italic")} className="p-1 border border-neutral-200 text-neutral-500 hover:text-black cursor-pointer bg-card text-[8px] font-bold flex items-center gap-0.5"><Italic className="w-2.5 h-2.5" /> Italic</button>
                    <button type="button" onClick={() => insertRichTextFormat("code")} className="p-1 border border-neutral-200 text-neutral-500 hover:text-black cursor-pointer bg-card text-[8px] font-bold flex items-center gap-0.5"><Code className="w-2.5 h-2.5" /> Code</button>
                    <button type="button" onClick={() => insertRichTextFormat("heading")} className="p-1 border border-neutral-200 text-neutral-500 hover:text-black cursor-pointer bg-card text-[8px] font-bold flex items-center gap-0.5"><Heading className="w-2.5 h-2.5" /> Title</button>
                  </div>
                </div>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none h-20 bg-card" />
              </div>

              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-card">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200/60">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase cursor-pointer rounded-none border-none">{editBrand ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Associated Products Drawer ───────────────────────────────── */}
      {selectedBrandForProducts && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50" onClick={() => setSelectedBrandForProducts(null)}>
          <div className="bg-card border-l border-neutral-300 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest">{selectedBrandForProducts.name}</h3>
                  <span className="text-[7.5px] font-bold uppercase tracking-wider text-neutral-400">Associated Products ({currentBrandProducts.length})</span>
                </div>
                <button onClick={() => setSelectedBrandForProducts(null)} className="text-neutral-400 hover:text-black bg-transparent border-none cursor-pointer p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Add New Mock Product */}
              <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-3">
                <span className="text-[8px] font-bold tracking-widest text-[#030213] uppercase block">Link New Product</span>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Product Name" value={newProductForm.name} onChange={e => setNewProductForm({...newProductForm, name: e.target.value})}
                    className="border border-neutral-200 px-2 py-1.5 text-[8.5px] font-semibold bg-card rounded-none focus:outline-none" />
                  <input type="text" placeholder="SKU Code" value={newProductForm.sku} onChange={e => setNewProductForm({...newProductForm, sku: e.target.value})}
                    className="border border-neutral-200 px-2 py-1.5 text-[8.5px] font-semibold bg-card rounded-none focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Price" value={newProductForm.price || ""} onChange={e => setNewProductForm({...newProductForm, price: Number(e.target.value)})}
                    className="border border-neutral-200 px-2 py-1.5 text-[8.5px] font-semibold bg-card rounded-none focus:outline-none" />
                  <select value={newProductForm.category} onChange={e => setNewProductForm({...newProductForm, category: e.target.value})}
                    className="border border-neutral-200 px-2 py-1.5 text-[8.5px] font-semibold bg-card rounded-none focus:outline-none">
                    <option value="Outerwear">Outerwear</option>
                    <option value="Knitwear">Knitwear</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <button onClick={handleAddProductToBrand} className="w-full bg-[#030213] hover:bg-neutral-800 text-white text-[8px] font-bold uppercase py-2 tracking-widest rounded-none border-none cursor-pointer">
                  Link Product
                </button>
              </div>

              {/* Product List */}
              <div className="space-y-2">
                {currentBrandProducts.length === 0 ? (
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider text-center py-6">No products linked to this brand</p>
                ) : (
                  currentBrandProducts.map(p => (
                    <div key={p.id} className="border border-neutral-200/80 p-3 bg-card flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider">{p.name}</p>
                        <p className="text-[7.5px] text-neutral-400 font-bold uppercase tracking-widest">{p.sku} • {p.category}</p>
                        <p className="text-[9px] font-bold text-neutral-700 mt-1">{RS}{p.price.toLocaleString("en-IN")}</p>
                      </div>
                      <button onClick={() => handleRemoveProductFromBrand(p.id)} className="text-neutral-400 hover:text-red-700 bg-transparent border-none cursor-pointer p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <button onClick={() => setSelectedBrandForProducts(null)} className="w-full border border-neutral-300 hover:border-[#030213] text-[9px] font-bold uppercase py-2.5 tracking-widest bg-transparent cursor-pointer rounded-none">
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-neutral-300 p-6 max-w-sm mx-4 rounded-none" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Delete Brand?</h3>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mb-4">This will remove the brand permanently.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={confirmDelete} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
