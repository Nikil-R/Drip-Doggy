import { useState, useMemo } from "react";
import { 
  Shield, Plus, Trash2, X, Check, AlertTriangle, UserCog, Users, 
  Lock, UserCheck, Search, Download, HelpCircle, Columns, FileText
} from "lucide-react";

interface Permission {
  section: string;
  read: boolean;
  write: boolean;
  delete: boolean;
}

interface AdminRole {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  adminCount: number;
}

const INITIAL_SECTIONS = [
  "Dashboard", "Orders", "Products", "Customers", "Coupons",
  "Categories", "Brands", "Content", "Analytics", "Settings",
  "Roles", "Media", "Shipping", "Reviews"
];

// Pre-built Role Templates
const PREBUILT_TEMPLATES = [
  {
    name: "Custom (Empty)",
    description: "Start with no permissions configuration",
    permissions: (sections: string[]) => sections.map(s => ({ section: s, read: false, write: false, delete: false }))
  },
  {
    name: "Support Representative",
    description: "Support desk staff with limited access to customer relations",
    permissions: (sections: string[]) => sections.map(s => ({
      section: s,
      read: ["Customers", "Reviews", "Dashboard", "Orders"].includes(s),
      write: ["Reviews", "Customers"].includes(s),
      delete: false
    }))
  },
  {
    name: "Catalog Auditor",
    description: "Manage product details, classifications, and imagery",
    permissions: (sections: string[]) => sections.map(s => ({
      section: s,
      read: ["Products", "Categories", "Brands", "Media", "Dashboard"].includes(s),
      write: ["Products", "Categories", "Brands", "Media"].includes(s),
      delete: false
    }))
  },
  {
    name: "Order Fulfillment Partner",
    description: "Logistics and dispatch operations focus",
    permissions: (sections: string[]) => sections.map(s => ({
      section: s,
      read: ["Orders", "Shipping", "Customers", "Dashboard"].includes(s),
      write: ["Orders", "Shipping"].includes(s),
      delete: false
    }))
  },
  {
    name: "Marketing Creator",
    description: "Execute promotional campaigns and content design edits",
    permissions: (sections: string[]) => sections.map(s => ({
      section: s,
      read: ["Coupons", "Content", "Analytics", "Dashboard", "Products"].includes(s),
      write: ["Coupons", "Content"].includes(s),
      delete: false
    }))
  }
];

const initialRoles: AdminRole[] = [
  {
    id: 1, name: "Super Admin", description: "Full system access to all Drip Doggy operations",
    permissions: INITIAL_SECTIONS.map(s => ({ section: s, read: true, write: true, delete: true })),
    adminCount: 2
  },
  {
    id: 2, name: "Collections Manager", description: "Manage products, categories, brands, and content editor",
    permissions: INITIAL_SECTIONS.map(s => ({
      section: s, read: true,
      write: ["Products", "Categories", "Brands", "Content", "Media"].includes(s),
      delete: s === "Content"
    })),
    adminCount: 3
  },
  {
    id: 3, name: "Order Ops", description: "Process orders, manage customers, and shipping",
    permissions: INITIAL_SECTIONS.map(s => ({
      section: s, read: true,
      write: ["Orders", "Customers", "Shipping", "Reviews"].includes(s),
      delete: false
    })),
    adminCount: 4
  },
  {
    id: 4, name: "Marketing", description: "Analytics, coupons, dashboard, and content editor",
    permissions: INITIAL_SECTIONS.map(s => ({
      section: s, read: true,
      write: ["Dashboard", "Analytics", "Coupons", "Content"].includes(s),
      delete: false
    })),
    adminCount: 2
  },
  {
    id: 5, name: "View Only", description: "Read-only access across all sections",
    permissions: INITIAL_SECTIONS.map(s => ({
      section: s, read: true, write: false, delete: false
    })),
    adminCount: 6
  },
];

