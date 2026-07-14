import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "@/app/store/auth-store";
import { categoryApi, subCategoryApi, BackendCategory, BackendSubCategory } from "@/app/lib/category-api";
import { productApi } from "@/app/lib/product-api";
import { REGEX_PATTERNS } from "../utils/validation";
import {
  Search,
  Plus,
  Calendar,
  ChevronDown,
  Upload,
  X,
  Save,
  RotateCw,
  FolderOpen,
  Edit2,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Package,
  Eye,
  SlidersHorizontal,
  Tags,
  Trash2,
  Star,
  AlertTriangle
} from "lucide-react";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const brands = ["Drip Doggy", "Syndicate", "Archive", "SS26", "FW25 Heritage", "Studio"];
const tags = ["New Arrival", "Limited Drop", "Best Seller", "Archive", "Signature Piece", "Seasonal", "Premium"];

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
const mockCatalogProducts = [
  { id: "#DD-P002", name: "Sartorial Trench Coat" },
  { id: "#DD-P003", name: "Cashmere Blend Crew" },
  { id: "#DD-P004", name: "Merino Wool Cardigan" },
  { id: "#DD-P005", name: "Signature Silk Blouse" },
];

const sampleProductsForEdit = [
  { id: "#DD-P001", name: "Structured Canvas Jacket", category: "Outerwear", price: 12999, cost: 5200, stock: 45, status: "Active", sales: 342, revenue: 4445658, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-STR-001", season: "SS26", dateAdded: "2026-03-12", description: "Premium heavy-weight structured canvas utility jacket with signature hardware." },
  { id: "#DD-P002", name: "Sartorial Trench Coat", category: "Outerwear", price: 24999, cost: 10000, stock: 18, status: "Active", sales: 198, revenue: 4949802, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-SAT-001", season: "FW25", dateAdded: "2026-04-05", description: "Double-breasted oversized trench coat made of waterproof cotton gabardine." },
  { id: "#DD-P003", name: "Cashmere Blend Crew", category: "Knitwear", price: 8999, cost: 3600, stock: 62, status: "Active", sales: 287, revenue: 2582713, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-CAS-001", season: "FW25", dateAdded: "2026-04-18", description: "Minimalist crewneck sweater knitted in 7-gauge soft cashmere blend yarn." },
  { id: "#DD-P004", name: "Merino Wool Cardigan", category: "Knitwear", price: 11999, cost: 4800, stock: 23, status: "Active", sales: 167, revenue: 2003833, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-MER-001", season: "FW25", dateAdded: "2026-04-20", description: "Heavy knit luxury cardigan with branded horn buttons and patch pockets." },
  { id: "#DD-P005", name: "Signature Silk Blouse", category: "Tops", price: 6999, cost: 2100, stock: 78, status: "Active", sales: 312, revenue: 2183688, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-SIL-001", season: "SS26", dateAdded: "2026-05-01", description: "Relaxed fit standard blouse crafted in 100% mulberry silk." },
  { id: "#DD-P006", name: "Relaxed Linen Shirt", category: "Tops", price: 5499, cost: 1650, stock: 54, status: "Active", sales: 256, revenue: 1407744, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-LIN-001", season: "SS26", dateAdded: "2026-05-15", description: "Breathable airy linen button-down with raw edge details." },
  { id: "#DD-P007", name: "French Terry Hoodie", category: "Tops", price: 4499, cost: 1350, stock: 92, status: "Active", sales: 421, revenue: 1894079, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-FTH-001", season: "SS26", dateAdded: "2026-05-22", description: "Oversized hoodie knitted in heavy-weight French terry loops." },
  { id: "#DD-P008", name: "Pleated Wool Trousers", category: "Bottoms", price: 9999, cost: 4000, stock: 31, status: "Active", sales: 145, revenue: 1449855, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-PLE-001", season: "FW25", dateAdded: "2026-05-25", description: "Tailored wide-leg trousers built in fine Italian tropical wool fabric." },
  { id: "#DD-P009", name: "Tailored Linen Trousers", category: "Bottoms", price: 7999, cost: 2400, stock: 0, status: "Draft", sales: 0, revenue: 0, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-TLT-002", season: "SS26", dateAdded: "2026-06-01", description: "Minimal cream trousers in durable organic linen yarn." },
  { id: "#DD-P010", name: "Handwoven Silk Scarf", category: "Accessories", price: 3999, cost: 1200, stock: 120, status: "Active", sales: 534, revenue: 2135466, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-SCF-001", season: "All", dateAdded: "2026-06-05", description: "Custom jacquard patterned silk scarf with frayed edge details." },
  { id: "#DD-P011", name: "Drip Doggy Varsity Jacket", category: "Signature", price: 19999, cost: 8000, stock: 7, status: "Active", sales: 89, revenue: 1779911, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-VAR-001", season: "FW25", dateAdded: "2026-06-10", description: "High contrast leather-sleeve varsity jacket with chenille embroidery." },
  { id: "#DD-P012", name: "SS26 Linen Blend Jacket", category: "New Arrivals", price: 14499, cost: 5800, stock: 15, status: "Draft", sales: 0, revenue: 0, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-SS26-002", season: "SS26", dateAdded: "2026-06-18", description: "Single-button soft tailored jacket ideal for warm climates." }
];

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  mrp: string;
  discountType: "percentage" | "value";
  discountValue: string;
  finalPrice: string;
  sizeStock: Record<string, string>; // Maps size code to its quantity
  active: boolean;
  sizes: string[];
  images: string[];
  primaryImageUrl?: string;
  existingUrls?: string[];
}

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-5 flex items-center transition-all duration-300 focus:outline-none rounded-full border ${
        enabled ? "bg-[#224870] border-[#224870]" : "bg-transparent border-[#382d24]/30"
      }`}
    >
      <span
        className={`w-4 h-4 rounded-full transition-all duration-300 ${
          enabled ? "translate-x-4 bg-white" : "translate-x-0.5 bg-[#382d24]/60"
        }`}
      />
    </button>
  );
}

export function AddProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Form States
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  
  // Organization
  const { token } = useAuthStore();
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dynamicTags, setDynamicTags] = useState<string[]>(["New Arrival", "Limited Drop", "Best Seller", "Archive", "Signature Piece", "Seasonal", "Premium"]);
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false);
  const [customTagVal, setCustomTagVal] = useState("");
  
  // Custom tag right-click context menu and inline edits
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetTag: string } | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editingTagVal, setEditingTagVal] = useState("");

  // Product Variants (color-based)
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Media (single cover image)
  const [productImages, setProductImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
  ]);

  // Validation feedback
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [deleteVariantIndex, setDeleteVariantIndex] = useState<number | null>(null);

  // PDP Rich Details: Specs and Design Details (New Section 4 states)
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: "Fabric Type", value: "Premium Cotton Polyester Blend" },
    { label: "Fit / Size", value: "Regular Comfort Fit" },
    { label: "Pattern", value: "Solid Matte Finish" },
    { label: "Neck/Collar Type", value: "Classic Crew Neck" },
    { label: "Sleeve Type", value: "Half Sleeve" },
    { label: "Pockets", value: "Concealed Side-Seam Cross Pockets" },
    { label: "Wash Care", value: "Machine Wash Cold at 40°C. Do Not Bleach. Warm Iron if needed." }
  ]);

  const [designDetails, setDesignDetails] = useState<string[]>([
    "Elasticated Waistband",
    "Adjustable Drawstring Closure",
    "Dual Side-Seam Cross Pockets",
    "Reinforced Ribbed Detailing",
    "Premium Breathable Blend",
    "Anti-Pilling Soft Finish"
  ]);

  const [newSpecLabel, setNewSpecLabel] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newDetailVal, setNewDetailVal] = useState("");

  // Load categories & load edit product on mount
  useEffect(() => {
    async function initPage() {
      if (!token) return;
      try {
        const catList = await categoryApi.getAllCategories(token);
        setDbCategories(catList);

        if (isEdit && id) {
          const rawId = Number(id.replace(/\D/g, ""));
          if (isNaN(rawId)) {
            navigate("/admin/products");
            return;
          }
          const product = await productApi.fetchProductById(rawId, token);
          if (product) {
            setProductName(product.productName || "");
            setSku(product.skuCode || "");
            setDescription(product.productDescription || "");
            setSelectedCategory(String(product.categoryId || ""));
            setSelectedSubCategory(String(product.subCategoryId || ""));
            if (product.baseTitle) {
              setSelectedTags([product.baseTitle]);
              setDynamicTags(prev => {
                if (!prev.includes(product.baseTitle)) {
                  return [...prev, product.baseTitle];
                }
                return prev;
              });
            } else {
              setSelectedTags([]);
            }
            
            // Map specifications
            if (product.specification) {
              const specMap = product.specification;
              const mappedSpecs = [
                { label: "Fabric Type", value: specMap.fabric || "" },
                { label: "Fit / Size", value: specMap.fit || "" },
                { label: "Pattern", value: specMap.pattern || "" },
                { label: "Neck/Collar Type", value: specMap.neckCollarType || "" },
                { label: "Sleeve Type", value: specMap.sleeveType || "" },
                { label: "Pockets", value: specMap.pockets || "" },
                { label: "Wash Care", value: specMap.washCare || "" }
              ].filter(s => s.value !== "");

              // Append custom specifications
              if (specMap.customSpecs) {
                Object.entries(specMap.customSpecs).forEach(([k, v]) => {
                  mappedSpecs.push({ label: k, value: String(v) });
                });
              }
              setSpecs(mappedSpecs);
            }

            // Map design details
            if (product.features) {
              setDesignDetails(product.features.map((f: any) => f.featureName));
            }

            // Map variants
            const mappedVariants: ProductVariant[] = (product.variants || []).map((v: any) => {
              const sizeStockMap: Record<string, string> = {};
              (v.sizes || []).forEach((s: any) => {
                sizeStockMap[s.sizeName] = String(s.stockQuantity || 0);
              });
              return {
                id: String(v.id),
                name: v.variantName || "",
                sku: v.skuCode || "",
                mrp: String(v.mrp || 0),
                discountType: v.discountType?.toLowerCase() === "percentage" ? "percentage" : "value",
                discountValue: String(v.discountValue || 0),
                finalPrice: String(v.price || v.mrp || 0),
                sizeStock: sizeStockMap,
                active: v.isActive !== false,
                sizes: (v.sizes || []).map((s: any) => s.sizeName),
                images: v.imageUrls || [],
                existingUrls: [...(v.imageUrls || [])],
                primaryImageUrl: v.primaryImageUrl || ""
              };
            });
            setVariants(mappedVariants);
            if (mappedVariants.length > 0 && mappedVariants[0].images.length > 0) {
              setProductImages([mappedVariants[0].images[0]]);
            }
          }
        } else {
          // Initialize first category and subcategory for a new product
          if (catList.length > 0) {
            setSelectedCategory(String(catList[0].categoryId));
            if (catList[0].subCategories && catList[0].subCategories.length > 0) {
              setSelectedSubCategory(String(catList[0].subCategories[0].subCategoryId));
            }
          }
        }
      } catch (err) {
        console.error("Initialization error", err);
      }
    }
    initPage();
  }, [id, isEdit, token]);


  // Save draft manually
  const handleSaveDraft = () => {
    const draft = {
      productName,
      sku,
      description,
      selectedCategory,
      productImages
    };
    localStorage.setItem("drip-doggy-product-draft", JSON.stringify(draft));
    setFeedbackMsg("Draft saved successfully to browser local storage.");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };


  // Custom image handling with 3:4 aspect checking (600x800 resolution)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64Url = event.target.result as string;
            const img = new Image();
            img.onload = () => {
              if (img.width !== 600 || img.height !== 800) {
                alert(`Error: Cover image dimensions are ${img.width}x${img.height}px. Product cover images must be exactly 600x800 pixels (3:4 aspect ratio).`);
                if (e.target) e.target.value = "";
              } else {
                setProductImages(prev => [...prev, base64Url]);
              }
            };
            img.src = base64Url;
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!productName.trim()) {
      errors.push("Product Name is required.");
    } else if (!REGEX_PATTERNS.NAME.test(productName.trim())) {
      errors.push("Invalid Product Name format. Must be 2 to 100 characters long and can contain letters, numbers, spaces, hyphens, and ampersands.");
    }

    if (!sku.trim()) {
      errors.push("SKU code is required.");
    } else if (!REGEX_PATTERNS.NAME.test(sku.trim())) {
      errors.push("Invalid SKU format. Must be 2 to 100 characters long and can contain letters, numbers, spaces, hyphens, and ampersands.");
    }

    if (variants.length === 0) errors.push("At least one product variant is required.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }

    setValidationErrors([]);
    try {
      const formData = new FormData();
      formData.append("productName", productName.trim());
      formData.append("skuCode", sku.trim());
      formData.append("categoryId", selectedCategory);
      formData.append("subCategoryId", selectedSubCategory);
      formData.append("baseTitle", selectedTags[0] || "");
      formData.append("productDescription", description.trim());
      formData.append("isActive", "true");

      // Features
      designDetails.forEach((detail, index) => {
        if (detail.trim()) {
          formData.append(`features[${index}]`, detail.trim());
        }
      });

      // Specifications
      const standardLabels = ["Fabric Type", "Fit / Size", "Pattern", "Neck/Collar Type", "Sleeve Type", "Pockets", "Wash Care"];
      
      const specFabric = specs.find(s => s.label === "Fabric Type")?.value || "";
      const specFit = specs.find(s => s.label === "Fit / Size")?.value || "";
      const specPattern = specs.find(s => s.label === "Pattern")?.value || "";
      const specNeck = specs.find(s => s.label === "Neck/Collar Type")?.value || "";
      const specSleeve = specs.find(s => s.label === "Sleeve Type")?.value || "";
      const specPockets = specs.find(s => s.label === "Pockets")?.value || "";
      const specWash = specs.find(s => s.label === "Wash Care")?.value || "";

      formData.append("specification.fabric", specFabric);
      formData.append("specification.fit", specFit);
      formData.append("specification.pattern", specPattern);
      formData.append("specification.neckCollarType", specNeck);
      formData.append("specification.sleeveType", specSleeve);
      formData.append("specification.pockets", specPockets);
      formData.append("specification.washCare", specWash);

      specs.filter(s => !standardLabels.includes(s.label)).forEach(custom => {
        if (custom.label.trim()) {
          formData.append(`specification.customSpecs[${custom.label.trim()}]`, custom.value.trim());
        }
      });

      // Variants
      variants.forEach((v, index) => {
        formData.append(`variants[${index}].variantName`, v.name);
        formData.append(`variants[${index}].skuCode`, v.sku);
        const cleanMrp = String(v.mrp || "").replace(/,/g, "").trim();
        const cleanDiscountVal = String(v.discountValue || "").replace(/,/g, "").trim();
        formData.append(`variants[${index}].mrp`, cleanMrp);
        formData.append(`variants[${index}].discountType`, v.discountType === "percentage" ? "PERCENTAGE" : "FLAT");
        formData.append(`variants[${index}].discountValue`, cleanDiscountVal);
        formData.append(`variants[${index}].isActive`, String(v.active));

        // Sizes
        const activeSizes = v.sizes || [];
        activeSizes.forEach((sizeName, sizeIdx) => {
          formData.append(`variants[${index}].sizes[${sizeIdx}].sizeName`, sizeName);
          formData.append(`variants[${index}].sizes[${sizeIdx}].stockQuantity`, String(v.sizeStock[sizeName] || 0));
          formData.append(`variants[${index}].sizes[${sizeIdx}].isActive`, "true");
        });

        // Images & Primary Image resolution
        let localImageCount = 0;
        let primaryFilename = "";
        const existingList = v.existingUrls || [];
        (v.images || []).forEach(img => {
          const isExisting = existingList.includes(img);
          if (isExisting) {
            formData.append(`variants[${index}].existingImageUrls`, img);
          } else {
            if (img.startsWith("data:")) {
              try {
                const filename = `variant_${index}_img_${localImageCount++}.png`;
                const file = dataURLtoFile(img, filename);
                formData.append(`variants[${index}].images`, file);
                if (v.primaryImageUrl === img) {
                  primaryFilename = filename;
                }
              } catch (fileErr) {
                console.error("Error converting image base64 to file", fileErr);
              }
            } else if (img.startsWith("http")) {
              formData.append(`variants[${index}].existingImageUrls`, img);
            }
          }
        });

        if (v.primaryImageUrl) {
          if (v.primaryImageUrl.startsWith("http")) {
            formData.append(`variants[${index}].primaryImageUrl`, v.primaryImageUrl);
          } else if (primaryFilename) {
            formData.append(`variants[${index}].primaryImageUrl`, primaryFilename);
          }
        }
      });

      if (isEdit && id) {
        const rawId = Number(id.replace(/\D/g, ""));
        await productApi.updateProduct(rawId, formData, token);
      } else {
        await productApi.createProduct(formData, token);
      }

      localStorage.removeItem("drip-doggy-product-draft");
      alert(`"${productName}" (${sku}) has been successfully ${isEdit ? "updated" : "published"}!`);
      navigate("/admin/products");
    } catch (err: any) {
      console.error("Error publishing product", err);
      alert(`Failed to save product: ${err?.response?.data?.message || err?.message || err}`);
    }
  };

  return (
    <form onSubmit={handlePublish} className="space-y-8 font-sans text-[#382d24]">

      {/* Header Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#382d24]/15 pb-5">
        <div>
          <button type="button" onClick={() => navigate("/admin/products")} className="text-[10px] font-black uppercase text-[#615e56] hover:text-[#224870] tracking-widest flex items-center gap-1.5 bg-transparent border-none cursor-pointer mb-2.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </button>
          <h1 className="text-2xl font-[950] text-[#382d24] uppercase tracking-widest">
            {isEdit ? "Edit Product Details" : "Add New Product"}
          </h1>
          <p className="text-xs text-[#615e56] font-[800] uppercase tracking-wider mt-1.5">
            {isEdit ? `Modifying Catalog Node: ${id}` : "Drip Doggy product creation interface"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {feedbackMsg && (
            <span className="text-[10px] bg-green-50 border border-green-200 text-green-700 px-4 py-2 font-bold uppercase tracking-wider">
              {feedbackMsg}
            </span>
          )}

          <button
            type="submit"
            className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[10.5px] font-black tracking-widest px-5.5 py-3 uppercase transition-colors cursor-pointer rounded-none border-none flex items-center gap-2"
          >
            {isEdit ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      {/* Validation Alerts */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-5 rounded-none">
          <h4 className="text-[11px] font-bold text-red-800 uppercase tracking-widest mb-2">Please address the following requirements:</h4>
          <ul className="list-disc pl-5 text-[10px] font-bold text-red-700 uppercase tracking-wider space-y-1.5">
            {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">

        {/* 1. Product Info & Categorization */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-5">
          <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest border-b border-[#382d24]/15 pb-4">
            1. Product Info &amp; Categorization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Product Title / Name</label>
              <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Structured Canvas Jacket"
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">SKU Code identifier</label>
              <input type="text" value={sku} onChange={e => setSku(e.target.value)}
                placeholder="e.g. DD-STR-001"
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold font-mono focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Category</label>
              <select 
                value={selectedCategory} 
                onChange={e => {
                  const catId = e.target.value;
                  setSelectedCategory(catId);
                  const cat = dbCategories.find(c => String(c.categoryId) === catId);
                  if (cat && cat.subCategories && cat.subCategories.length > 0) {
                    setSelectedSubCategory(String(cat.subCategories[0].subCategoryId));
                  } else {
                    setSelectedSubCategory("");
                  }
                }}
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all"
              >
                {dbCategories.map(c => (
                  <option key={c.categoryId} value={String(c.categoryId)}>{c.categoryName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Subcategory</label>
              <select 
                value={selectedSubCategory} 
                onChange={e => setSelectedSubCategory(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all"
              >
                {(() => {
                  const activeCat = dbCategories.find(c => String(c.categoryId) === selectedCategory);
                  const subCats = activeCat?.subCategories || [];
                  return subCats.map(sub => (
                    <option key={sub.subCategoryId} value={String(sub.subCategoryId)}>{sub.subcategoryName}</option>
                  ));
                })()}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Tag Badge (Single Select)</label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#faf8f5] border border-[#382d24]/20 max-h-28 overflow-y-auto items-center">
              {dynamicTags.map(t => {
                const isChecked = selectedTags.includes(t);
                const isEditingThis = editingTag === t;

                if (isEditingThis) {
                  return (
                    <input
                      key={t}
                      type="text"
                      autoFocus
                      value={editingTagVal}
                      onChange={(e) => setEditingTagVal(e.target.value)}
                      className="border border-[#224870] bg-[#faf8f5] px-2 py-1 text-[8.5px] font-bold uppercase tracking-wider focus:outline-none w-24 text-[#382d24]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = editingTagVal.trim();
                          if (val) {
                            setDynamicTags(prev => prev.map(old => old === t ? val : old));
                            if (selectedTags.includes(t)) {
                              setSelectedTags([val]);
                            }
                          }
                          setEditingTag(null);
                          setEditingTagVal("");
                        } else if (e.key === "Escape") {
                          setEditingTag(null);
                          setEditingTagVal("");
                        }
                      }}
                      onBlur={() => {
                        const val = editingTagVal.trim();
                        if (val) {
                          setDynamicTags(prev => prev.map(old => old === t ? val : old));
                          if (selectedTags.includes(t)) {
                            setSelectedTags([val]);
                          }
                        }
                        setEditingTag(null);
                        setEditingTagVal("");
                      }}
                    />
                  );
                }

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      if (isChecked) {
                        setSelectedTags([]);
                      } else {
                        setSelectedTags([t]);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        targetTag: t
                      });
                    }}
                    className={`px-3 py-1.5 text-[9px] font-bold uppercase border cursor-pointer transition-all ${
                      isChecked ? "bg-[#224870] border-[#224870] text-white" : "bg-transparent border-[#382d24]/25 text-[#615e56]/90 hover:border-neutral-400"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}

              {/* Dotted Box custom tag creator */}
              {isAddingCustomTag ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="TAG NAME..."
                    value={customTagVal}
                    onChange={(e) => setCustomTagVal(e.target.value)}
                    className="border border-[#224870] bg-[#faf8f5] px-2 py-1 text-[8.5px] font-bold uppercase tracking-wider focus:outline-none w-24 text-[#382d24]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = customTagVal.trim();
                        if (val) {
                          setDynamicTags(prev => [...prev, val]);
                          setSelectedTags([val]);
                        }
                        setIsAddingCustomTag(false);
                        setCustomTagVal("");
                      } else if (e.key === "Escape") {
                        setIsAddingCustomTag(false);
                        setCustomTagVal("");
                      }
                    }}
                    onBlur={() => {
                      const val = customTagVal.trim();
                      if (val) {
                        setDynamicTags(prev => [...prev, val]);
                        setSelectedTags([val]);
                      }
                      setIsAddingCustomTag(false);
                      setCustomTagVal("");
                    }}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCustomTag(true)}
                  className="px-3 py-1.5 text-[9px] font-bold uppercase border border-dashed border-[#382d24]/40 hover:border-[#224870]/70 text-[#615e56]/90 hover:text-[#224870] bg-transparent cursor-pointer transition-all flex items-center gap-1 rounded-none"
                >
                  <Plus className="w-3 h-3" /> Add Custom Tag
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Editorial Description</label>
            </div>
            <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of fabrics, fit, and seasonal inspirations..."
              className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] leading-relaxed rounded-none text-[#382d24] transition-all" />
          </div>
        </div>



        {/* 2. Product Variants */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#382d24]/15 pb-4">
            <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest">
              2. Product Variants
            </h3>
            <button
              type="button"
              onClick={() => setVariants(prev => [...prev, {
                id: Date.now().toString(),
                name: "",
                sku: "",
                mrp: "",
                discountType: "percentage",
                discountValue: "",
                finalPrice: "",
                sizeStock: {},
                active: true,
                sizes: [],
                images: [],
                existingUrls: [],
              }])}
              className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-black tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 border-none cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Variant
            </button>
          </div>

          {variants.length === 0 && (
            <div className="border-2 border-dashed border-[#382d24]/15 p-8 text-center">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">No variants added yet. Click "Add Variant" to begin.</span>
            </div>
          )}

          <div className="space-y-6">
            {variants.map((variant, idx) => (
              <div key={variant.id} className="border border-[#382d24]/15 bg-white p-6 space-y-5 relative">
                {/* Variant Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#224870] uppercase tracking-widest">Variant {idx + 1}</span>
                  <div className="flex items-center gap-3">
                    {/* Active Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider">Active</span>
                      <ToggleSwitch
                        enabled={variant.active}
                        onClick={() => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, active: !v.active } : v))}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteVariantIndex(idx)}
                      className="text-neutral-400 hover:text-[#b2533e] bg-transparent border-none cursor-pointer p-0 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Variant Images <span className="text-red-500 font-bold uppercase text-[8.5px]">(Required: 3:4 aspect ratio portrait only, e.g. 600x800, 768x1024)</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {variant.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="border border-[#382d24]/15 w-[75px] h-[100px] relative bg-neutral-50 flex items-center justify-center p-1 shadow-xs">
                          <img src={img} alt="Variant asset" className="w-full h-full object-cover" />
                          
                          {/* Primary Image Star Indicator */}
                          <button
                            type="button"
                            onClick={() => {
                              setVariants(prev => prev.map((v, i) => {
                                if (i !== idx) return v;
                                const remainingImages = v.images.filter((_, idxImg) => idxImg !== imgIdx);
                                return {
                                  ...v,
                                  images: [img, ...remainingImages],
                                  primaryImageUrl: img
                                };
                              }));
                            }}
                            className={`absolute top-0.5 left-0.5 p-0.5 bg-white/80 hover:bg-white text-xs border border-neutral-200/50 cursor-pointer transition-all ${
                              (variant.primaryImageUrl === img || (!variant.primaryImageUrl && imgIdx === 0))
                                ? "text-amber-500" 
                                : "text-neutral-300 hover:text-amber-400"
                            }`}
                            title="Set as Primary Cover Image"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setVariants(prev => prev.map((v, i) => i === idx ? {
                                ...v,
                                images: v.images.filter((_, idxImg) => idxImg !== imgIdx),
                                primaryImageUrl: v.primaryImageUrl === img ? undefined : v.primaryImageUrl
                              } : v));
                            }}
                            className="absolute -top-1 -right-1 bg-[#b2533e] text-white hover:bg-red-800 w-4.5 h-4.5 flex items-center justify-center border-none cursor-pointer rounded-none"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.multiple = true;
                          input.onchange = (e: any) => {
                            const files = e.target.files;
                            if (files) {
                              Array.from(files).forEach((file: any) => {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) {
                                    const base64Url = ev.target.result as string;
                                    const img = new Image();
                                    img.onload = () => {
                                      const ratio = img.width / img.height;
                                      const isCorrectRatio = Math.abs(ratio - 0.75) < 0.025;
                                      if (!isCorrectRatio) {
                                        alert(`Error: Variant image dimensions are ${img.width}x${img.height}px. Variant images must match a 3:4 aspect ratio (portrait) only.`);
                                      } else {
                                        setVariants(prev => prev.map((v, i) => i === idx ? {
                                          ...v,
                                          images: [...v.images, base64Url]
                                        } : v));
                                      }
                                    };
                                    img.src = base64Url;
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          };
                          input.click();
                        }}
                        className="border-2 border-dashed border-[#382d24]/20 w-[75px] h-[100px] flex flex-col items-center justify-center cursor-pointer hover:border-[#224870] transition-colors"
                      >
                        <Upload className="w-4 h-4 text-neutral-300 stroke-[1.5]" />
                        <span className="text-[7.5px] font-black text-neutral-400 uppercase tracking-wider mt-1 text-center leading-tight">Add 3:4</span>
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Variant Name</label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={e => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, name: e.target.value } : v))}
                        placeholder="e.g. Black, Red, Navy"
                        className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">SKU</label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={e => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, sku: e.target.value } : v))}
                        placeholder="e.g. DD-P001-BLK"
                        className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2.5 text-xs font-bold font-mono focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">MRP (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                        <input
                          type="text"
                          value={variant.mrp}
                          onChange={e => {
                            const mrpValue = e.target.value;
                            setVariants(prev => prev.map((v, i) => {
                              if (i !== idx) return v;
                              const mrpNum = Number(String(mrpValue).replace(/,/g, "")) || 0;
                              const discNum = Number(String(v.discountValue).replace(/,/g, "")) || 0;
                              let finalVal = mrpNum;
                              if (v.discountType === "percentage") {
                                finalVal = mrpNum - (mrpNum * (discNum / 100));
                              } else {
                                finalVal = mrpNum - discNum;
                              }
                              return {
                                ...v,
                                mrp: mrpValue,
                                finalPrice: finalVal > 0 ? String(Math.round(finalVal)) : "0"
                              };
                            }));
                          }}
                          placeholder="0"
                          className="w-full bg-[#faf8f5] border border-[#382d24]/20 pl-7 pr-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Discount Option</label>
                        <select
                          value={variant.discountType}
                          onChange={e => {
                            const discType = e.target.value as "percentage" | "value";
                            setVariants(prev => prev.map((v, i) => {
                              if (i !== idx) return v;
                              const mrpNum = Number(String(v.mrp).replace(/,/g, "")) || 0;
                              const discNum = Number(String(v.discountValue).replace(/,/g, "")) || 0;
                              let finalVal = mrpNum;
                              if (discType === "percentage") {
                                finalVal = mrpNum - (mrpNum * (discNum / 100));
                              } else {
                                finalVal = mrpNum - discNum;
                              }
                              return {
                                ...v,
                                discountType: discType,
                                finalPrice: finalVal > 0 ? String(Math.round(finalVal)) : "0"
                              };
                            }));
                          }}
                          className="text-[9px] font-bold uppercase border-none bg-transparent text-[#224870] focus:outline-none cursor-pointer"
                        >
                          <option value="percentage">% Percent</option>
                          <option value="value">₹ Flat Value</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={variant.discountValue}
                        onChange={e => {
                          const discValue = e.target.value;
                          setVariants(prev => prev.map((v, i) => {
                            if (i !== idx) return v;
                            const mrpNum = Number(String(v.mrp).replace(/,/g, "")) || 0;
                            const discNum = Number(String(discValue).replace(/,/g, "")) || 0;
                            let finalVal = mrpNum;
                            if (v.discountType === "percentage") {
                              finalVal = mrpNum - (mrpNum * (discNum / 100));
                            } else {
                              finalVal = mrpNum - discNum;
                            }
                            return {
                              ...v,
                              discountValue: discValue,
                              finalPrice: finalVal > 0 ? String(Math.round(finalVal)) : "0"
                            };
                          }));
                        }}
                        placeholder={variant.discountType === "percentage" ? "e.g. 10 for 10%" : "e.g. 500 for flat ₹500"}
                        className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Final Computed Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                        <input
                          type="text"
                          value={variant.finalPrice}
                          disabled
                          placeholder="Calculated automatically"
                          className="w-full bg-neutral-100 border border-[#382d24]/10 pl-7 pr-3 py-2.5 text-xs font-bold text-neutral-500 rounded-none cursor-not-allowed select-none"
                        />
                      </div>
                    </div>

                     {/* Sizes Selection */}
                     <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Available Sizes</label>
                      <div className="flex flex-wrap gap-1.5">
                        {availableSizes.map(size => {
                          const isSelected = variant.sizes.includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setVariants(prev => prev.map((v, i) => {
                                if (i !== idx) return v;
                                const sizesList = v.sizes.includes(size) 
                                  ? v.sizes.filter(s => s !== size) 
                                  : [...v.sizes, size];
                                
                                // Create copy of sizeStock to initialize or clean values
                                const newSizeStock = { ...v.sizeStock };
                                if (v.sizes.includes(size)) {
                                  delete newSizeStock[size];
                                } else {
                                  newSizeStock[size] = "";
                                }

                                return {
                                  ...v,
                                  sizes: sizesList,
                                  sizeStock: newSizeStock
                                };
                              }))}
                              className={`px-3 py-1.5 text-[9px] font-bold uppercase border cursor-pointer transition-all ${
                                isSelected ? "bg-[#224870] border-[#224870] text-white" : "bg-[#faf8f5] border-[#382d24]/20 text-[#615e56] hover:border-[#224870]"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stock Inputs by Size */}
                    {variant.sizes.length > 0 && (
                      <div className="sm:col-span-2 space-y-2.5 border-t border-neutral-100 pt-3">
                        <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Stock Quantity by Size</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {variant.sizes.map(size => (
                            <div key={size} className="space-y-1">
                              <span className="text-[10px] font-extrabold text-[#382d24] uppercase block">Size {size}</span>
                              <input
                                type="text"
                                value={variant.sizeStock[size] || ""}
                                onChange={e => {
                                  const val = e.target.value;
                                  setVariants(prev => prev.map((v, i) => {
                                    if (i !== idx) return v;
                                    return {
                                      ...v,
                                      sizeStock: {
                                        ...v.sizeStock,
                                        [size]: val
                                      }
                                    };
                                  }));
                                }}
                                placeholder="0"
                                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Product Details (Specs & Features) */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-8">
          <div className="border-b border-[#382d24]/15 pb-4">
            <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest">
              3. Product Details (Specs & Features)
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Col: Specifications */}
            <div className="space-y-5">
              <h4 className="text-[11px] font-black text-[#224870] uppercase tracking-widest border-b border-[#382d24]/10 pb-1.5">
                Product Specifications
              </h4>
              
              {/* Predefined Standard Specs List with Checkboxes */}
              <div className="space-y-3">
                <span className="text-[9.5px] font-black text-[#615e56] uppercase tracking-wider block">Standard Specifications</span>
                {[
                  { key: "Fabric Type", placeholder: "e.g. Cotton Polyester Blend" },
                  { key: "Fit / Size", placeholder: "e.g. Regular Fit" },
                  { key: "Pattern", placeholder: "e.g. Solid Matte Finish" },
                  { key: "Neck/Collar Type", placeholder: "e.g. Classic Crew Neck" },
                  { key: "Sleeve Type", placeholder: "e.g. Half Sleeve" },
                  { key: "Pockets", placeholder: "e.g. Cross Pocket" },
                  { key: "Wash Care", placeholder: "e.g. Machine Wash Cold" }
                ].map((std) => {
                  const activeSpec = specs.find(s => s.label === std.key);
                  const isChecked = !!activeSpec;
                  return (
                    <div key={std.key} className="flex gap-3 items-center bg-white border border-[#382d24]/10 p-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSpecs(prev => prev.filter(s => s.label !== std.key));
                          } else {
                            setSpecs(prev => [...prev, { label: std.key, value: "" }]);
                          }
                        }}
                        className="w-4 h-4 cursor-pointer accent-[#224870]"
                      />
                      <span className="w-1/3 text-xs font-bold text-[#382d24] uppercase tracking-wider">{std.key}</span>
                      <input
                        type="text"
                        disabled={!isChecked}
                        placeholder={std.placeholder}
                        value={activeSpec?.value || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSpecs(prev => prev.map(s => s.label === std.key ? { ...s, value: val } : s));
                        }}
                        className="flex-1 bg-[#faf8f5] disabled:opacity-50 border border-[#382d24]/20 px-2.5 py-1.5 text-xs font-bold text-[#382d24] disabled:cursor-not-allowed"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Custom / Added Specs Section */}
              <div className="space-y-3 pt-2">
                <span className="text-[9.5px] font-black text-[#615e56] uppercase tracking-wider block">Custom Specifications</span>
                {specs.filter(s => ![
                  "Fabric Type",
                  "Fit / Size",
                  "Pattern",
                  "Neck/Collar Type",
                  "Sleeve Type",
                  "Pockets",
                  "Wash Care"
                ].includes(s.label)).map((spec, sIdx) => {
                  return (
                    <div key={spec.label} className="flex gap-2 items-center bg-white border border-[#382d24]/10 p-2.5">
                      <span className="w-1/3 text-xs font-bold text-[#382d24] uppercase tracking-wider">{spec.label}</span>
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSpecs(prev => prev.map(s => s.label === spec.label ? { ...s, value: val } : s));
                        }}
                        className="flex-1 bg-[#faf8f5] border border-[#382d24]/20 px-2.5 py-1.5 text-xs font-bold text-[#382d24]"
                      />
                      <button
                        type="button"
                        onClick={() => setSpecs(prev => prev.filter(s => s.label !== spec.label))}
                        className="text-[#b2533e] hover:text-red-700 bg-transparent border-none cursor-pointer p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add New Custom Spec Form */}
              <div className="flex gap-2 items-center border border-dashed border-[#382d24]/20 p-3 bg-white/50">
                <input
                  type="text"
                  placeholder="CUSTOM LABEL"
                  value={newSpecLabel}
                  onChange={(e) => setNewSpecLabel(e.target.value)}
                  className="w-1/3 bg-white border border-[#382d24]/20 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#382d24]"
                />
                <input
                  type="text"
                  placeholder="CUSTOM VALUE"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  className="flex-1 bg-white border border-[#382d24]/20 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#382d24]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSpecLabel.trim() && newSpecValue.trim()) {
                      const cleanLabel = newSpecLabel.trim();
                      if (specs.some(s => s.label.toLowerCase() === cleanLabel.toLowerCase())) {
                        alert("A specification with this label already exists.");
                        return;
                      }
                      setSpecs(prev => [...prev, { label: cleanLabel, value: newSpecValue.trim() }]);
                      setNewSpecLabel("");
                      setNewSpecValue("");
                    }
                  }}
                  className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9px] font-bold tracking-widest px-3 py-1.5 uppercase border-none cursor-pointer transition-colors"
                >
                  ADD
                </button>
              </div>
            </div>

            {/* Right Col: Design Details */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-[#224870] uppercase tracking-widest border-b border-[#382d24]/10 pb-1.5">
                Product Features
              </h4>
              <div className="space-y-2">
                {designDetails.map((detail, dIdx) => (
                  <div key={dIdx} className="flex gap-2 items-center bg-white border border-[#382d24]/10 p-2.5">
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDesignDetails(prev => prev.map((d, idx) => idx === dIdx ? val : d));
                      }}
                      className="flex-1 bg-[#faf8f5] border border-[#382d24]/20 px-2 py-1.5 text-xs font-bold text-[#382d24]"
                    />
                    <button
                      type="button"
                      onClick={() => setDesignDetails(prev => prev.filter((_, idx) => idx !== dIdx))}
                      className="text-[#b2533e] hover:text-red-700 bg-transparent border-none cursor-pointer p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Detail Form */}
              <div className="flex gap-2 items-center border border-dashed border-[#382d24]/20 p-3 bg-white/50">
                <input
                  type="text"
                  placeholder="BULLET DETAIL (e.g. Drawstring Waist)"
                  value={newDetailVal}
                  onChange={(e) => setNewDetailVal(e.target.value)}
                  className="flex-1 bg-white border border-[#382d24]/20 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#382d24]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newDetailVal.trim()) {
                      setDesignDetails(prev => [...prev, newDetailVal.trim()]);
                      setNewDetailVal("");
                    }
                  }}
                  className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9px] font-bold tracking-widest px-3 py-1.5 uppercase border-none cursor-pointer transition-colors"
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right-click Context Menu for Tag Badges */}
      {contextMenu && (
        <div 
          className="fixed z-50 bg-[#faf8f5] border border-[#382d24]/20 shadow-md py-1 min-w-[100px] uppercase text-[9px] font-bold tracking-wider"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => {
                setEditingTag(contextMenu.targetTag);
                setEditingTagVal(contextMenu.targetTag);
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-2 hover:bg-[#224870]/10 text-[#382d24] transition-colors border-none bg-transparent cursor-pointer font-sans text-[8.5px] font-black tracking-widest uppercase flex items-center gap-2"
            >
              <Edit2 className="w-3 h-3 text-[#615e56]" />
              Edit Tag
            </button>
            <button
              type="button"
              onClick={() => {
                const target = contextMenu.targetTag;
                setDynamicTags(prev => prev.filter(t => t !== target));
                if (selectedTags.includes(target)) {
                  setSelectedTags([]);
                }
                setContextMenu(null);
              }}
              className="w-full text-left px-3.5 py-2 hover:bg-[#b2533e]/10 text-[#b2533e] transition-colors border-none bg-transparent cursor-pointer font-sans text-[8.5px] font-black tracking-widest uppercase flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3 text-[#b2533e]" />
              Delete Tag
            </button>
          </div>
        </div>
      )}

      {/* Dismiss context menu on click anywhere */}
      <div 
        className={`fixed inset-0 z-40 pointer-events-auto ${contextMenu ? "block" : "hidden"}`} 
        onClick={() => setContextMenu(null)}
      />

      {/* Delete Variant Confirmation Modal */}
      {deleteVariantIndex !== null && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setDeleteVariantIndex(null)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4 rounded-none" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-[#b2533e]">
              <AlertTriangle className="w-5 h-5 text-[#b2533e]" />
              <h3 className="text-xs font-black tracking-widest uppercase">Critical Action — Delete Variant</h3>
            </div>
            <p className="text-[10px] text-[#615e56] uppercase font-bold leading-normal">
              Are you sure you want to delete <strong className="text-[#382d24]">{variants[deleteVariantIndex]?.name || `Variant ${deleteVariantIndex + 1}`}</strong>? This will permanently delete this variant from the product <strong className="text-[#382d24]">{productName || ""}</strong>. This action is irreversible.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button type="button" onClick={() => setDeleteVariantIndex(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
              <button 
                type="button"
                onClick={() => {
                  setVariants(prev => prev.filter((_, i) => i !== deleteVariantIndex));
                  setDeleteVariantIndex(null);
                }} 
                className="bg-[#b2533e] text-white hover:bg-red-800 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </form>
  );
}

