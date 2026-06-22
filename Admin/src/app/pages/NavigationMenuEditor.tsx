import { useState, useEffect } from "react";
import { RotateCcw, Check, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { getNavConfig, setNavConfig, NavConfig, NavMenuItem } from "../lib/admin-content-store";

export function NavigationMenuEditorPage() {
  const [config, setConfigState] = useState<NavConfig>({ desktopItems: [], mobileItems: [], active: true });
  const [toast, setToast] = useState("");
  const [expanded, setExpanded] = useState<number[]>([]);

  useEffect(() => { setConfigState(getNavConfig()); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const save = () => { setNavConfig(config); showToast("Navigation saved"); };

  const reset = () => {
    setConfigState({
      desktopItems: [
        { label: "Shop", to: "#", children: [
          { label: "Outerwear", to: "/shop?category=outerwear", children: [
            { label: "All Outerwear", to: "/shop?category=outerwear" },
            { label: "Canvas Jackets", to: "/shop?category=outerwear&sub=jackets" },
            { label: "Moto Coats", to: "/shop?category=outerwear&sub=coats" },
            { label: "Blazers", to: "/shop?category=outerwear&sub=blazers" },
          ]},
          { label: "Knitwear", to: "/shop?category=knitwear" },
          { label: "Tops", to: "/shop?category=tops" },
          { label: "Bottoms", to: "/shop?category=bottoms" },
          { label: "Accessories", to: "/coming-soon" },
        ]},
        { label: "Collections", to: "#", children: [
          { label: "SS26 Capsule", to: "/shop?collection=ss26" },
          { label: "Signature Archive", to: "/shop?collection=archive" },
          { label: "FW25 Heritage", to: "/coming-soon" },
        ]},
        { label: "About", to: "/about" },
        { label: "Help", to: "/help" },
        { label: "Contact", to: "/contact" },
      ],
      mobileItems: [
        { label: "Shop All", to: "/shop" },
        { label: "Outerwear", to: "/shop?category=outerwear" },
        { label: "Knitwear", to: "/shop?category=knitwear" },
        { label: "Tops", to: "/shop?category=tops" },
        { label: "Bottoms", to: "/shop?category=bottoms" },
        { label: "About", to: "/about" },
        { label: "Help", to: "/help" },
        { label: "Contact", to: "/contact" },
        { label: "Wishlist", to: "/wishlist" },
        { label: "Account", to: "/account" },
      ],
      active: true,
    });
  };

  const toggleExpand = (idx: number) => {
    setExpanded(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const updateDesktopItem = (idx: number, updates: Partial<NavMenuItem>) => {
    const items = [...config.desktopItems];
    items[idx] = { ...items[idx], ...updates };
    setConfigState({ ...config, desktopItems: items });
  };

  const addChild = (parentIdx: number) => {
    const items = [...config.desktopItems];
    if (!items[parentIdx].children) items[parentIdx].children = [];
    items[parentIdx].children = [...(items[parentIdx].children || []), { label: "", to: "" }];
    setConfigState({ ...config, desktopItems: items });
  };

  const addSubChild = (parentIdx: number, childIdx: number) => {
    const items = [...config.desktopItems];
    const child = items[parentIdx].children?.[childIdx];
    if (child) {
      if (!child.children) child.children = [];
      child.children = [...child.children, { label: "", to: "" }];
    }
    setConfigState({ ...config, desktopItems: items });
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Navigation Menu</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Manage Drip Doggy header navigation structure</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer bg-white rounded-none"><RotateCcw className="w-3 h-3" /> Reset</button>
          <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none"><Check className="w-3.5 h-3.5" /> Save</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desktop Nav */}
        <div className="bg-white border border-neutral-200/80 p-6">
          <h3 className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-4">Desktop Navigation</h3>
          <div className="space-y-2">
            {config.desktopItems.map((item, idx) => (
              <div key={idx} className="border border-neutral-100">
                <div className="flex items-center gap-2 p-3 bg-[#faf8f5]/40">
                  <button onClick={() => toggleExpand(idx)} className="text-neutral-400 cursor-pointer bg-transparent border-none">
                    {expanded.includes(idx) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  <input value={item.label} onChange={e => updateDesktopItem(idx, { label: e.target.value })}
                    className="flex-1 border border-neutral-200/80 px-2 py-1 text-[8px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" placeholder="Label" />
                  <input value={item.to} onChange={e => updateDesktopItem(idx, { to: e.target.value })}
                    className="w-24 border border-neutral-200/80 px-2 py-1 text-[8px] font-bold focus:outline-none focus:border-[#030213] rounded-none" placeholder="Path" />
                  <button onClick={() => addChild(idx)} className="text-[#030213] hover:text-neutral-600 text-[7px] font-extrabold cursor-pointer bg-transparent border-none">+ CHILD</button>
                  <button onClick={() => setConfigState({ ...config, desktopItems: config.desktopItems.filter((_, i) => i !== idx) })}
                    className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none"><Trash2 className="w-3 h-3" /></button>
                </div>
                {expanded.includes(idx) && item.children && (
                  <div className="pl-8 pr-3 pb-3 space-y-1.5">
                    {item.children.map((child, ci) => (
                      <div key={ci}>
                        <div className="flex items-center gap-2 py-1">
                          <input value={child.label} onChange={e => {
                            const items = [...config.desktopItems];
                            if (items[idx].children) {
                              items[idx].children![ci] = { ...items[idx].children![ci], label: e.target.value };
                              setConfigState({ ...config, desktopItems: items });
                            }
                          }} className="flex-1 border border-neutral-200/80 px-2 py-1 text-[7px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" placeholder="Child label" />
                          <input value={child.to} onChange={e => {
                            const items = [...config.desktopItems];
                            if (items[idx].children) {
                              items[idx].children![ci] = { ...items[idx].children![ci], to: e.target.value };
                              setConfigState({ ...config, desktopItems: items });
                            }
                          }} className="w-20 border border-neutral-200/80 px-2 py-1 text-[7px] font-bold focus:outline-none focus:border-[#030213] rounded-none" placeholder="Path" />
                          <button onClick={() => addSubChild(idx, ci)} className="text-[#030213] text-[7px] font-extrabold cursor-pointer bg-transparent border-none">+ SUB</button>
                          <button onClick={() => {
                            const items = [...config.desktopItems];
                            if (items[idx].children) {
                              items[idx].children = items[idx].children!.filter((_, i) => i !== ci);
                              setConfigState({ ...config, desktopItems: items });
                            }
                          }} className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none"><Trash2 className="w-2.5 h-2.5" /></button>
                        </div>
                        {/* Render sub-children */}
                        {child.children?.map((sub, si) => (
                          <div key={si} className="flex items-center gap-2 pl-8 py-0.5">
                            <input value={sub.label} onChange={e => {
                              const items = [...config.desktopItems];
                              const c = items[idx].children?.[ci];
                              if (c?.children) {
                                c.children[si] = { ...c.children[si], label: e.target.value };
                                setConfigState({ ...config, desktopItems: items });
                              }
                            }} className="flex-1 border border-neutral-200/80 px-2 py-0.5 text-[7px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
                            <input value={sub.to} onChange={e => {
                              const items = [...config.desktopItems];
                              const c = items[idx].children?.[ci];
                              if (c?.children) {
                                c.children[si] = { ...c.children[si], to: e.target.value };
                                setConfigState({ ...config, desktopItems: items });
                              }
                            }} className="w-16 border border-neutral-200/80 px-2 py-0.5 text-[7px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
                            <button onClick={() => {
                              const items = [...config.desktopItems];
                              const c = items[idx].children?.[ci];
                              if (c?.children) {
                                c.children = c.children.filter((_, i) => i !== si);
                                setConfigState({ ...config, desktopItems: items });
                              }
                            }} className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none"><Trash2 className="w-2 h-2" /></button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setConfigState({ ...config, desktopItems: [...config.desktopItems, { label: "", to: "" }] })}
            className="mt-3 text-[7px] font-extrabold text-[#030213] hover:text-neutral-600 cursor-pointer bg-transparent border-none">+ Add Nav Item</button>
        </div>

        {/* Mobile Nav */}
        <div className="bg-white border border-neutral-200/80 p-6">
          <h3 className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-4">Mobile Navigation</h3>
          <div className="space-y-2">
            {config.mobileItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 border border-neutral-100">
                <input value={item.label} onChange={e => {
                  const items = [...config.mobileItems];
                  items[idx] = { ...items[idx], label: e.target.value };
                  setConfigState({ ...config, mobileItems: items });
                }} className="flex-1 border border-neutral-200/80 px-2 py-1 text-[8px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
                <input value={item.to} onChange={e => {
                  const items = [...config.mobileItems];
                  items[idx] = { ...items[idx], to: e.target.value };
                  setConfigState({ ...config, mobileItems: items });
                }} className="w-24 border border-neutral-200/80 px-2 py-1 text-[8px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
                <button onClick={() => setConfigState({ ...config, mobileItems: config.mobileItems.filter((_, i) => i !== idx) })}
                  className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setConfigState({ ...config, mobileItems: [...config.mobileItems, { label: "", to: "" }] })}
            className="mt-3 text-[7px] font-extrabold text-[#030213] hover:text-neutral-600 cursor-pointer bg-transparent border-none">+ Add Mobile Item</button>
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-[#030213] text-white text-[9px] font-extrabold tracking-widest px-4 py-3 uppercase z-50">{toast}</div>}
    </div>
  );
}
