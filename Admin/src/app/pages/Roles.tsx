import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/auth-store";
import { authApi } from "@/app/lib/auth-api";
import {
  Shield,
  Users,
  Search,
  Mail,
  UserPlus,
  Trash2,
  Edit2,
  X,
  Lock,
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

export function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Modals state
  const [statusChangeUser, setStatusChangeUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [sessionRevokeUser, setSessionRevokeUser] = useState<AdminUser | null>(null);

  // ─── Drip Doggy Admin Users ────────────────────────────────────────────
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: "DD-ADM-001", name: "Nikil", email: "nikil@dripdoggy.com", role: "Admin", status: "Active", lastActive: "Just now", lastLoginIP: "103.24.12.87", permissionsCount: 27, twoFactorEnabled: true, department: "Executive" },
    { id: "DD-ADM-002", name: "Vinay", email: "vinay@dripdoggy.com", role: "Admin", status: "Active", lastActive: "2 hours ago", lastLoginIP: "192.168.1.15", permissionsCount: 18, twoFactorEnabled: true, department: "Tech" },
    { id: "DD-ADM-003", name: "Jeshwanth", email: "jeshwanth@dripdoggy.com", role: "Admin", status: "Active", lastActive: "Yesterday", lastLoginIP: "103.45.98.201", permissionsCount: 18, twoFactorEnabled: false, department: "Operations" }
  ]);

  const { user, token } = useAuthStore();
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Fetch admin users on mount
  useEffect(() => {
    async function fetchAdmins() {
      if (!token) return;
      try {
        // Fetch through local Vite server proxy to hit the database correctly
        const response = await fetch("/dripdoggy/api/auth/admin/list", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            // Mapped keys directly matching the database user schema columns (first_name, last_name, role, dob, phone_no, gender)
            const mapped: AdminUser[] = data.map((item: any, index: number) => {
              const fName = item.firstName || item.first_name || "";
              const lName = item.lastName || item.last_name || "";
              const name = fName && lName ? `${fName} ${lName}` : (fName || lName || item.name || "Nikil");
              return {
                id: item.id ? `DD-ADM-${item.id}` : `DD-ADM-00${index + 1}`,
                name,
                email: item.email || "nikil@dripdoggy.com",
                role: item.role || "Admin",
                status: item.status === "Active" || item.status === "Inactive" || item.status === "Pending" ? item.status : "Active",
                lastActive: item.lastActive || "Just now",
                lastLoginIP: item.lastLoginIP || "—",
                permissionsCount: 18,
                twoFactorEnabled: !!item.twoFactorEnabled,
                department: item.department || "Tech"
              };
            });
            setAdmins(mapped);
          }
        } else {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }
      } catch (err) {
        console.warn("Backend admin list query returned error, using fallback seed database.", err);
      }
    }
    fetchAdmins();
  }, [token]);

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const gender = formData.get("gender") as string;
    const dob = formData.get("dob") as string;
    const phoneNo = formData.get("phone") as string;
    
    const name = `${firstName} ${lastName}`;

    if (!token) {
      setInviteError("Unauthorized: Session token is missing.");
      return;
    }

    try {
      await authApi.registerAdmin(token, {
        firstName,
        lastName,
        email,
        phoneNo,
        dob,
        gender
      });

      const newAdmin: AdminUser = {
        id: `DD-ADM-00${admins.length + 1}`,
        name, 
        email, 
        role: "Admin",
        status: "Active",
        lastActive: "Just now",
        lastLoginIP: "—",
        permissionsCount: 18,
        twoFactorEnabled: false,
        department: "Tech"
      };

      setAdmins(prev => [...prev, newAdmin]);
      setIsInviteModalOpen(false);
    } catch (err: any) {
      setInviteError(err?.response?.data?.message || "Failed to register admin. Please verify input data.");
    }
  };

  const toggleUserStatus = (user: AdminUser) => {
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";
    setAdmins(prev => prev.map(a => a.id === user.id ? { ...a, status: nextStatus } : a));
    setStatusChangeUser(null);
  };

  const handleUpdateUser = (updatedUser: AdminUser) => {
    setAdmins(prev => prev.map(a => a.id === updatedUser.id ? updatedUser : a));
    setEditUser(null);
  };

  const handleDeleteAdmin = () => {
    if (!deleteUser) return;
    setAdmins(prev => prev.filter(a => a.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const handleForceRevokeSession = () => {
    if (!sessionRevokeUser) return;
    setAdmins(prev => prev.map(a => a.id === sessionRevokeUser.id ? { ...a, lastActive: "Session Revoked" } : a));
    setSessionRevokeUser(null);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = admins.filter(a => a.status === "Active").length;
  const isExistingAdmin = admins.some(admin => admin.email.toLowerCase() === user?.email.toLowerCase());

  return (
    <div className="space-y-6 font-sans text-[#382d24]">

      {/* KPI Cards */}
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <p className="text-2xl font-bold tracking-tight text-[#382d24] mt-2">1</p>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">Admin</p>
        </div>

        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] rounded-none hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Inactive Staff</span>
            <Mail className="w-4 h-4 text-[#615e56]/70" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-500 mt-2">{admins.filter(a => a.status === "Inactive").length}</p>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">Revoked access entries</p>
        </div>
      </div>

      {/* Main Grid Redesigned Layout */}
      <div className="space-y-6">

        {/* Admin Users Directory (Full Width) */}
        <div className="w-full bg-card border border-neutral-200/80 p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 border-b border-neutral-200/60">
            <span className="text-xs font-black uppercase tracking-widest text-[#382d24]">Team Directory</span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <input type="text" placeholder="Search team..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#faf8f5] border border-neutral-300 focus:border-[#224870] pl-9.5 pr-4 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none placeholder-neutral-400 rounded-none w-56 text-[#382d24]" />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#615e56]" />
              </div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase transition-colors cursor-pointer rounded-none border-none flex items-center justify-center gap-1.5 shrink-0"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Add New Admin
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-neutral-200/40">
            <table className="w-full text-left uppercase text-[9.5px] font-bold tracking-wider border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/60 bg-[#faf8f5]/60 text-[8.5px] text-[#615e56] tracking-[0.15em]">
                  <th className="py-3.5 pl-4 pr-3 font-bold w-[45%]">User / Email</th>
                  <th className="py-3.5 px-3 font-bold w-[35%]">Role</th>
                  <th className="py-3.5 pl-3 pr-4 font-bold text-right w-[20%]">Actions</th>
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
                    
                    {/* Role & Group Column */}
                    <td className="py-4.5 px-3 align-middle">
                      <span className="inline-block text-[8.5px] font-extrabold tracking-wider bg-[#224870]/10 border border-[#224870]/20 px-2.5 py-1 uppercase text-[#224870] rounded-none">
                        {admin.role}
                      </span>
                    </td>

                    {/* Actions Column */}
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

      </div>

      {/* Add New Admin Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setIsInviteModalOpen(false)}>
          <div className="bg-card border border-neutral-300 max-w-md w-full p-6 space-y-5 shadow-xl rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#382d24]">Add New Admin</h3>
              <button onClick={() => setIsInviteModalOpen(false)}
                className="text-neutral-450 hover:text-[#382d24] p-1 bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="space-y-4">
              {inviteError && (
                <div className="border border-red-200 bg-red-50 text-red-700 text-[10px] font-bold p-3 uppercase tracking-wider">
                  {inviteError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">First Name</label>
                  <input type="text" name="firstName" required placeholder="e.g. John"
                    className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Last Name</label>
                  <input type="text" name="lastName" required placeholder="e.g. Doe"
                    className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Email Address</label>
                <input type="email" name="email" required placeholder="e.g. name@dripdoggy.com"
                  className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Gender</label>
                  <select name="gender"
                    className="w-full bg-[#faf8f5] border border-neutral-300 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24]">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Date of Birth</label>
                  <input type="date" name="dob" required
                    className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] cursor-pointer hover:bg-[#faf8f5]/60 transition-colors [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Phone Number</label>
                <input type="tel" name="phone" required placeholder="e.g. +91 9876543210"
                  className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-neutral-200/60 mt-5">
                <button type="button" onClick={() => setIsInviteModalOpen(false)}
                  className="bg-transparent border border-neutral-200 hover:border-[#382d24] text-neutral-600 text-[9.5px] font-bold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer rounded-none">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9.5px] font-black tracking-widest px-5 py-2.5 uppercase cursor-pointer border-none rounded-none">
                  Save Admin
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">User Status</label>
                <select value={editUser.status} onChange={e => setEditUser({ ...editUser, status: e.target.value as any })}
                  className="w-full bg-[#faf8f5] border border-neutral-300 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24]">
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

    </div>
  );
}