export function ControlAuthorityPage() {
  const [sections, setSections] = useState<string[]>(INITIAL_SECTIONS);
  const [roles, setRoles] = useState<AdminRole[]>(initialRoles);
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState<AdminRole | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Custom Section Addition
  const [newSectionName, setNewSectionName] = useState("");

  // Modal Table Searching
  const [modalSearch, setModalSearch] = useState("");

  // Role Comparison State
  const [compRole1Id, setCompRole1Id] = useState<number>(1);
  const [compRole2Id, setCompRole2Id] = useState<number>(2);
  const [showComparison, setShowComparison] = useState(false);

  // Form states
  const [form, setForm] = useState({ name: "", description: "" });
  const [formPerms, setFormPerms] = useState<Permission[]>([]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  // Quick summary card overlay ID
  const [hoveredSummaryId, setHoveredSummaryId] = useState<number | null>(null);

  // ── KPI Stats ─────────────────────────────────────────────────────
  const totalAdmins = roles.reduce((s, r) => s + r.adminCount, 0);
  const writableSections = roles.filter(r => r.permissions.some(p => p.write)).length;
  const fullAccessRoles = roles.filter(r => r.permissions.every(p => p.delete)).length;

  const kpis = [
    { label: "Total Roles", value: roles.length.toString(), icon: Shield, color: "text-[#030213]" },
    { label: "Total Admins", value: totalAdmins.toString(), icon: Users, color: "text-[#030213]" },
    { label: "Full Access", value: fullAccessRoles.toString(), icon: UserCheck, color: "text-[#030213]" },
    { label: "Permissions", value: (sections.length * roles.length).toString(), icon: Lock, color: "text-[#030213]" },
  ];

  // Check for duplicate name validation
  const isDuplicateName = useMemo(() => {
    return roles.some(r => r.name.toLowerCase() === form.name.toLowerCase() && (!editRole || r.id !== editRole.id));
  }, [form.name, roles, editRole]);

  const openAdd = () => {
    setEditRole(null);
    setForm({ name: "", description: "" });
    setSelectedTemplateIndex(0);
    setFormPerms(sections.map(s => ({ section: s, read: true, write: false, delete: false })));
    setModalSearch("");
    setShowModal(true);
  };

  const openEdit = (role: AdminRole) => {
    setEditRole(role);
    setForm({ name: role.name, description: role.description });
    setFormPerms([...role.permissions]);
    setModalSearch("");
    setShowModal(true);
  };

  const handleTemplateChange = (idx: number) => {
    setSelectedTemplateIndex(idx);
    const template = PREBUILT_TEMPLATES[idx];
    setFormPerms(template.permissions(sections));
  };

  const togglePerm = (section: string, field: "read" | "write" | "delete") => {
    setFormPerms(formPerms.map(p => p.section === section ? { ...p, [field]: !p[field] } : p));
  };

  const setAll = (field: "read" | "write" | "delete", value: boolean) => {
    setFormPerms(formPerms.map(p => ({ ...p, [field]: value })));
  };

  const handleAddCustomSection = () => {
    const formatted = newSectionName.trim();
    if (!formatted || sections.includes(formatted)) return;
    
    const updatedSections = [...sections, formatted];
    setSections(updatedSections);
    
    // Add section default permission to form if modal is currently open
    if (showModal) {
      setFormPerms(prev => [...prev, { section: formatted, read: false, write: false, delete: false }]);
    }

    // Add section default to existing roles in state
    setRoles(prev => prev.map(r => ({
      ...r,
      permissions: [...r.permissions, { section: formatted, read: r.name === "Super Admin", write: r.name === "Super Admin", delete: r.name === "Super Admin" }]
    })));

    setNewSectionName("");
  };

  const save = () => {
    if (!form.name.trim() || isDuplicateName) return;
    if (editRole) {
      setRoles(roles.map(r => r.id === editRole.id ? { ...r, name: form.name, description: form.description, permissions: formPerms } : r));
    } else {
      setRoles([...roles, { id: Date.now(), name: form.name, description: form.description, permissions: formPerms, adminCount: 0 }]);
    }
    setShowModal(false);
  };

  // Export Matrix as CSV report
  const handleExportCSVReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Role,Description,Section,Read,Write,Delete\n";
    
    roles.forEach(role => {
      role.permissions.forEach(p => {
        csvContent += `"${role.name}","${role.description}","${p.section}",${p.read ? "YES" : "NO"},${p.write ? "YES" : "NO"},${p.delete ? "YES" : "NO"}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "drip_doggy_permissions_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search filtered permissions inside Modal
  const filteredFormPerms = useMemo(() => {
    return formPerms.filter(p => !modalSearch || p.section.toLowerCase().includes(modalSearch.toLowerCase()));
  }, [formPerms, modalSearch]);

  // Comparison Roles details
  const role1 = roles.find(r => r.id === compRole1Id);
  const role2 = roles.find(r => r.id === compRole2Id);

  return (
    <div className="space-y-8 font-sans text-[#030213]">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest">Control Authority</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy admin roles &amp; permission management
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowComparison(!showComparison)} 
            className="border border-neutral-200 hover:border-black text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase bg-transparent cursor-pointer rounded-none flex items-center gap-1.5"
          >
            <Columns className="w-3.5 h-3.5" /> Compare Roles
          </button>
          <button 
            onClick={handleExportCSVReport} 
            className="border border-neutral-200 hover:border-black text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase bg-transparent cursor-pointer rounded-none flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Export Report
          </button>
          <button onClick={openAdd} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none">
            <Plus className="w-3.5 h-3.5" /> Add Role
          </button>
        </div>
      </div>

      {/* ── Custom Section Adder Form ──────────────────────────────── */}
      <div className="bg-card border border-neutral-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[8px] font-bold tracking-widest uppercase text-[#030213]">Create Custom Module Section</span>
          <p className="text-[7px] text-neutral-400 font-bold uppercase mt-0.5">Introduce a new application feature category to track security accesses</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="e.g. ReturnLogistics"
            value={newSectionName}
            onChange={e => setNewSectionName(e.target.value)}
            className="border border-neutral-200 px-3 py-1.5 text-[9px] font-bold uppercase bg-card focus:outline-none w-full sm:w-48"
          />
          <button onClick={handleAddCustomSection} className="bg-[#030213] hover:bg-neutral-800 text-white text-[8px] font-bold px-4 py-2 uppercase tracking-widest rounded-none border-none cursor-pointer shrink-0">
            Create Section
          </button>
        </div>
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

      {/* ── Role Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(r => {
          const writeCount = r.permissions.filter(p => p.write).length;
          const deleteCount = r.permissions.filter(p => p.delete).length;
          const readOnlyCount = r.permissions.filter(p => p.read && !p.write && !p.delete).length;
          return (
            <div 
              key={r.id} 
              className="bg-card border border-neutral-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow rounded-none relative"
              onMouseEnter={() => setHoveredSummaryId(r.id)}
              onMouseLeave={() => setHoveredSummaryId(null)}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#030213] flex items-center justify-center rounded-none">
                    <UserCog className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide">{r.name}</h3>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{r.description}</p>
                  </div>
                </div>

                {/* Quick stats row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-200/60 text-center">
                  <div>
                    <p className="text-[11px] font-bold">{r.adminCount}</p>
                    <p className="text-[6px] text-neutral-400 font-semibold uppercase tracking-widest mt-0.5">Admins</p>
                  </div>
                  <div className="border-x border-neutral-200/60">
                    <p className="text-[11px] font-bold text-green-700">{writeCount}</p>
                    <p className="text-[6px] text-neutral-400 font-semibold uppercase tracking-widest mt-0.5">Write</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#b2533e]">{deleteCount}</p>
                    <p className="text-[6px] text-neutral-400 font-semibold uppercase tracking-widest mt-0.5">Delete</p>
                  </div>
                </div>

                {/* Permission visibility bar */}
                <div className="my-4">
                  <div className="flex items-center justify-between text-[7px] text-neutral-400 font-bold uppercase tracking-widest mb-1.5">
                    <span>Access ({writeCount}/{sections.length})</span>
                  </div>
                  <div className="h-1 bg-neutral-200 rounded-none overflow-hidden">
                    <div className="h-full bg-[#030213] transition-all" style={{ width: `${(writeCount / sections.length) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Hover Quick Permission Summary Panel */}
              {hoveredSummaryId === r.id && (
                <div className="absolute inset-x-0 top-0 bg-[#030213] text-white p-5 z-10 border border-neutral-700 max-h-[160px] overflow-y-auto uppercase text-[7.5px] tracking-wider space-y-1 rounded-none">
                  <div className="border-b border-neutral-700 pb-1 mb-1 font-bold text-amber-500">Privileged Write Modules</div>
                  {r.permissions.filter(p => p.write).map(p => (
                    <div key={p.section} className="flex justify-between">
                      <span>{p.section}</span>
                      <span className="text-green-500">[Write/Read]</span>
                    </div>
                  ))}
                  {r.permissions.filter(p => p.write).length === 0 && <p className="text-neutral-400">No write privileges configured</p>}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60">
                <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest">
                  {r.permissions.every(p => p.read) ? "Full visibility" : `ReadOnly in ${readOnlyCount} sec`}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(r)} className="text-neutral-400 hover:text-[#030213] text-[8px] font-bold tracking-widest uppercase cursor-pointer bg-transparent border-none p-0">Edit</button>
                  <button onClick={() => setDeleteId(r.id)} className="text-neutral-400 hover:text-[#b2533e] text-[8px] font-bold tracking-widest uppercase cursor-pointer bg-transparent border-none p-0">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Side-by-Side Role Comparison Section ──────────────────────── */}
      {showComparison && (
        <div className="bg-card border border-neutral-200/80 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest">Side-by-Side Role Comparer</h3>
              <p className="text-[7.5px] text-neutral-400 font-bold uppercase">Cross-check access differences between selected credentials</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={compRole1Id} onChange={e => setCompRole1Id(Number(e.target.value))} className="bg-card border border-neutral-200 px-2 py-1 text-[9px] font-semibold uppercase">
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <span className="text-[8px] font-bold text-neutral-400 uppercase">VS</span>
              <select value={compRole2Id} onChange={e => setCompRole2Id(Number(e.target.value))} className="bg-card border border-neutral-200 px-2 py-1 text-[9px] font-semibold uppercase">
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <button onClick={() => setShowComparison(false)} className="text-neutral-400 hover:text-[#030213] bg-transparent border-none p-1 cursor-pointer">✕</button>
            </div>
          </div>

          <div className="overflow-x-auto border border-neutral-200">
            <table className="w-full text-[9px] font-bold text-left uppercase tracking-wider">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200 text-[8px] text-neutral-400">
                  <th className="p-3">Section module</th>
                  <th className="p-3 text-center border-l border-neutral-200">{role1?.name} (R/W/D)</th>
                  <th className="p-3 text-center border-l border-neutral-200">{role2?.name} (R/W/D)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {sections.map(s => {
                  const p1 = role1?.permissions.find(p => p.section === s);
                  const p2 = role2?.permissions.find(p => p.section === s);
                  return (
                    <tr key={s} className="hover:bg-neutral-200/10">
                      <td className="p-3 text-[#030213]">{s}</td>
                      <td className="p-3 text-center border-l border-neutral-200 font-mono">
                        {p1 ? `${p1.read ? "R" : "-"}/${p1.write ? "W" : "-"}/${p1.delete ? "D" : "-"}` : "—"}
                      </td>
                      <td className="p-3 text-center border-l border-neutral-200 font-mono">
                        {p2 ? `${p2.read ? "R" : "-"}/${p2.write ? "W" : "-"}/${p2.delete ? "D" : "-"}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-neutral-300 w-full max-w-3xl mx-4 p-6 my-8 rounded-none" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest">{editRole ? "Edit Role" : "Add Role"}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error alerts */}
            {isDuplicateName && (
              <div className="bg-red-50 border border-red-500/20 text-red-700 p-3 text-[9px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Error: Role name "{form.name}" already exists. Please choose a unique name.
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Role Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="e.g. Collections Manager" />
              </div>
              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="e.g. Manages products and content" />
              </div>
              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Pre-built Role Template</label>
                <select 
                  value={selectedTemplateIndex}
                  onChange={e => handleTemplateChange(Number(e.target.value))}
                  disabled={editRole !== null}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-semibold focus:outline-none focus:border-[#030213] rounded-none bg-card uppercase cursor-pointer"
                >
                  {PREBUILT_TEMPLATES.map((t, idx) => (
                    <option key={idx} value={idx}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Permission Matrix */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search sections..." 
                    value={modalSearch} 
                    onChange={e => setModalSearch(e.target.value)} 
                    className="border border-neutral-200 pl-8 pr-3 py-1 text-[8.5px] uppercase tracking-wider bg-card focus:outline-none w-48"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
                </div>
                <div className="flex gap-3 text-[7.5px] font-bold tracking-widest text-neutral-400 uppercase">
                  <button onClick={() => setAll("read", !formPerms.every(p => p.read))} className="hover:text-[#030213] cursor-pointer bg-transparent border-none">Toggle Read</button>
                  <button onClick={() => setAll("write", !formPerms.every(p => p.write))} className="hover:text-[#030213] cursor-pointer bg-transparent border-none">Toggle Write</button>
                  <button onClick={() => setAll("delete", !formPerms.every(p => p.delete))} className="hover:text-[#030213] cursor-pointer bg-transparent border-none">Toggle Delete</button>
                </div>
              </div>
              <div className="border border-neutral-200 overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-[9px] font-bold uppercase">
                  <thead>
                    <tr className="bg-neutral-100 text-[8px] text-neutral-400 tracking-[0.2em] uppercase border-b border-neutral-200 sticky top-0">
                      <th className="p-3 font-bold">Section</th>
                      <th className="p-3 font-bold text-center">Read</th>
                      <th className="p-3 font-bold text-center">Write</th>
                      <th className="p-3 font-bold text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/60">
                    {filteredFormPerms.map(p => (
                      <tr key={p.section} className="hover:bg-neutral-200/10">
                        <td className="p-3 font-bold text-[#030213]">{p.section}</td>
                        {(["read", "write", "delete"] as const).map(f => (
                          <td key={f} className="p-3 text-center">
                            <button onClick={() => togglePerm(p.section, f)}
                              className={`w-6 h-6 border flex items-center justify-center cursor-pointer mx-auto transition-colors rounded-none ${
                                p[f] ? "bg-[#030213] border-[#030213] text-white" : "bg-neutral-200 border-neutral-300 text-neutral-400"
                              }`}>
                              <Check className={`w-3.5 h-3.5 stroke-[3] ${p[f] ? "block" : "hidden"}`} />
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200/60">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} disabled={isDuplicateName} className="bg-[#030213] hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-[#030213] text-white text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase cursor-pointer rounded-none border-none">{editRole ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-neutral-300 p-6 max-w-sm mx-4 rounded-none" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Delete Role?</h3>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mb-4">This will remove the role permanently.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={() => { setRoles(roles.filter(r => r.id !== deleteId)); setDeleteId(null); }} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
