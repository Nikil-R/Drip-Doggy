import { useState } from "react";
import { Shield, Plus, Trash2, X, Check, AlertTriangle, UserCog, Users, Lock, UserCheck } from "lucide-react";

const RS = "\u20B9";

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

const SECTIONS = [
  "Dashboard", "Orders", "Products", "Customers", "Coupons",
  "Categories", "Brands", "Content", "Analytics", "Settings",
  "Roles", "Media", "Shipping", "Reviews"
];

const defaultPermissions = (read = true, write = false, del = false): Permission[] =>
  SECTIONS.map(s => ({ section: s, read, write, delete: del }));

const initialRoles: AdminRole[] = [
  {
    id: 1, name: "Super Admin", description: "Full system access to all Drip Doggy operations",
    permissions: SECTIONS.map(s => ({ section: s, read: true, write: true, delete: true })),
    adminCount: 2
  },
  {
    id: 2, name: "Collections Manager", description: "Manage products, categories, brands, and content editor",
    permissions: SECTIONS.map(s => ({
      section: s, read: true,
      write: ["Products", "Categories", "Brands", "Content", "Media"].includes(s),
      delete: s === "Content"
    })),
    adminCount: 3
  },
  {
    id: 3, name: "Order Ops", description: "Process orders, manage customers, and shipping",
    permissions: SECTIONS.map(s => ({
      section: s, read: true,
      write: ["Orders", "Customers", "Shipping", "Reviews"].includes(s),
      delete: false
    })),
    adminCount: 4
  },
  {
    id: 4, name: "Marketing", description: "Analytics, coupons, dashboard, and content editor",
    permissions: SECTIONS.map(s => ({
      section: s, read: true,
      write: ["Dashboard", "Analytics", "Coupons", "Content"].includes(s),
      delete: false
    })),
    adminCount: 2
  },
  {
    id: 5, name: "View Only", description: "Read-only access across all sections",
    permissions: SECTIONS.map(s => ({
      section: s, read: true, write: false, delete: false
    })),
    adminCount: 6
  },
];

