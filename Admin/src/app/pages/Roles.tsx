import { useState } from "react";
import {
  Shield,
  ShieldAlert,
  Users,
  Search,
  Mail,
  UserPlus,
  Check,
  Trash2,
  Edit,
  X
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  lastActive: string;
  permissionsCount: number;
}

interface RolePermission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
}

const SECTIONS = [
  "Dashboard & Analytics",
  "Products Management",
  "Order Management",
  "Customer Base",
  "Content Editor",
  "Media & Assets",
  "Coupons & Promotions",
  "Reviews & Feedback",
  "Settings & System"
];

export function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState("Super Admin");

  // ─── Drip Doggy Admin Users ────────────────────────────────────────────
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: "DD-ADM-001", name: "Jeshwanth Jesh", email: "jeshwanth@dripdoggy.com", role: "Super Admin", status: "Active", lastActive: "Just now", permissionsCount: 27 },
    { id: "DD-ADM-002", name: "Ananya Sharma", email: "ananya@dripdoggy.com", role: "Collections Manager", status: "Active", lastActive: "2 hours ago", permissionsCount: 18 },
    { id: "DD-ADM-003", name: "Rahul Verma", email: "rahul@dripdoggy.com", role: "Order Ops", status: "Active", lastActive: "Yesterday", permissionsCount: 12 },
    { id: "DD-ADM-004", name: "Priya Kapoor", email: "priya@dripdoggy.com", role: "Marketing", status: "Pending", lastActive: "Invited 1 day ago", permissionsCount: 6 },
    { id: "DD-ADM-005", name: "Aditya Joshi", email: "aditya@dripdoggy.com", role: "Order Ops", status: "Inactive", lastActive: "5 days ago", permissionsCount: 12 },
    { id: "DD-ADM-006", name: "Neha Gupta", email: "neha@dripdoggy.com", role: "View Only", status: "Active", lastActive: "3 days ago", permissionsCount: 9 }
  ]);

  // ─── Drip Doggy Role Permission Matrices ───────────────────────────────
  const [rolePermissions, setRolePermissions] = useState<Record<string, RolePermission[]>>({
    "Super Admin": SECTIONS.map(s => ({ module: s, read: true, write: true, delete: true })),
    "Collections Manager": SECTIONS.map(s => ({
      module: s, read: true,
      write: ["Products Management", "Content Editor", "Media & Assets"].includes(s),
      delete: s === "Content Editor"
    })),
    "Order Ops": SECTIONS.map(s => ({
      module: s, read: true,
      write: ["Order Management", "Customer Base", "Reviews & Feedback"].includes(s),
      delete: false
    })),
    "Marketing": SECTIONS.map(s => ({
      module: s, read: true,
      write: ["Dashboard & Analytics", "Coupons & Promotions", "Content Editor"].includes(s),
      delete: false
    })),
    "View Only": SECTIONS.map(s => ({ module: s, read: true, write: false, delete: false }))
  });

  const togglePermission = (role: string, moduleIndex: number, type: "read" | "write" | "delete") => {
    setRolePermissions(prev => {
      const updated = { ...prev };
      const currentList = [...updated[role]];
      currentList[moduleIndex] = {
        ...currentList[moduleIndex],
        [type]: !currentList[moduleIndex][type]
      };
      updated[role] = currentList;
      return updated;
    });
  };

  const handleInviteAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    const permMap: Record<string, number> = {
      "Super Admin": 27, "Collections Manager": 18, "Order Ops": 12,
      "Marketing": 6, "View Only": 9
    };

    const newAdmin: AdminUser = {
      id: `DD-ADM-00${admins.length + 1}`,
      name, email, role,
      status: "Pending",
      lastActive: "Invited just now",
      permissionsCount: permMap[role] || 9
    };

    setAdmins(prev => [...prev, newAdmin]);
    setIsInviteModalOpen(false);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleList = Object.keys(rolePermissions);
  const activeCount = admins.filter(a => a.status === "Active").length;
  const pendingCount = admins.filter(a => a.status === "Pending").length;

  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Admin Roles</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy team permissions &amp; security control
          </p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase transition-colors cursor-pointer rounded-none border-none flex items-center gap-1.5"
        >
          <UserPlus className="h-4 w-4" />
          Invite Admin
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-black text-neutral-400 uppercase tracking-widest">Total Staff</span>
            <Users className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-black text-[#030213] mt-2">{admins.length}</p>
          <p className="text-[8px] text-neutral-400 font-bold mt-1">{activeCount} active members</p>
        </div>

        <div className="bg-white border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-black text-neutral-400 uppercase tracking-widest">Active Roles</span>
            <Shield className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-black text-[#030213] mt-2">{roleList.length}</p>
          <p className="text-[8px] text-neutral-400 font-bold mt-1">Super Admin, Collections Mgr, Order Ops, Marketing, View Only</p>
        </div>

        <div className="bg-white border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-black text-neutral-400 uppercase tracking-widest">Pending Invites</span>
            <Mail className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingCount}</p>
          <p className="text-[8px] text-neutral-400 font-bold mt-1">Awaiting response</p>
        </div>

        <div className="bg-white border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-black text-neutral-400 uppercase tracking-widest">Security</span>
            <ShieldAlert className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-black text-green-700 mt-2">Secured</p>
          <p className="text-[8px] text-neutral-400 font-bold mt-1">OAuth + 2FA enabled</p>
        </div>
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ─── Left Column: Admin Users Table ─────────────────────────── */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase">Team Members</h3>
            <div className="relative">
              <input type="text" placeholder="Search team..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-neutral-200/80 pl-8 pr-3 py-1.5 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-48" />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider">
              <thead>
                <tr className="border-b border-neutral-100 text-[8px] text-neutral-400 tracking-[0.2em]">
                  <th className="pb-3 font-black">User</th>
                  <th className="pb-3 font-black">Role</th>
                  <th className="pb-3 font-black">Status</th>
                  <th className="pb-3 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100/50">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#030213] text-white flex items-center justify-center text-[10px] font-black">
                          {admin.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#030213] text-[9px]">{admin.name}</p>
                          <p className="text-[7px] text-neutral-400 font-semibold lowercase">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-[7px] font-extrabold tracking-widest bg-neutral-50 border border-neutral-200 px-2 py-0.5 uppercase">
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[8px] font-extrabold tracking-widest uppercase ${
                        admin.status === "Active" ? "text-green-700" :
                        admin.status === "Pending" ? "text-blue-700" : "text-neutral-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          admin.status === "Active" ? "bg-green-600" :
                          admin.status === "Pending" ? "bg-blue-500" : "bg-neutral-300"
                        }`} />
                        {admin.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-neutral-400 hover:text-red-600 p-1.5 bg-transparent border-none cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── Right Column: Permissions Matrix ─────────────────────────── */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/80 p-6 space-y-5">
          <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
            <h3 className="text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase">Permissions</h3>
            <select value={selectedRoleForMatrix}
              onChange={(e) => setSelectedRoleForMatrix(e.target.value)}
              className="bg-[#faf8f5] border border-neutral-200 px-2 py-1 text-[9px] font-extrabold focus:outline-none focus:border-[#030213] uppercase appearance-none cursor-pointer pr-6">
              {roleList.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <p className="text-[8px] text-neutral-400 leading-relaxed font-bold uppercase tracking-wider">
            Fine-tune permissions for <strong className="text-[#030213]">{selectedRoleForMatrix}</strong>
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-12 text-[7px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
              <span className="col-span-6">Module</span>
              <span className="col-span-2 text-center">Read</span>
              <span className="col-span-2 text-center">Write</span>
              <span className="col-span-2 text-center">Delete</span>
            </div>

            {rolePermissions[selectedRoleForMatrix]?.map((perm, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center text-[8px] border-b border-neutral-100/50 pb-2.5 last:border-none">
                <span className="col-span-6 font-extrabold text-neutral-700">{perm.module}</span>
                {(["read", "write", "delete"] as const).map(type => (
                  <span key={type} className="col-span-2 flex justify-center">
                    <button type="button"
                      onClick={() => togglePermission(selectedRoleForMatrix, idx, type)}
                      className={`w-4 h-4 border cursor-pointer flex items-center justify-center transition-colors ${
                        perm[type] ? "bg-[#030213] border-[#030213] text-white" : "border-neutral-200 hover:border-neutral-400"
                      }`}>
                      {perm[type] && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100">
            <button className="bg-[#030213] hover:bg-neutral-800 text-white text-[8px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">
              Save Permissions
            </button>
          </div>
        </div>

      </div>

      {/* ── Invite Modal ──────────────────────────────────────────────── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-[#030213]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-[12px] font-black text-[#030213] uppercase tracking-widest">Invite Admin</h3>
              <button onClick={() => setIsInviteModalOpen(false)}
                className="text-neutral-400 hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Full Name</label>
                <input type="text" name="name" required placeholder="e.g. Ananya Sharma"
                  className="w-full bg-white border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213]" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Email</label>
                <input type="email" name="email" required placeholder="e.g. name@dripdoggy.com"
                  className="w-full bg-white border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213]" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Role</label>
                <select name="role"
                  className="w-full bg-white border border-neutral-200/80 px-3 py-2 text-[9px] font-extrabold focus:outline-none focus:border-[#030213] uppercase appearance-none cursor-pointer">
                  {roleList.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button type="button" onClick={() => setIsInviteModalOpen(false)}
                  className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer border-none">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
