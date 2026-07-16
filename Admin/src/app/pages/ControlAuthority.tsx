import { useState, useMemo } from "react";
import { 
  Shield, Plus, Trash2, X, Check, AlertTriangle, UserCog, Users, 
  Lock, UserCheck, Search, Columns, FileText
} from "lucide-react";
import { REGEX_PATTERNS } from "../utils/validation";

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
    id: 1, name: "Super Admin", description: "Full system access to all DripDoggy operations",
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

  // Selected Role for Side Drawer Details
  const [selectedRoleDetails, setSelectedRoleDetails] = useState<AdminRole | null>(null);

  // ── KPI Stats ─────────────────────────────────────────────────────
  const totalAdmins = roles.reduce((s, r) => s + r.adminCount, 0);
  const fullAccessRoles = roles.filter(r => r.permissions.every(p => p.delete)).length;

  const kpis = [
    { label: "Total Roles", value: roles.length.toString(), icon: Shield },
    { label: "Total Admins", value: totalAdmins.toString(), icon: Users },
    { label: "Full Access", value: fullAccessRoles.toString(), icon: UserCheck },
    { label: "Permissions", value: (sections.length * roles.length).toString(), icon: Lock },
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

    if (!REGEX_PATTERNS.NAME.test(formatted)) {
      alert("Invalid section name format. Names must be 2 to 100 characters long and can contain letters, numbers, spaces, hyphens, and ampersands.");
      return;
    }
    
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

  const save = () => {
    if (!form.name.trim() || isDuplicateName) return;

    if (!REGEX_PATTERNS.NAME.test(form.name.trim())) {
      alert("Invalid role name format. Names must be 2 to 100 characters long and can contain letters, numbers, spaces, hyphens, and ampersands.");
      return;
    }
    if (editRole) {
      setRoles(roles.map(r => r.id === editRole.id ? { ...r, name: form.name, description: form.description, permissions: formPerms } : r));
    } else {
      setRoles([...roles, { id: Date.now(), name: form.name, description: form.description, permissions: formPerms, adminCount: 0 }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <UserCog className="w-5 h-5 text-[#224870]" /> Control Authority
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            DripDoggy admin roles &amp; permission management
          </p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => setShowComparison(true)} 
            className="border border-neutral-300 hover:border-[#224870] text-[#382d24] hover:text-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase bg-transparent cursor-pointer rounded-none flex items-center gap-1.5 transition-colors"
          >
            <Columns className="w-3.5 h-3.5" /> Compare Roles
          </button>
          <button 
            onClick={handleExportCSVReport} 
            className="border border-neutral-300 hover:border-[#224870] text-[#382d24] hover:text-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase bg-transparent cursor-pointer rounded-none flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Export Report
          </button>
          <button onClick={openAdd} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Role
          </button>
        </div>
      </div>

      {/* ── Custom Section Adder Form ──────────────────────────────── */}
      <div className="bg-card border border-neutral-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase text-[#382d24] block">Create Custom Module Section</span>
          <p className="text-[8px] text-[#615e56] font-bold uppercase mt-1">Introduce a new application feature category to track security accesses</p>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="e.g. ReturnLogistics"
            value={newSectionName}
            onChange={e => setNewSectionName(e.target.value)}
            className="border border-neutral-300 bg-[#faf8f5] px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#224870] w-full sm:w-56 text-[#382d24]"
          />
          <button onClick={handleAddCustomSection} className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9px] font-black px-4.5 py-2 uppercase tracking-widest rounded-none border-none cursor-pointer shrink-0 transition-colors">
            Create Section
          </button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] rounded-none hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">{kpi.label}</span>
                <Icon className="w-4 h-4 text-[#615e56]/70" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-[#382d24] mt-2">{kpi.value}</p>
              <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">System authorization metric</p>
            </div>
          );
        })}
      </div>

      {/* ── Role Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map(r => {
          const writeCount = r.permissions.filter(p => p.write).length;
          const deleteCount = r.permissions.filter(p => p.delete).length;
          const readOnlyCount = r.permissions.filter(p => p.read && !p.write && !p.delete).length;
          return (
            <div 
              key={r.id} 
              className="bg-card border border-neutral-200/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow rounded-none relative"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#224870]/10 border border-[#224870]/20 flex items-center justify-center rounded-none text-[#224870]">
                    <UserCog className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-wide text-[#382d24]">{r.name}</h3>
                    <p className="text-[9px] text-[#615e56] font-bold uppercase tracking-wider mt-0.5">{r.description}</p>
                  </div>
                </div>

                {/* Quick stats row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-200/60 text-center">
                  <div>
                    <p className="text-[11px] font-bold text-[#382d24]">{r.adminCount}</p>
                    <p className="text-[6.5px] text-neutral-400 font-semibold uppercase tracking-widest mt-0.5">Admins</p>
                  </div>
                  <div className="border-x border-neutral-200/60">
                    <p className="text-[11px] font-bold text-green-700">{writeCount}</p>
                    <p className="text-[6.5px] text-neutral-400 font-semibold uppercase tracking-widest mt-0.5">Write</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#b2533e]">{deleteCount}</p>
                    <p className="text-[6.5px] text-neutral-400 font-semibold uppercase tracking-widest mt-0.5">Delete</p>
                  </div>
                </div>

                {/* Permission visibility bar */}
                <div className="my-4">
                  <div className="flex items-center justify-between text-[7px] text-neutral-400 font-bold uppercase tracking-widest mb-1.5">
                    <span>Access ({writeCount}/{sections.length})</span>
                  </div>
                  <div className="h-1 bg-neutral-200 rounded-none overflow-hidden">
                    <div className="h-full bg-[#224870] transition-all" style={{ width: `${(writeCount / sections.length) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-neutral-200/60 mt-4">
                <span className="text-[7.5px] font-bold text-neutral-400 uppercase tracking-widest">
                  {r.permissions.every(p => p.read) ? "Full visibility" : `ReadOnly in ${readOnlyCount} sec`}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => setSelectedRoleDetails(r)} className="text-[#224870] hover:text-[#224870]/85 text-[8.5px] font-black uppercase tracking-widest cursor-pointer bg-transparent border-none p-0 transition-colors">View Access</button>
                  <button onClick={() => openEdit(r)} className="text-[#615e56] hover:text-[#382d24] text-[8.5px] font-black uppercase tracking-widest cursor-pointer bg-transparent border-none p-0 transition-colors">Edit</button>
                  {r.name !== "Super Admin" && (
                    <button onClick={() => setDeleteId(r.id)} className="text-[#b2533e] hover:text-red-700 text-[8.5px] font-black uppercase tracking-widest cursor-pointer bg-transparent border-none p-0 transition-colors">Delete</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Side-by-Side Role Comparison Modal Overlay ───────────────── */}
      {showComparison && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowComparison(false)}>
          <div className="bg-card border border-neutral-300 w-full max-w-2xl p-6 shadow-2xl rounded-none animate-scale-in max-h-[90vh] flex flex-col justify-between" onClick={e => e.stopPropagation()}>
            <div>
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3.5 mb-5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#382d24] flex items-center gap-1.5">
                    <Columns className="w-4 h-4 text-[#224870]" /> Side-by-Side Role Comparer
                  </h3>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">Cross-check access differences between selected credentials</span>
                </div>
                <button onClick={() => setShowComparison(false)} className="text-neutral-450 hover:text-black bg-transparent border-none p-1 cursor-pointer font-bold">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 mb-5 bg-[#faf8f5] p-3 border border-neutral-200/60">
                <select value={compRole1Id} onChange={e => setCompRole1Id(Number(e.target.value))} className="bg-card border border-neutral-300 px-3 py-1.5 text-[9.5px] font-bold uppercase cursor-pointer text-[#382d24] rounded-none flex-1 min-w-0">
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest shrink-0">VS</span>
                <select value={compRole2Id} onChange={e => setCompRole2Id(Number(e.target.value))} className="bg-card border border-neutral-300 px-3 py-1.5 text-[9.5px] font-bold uppercase cursor-pointer text-[#382d24] rounded-none flex-1 min-w-0">
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div className="overflow-y-auto max-h-[50vh] border border-neutral-200/60">
                <table className="w-full text-[9.5px] font-bold text-left uppercase tracking-wider border-collapse">
                  <thead>
                    <tr className="bg-[#faf8f5] border-b border-neutral-200/60 text-[8px] text-[#615e56] tracking-widest sticky top-0 z-10">
                      <th className="p-3 font-bold">Section module</th>
                      <th className="p-3 text-center border-l border-neutral-200/60 font-bold w-[35%]">{role1?.name} (R/W/D)</th>
                      <th className="p-3 text-center border-l border-neutral-200/60 font-bold w-[35%]">{role2?.name} (R/W/D)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/40">
                    {sections.map(s => {
                      const p1 = role1?.permissions.find(p => p.section === s);
                      const p2 = role2?.permissions.find(p => p.section === s);
                      return (
                        <tr key={s} className="hover:bg-neutral-50/40 transition-colors">
                          <td className="p-3 text-[#382d24] font-semibold">{s}</td>
                          <td className="p-3 text-center border-l border-neutral-200/60 font-mono text-[9px]">
                            {p1 ? (
                              <span className="flex items-center justify-center gap-1.5">
                                <span className={p1.read ? "text-green-700 font-extrabold" : "text-neutral-300"}>R</span>
                                <span className="text-neutral-300">/</span>
                                <span className={p1.write ? "text-amber-750 font-extrabold" : "text-neutral-300"}>W</span>
                                <span className="text-neutral-300">/</span>
                                <span className={p1.delete ? "text-[#b2533e] font-extrabold" : "text-neutral-300"}>D</span>
                              </span>
                            ) : "—"}
                          </td>
                          <td className="p-3 text-center border-l border-neutral-200/60 font-mono text-[9px]">
                            {p2 ? (
                              <span className="flex items-center justify-center gap-1.5">
                                <span className={p2.read ? "text-green-700 font-extrabold" : "text-neutral-300"}>R</span>
                                <span className="text-neutral-300">/</span>
                                <span className={p2.write ? "text-amber-750 font-extrabold" : "text-neutral-300"}>W</span>
                                <span className="text-neutral-300">/</span>
                                <span className={p2.delete ? "text-[#b2533e] font-extrabold" : "text-neutral-300"}>D</span>
                              </span>
                            ) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200/60 mt-5 shrink-0">
              <button onClick={() => setShowComparison(false)} className="border border-neutral-300 hover:border-[#382d24] text-neutral-500 text-[9px] font-semibold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none">Close Comparer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Role Details Side Drawer Panel ───────────────────────────── */}
      {selectedRoleDetails && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs z-50 flex justify-end animate-fade-in" onClick={() => setSelectedRoleDetails(null)}>
          <div className="bg-card border-l border-neutral-350 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="space-y-6 flex-1 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#382d24]">{selectedRoleDetails.name} Access</h3>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Permissions Summary Grid</span>
                </div>
                <button onClick={() => setSelectedRoleDetails(null)} className="text-neutral-450 hover:text-black bg-transparent border-none cursor-pointer p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-[#615e56] leading-relaxed font-bold uppercase tracking-wider">
                  Detailed list of permissions authorized for this credential:
                </p>

                <div className="border border-neutral-200/60 overflow-hidden">
                  <table className="w-full text-left uppercase text-[9.5px] font-bold tracking-wider border-collapse">
                    <thead>
                      <tr className="bg-[#faf8f5] border-b border-neutral-200/60 text-[7.5px] text-[#615e56] tracking-widest">
                        <th className="p-3 font-bold text-left">Module</th>
                        <th className="p-3 text-center w-[18%]">Read</th>
                        <th className="p-3 text-center w-[18%]">Write</th>
                        <th className="p-3 text-center w-[18%]">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/40">
                      {selectedRoleDetails.permissions.map((p, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/20 transition-colors">
                          <td className="p-3 font-bold text-neutral-750 normal-case tracking-normal whitespace-nowrap">
                            {p.section}
                          </td>
                          {(["read", "write", "delete"] as const).map(type => (
                            <td key={type} className="p-3 text-center">
                              <div className="flex justify-center">
                                {p[type] ? (
                                  <span className={`w-2 h-2 rounded-full ${
                                    type === "read" ? "bg-green-600" : type === "write" ? "bg-amber-600" : "bg-[#b2533e]"
                                  }`} title="Authorized" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-neutral-200" title="Unauthorized" />
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200/60 pt-4 mt-4">
              <button onClick={() => setSelectedRoleDetails(null)} className="w-full border border-neutral-300 hover:border-[#382d24] text-[9.5px] font-bold uppercase py-3 tracking-widest bg-transparent cursor-pointer rounded-none text-[#382d24] transition-colors">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-neutral-300 w-full max-w-3xl mx-4 p-6 my-8 rounded-none shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3.5 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <UserCog className="w-4 h-4 text-[#224870]" />
                {editRole ? "Edit Role Authority" : "Create New Role Authority"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-450 hover:text-black cursor-pointer bg-transparent border-none p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error alerts */}
            {isDuplicateName && (
              <div className="bg-red-50 border border-red-500/20 text-red-700 p-3 text-[9px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Error: Role name "{form.name}" already exists. Please choose a unique name.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Role Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-neutral-300 px-3.5 py-2 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none bg-[#faf8f5] text-[#382d24]" placeholder="e.g. Collections Manager" />
              </div>
              <div className="space-y-1">
                <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-300 px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none bg-[#faf8f5] text-[#382d24]" placeholder="e.g. Manages products and content" />
              </div>
              <div className="space-y-1">
                <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Pre-built Template</label>
                <select 
                  value={selectedTemplateIndex}
                  onChange={e => handleTemplateChange(Number(e.target.value))}
                  disabled={editRole !== null}
                  className="w-full border border-neutral-300 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#224870] rounded-none bg-[#faf8f5] uppercase cursor-pointer text-[#382d24]"
                >
                  {PREBUILT_TEMPLATES.map((t, idx) => (
                    <option key={idx} value={idx}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Permission Matrix */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 gap-2.5">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search sections..." 
                    value={modalSearch} 
                    onChange={e => setModalSearch(e.target.value)} 
                    className="border border-neutral-300 bg-[#faf8f5] pl-8.5 pr-3 py-1.5 text-[8.5px] uppercase tracking-wider w-52 focus:outline-none focus:border-[#224870] text-[#382d24]"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                </div>
                <div className="flex gap-3.5 text-[8px] font-black tracking-widest text-[#615e56] uppercase">
                  <button onClick={() => setAll("read", !formPerms.every(p => p.read))} className="hover:text-[#224870] cursor-pointer bg-transparent border-none transition-colors">Toggle Read</button>
                  <button onClick={() => setAll("write", !formPerms.every(p => p.write))} className="hover:text-[#224870] cursor-pointer bg-transparent border-none transition-colors">Toggle Write</button>
                  <button onClick={() => setAll("delete", !formPerms.every(p => p.delete))} className="hover:text-[#224870] cursor-pointer bg-transparent border-none transition-colors">Toggle Delete</button>
                </div>
              </div>
              <div className="border border-neutral-300 overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-[9.5px] font-bold uppercase border-collapse">
                  <thead>
                    <tr className="bg-[#faf8f5] text-[8px] text-[#615e56] tracking-[0.2em] uppercase border-b border-neutral-200 sticky top-0 z-10">
                      <th className="p-3 font-bold">Section</th>
                      <th className="p-3 font-bold text-center w-[18%]">Read</th>
                      <th className="p-3 font-bold text-center w-[18%]">Write</th>
                      <th className="p-3 font-bold text-center w-[18%]">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/40">
                    {filteredFormPerms.map(p => (
                      <tr key={p.section} className="hover:bg-neutral-50/20 transition-colors">
                        <td className="p-3 font-bold text-neutral-700">{p.section}</td>
                        {(["read", "write", "delete"] as const).map(f => (
                          <td key={f} className="p-3 text-center">
                            <div className="flex justify-center">
                              <button onClick={() => togglePerm(p.section, f)}
                                className={`w-4.5 h-4.5 border flex items-center justify-center cursor-pointer transition-colors rounded-none ${
                                  p[f] ? "bg-[#224870] border-[#224870] text-white" : "bg-transparent border-neutral-300 text-neutral-400 hover:border-neutral-450"
                                }`}>
                                {p[f] && <Check className="w-3 h-3 stroke-[3.5] text-white" />}
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200/60">
              <button onClick={() => setShowModal(false)} className="border border-neutral-300 hover:border-[#382d24] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} disabled={isDuplicateName} className="bg-[#224870] hover:bg-[#224870]/90 disabled:opacity-30 disabled:hover:bg-[#224870] text-white text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase cursor-pointer rounded-none border-none transition-colors">{editRole ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-neutral-300 p-6 max-w-sm mx-4 rounded-none shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-[#382d24]">Delete Role?</h3>
            <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider mb-4 leading-relaxed">This will remove the role permanently. This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-300 hover:border-[#382d24] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={() => { setRoles(roles.filter(r => r.id !== deleteId)); setDeleteId(null); }} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