export function ControlAuthorityPage() {
  const [roles, setRoles] = useState<AdminRole[]>(initialRoles);
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState<AdminRole | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [formPerms, setFormPerms] = useState<Permission[]>(defaultPermissions(false, false, false));

  // ── KPI Stats ─────────────────────────────────────────────────────
  const totalAdmins = roles.reduce((s, r) => s + r.adminCount, 0);
  const writableSections = roles.filter(r => r.permissions.some(p => p.write)).length;
  const fullAccessRoles = roles.filter(r => r.permissions.every(p => p.delete)).length;

  const kpis = [
    { label: "Total Roles", value: roles.length.toString(), icon: Shield, color: "text-[#030213]" },
    { label: "Total Admins", value: totalAdmins.toString(), icon: Users, color: "text-[#030213]" },
    { label: "Full Access", value: fullAccessRoles.toString(), icon: UserCheck, color: "text-amber-700" },
    { label: "Permissions", value: (SECTIONS.length * roles.length).toString(), icon: Lock, color: "text-[#030213]" },
  ];

  const openAdd = () => {
    setEditRole(null);
    setForm({ name: "", description: "" });
    setFormPerms(defaultPermissions(true, false, false));
    setShowModal(true);
  };

  const openEdit = (role: AdminRole) => {
    setEditRole(role);
    setForm({ name: role.name, description: role.description });
    setFormPerms([...role.permissions]);
    setShowModal(true);
  };

  const togglePerm = (section: string, field: "read" | "write" | "delete") => {
    setFormPerms(formPerms.map(p => p.section === section ? { ...p, [field]: !p[field] } : p));
  };

  const setAll = (field: "read" | "write" | "delete", value: boolean) => {
    setFormPerms(formPerms.map(p => ({ ...p, [field]: value })));
  };

  const save = () => {
    if (!form.name) return;
    if (editRole) {
      setRoles(roles.map(r => r.id === editRole.id ? { ...r, ...form, permissions: formPerms } : r));
    } else {
      setRoles([...roles, { ...form, id: Date.now(), permissions: formPerms, adminCount: 0 }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Control Authority</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy admin roles &amp; permission management
          </p>
        </div>
        <button onClick={openAdd} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none">
          <Plus className="w-3.5 h-3.5" /> Add Role
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
            <kpi.icon className="w-5 h-5 text-neutral-400 shrink-0" />
            <div>
              <p className={`text-lg font-black ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Role Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(r => {
          const writeCount = r.permissions.filter(p => p.write).length;
          const deleteCount = r.permissions.filter(p => p.delete).length;
          return (
            <div key={r.id} className="bg-white border border-neutral-200/80 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#030213] flex items-center justify-center">
                  <UserCog className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-wide">{r.name}</h3>
                  <p className="text-[8px] text-neutral-400 font-bold">{r.description}</p>
                </div>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-neutral-100 text-center">
                <div>
                  <p className="text-[11px] font-black text-[#030213]">{r.adminCount}</p>
                  <p className="text-[6px] text-neutral-400 font-extrabold uppercase tracking-widest">Admins</p>
                </div>
                <div className="border-x border-neutral-100">
                  <p className="text-[11px] font-black text-green-700">{writeCount}</p>
                  <p className="text-[6px] text-neutral-400 font-extrabold uppercase tracking-widest">Write</p>
                </div>
                <div>
                  <p className="text-[11px] font-black text-[#b2533e]">{deleteCount}</p>
                  <p className="text-[6px] text-neutral-400 font-extrabold uppercase tracking-widest">Delete</p>
                </div>
              </div>

              {/* Permission visibility bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[7px] text-neutral-400 font-extrabold uppercase tracking-widest mb-1">
                  <span>Access ({writeCount}/{SECTIONS.length})</span>
                </div>
                <div className="h-2 bg-neutral-100 flex">
                  <div className="h-full bg-[#030213] transition-all" style={{ width: (writeCount / SECTIONS.length) * 100 + "%" }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span className="text-[8px] font-bold text-neutral-400">
                  {r.permissions.every(p => p.read) ? "All sections visible" : "Restricted access"}
                </span>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(r)} className="text-neutral-400 hover:text-[#030213] text-[8px] font-extrabold tracking-widest uppercase cursor-pointer bg-transparent border-none">Edit</button>
                  <button onClick={() => setDeleteId(r.id)} className="text-neutral-400 hover:text-[#b2533e] text-[8px] font-extrabold tracking-widest uppercase cursor-pointer bg-transparent border-none">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add/Edit Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white border border-neutral-200 w-full max-w-3xl mx-4 p-6 my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-[#030213] uppercase tracking-widest">{editRole ? "Edit Role" : "Add Role"}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none"><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Role Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" placeholder="e.g. Collections Manager" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" placeholder="e.g. Manages products and content" />
              </div>
            </div>

            {/* Permission Matrix */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Permissions — {SECTIONS.length} sections</span>
                <div className="flex gap-3 text-[7px] font-extrabold tracking-widest text-neutral-400 uppercase">
                  <button onClick={() => setAll("read", !formPerms.every(p => p.read))} className="hover:text-[#030213] cursor-pointer bg-transparent border-none">Toggle Read</button>
                  <button onClick={() => setAll("write", !formPerms.every(p => p.write))} className="hover:text-[#030213] cursor-pointer bg-transparent border-none">Toggle Write</button>
                  <button onClick={() => setAll("delete", !formPerms.every(p => p.delete))} className="hover:text-[#030213] cursor-pointer bg-transparent border-none">Toggle Delete</button>
                </div>
              </div>
              <div className="border border-neutral-200/80 overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-[9px] font-bold">
                  <thead>
                    <tr className="bg-[#faf8f5] text-[8px] text-neutral-400 tracking-[0.2em] uppercase sticky top-0">
                      <th className="p-3 font-black">Section</th>
                      <th className="p-3 font-black text-center">Read</th>
                      <th className="p-3 font-black text-center">Write</th>
                      <th className="p-3 font-black text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {formPerms.map(p => (
                      <tr key={p.section} className="hover:bg-neutral-50/50">
                        <td className="p-3 font-bold text-[#030213]">{p.section}</td>
                        {(["read", "write", "delete"] as const).map(f => (
                          <td key={f} className="p-3 text-center">
                            <button onClick={() => togglePerm(p.section, f)}
                              className={`w-6 h-6 flex items-center justify-center cursor-pointer border-none ${
                                p[f] ? "bg-[#030213] text-white" : "bg-neutral-100 text-neutral-300"
                              }`}>
                              {p[f] ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">{editRole ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-white border border-neutral-200 p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-sm font-black text-[#030213] uppercase tracking-widest mb-2">Delete Role?</h3>
            <p className="text-[9px] text-neutral-500 mb-4">This will remove the role permanently.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none">Cancel</button>
              <button onClick={() => { setRoles(roles.filter(r => r.id !== deleteId)); setDeleteId(null); }} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
