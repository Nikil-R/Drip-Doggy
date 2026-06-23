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
  Edit2,
  X,
  Lock,
  Clock,
  Copy,
  Plus,
  HelpCircle,
  AlertTriangle
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
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#224870]" : "bg-neutral-350"
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

  const handleAddCustomSection = () => {
    if (!newSectionName.trim() || customSections.includes(newSectionName)) return;
    const updatedSections = [...customSections, newSectionName.trim()];
    setCustomSections(updatedSections);

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
    <div className="space-y-8 font-sans text-[#382d24]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-200/60">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#224870]" /> Admin Roles
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Drip Doggy team permissions &amp; security control
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setShowAuditLogs(true)}
            className="border border-neutral-300 hover:border-[#224870] text-[#382d24] hover:text-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase transition-colors cursor-pointer rounded-none bg-transparent flex items-center gap-1.5"
          >
            <Clock className="h-3.5 w-3.5" />
            Audit Logs
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase transition-colors cursor-pointer rounded-none border-none flex items-center gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite Admin
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] rounded-none hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Total Staff</span>
            <Users className="w-4 h-4 text-[#615e56]/70" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-[#382d24] mt-2">{admins.length}</p>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">{activeCount} active members</p>
        </div>

        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] rounded-none hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Active Roles</span>
            <Shield className="w-4 h-4 text-[#615e56]/70" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-[#382d24] mt-2">{roleList.length}</p>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">{roleList.slice(0, 2).join(", ")}...</p>
        </div>

        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] rounded-none hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Pending Invites</span>
            <Mail className="w-4 h-4 text-[#615e56]/70" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-amber-700 mt-2">{pendingCount}</p>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">Awaiting activation</p>
        </div>

        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] rounded-none hover:shadow-sm transition-shadow relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase flex items-center gap-1">
              Security Score
              <HelpCircle className="w-3.5 h-3.5 text-neutral-450 cursor-pointer" onClick={() => setShowSecurityTooltip(!showSecurityTooltip)} />
            </span>
            <ShieldAlert className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-green-700 mt-2">{twoFaRate}%</p>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">2FA Compliance Rate</p>

          {showSecurityTooltip && (
            <div className="absolute top-12 left-4 right-4 bg-[#382d24] text-[#faf8f5] text-[8.5px] uppercase tracking-wider p-4.5 z-10 border border-neutral-700 space-y-1.5">
              <div className="flex justify-between font-bold border-b border-neutral-750 pb-1.5">
                <span>Security matrix metadata</span>
                <button onClick={() => setShowSecurityTooltip(false)} className="text-neutral-450 hover:text-white bg-transparent border-none p-0 cursor-pointer">✕</button>
              </div>
              <p>2FA active rate: {twoFaRate}%</p>
              <p>Max Idle Session limit: 15m</p>
              <p>IP restriction validation active</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Redesigned Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* Left Column: Admin Users Directory (Redesigned with Spacings and High-Contrast Actions) */}
        <div className="xl:col-span-8 bg-card border border-neutral-200/80 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200/60">
            <span className="text-xs font-black uppercase tracking-widest text-[#382d24]">Team Directory</span>
            <div className="relative">
              <input type="text" placeholder="Search team..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#faf8f5] border border-neutral-300 focus:border-[#224870] pl-9.5 pr-4 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none placeholder-neutral-400 rounded-none w-56 text-[#382d24]" />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#615e56]" />
            </div>
          </div>

          <div className="overflow-x-auto border border-neutral-200/40">
            <table className="w-full text-left uppercase text-[9.5px] font-bold tracking-wider border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/60 bg-[#faf8f5]/60 text-[8.5px] text-[#615e56] tracking-[0.15em]">
                  <th className="py-3.5 pl-4 pr-3 font-bold w-[32%]">User / Email</th>
                  <th className="py-3.5 px-3 font-bold w-[23%]">Role &amp; Group</th>
                  <th className="py-3.5 px-3 font-bold w-[15%]">2FA Status</th>
                  <th className="py-3.5 px-3 font-bold w-[16%]">Last Active</th>
                  <th className="py-3.5 pl-3 pr-4 font-bold text-right w-[14%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/40">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4.5 pl-4 pr-3 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#224870] text-white flex items-center justify-center text-[11px] font-bold shrink-0 rounded-none">
                          {admin.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#382d24] text-[10.5px] tracking-tight">{admin.name}</p>
                          <p className="text-[8.5px] text-neutral-400 font-semibold lowercase tracking-normal mt-0.5">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Role & Group Column (Proper spacing between tags) */}
                    <td className="py-4.5 px-3 align-middle">
                      <div className="flex flex-col items-start gap-2.5 py-1">
                        <span className="inline-block text-[8.5px] font-extrabold tracking-wider bg-[#224870]/10 border border-[#224870]/20 px-2.5 py-1 uppercase text-[#224870] rounded-none">
                          {admin.role}
                        </span>
                        <span className="text-[8px] text-[#615e56] font-black tracking-widest pl-0.5 block">
                          {admin.department} Group
                        </span>
                      </div>
                    </td>

                    <td className="py-4.5 px-3 align-middle">
                      {admin.twoFactorEnabled ? (
                        <span className="inline-block text-[8px] font-bold tracking-widest text-green-700 bg-green-50 border border-green-500/20 px-2.5 py-1.5 uppercase rounded-none">2FA Active</span>
                      ) : (
                        <span className="inline-block text-[8px] font-bold tracking-widest text-neutral-450 bg-[#faf8f5] border border-neutral-200 px-2.5 py-1.5 uppercase font-mono rounded-none">Inactive</span>
                      )}
                    </td>

                    <td className="py-4.5 px-3 align-middle">
                      <div className="space-y-1.5">
                        <p className="text-[9.5px] font-bold text-[#382d24]">{admin.lastActive}</p>
                        {admin.lastLoginIP !== "—" && (
                          <p className="text-[7.5px] text-neutral-400 font-mono">IP: {admin.lastLoginIP}</p>
                        )}
                      </div>
                    </td>

                    {/* Actions Column (Highly visible controls with solid background colors) */}
                    <td className="py-4.5 pl-3 pr-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        {admin.status === "Active" && (
                          <button 
                            onClick={() => setSessionRevokeUser(admin)}
                            className="text-[#615e56] hover:text-amber-700 px-2.5 py-1.5 border border-neutral-300 hover:border-amber-750 text-[8.5px] font-black uppercase cursor-pointer transition-all bg-transparent rounded-none"
                            title="Force Logout"
                          >
                            Revoke
                          </button>
                        )}
                        <button 
                          onClick={() => setEditUser(admin)}
                          className="text-white bg-[#224870] hover:bg-[#224870]/85 p-2 cursor-pointer transition-all rounded-none flex items-center justify-center border-none shadow-sm"
                          title="Edit User Info"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button 
                          onClick={() => setDeleteUser(admin)}
                          className="text-white bg-[#b2533e] hover:bg-[#b2533e]/85 p-2 cursor-pointer transition-all rounded-none flex items-center justify-center border-none shadow-sm"
                          title="Delete Admin User"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Permissions Matrix */}
        <div className="xl:col-span-4 bg-card border border-neutral-200/80 p-6 space-y-5">
          <div className="border-b border-neutral-200/60 pb-3.5 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#382d24] block">Permissions Matrix</span>
            <div className="flex gap-2 w-full">
              <select value={selectedRoleForMatrix}
                onChange={(e) => setSelectedRoleForMatrix(e.target.value)}
                className="bg-[#faf8f5] border border-neutral-300 px-3 py-2 text-[9.5px] font-bold focus:outline-none focus:border-[#224870] uppercase cursor-pointer text-[#382d24] rounded-none flex-1 min-w-0">
                {roleList.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <button 
                onClick={() => setShowCloneModal(true)} 
                className="text-[9px] font-bold tracking-widest uppercase border border-neutral-300 hover:border-[#224870] px-3.5 py-2 flex items-center justify-center gap-1.5 cursor-pointer bg-[#faf8f5] text-[#615e56] hover:text-[#224870] transition-colors rounded-none shrink-0"
                title="Clone this role matrix"
              >
                <Copy className="w-3.5 h-3.5" /> Clone Role
              </button>
            </div>
          </div>

          <p className="text-[10px] text-[#615e56] leading-relaxed font-bold uppercase tracking-wider">
            Fine-tune permissions for <strong className="text-[#382d24]">{selectedRoleForMatrix}</strong>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left uppercase text-[9.5px] font-bold tracking-wider border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/60 text-[8px] text-[#615e56] tracking-[0.12em]">
                  <th className="pb-2.5 font-bold text-left">Module</th>
                  <th className="pb-2.5 font-bold text-center w-[16%]">Read</th>
                  <th className="pb-2.5 font-bold text-center w-[16%]">Write</th>
                  <th className="pb-2.5 font-bold text-center w-[16%]">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/40">
                {rolePermissions[selectedRoleForMatrix]?.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/20 transition-colors">
                    <td className="py-3 font-semibold text-neutral-700 normal-case tracking-normal whitespace-nowrap pr-2">
                      {perm.module}
                    </td>
                    {(["read", "write", "delete"] as const).map(type => (
                      <td key={type} className="py-3 text-center">
                        <div className="flex justify-center">
                          <button type="button"
                            onClick={() => togglePermission(selectedRoleForMatrix, idx, type)}
                            className={`w-4.5 h-4.5 border rounded-none cursor-pointer flex items-center justify-center transition-colors ${
                              perm[type] ? "bg-[#224870] border-[#224870] text-white" : "border-neutral-300 hover:border-neutral-400 bg-transparent"
                            }`}>
                            {perm[type] && <Check className="w-3 h-3 stroke-[3.5] text-white" />}
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add custom permission modules directly into matrix */}
          <div className="border-t border-neutral-200/60 pt-4 flex gap-2">
            <input 
              type="text" 
              placeholder="Add Custom Module..." 
              value={newSectionName} 
              onChange={e => setNewSectionName(e.target.value)} 
              className="border border-neutral-300 px-2.5 py-1.5 text-[9px] uppercase tracking-wider bg-[#faf8f5] focus:outline-none w-full text-[#382d24]"
            />
            <button onClick={handleAddCustomSection} className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9px] font-bold px-3 py-1.5 uppercase cursor-pointer rounded-none border-none flex items-center gap-1 shrink-0 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="pt-3.5 flex justify-end gap-2 border-t border-neutral-200/60">
            <button onClick={handleSavePermissions} className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9.5px] font-bold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-colors">
              Save Permissions
            </button>
          </div>
        </div>

      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setIsInviteModalOpen(false)}>
          <div className="bg-card border border-neutral-300 max-w-md w-full p-6 space-y-5 shadow-xl rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest">Invite Admin</h3>
              <button onClick={() => setIsInviteModalOpen(false)}
                className="text-neutral-450 hover:text-[#382d24] p-1 bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Full Name</label>
                <input type="text" name="name" required placeholder="e.g. Ananya Sharma"
                  className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Email Address</label>
                <input type="email" name="email" required placeholder="e.g. name@dripdoggy.com"
                  className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Role Group</label>
                  <select name="role"
                    className="w-full bg-[#faf8f5] border border-neutral-300 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24]">
                    {roleList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Department</label>
                  <select name="department"
                    className="w-full bg-[#faf8f5] border border-neutral-300 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24]">
                    <option value="Tech">Tech</option>
                    <option value="Operations">Operations</option>
                    <option value="Cataloging">Cataloging</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-neutral-200/60 mt-5">
                <button type="button" onClick={() => setIsInviteModalOpen(false)}
                  className="bg-transparent border border-neutral-200 hover:border-[#382d24] text-neutral-600 text-[9.5px] font-bold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer rounded-none">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9.5px] font-black tracking-widest px-5 py-2.5 uppercase cursor-pointer border-none rounded-none">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setEditUser(null)}>
          <div className="bg-card border border-neutral-300 max-w-md w-full p-6 space-y-5 shadow-xl rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest">Edit Admin User</h3>
              <button onClick={() => setEditUser(null)} className="text-neutral-450 hover:text-[#382d24] p-1 bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Full Name</label>
                <input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Email Address</label>
                <input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Role Group</label>
                  <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-neutral-300 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24]">
                    {roleList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Department</label>
                  <select value={editUser.department} onChange={e => setEditUser({ ...editUser, department: e.target.value as any })}
                    className="w-full bg-[#faf8f5] border border-neutral-300 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24]">
                    <option value="Tech">Tech</option>
                    <option value="Operations">Operations</option>
                    <option value="Cataloging">Cataloging</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 border border-neutral-200 bg-[#faf8f5]">
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider">Two-Factor Authentication</p>
                  <p className="text-[8px] text-neutral-400 font-bold uppercase mt-0.5">Enforce SMS/OTP verification login</p>
                </div>
                <ToggleSwitch enabled={editUser.twoFactorEnabled} onClick={() => setEditUser({ ...editUser, twoFactorEnabled: !editUser.twoFactorEnabled })} />
              </div>

              <div className="flex justify-between items-center p-3.5 border border-neutral-200 bg-[#faf8f5]">
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider">User Status</p>
                  <p className="text-[8px] text-neutral-400 font-bold uppercase mt-0.5">Manage system access state</p>
                </div>
                <select value={editUser.status} onChange={e => setEditUser({ ...editUser, status: e.target.value as any })}
                  className="bg-card border border-neutral-300 px-2 py-1 text-[8.5px] font-bold uppercase focus:outline-none cursor-pointer text-[#382d24]">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200/60 mt-5">
              <button onClick={() => setEditUser(null)} className="border border-neutral-200 hover:border-[#382d24] text-neutral-500 text-[9px] font-semibold tracking-widest px-4.5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={() => handleUpdateUser(editUser)} className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9px] font-semibold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer rounded-none border-none">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUser && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setDeleteUser(null)}>
          <div className="bg-card border border-neutral-300 max-w-sm w-full p-6 space-y-4 shadow-xl rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2.5 text-[#b2533e]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Delete staff member?</h3>
            </div>
            
            <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#382d24]">{deleteUser.name}</strong> from the team?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/60 mt-4">
              <button onClick={() => setDeleteUser(null)} className="border border-neutral-200 hover:border-[#382d24] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={handleDeleteAdmin} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Force Session Revocation Modal */}
      {sessionRevokeUser && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setSessionRevokeUser(null)}>
          <div className="bg-card border border-neutral-300 max-w-sm w-full p-6 space-y-4 shadow-xl rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2.5 text-amber-600">
              <Lock className="w-6 h-6 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Revoke session?</h3>
            </div>
            
            <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider leading-relaxed">
              This will immediately invalidate the session token for <strong className="text-[#382d24]">{sessionRevokeUser.name}</strong> and force them to authenticate again on next action.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/60 mt-4">
              <button onClick={() => setSessionRevokeUser(null)} className="border border-neutral-200 hover:border-[#382d24] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={handleForceRevokeSession} className="bg-amber-600 hover:bg-amber-850 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Confirm Revoke</button>
            </div>
          </div>
        </div>
      )}

      {/* Clone Role Modal */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setShowCloneModal(false)}>
          <div className="bg-card border border-neutral-300 max-w-sm w-full p-6 space-y-4 shadow-xl rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest">Clone Selected Role</h3>
              <button onClick={() => setShowCloneModal(false)} className="text-neutral-450 hover:text-black bg-transparent border-none cursor-pointer p-0"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3">
              <p className="text-[9px] text-[#615e56] font-bold uppercase tracking-wider">
                Create a duplicate of <strong className="text-[#382d24]">{selectedRoleForMatrix}</strong> matrix.
              </p>
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 block">New Role name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Catalog Specialist"
                  value={cloneRoleName}
                  onChange={e => setCloneRoleName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-neutral-300 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] uppercase rounded-none text-[#382d24]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/60 mt-4">
              <button onClick={() => setShowCloneModal(false)} className="border border-neutral-200 hover:border-[#382d24] text-[#615e56] hover:text-[#382d24] text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={handleCloneRole} className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none transition-colors">Clone</button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Slideout Drawer */}
      {showAuditLogs && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs z-50 flex items-center justify-end animate-fade-in" onClick={() => setShowAuditLogs(false)}>
          <div className="bg-card border-l border-neutral-300 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="space-y-6 flex-1 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-neutral-250 pb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest">Security Audit Logs</h3>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Recent Admin operations</span>
                </div>
                <button onClick={() => setShowAuditLogs(false)} className="text-neutral-450 hover:text-black bg-transparent border-none cursor-pointer p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="border border-neutral-200/80 p-3.5 bg-[#faf8f5]">
                    <div className="flex items-center justify-between text-[7.5px] text-neutral-400 font-bold uppercase tracking-widest">
                      <span>{log.timestamp}</span>
                      <span className="bg-card px-1.5 border border-neutral-200 text-[#382d24]">{log.action}</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase text-[#382d24] mt-1.5">{log.user}</p>
                    <p className="text-[9px] text-[#615e56] uppercase mt-0.5 tracking-wider">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-250 pt-4">
              <button onClick={() => setShowAuditLogs(false)} className="w-full border border-neutral-300 hover:border-[#382d24] text-[9.5px] font-bold uppercase py-3 tracking-widest bg-transparent cursor-pointer rounded-none text-[#382d24] transition-colors">
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
