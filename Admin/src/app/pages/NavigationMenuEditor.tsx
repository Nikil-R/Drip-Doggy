import { useState, useEffect } from "react";
import { Plus, Trash2, RotateCcw, Check, ChevronDown, ChevronRight, Globe, Layers, Smartphone, Monitor, Eye, Link as LinkIcon, Save } from "lucide-react";
import { getNavConfig, setNavConfig, NavConfig, NavMenuItem, NavDropdownItem } from "../lib/admin-content-store";
import { useAuthStore } from "../store/auth-store";
import { categoryApi, subCategoryApi } from "../lib/category-api";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#224870]" : "bg-neutral-300"
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

const DEFAULT_CONFIG: NavConfig = {
  desktopItems: [
    {
      label: "Categories",
      to: "#",
      children: [
        {
          label: "Women",
          to: "/shop?gender=women",
          children: [
            { label: "All Women's", to: "/shop?gender=women" },
            { label: "Dresses", to: "/shop?gender=women&category=dresses" },
            { label: "Outerwear", to: "/shop?gender=women&category=outerwear" },
            { label: "Tops", to: "/shop?gender=women&category=tops" },
            { label: "Skirts", to: "/shop?gender=women&category=skirts" },
          ],
        },
        { label: "Men", to: "/coming-soon" },
        { label: "Accessories", to: "/coming-soon" },
      ],
    },
    { label: "About", to: "/about" },
    { label: "Help", to: "/help" },
  ],
  mobileItems: [
    { label: "Women", to: "/shop?gender=women" },
    { label: "Men", to: "/coming-soon" },
    { label: "Accessories", to: "/coming-soon" },
    { label: "About", to: "/about" },
    { label: "Help", to: "/help" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "Account Settings", to: "/account" },
  ],
  active: true,
};

