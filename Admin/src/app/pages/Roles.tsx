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
  X,
  Lock,
  Clock,
  UserX,
  UserCheck,
  Copy,
  Plus,
  HelpCircle
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  lastActive: string;
  lastLoginIP: string;
  permissionsCount: number;
  twoFactorEnabled: boolean;
  department: "Tech" | "Operations" | "Cataloging" | "Marketing" | "Executive";
}

interface RolePermission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
}

interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

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

const INITIAL_SECTIONS = [
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

const initialAuditLogs: AuditLog[] = [
  { timestamp: "2026-06-23 14:12:05", user: "Nikil (Super Admin)", action: "EDIT_PERMISSIONS", details: "Updated write access for Collections Manager on Content Editor" },
  { timestamp: "2026-06-23 11:45:22", user: "Nikil (Super Admin)", action: "INVITE_STAFF", details: "Invited Priya Kapoor (Marketing) to department Marketing" },
  { timestamp: "2026-06-22 09:30:00", user: "Ananya Sharma", action: "LOGIN", details: "Successful authentication from IP 192.168.1.15" },
  { timestamp: "2026-06-21 16:04:18", user: "Rahul Verma", action: "REVOKE_SESSION", details: "Forced session termination for Aditya Joshi" }
];

export function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState("Super Admin");
  const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);
  
  // Modals state
  const [statusChangeUser, setStatusChangeUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [sessionRevokeUser, setSessionRevokeUser] = useState<AdminUser | null>(null);
  
  // Role cloning state
  const [cloneRoleName, setCloneRoleName] = useState("");
  const [showCloneModal, setShowCloneModal] = useState(false);

  // Custom permission sections state
  const [customSections, setCustomSections] = useState<string[]>(INITIAL_SECTIONS);
  const [newSectionName, setNewSectionName] = useState("");

  // Audit Logs drawer state
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // ─── Drip Doggy Admin Users ────────────────────────────────────────────
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: "DD-ADM-001", name: "Nikil", email: "nikil@dripdoggy.com", role: "Super Admin", status: "Active", lastActive: "Just now", lastLoginIP: "103.24.12.87", permissionsCount: 27, twoFactorEnabled: true, department: "Executive" },
    { id: "DD-ADM-002", name: "Ananya Sharma", email: "ananya@dripdoggy.com", role: "Collections Manager", status: "Active", lastActive: "2 hours ago", lastLoginIP: "192.168.1.15", permissionsCount: 18, twoFactorEnabled: true, department: "Cataloging" },
    { id: "DD-ADM-003", name: "Rahul Verma", email: "rahul@dripdoggy.com", role: "Order Ops", status: "Active", lastActive: "Yesterday", lastLoginIP: "103.45.98.201", permissionsCount: 12, twoFactorEnabled: false, department: "Operations" },
    { id: "DD-ADM-004", name: "Priya Kapoor", email: "priya@dripdoggy.com", role: "Marketing", status: "Pending", lastActive: "Invited 1 day ago", lastLoginIP: "—", permissionsCount: 6, twoFactorEnabled: false, department: "Marketing" },
    { id: "DD-ADM-005", name: "Aditya Joshi", email: "aditya@dripdoggy.com", role: "Order Ops", status: "Inactive", lastActive: "5 days ago", lastLoginIP: "122.160.8.44", permissionsCount: 12, twoFactorEnabled: false, department: "Operations" },
    { id: "DD-ADM-006", name: "Neha Gupta", email: "neha@dripdoggy.com", role: "View Only", status: "Active", lastActive: "3 days ago", lastLoginIP: "192.168.1.48", permissionsCount: 9, twoFactorEnabled: true, department: "Tech" }
  ]);

  // ─── Drip Doggy Role Permission Matrices ───────────────────────────────
  const [rolePermissions, setRolePermissions] = useState<Record<string, RolePermission[]>>({
    "Super Admin": customSections.map(s => ({ module: s, read: true, write: true, delete: true })),
    "Collections Manager": customSections.map(s => ({
      module: s, read: true,
      write: ["Products Management", "Content Editor", "Media & Assets"].includes(s),
      delete: s === "Content Editor"
    })),
    "Order Ops": customSections.map(s => ({
      module: s, read: true,
      write: ["Order Management", "Customer Base", "Reviews & Feedback"].includes(s),
      delete: false
    })),
    "Marketing": customSections.map(s => ({
      module: s, read: true,
      write: ["Dashboard & Analytics", "Coupons & Promotions", "Content Editor"].includes(s),
      delete: false
    })),
    "View Only": customSections.map(s => ({ module: s, read: true, write: false, delete: false }))
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

  // Add a brand-new granular permission section (Custom Section)
  const handleAddCustomSection = () => {
    if (!newSectionName.trim() || customSections.includes(newSectionName)) return;
    const updatedSections = [...customSections, newSectionName.trim()];
    setCustomSections(updatedSections);

    // Update permission matrix for all roles
    setRolePermissions(prev => {
      const copy = { ...prev };
      Object.keys(copy).forEach(role => {
        copy[role] = [...copy[role], { module: newSectionName.trim(), read: role === "Super Admin", write: role === "Super Admin", delete: role === "Super Admin" }];
      });
      return copy;
    });

    const newLog: AuditLog = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: "Nikil (Super Admin)",
      action: "ADD_PERMISSION_MODULE",
      details: `Added new granular module: ${newSectionName}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setNewSectionName("");
  };

  // Duplicate / Clone Existing Role Matrix
  const handleCloneRole = () => {
    if (!cloneRoleName.trim() || rolePermissions[cloneRoleName]) return;
    const currentMatrix = rolePermissions[selectedRoleForMatrix] || [];
    
    setRolePermissions(prev => ({
      ...prev,
      [cloneRoleName.trim()]: currentMatrix.map(m => ({ ...m }))
    }));

    const newLog: AuditLog = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: "Nikil (Super Admin)",
      action: "CLONE_ROLE",
      details: `Cloned role "${selectedRoleForMatrix}" as "${cloneRoleName.trim()}"`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setSelectedRoleForMatrix(cloneRoleName.trim());
    setCloneRoleName("");
    setShowCloneModal(false);
  };

  const handleInviteAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const dept = formData.get("department") as any;

    const newAdmin: AdminUser = {
      id: `DD-ADM-00${admins.length + 1}`,
      name, email, role,
      status: "Pending",
      lastActive: "Invited just now",
      lastLoginIP: "—",
      permissionsCount: rolePermissions[role]?.filter(p => p.write).length * 3 || 9,
      twoFactorEnabled: false,
      department: dept
    };

    setAdmins(prev => [...prev, newAdmin]);
    
    // Add audit log
    const newLog: AuditLog = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: "Nikil (Super Admin)",
      action: "INVITE_STAFF",
      details: `Invited ${name} (${role}) to ${dept} team`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setIsInviteModalOpen(false);
  };

  const toggleUserStatus = (user: AdminUser) => {
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";
    setAdmins(prev => prev.map(a => a.id === user.id ? { ...a, status: nextStatus } : a));
    
    const newLog: AuditLog = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: "Nikil (Super Admin)",
      action: nextStatus === "Active" ? "ACTIVATE_STAFF" : "DEACTIVATE_STAFF",
      details: `${nextStatus === "Active" ? "Activated" : "Deactivated"} access for ${user.name}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setStatusChangeUser(null);
  };

  const handleUpdateUser = (updatedUser: AdminUser) => {
    setAdmins(prev => prev.map(a => a.id === updatedUser.id ? updatedUser : a));
    const newLog: AuditLog = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: "Nikil (Super Admin)",
      action: "UPDATE_STAFF",
      details: `Updated info / 2FA status for ${updatedUser.name}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setEditUser(null);
  };

  const handleDeleteAdmin = () => {
    if (!deleteUser) return;
    setAdmins(prev => prev.filter(a => a.id !== deleteUser.id));
    const newLog: AuditLog = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: "Nikil (Super Admin)",
      action: "DELETE_STAFF",
      details: `Deleted admin member: ${deleteUser.name}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setDeleteUser(null);
  };

  const handleForceRevokeSession = () => {
    if (!sessionRevokeUser) return;
    setAdmins(prev => prev.map(a => a.id === sessionRevokeUser.id ? { ...a, lastActive: "Session Revoked" } : a));
    const newLog: AuditLog = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: "Nikil (Super Admin)",
      action: "REVOKE_SESSION",
      details: `Forced logout and revoked session token for ${sessionRevokeUser.name}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setSessionRevokeUser(null);
  };

  const handleSavePermissions = () => {
    alert(`Permissions matrix updated successfully for: ${selectedRoleForMatrix}`);
    const newLog: AuditLog = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: "Nikil (Super Admin)",
      action: "EDIT_PERMISSIONS",
      details: `Saved changes to permission matrix for ${selectedRoleForMatrix}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleList = Object.keys(rolePermissions);
  const activeCount = admins.filter(a => a.status === "Active").length;
  const pendingCount = admins.filter(a => a.status === "Pending").length;
  const twoFaRate = Math.round((admins.filter(a => a.twoFactorEnabled).length / admins.length) * 100);

  return (
    <div className="space-y-8 font-sans text-[#030213]">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200/60">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest">Admin Roles</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy team permissions &amp; security control
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAuditLogs(true)}
            className="border border-neutral-200 hover:border-[#030213] text-[#030213] text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase transition-colors cursor-pointer rounded-none bg-transparent flex items-center gap-1.5"
          >
            <Clock className="h-3.5 w-3.5" />
            Audit Logs
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase transition-colors cursor-pointer rounded-none border-none flex items-center gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite Admin
          </button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[105px] rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest">Total Staff</span>
            <Users className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xl font-bold text-[#030213] mt-2">{admins.length}</p>
          <p className="text-[8px] text-neutral-400 font-bold mt-1 uppercase tracking-wider">{activeCount} active members</p>
        </div>

        <div className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[105px] rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest">Active Roles</span>
            <Shield className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xl font-bold text-[#030213] mt-2">{roleList.length}</p>
          <p className="text-[8px] text-neutral-400 font-bold mt-1 uppercase tracking-wider">{roleList.slice(0, 3).join(", ")}...</p>
        </div>

        <div className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[105px] rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest">Pending Invites</span>
            <Mail className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-xl font-bold text-amber-600 mt-2">{pendingCount}</p>
          <p className="text-[8px] text-neutral-400 font-bold mt-1 uppercase tracking-wider">Awaiting response</p>
        </div>

        <div className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[105px] rounded-none relative">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              Security Score
              <HelpCircle className="w-3 h-3 text-neutral-400 cursor-pointer" onClick={() => setShowSecurityTooltip(!showSecurityTooltip)} />
            </span>
            <ShieldAlert className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xl font-bold text-green-700 mt-2">{twoFaRate}%</p>
          <p className="text-[8px] text-neutral-400 font-bold mt-1 uppercase tracking-wider">2FA Compliance Rate</p>

          {showSecurityTooltip && (
            <div className="absolute top-10 left-5 right-5 bg-[#030213] text-white text-[7.5px] uppercase tracking-wider p-3 z-10 border border-neutral-700 space-y-1">
              <div className="flex justify-between font-bold border-b border-neutral-700 pb-1">
                <span>Security metrics</span>
                <button onClick={() => setShowSecurityTooltip(false)} className="text-neutral-400 hover:text-white bg-transparent border-none p-0 cursor-pointer">✕</button>
              </div>
              <p>2FA active rate: {twoFaRate}%</p>
              <p>Max Idle Session limit: 15m</p>
              <p>IP restriction validation active</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ─── Left Column: Admin Users Table ─────────────────────────── */}
        <div className="lg:col-span-7 bg-card border border-neutral-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Team Members</h3>
            <div className="relative">
              <input type="text" placeholder="Search team..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border border-neutral-200/80 pl-8 pr-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-48" />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider">
              <thead>
                <tr className="border-b border-neutral-200/60 text-[8px] text-neutral-400 tracking-[0.2em]">
                  <th className="pb-3 font-bold">User / Email</th>
                  <th className="pb-3 font-bold">Role / Group</th>
                  <th className="pb-3 font-bold">2FA Status</th>
                  <th className="pb-3 font-bold">Last Active</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/40">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-neutral-200/10 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#030213] text-white flex items-center justify-center text-[10px] font-bold rounded-none">
                          {admin.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#030213] text-[9.5px]">{admin.name}</p>
                          <p className="text-[7.5px] text-neutral-400 font-semibold lowercase tracking-normal">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="space-y-0.5">
                        <span className="text-[7px] font-bold tracking-widest bg-neutral-100 border border-neutral-200/60 px-1.5 py-0.5 uppercase">
                          {admin.role}
                        </span>
                        <p className="text-[6.5px] text-neutral-400 font-bold tracking-widest">{admin.department}</p>
                      </div>
                    </td>
                    <td className="py-3.5">
                      {admin.twoFactorEnabled ? (
                        <span className="text-[6.5px] font-bold tracking-widest text-green-700 bg-green-50 border border-green-500/20 px-1.5 py-0.5 uppercase">2FA Active</span>
                      ) : (
                        <span className="text-[6.5px] font-bold tracking-widest text-neutral-400 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 uppercase font-mono">Inactive</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-bold text-[#030213]">{admin.lastActive}</p>
                        {admin.lastLoginIP !== "—" && (
                          <p className="text-[6.5px] text-neutral-400 font-mono">IP: {admin.lastLoginIP}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {admin.status === "Active" && (
                          <button 
                            onClick={() => setSessionRevokeUser(admin)}
                            className="text-neutral-400 hover:text-amber-700 p-1 border border-neutral-200 hover:border-amber-700/40 text-[7px] font-bold uppercase cursor-pointer"
                            title="Force Logout"
                          >
                            Revoke
                          </button>
                        )}
                        <button 
                          onClick={() => setEditUser(admin)}
                          className="text-neutral-400 hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer"
                          title="Edit User Info"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeleteUser(admin)}
                          className="text-neutral-400 hover:text-red-700 p-1 bg-transparent border-none cursor-pointer"
                          title="Delete Admin User"
                        >
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
        <div className="lg:col-span-5 bg-card border border-neutral-200/80 p-6 space-y-5">
          <div className="border-b border-neutral-200/60 pb-3 flex items-center justify-between">
            <h3 className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Permissions</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCloneModal(true)} 
                className="text-[7.5px] font-bold tracking-widest uppercase border border-neutral-200 hover:border-black px-2 py-1 flex items-center gap-1 cursor-pointer bg-card text-neutral-500 hover:text-[#030213]"
                title="Clone this role matrix"
              >
                <Copy className="w-2.5 h-2.5" /> Clone
              </button>
              <select value={selectedRoleForMatrix}
                onChange={(e) => setSelectedRoleForMatrix(e.target.value)}
                className="bg-card border border-neutral-200 px-2 py-1 text-[9px] font-semibold focus:outline-none focus:border-[#030213] uppercase cursor-pointer">
                {roleList.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <p className="text-[8px] text-neutral-400 leading-relaxed font-bold uppercase tracking-wider">
            Fine-tune permissions for <strong className="text-[#030213]">{selectedRoleForMatrix}</strong>
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-12 text-[7px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200/60 pb-2">
              <span className="col-span-6">Module</span>
              <span className="col-span-2 text-center">Read</span>
              <span className="col-span-2 text-center">Write</span>
              <span className="col-span-2 text-center">Delete</span>
            </div>

            {rolePermissions[selectedRoleForMatrix]?.map((perm, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center text-[8.5px] border-b border-neutral-200/40 pb-2.5 last:border-none">
                <span className="col-span-6 font-semibold text-neutral-700">{perm.module}</span>
                {(["read", "write", "delete"] as const).map(type => (
                  <span key={type} className="col-span-2 flex justify-center">
                    <button type="button"
                      onClick={() => togglePermission(selectedRoleForMatrix, idx, type)}
                      className={`w-4 h-4 border rounded-none cursor-pointer flex items-center justify-center transition-colors ${
                        perm[type] ? "bg-[#030213] border-[#030213] text-white" : "border-neutral-200 hover:border-neutral-400"
                      }`}>
                      {perm[type] && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Add custom permission modules directly into matrix */}
          <div className="border-t border-neutral-200/60 pt-4 flex gap-2">
            <input 
              type="text" 
              placeholder="Add Custom Module..." 
              value={newSectionName} 
              onChange={e => setNewSectionName(e.target.value)} 
              className="border border-neutral-200 px-2 py-1.5 text-[8.5px] uppercase tracking-wider bg-card focus:outline-none w-full"
            />
            <button onClick={handleAddCustomSection} className="bg-[#030213] hover:bg-neutral-800 text-white text-[8px] font-bold px-3 py-1.5 uppercase cursor-pointer rounded-none border-none flex items-center gap-1 shrink-0">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200/60">
            <button onClick={handleSavePermissions} className="bg-[#030213] hover:bg-neutral-800 text-white text-[8px] font-semibold tracking-widest px-4 py-2.5 uppercase cursor-pointer rounded-none border-none">
              Save Permissions
            </button>
          </div>
        </div>

      </div>

      {/* ── Invite Modal ──────────────────────────────────────────────── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-[#030213]/40 z-50 flex items-center justify-center p-4" onClick={() => setIsInviteModalOpen(false)}>
          <div className="bg-card border border-neutral-300 max-w-md w-full p-6 space-y-5 shadow-xl rounded-none" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest">Invite Admin</h3>
              <button onClick={() => setIsInviteModalOpen(false)}
                className="text-neutral-400 hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Full Name</label>
                <input type="text" name="name" required placeholder="e.g. Ananya Sharma"
                  className="w-full bg-card border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Email</label>
                <input type="email" name="email" required placeholder="e.g. name@dripdoggy.com"
                  className="w-full bg-card border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Role</label>
                  <select name="role"
                    className="w-full bg-card border border-neutral-200/80 px-3 py-2 text-[9px] font-semibold focus:outline-none focus:border-[#030213] uppercase cursor-pointer rounded-none">
                    {roleList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Department</label>
                  <select name="department"
                    className="w-full bg-card border border-neutral-200/80 px-3 py-2 text-[9px] font-semibold focus:outline-none focus:border-[#030213] uppercase cursor-pointer rounded-none">
                    <option value="Tech">Tech</option>
                    <option value="Operations">Operations</option>
                    <option value="Cataloging">Cataloging</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-neutral-200/60 pt-4">
                <button type="button" onClick={() => setIsInviteModalOpen(false)}
                  className="bg-transparent border border-neutral-200 hover:border-[#030213] text-neutral-600 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer border-none rounded-none">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Admin User Modal ────────────────────────────────────── */}
      {editUser && (
        <div className="fixed inset-0 bg-[#030213]/40 z-50 flex items-center justify-center p-4" onClick={() => setEditUser(null)}>
          <div className="bg-card border border-neutral-300 max-w-md w-full p-6 space-y-5 shadow-xl rounded-none" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest">Edit Admin User</h3>
              <button onClick={() => setEditUser(null)} className="text-neutral-400 hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Full Name</label>
                <input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                  className="w-full bg-card border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Email</label>
                <input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                  className="w-full bg-card border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Role</label>
                  <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                    className="w-full bg-card border border-neutral-200/80 px-3 py-2 text-[9px] font-semibold focus:outline-none focus:border-[#030213] uppercase cursor-pointer rounded-none">
                    {roleList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Department</label>
                  <select value={editUser.department} onChange={e => setEditUser({ ...editUser, department: e.target.value as any })}
                    className="w-full bg-card border border-neutral-200/80 px-3 py-2 text-[9px] font-semibold focus:outline-none focus:border-[#030213] uppercase cursor-pointer rounded-none">
                    <option value="Tech">Tech</option>
                    <option value="Operations">Operations</option>
                    <option value="Cataloging">Cataloging</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-neutral-200 bg-card">
                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-wider">Two-Factor Authentication</p>
                  <p className="text-[7.5px] text-neutral-400 font-bold uppercase mt-0.5">Enforce SMS/OTP verification login</p>
                </div>
                <ToggleSwitch enabled={editUser.twoFactorEnabled} onClick={() => setEditUser({ ...editUser, twoFactorEnabled: !editUser.twoFactorEnabled })} />
              </div>

              <div className="flex justify-between items-center p-3 border border-neutral-200 bg-card">
                <div>
                  <p className="text-[8.5px] font-bold uppercase tracking-wider">User Status</p>
                  <p className="text-[7.5px] text-neutral-400 font-bold uppercase mt-0.5">Manage system access state</p>
                </div>
                <select value={editUser.status} onChange={e => setEditUser({ ...editUser, status: e.target.value as any })}
                  className="bg-card border border-neutral-200 px-2 py-1 text-[8.5px] font-bold uppercase focus:outline-none cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200/60">
              <button onClick={() => setEditUser(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={() => handleUpdateUser(editUser)} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase cursor-pointer rounded-none border-none">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────── */}
      {deleteUser && (
        <div className="fixed inset-0 bg-[#030213]/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteUser(null)}>
          <div className="bg-card border border-neutral-300 max-w-sm w-full p-6 space-y-4 shadow-xl rounded-none" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-[#b2533e]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Delete staff member?</h3>
            </div>
            
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#030213]">{deleteUser.name}</strong> from the team?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/60">
              <button onClick={() => setDeleteUser(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={handleDeleteAdmin} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Force Session Revocation Modal ────────────────────────────── */}
      {sessionRevokeUser && (
        <div className="fixed inset-0 bg-[#030213]/40 z-50 flex items-center justify-center p-4" onClick={() => setSessionRevokeUser(null)}>
          <div className="bg-card border border-neutral-300 max-w-sm w-full p-6 space-y-4 shadow-xl rounded-none" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-amber-600">
              <Lock className="w-6 h-6" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Revoke session?</h3>
            </div>
            
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider leading-relaxed">
              This will immediately invalidate the session token for <strong className="text-[#030213]">{sessionRevokeUser.name}</strong> and force them to authenticate again on next action.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/60">
              <button onClick={() => setSessionRevokeUser(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={handleForceRevokeSession} className="bg-amber-600 hover:bg-amber-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Confirm Revoke</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Clone Role Modal ────────────────────────────────────────── */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-[#030213]/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCloneModal(false)}>
          <div className="bg-card border border-neutral-300 max-w-sm w-full p-6 space-y-4 shadow-xl rounded-none" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest">Clone Selected Role</h3>
              <button onClick={() => setShowCloneModal(false)} className="text-neutral-400 hover:text-black bg-transparent border-none cursor-pointer p-0"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3">
              <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">
                Create a duplicate of <strong className="text-[#030213]">{selectedRoleForMatrix}</strong> matrix.
              </p>
              <div>
                <label className="text-[7.5px] font-bold text-neutral-500 uppercase tracking-widest mb-1 block">New Role name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Catalog Specialist"
                  value={cloneRoleName}
                  onChange={e => setCloneRoleName(e.target.value)}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] uppercase bg-card rounded-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/60">
              <button onClick={() => setShowCloneModal(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={handleCloneRole} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Clone</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Audit Logs Slideout Drawer ───────────────────────────────── */}
      {showAuditLogs && (
        <div className="fixed inset-0 bg-[#030213]/40 z-50 flex items-center justify-end" onClick={() => setShowAuditLogs(false)}>
          <div className="bg-card border-l border-neutral-300 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest">Security Audit Logs</h3>
                  <span className="text-[7.5px] font-bold uppercase tracking-wider text-neutral-400">Recent Admin operations</span>
                </div>
                <button onClick={() => setShowAuditLogs(false)} className="text-neutral-400 hover:text-black bg-transparent border-none cursor-pointer p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="border border-neutral-200/80 p-3 bg-neutral-50/50">
                    <div className="flex items-center justify-between text-[7px] text-neutral-400 font-bold uppercase tracking-widest">
                      <span>{log.timestamp}</span>
                      <span className="bg-neutral-100 px-1 border border-neutral-200 text-[#030213]">{log.action}</span>
                    </div>
                    <p className="text-[8px] font-semibold uppercase text-[#030213] mt-1.5">{log.user}</p>
                    <p className="text-[8.5px] text-neutral-500 uppercase mt-0.5 tracking-wider">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <button onClick={() => setShowAuditLogs(false)} className="w-full border border-neutral-300 hover:border-[#030213] text-[9px] font-bold uppercase py-2.5 tracking-widest bg-transparent cursor-pointer rounded-none">
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