export function NavigationMenuEditorPage() {
  const [config, setConfig] = useState<NavConfig>(DEFAULT_CONFIG);
  const [lastSavedConfig, setLastSavedConfig] = useState<NavConfig>(DEFAULT_CONFIG);
  const [toast, setToast] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["desktop-0"]));
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");
  const [previewOpen, setPreviewOpen] = useState(false);

  const { token } = useAuthStore();

  useEffect(() => {
    async function loadAndSyncCategories() {
      const stored = getNavConfig();
      let currentConfig = stored.desktopItems.length > 0 ? stored : { ...DEFAULT_CONFIG };

      if (!token) {
        setConfig(currentConfig);
        return;
      }

      try {
        const [cats, subs] = await Promise.all([
          categoryApi.getAllCategories(token),
          subCategoryApi.getAllSubCategories(token)
        ]);

        const activeCats = cats.filter(c => c.isActive !== false && c.isDeleted !== true);

        const categoryDropdownItems = activeCats.map(cat => {
          const subIds = cat.subCategoryIds ? cat.subCategoryIds.split(",").map(id => parseInt(id.trim(), 10)) : [];
          const matchedSubs = subs.filter(sub => subIds.includes(sub.subCategoryId) && sub.isActive !== false && sub.isDeleted !== true);

          const subChildren = matchedSubs.map(s => ({
            label: s.subcategoryName,
            to: `/shop?category=${cat.categoryName.toLowerCase()}&subcategory=${s.subcategoryName.toLowerCase()}`
          }));

          const childrenList = [
            { label: `All ${cat.categoryName}`, to: `/shop?category=${cat.categoryName.toLowerCase()}` },
            ...subChildren
          ];

          const existingDesktopItem = currentConfig.desktopItems
            ?.find(item => item.label.toLowerCase() === "categories")
            ?.children?.find((child: any) => child.label.toLowerCase() === cat.categoryName.toLowerCase());

          const defaultTo = cat.categoryName.toLowerCase().includes("women")
            ? `/shop?category=${cat.categoryName.toLowerCase()}`
            : "/coming-soon";

          return {
            label: cat.categoryName,
            to: existingDesktopItem?.to || defaultTo,
            children: childrenList.length > 1 ? childrenList : undefined
          };
        });

        const desktop = [...currentConfig.desktopItems];
        const categoriesIndex = desktop.findIndex(item => item.label.toLowerCase() === "categories");
        if (categoriesIndex !== -1) {
          desktop[categoriesIndex] = {
            ...desktop[categoriesIndex],
            children: categoryDropdownItems
          };
        }

        const mobile = [...currentConfig.mobileItems];
        const filteredMobile = mobile.filter(item => {
          const matchedCat = activeCats.some(c => c.categoryName.toLowerCase() === item.label.toLowerCase());
          const isOldHardcoded = ["women", "men", "accessories"].includes(item.label.toLowerCase());
          return !matchedCat && !isOldHardcoded;
        });

        const categoriesToInsert = activeCats.map(cat => ({
          label: cat.categoryName,
          to: `/shop?category=${cat.categoryName.toLowerCase()}`
        }));
        filteredMobile.splice(0, 0, ...categoriesToInsert);

         const finalConfig = {
          ...currentConfig,
          desktopItems: desktop,
          mobileItems: filteredMobile
        };
        setConfig(finalConfig);
        setLastSavedConfig(finalConfig);
      } catch (err) {
        console.error("Failed to load and sync categories in navigation editor", err);
        setConfig(currentConfig);
        setLastSavedConfig(currentConfig);
      }
    }

    loadAndSyncCategories();
  }, [token]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const save = () => {
    setNavConfig(config);
    setLastSavedConfig(config);
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_navigation" } }));
    showToast("Navigation saved & synced to frontend");
  };

  const reset = () => {
    setConfig(DEFAULT_CONFIG);
    showToast("Reset to default navigation");
  };

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // ── Desktop item helpers ──────────────────────────────────────────────────
  const updateDesktopItem = (index: number, updates: Partial<NavMenuItem>) => {
    const items = [...config.desktopItems];
    items[index] = { ...items[index], ...updates };
    setConfig({ ...config, desktopItems: items });
  };

  const updateDesktopChild = (parentIdx: number, childIdx: number, updates: Partial<NavDropdownItem>) => {
    const items = [...config.desktopItems];
    const children = [...(items[parentIdx].children || [])];
    children[childIdx] = { ...children[childIdx], ...updates };
    items[parentIdx] = { ...items[parentIdx], children };
    setConfig({ ...config, desktopItems: items });
  };

  const updateDesktopGrandchild = (pi: number, ci: number, gi: number, updates: Partial<NavDropdownItem>) => {
    const items = [...config.desktopItems];
    const children = [...(items[pi].children || [])];
    const grandchildren = [...(children[ci].children || [])];
    grandchildren[gi] = { ...grandchildren[gi], ...updates };
    children[ci] = { ...children[ci], children: grandchildren };
    items[pi] = { ...items[pi], children };
    setConfig({ ...config, desktopItems: items });
  };

  const addDesktopItem = () => {
    const newItems = [...config.desktopItems, { label: "New Item", to: "#" }];
    setConfig({ ...config, desktopItems: newItems });
    setExpandedItems(prev => new Set([...prev, `desktop-${newItems.length - 1}`]));
  };

  const removeDesktopItem = (index: number) => {
    setConfig({ ...config, desktopItems: config.desktopItems.filter((_, i) => i !== index) });
  };

  const addDesktopChild = (parentIdx: number) => {
    const items = [...config.desktopItems];
    items[parentIdx] = { ...items[parentIdx], children: [...(items[parentIdx].children || []), { label: "New Link", to: "#" }] };
    setConfig({ ...config, desktopItems: items });
  };

  const removeDesktopChild = (parentIdx: number, childIdx: number) => {
    const items = [...config.desktopItems];
    items[parentIdx] = { ...items[parentIdx], children: (items[parentIdx].children || []).filter((_, i) => i !== childIdx) };
    setConfig({ ...config, desktopItems: items });
  };

  const addDesktopGrandchild = (pi: number, ci: number) => {
    const items = [...config.desktopItems];
    const children = [...(items[pi].children || [])];
    children[ci] = { ...children[ci], children: [...(children[ci].children || []), { label: "Sub-Link", to: "#" }] };
    items[pi] = { ...items[pi], children };
    setConfig({ ...config, desktopItems: items });
  };

  const removeDesktopGrandchild = (pi: number, ci: number, gi: number) => {
    const items = [...config.desktopItems];
    const children = [...(items[pi].children || [])];
    children[ci] = { ...children[ci], children: (children[ci].children || []).filter((_, i) => i !== gi) };
    items[pi] = { ...items[pi], children };
    setConfig({ ...config, desktopItems: items });
  };

  // ── Mobile item helpers ───────────────────────────────────────────────────
  const updateMobileItem = (index: number, updates: Partial<{ label: string; to: string }>) => {
    const items = [...config.mobileItems];
    items[index] = { ...items[index], ...updates };
    setConfig({ ...config, mobileItems: items });
  };

  const addMobileItem = () => {
    setConfig({ ...config, mobileItems: [...config.mobileItems, { label: "New Item", to: "#" }] });
  };

  const removeMobileItem = (index: number) => {
    setConfig({ ...config, mobileItems: config.mobileItems.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div />
        <div className="flex gap-2.5">
          <button
            onClick={() => setPreviewOpen(!previewOpen)}
            className="border border-neutral-200 hover:border-[#224870] text-neutral-500 hover:text-[#224870] text-[9px] font-semibold tracking-widest px-3 py-2 uppercase cursor-pointer bg-white rounded-none flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
          <button
            onClick={reset}
            className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-3 py-2 uppercase cursor-pointer bg-white rounded-none flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={save}
            className="bg-[#224870] hover:bg-[#1a3a5c] text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Save & Sync
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-[#224870]/8 border border-[#224870]/20 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#224870]" />
          <span className="text-[8px] font-bold text-[#224870] uppercase tracking-[0.2em]">
            Navigation active — {config.desktopItems.length} desktop items · {config.mobileItems.length} mobile items
          </span>
        </div>
        <ToggleSwitch enabled={config.active} onClick={() => setConfig({ ...config, active: !config.active })} />
      </div>

      {/* Live Preview */}
      {previewOpen && (
        <div className="bg-white border border-neutral-200/80 overflow-hidden">
          <div className="bg-neutral-50 border-b border-neutral-100 px-5 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-[8px] text-neutral-400 font-mono ml-2">Navigation Preview</span>
          </div>
          <div className="px-8 py-4 bg-white border-b border-neutral-100 flex items-center justify-between">
            <div className="w-20 h-5 bg-neutral-900 rounded-sm" />
            <div className="flex items-center gap-6">
              {config.desktopItems.map((item, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-neutral-600">{item.label}</span>
                  {item.children && item.children.length > 0 && (
                    <ChevronDown className="w-2 h-2 text-neutral-400" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-neutral-200" />
              <div className="w-4 h-4 rounded-full bg-neutral-200" />
              <div className="w-4 h-4 rounded-full bg-neutral-200" />
            </div>
          </div>
          <div className="px-8 py-3 bg-neutral-50 flex items-center gap-3">
            <span className="text-[7px] text-neutral-400 font-bold uppercase tracking-widest">Mobile:</span>
            {config.mobileItems.slice(0, 5).map((item, i) => (
              <span key={i} className="text-[8px] font-bold tracking-wider text-neutral-600 uppercase">{item.label}</span>
            ))}
            {config.mobileItems.length > 5 && (
              <span className="text-[7px] text-neutral-400">+{config.mobileItems.length - 5} more</span>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-neutral-200">
        {[
          { id: "desktop" as const, label: "Desktop Navigation", icon: Monitor },
          { id: "mobile" as const, label: "Mobile Navigation", icon: Smartphone },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-[9px] font-bold uppercase tracking-widest border-none cursor-pointer transition-all ${
              activeTab === id
                ? "bg-white text-[#224870] border-b-2 border-[#224870] -mb-px"
                : "bg-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Desktop Nav Editor */}
      {activeTab === "desktop" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
              Top-level items — supports 2-level nesting (categories → sub-categories → sub-links)
            </p>
            <button
              onClick={addDesktopItem}
              className="flex items-center gap-1.5 text-[8px] font-bold text-[#224870] hover:text-[#1a3a5c] cursor-pointer bg-transparent border-none uppercase tracking-widest"
            >
              <Plus className="w-3 h-3" /> Add Top-Level Item
            </button>
          </div>

          {config.desktopItems.map((item, idx) => {
            const key = `desktop-${idx}`;
            const isExpanded = expandedItems.has(key);
            return (
              <div key={idx} className="bg-white border border-neutral-200/80 overflow-hidden">
                {/* Top-level row */}
                <div
                  className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border-b border-neutral-100 cursor-pointer"
                  onClick={() => toggleExpand(key)}
                >
                  <div className="text-neutral-300">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <button className="text-neutral-400 hover:text-[#224870] cursor-pointer bg-transparent border-none p-0 flex-shrink-0" onClick={e => { e.stopPropagation(); toggleExpand(key); }}>
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  <input
                    value={item.label}
                    onChange={e => { e.stopPropagation(); updateDesktopItem(idx, { label: e.target.value }); }}
                    onClick={e => e.stopPropagation()}
                    placeholder="Label"
                    className="border border-neutral-200 px-2.5 py-1.5 text-[9px] font-bold text-[#030213] uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none w-40 bg-white"
                  />
                  <div className="flex items-center gap-1.5 flex-1">
                    <LinkIcon className="w-2.5 h-2.5 text-neutral-300 flex-shrink-0" />
                    <input
                      value={item.to}
                      onChange={e => { e.stopPropagation(); updateDesktopItem(idx, { to: e.target.value }); }}
                      onClick={e => e.stopPropagation()}
                      placeholder="URL path (e.g. /shop)"
                      className="border border-neutral-200 px-2.5 py-1.5 text-[9px] font-mono focus:outline-none focus:border-[#224870] rounded-none w-52 bg-white text-neutral-600"
                    />
                  </div>
                  {item.children && item.children.length > 0 && (
                    <span className="text-[7px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {item.children.length} child{item.children.length !== 1 ? "ren" : ""}
                    </span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); addDesktopChild(idx); }}
                    className="flex items-center gap-1 text-[7px] font-bold text-[#224870] hover:text-[#1a3a5c] cursor-pointer bg-transparent border border-[#224870]/30 px-2 py-1 rounded-none transition-colors"
                    title="Add child item"
                  >
                    <Plus className="w-2.5 h-2.5" /> Child
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); removeDesktopItem(idx); }}
                    className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Children */}
                {isExpanded && item.children && item.children.length > 0 && (
                  <div className="divide-y divide-neutral-50">
                    {item.children.map((child, ci) => {
                      const childKey = `${key}-child-${ci}`;
                      const childExpanded = expandedItems.has(childKey);
                      return (
                        <div key={ci}>
                          <div className="flex items-center gap-3 px-4 py-2.5 pl-10 bg-white hover:bg-neutral-50/50 cursor-pointer" onClick={() => toggleExpand(childKey)}>
                            <div className="w-px h-3 bg-neutral-200 flex-shrink-0" />
                            <button className="text-neutral-300 hover:text-[#224870] cursor-pointer bg-transparent border-none p-0 flex-shrink-0">
                              {child.children && child.children.length > 0 ? (
                                childExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                              ) : <div className="w-3" />}
                            </button>
                            <input
                              value={child.label}
                              onChange={e => { e.stopPropagation(); updateDesktopChild(idx, ci, { label: e.target.value }); }}
                              onClick={e => e.stopPropagation()}
                              placeholder="Child label"
                              className="border border-neutral-200 px-2 py-1 text-[8px] font-bold text-[#030213] uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none w-36 bg-white"
                            />
                            <input
                              value={child.to}
                              onChange={e => { e.stopPropagation(); updateDesktopChild(idx, ci, { to: e.target.value }); }}
                              onClick={e => e.stopPropagation()}
                              placeholder="/path"
                              className="border border-neutral-200 px-2 py-1 text-[8px] font-mono focus:outline-none focus:border-[#224870] rounded-none w-44 bg-white text-neutral-600"
                            />
                            {child.children && child.children.length > 0 && (
                              <span className="text-[7px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                                {child.children.length} sub-links
                              </span>
                            )}
                            <button
                              onClick={e => { e.stopPropagation(); addDesktopGrandchild(idx, ci); }}
                              className="flex items-center gap-1 text-[7px] font-bold text-neutral-400 hover:text-[#224870] cursor-pointer bg-transparent border border-neutral-200 px-1.5 py-0.5 rounded-none transition-colors"
                              title="Add sub-link"
                            >
                              <Plus className="w-2 h-2" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const savedChild = lastSavedConfig.desktopItems[idx]?.children?.[ci];
                                const isChildSaved = savedChild && savedChild.label === child.label && savedChild.to === child.to;
                                if (!isChildSaved) {
                                  setNavConfig(config);
                                  setLastSavedConfig(config);
                                  window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_navigation" } }));
                                  showToast("Item saved & synced!");
                                }
                              }}
                              className={`p-1 border cursor-pointer transition-colors flex items-center justify-center ${
                                (() => {
                                  const savedChild = lastSavedConfig.desktopItems[idx]?.children?.[ci];
                                  const isChildSaved = savedChild && savedChild.label === child.label && savedChild.to === child.to;
                                  return isChildSaved
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-250"
                                    : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100";
                                })()
                              }`}
                              title={
                                (() => {
                                  const savedChild = lastSavedConfig.desktopItems[idx]?.children?.[ci];
                                  const isChildSaved = savedChild && savedChild.label === child.label && savedChild.to === child.to;
                                  return isChildSaved ? "Already saved" : "Click to save changes instantly";
                                })()
                              }
                            >
                              {(() => {
                                const savedChild = lastSavedConfig.desktopItems[idx]?.children?.[ci];
                                const isChildSaved = savedChild && savedChild.label === child.label && savedChild.to === child.to;
                                return isChildSaved ? (
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                ) : (
                                  <Save className="w-3 h-3 stroke-[2.5]" />
                                );
                              })()}
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); removeDesktopChild(idx, ci); }}
                              className="text-neutral-200 hover:text-[#b2533e] cursor-pointer bg-transparent border-none transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Grandchildren */}
                          {childExpanded && child.children && child.children.length > 0 && (
                            <div className="divide-y divide-neutral-50 bg-neutral-50/30">
                              {child.children.map((gc, gi) => (
                                <div key={gi} className="flex items-center gap-3 px-4 py-2 pl-20">
                                  <div className="w-px h-3 bg-neutral-100 flex-shrink-0" />
                                  <input
                                    value={gc.label}
                                    onChange={e => updateDesktopGrandchild(idx, ci, gi, { label: e.target.value })}
                                    placeholder="Sub-link label"
                                    className="border border-neutral-100 px-2 py-1 text-[7px] font-bold text-[#030213] uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none w-32 bg-white"
                                  />
                                  <input
                                    value={gc.to}
                                    onChange={e => updateDesktopGrandchild(idx, ci, gi, { to: e.target.value })}
                                    placeholder="/path"
                                    className="border border-neutral-100 px-2 py-1 text-[7px] font-mono focus:outline-none focus:border-[#224870] rounded-none w-44 bg-white text-neutral-500"
                                  />
                                  <button
                                    onClick={() => removeDesktopGrandchild(idx, ci, gi)}
                                    className="text-neutral-200 hover:text-[#b2533e] cursor-pointer bg-transparent border-none transition-colors ml-auto"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Nav Editor */}
      {activeTab === "mobile" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
              Flat list — these appear in the hamburger menu on mobile
            </p>
            <button
              onClick={addMobileItem}
              className="flex items-center gap-1.5 text-[8px] font-bold text-[#224870] hover:text-[#1a3a5c] cursor-pointer bg-transparent border-none uppercase tracking-widest"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>
          <div className="bg-white border border-neutral-200/80 divide-y divide-neutral-50">
            {config.mobileItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3">
                <div className="text-[8px] font-black text-neutral-300 w-5 text-center">{idx + 1}</div>
                <input
                  value={item.label}
                  onChange={e => updateMobileItem(idx, { label: e.target.value })}
                  placeholder="Label"
                  className="border border-neutral-200 px-2.5 py-1.5 text-[9px] font-bold text-[#030213] uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none w-40 bg-white"
                />
                <div className="flex items-center gap-1.5 flex-1">
                  <LinkIcon className="w-2.5 h-2.5 text-neutral-300 flex-shrink-0" />
                  <input
                    value={item.to}
                    onChange={e => updateMobileItem(idx, { to: e.target.value })}
                    placeholder="URL path"
                    className="border border-neutral-200 px-2.5 py-1.5 text-[9px] font-mono focus:outline-none focus:border-[#224870] rounded-none w-52 bg-white text-neutral-600"
                  />
                </div>
                <button
                  onClick={() => removeMobileItem(idx)}
                  className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#224870] text-white text-[9px] font-bold tracking-widest px-5 py-3 uppercase z-50 flex items-center gap-2 shadow-xl">
          <Check className="w-3.5 h-3.5" />
          {toast}
        </div>
      )}
    </div>
  );
}
