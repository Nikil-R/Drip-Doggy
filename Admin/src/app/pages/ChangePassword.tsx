import { useState } from "react";
import { KeyRound, Check, AlertTriangle } from "lucide-react";

export function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setToast(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-[#382d24]">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#224870]" /> Change Password
        </h1>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">
          Update your administrator credentials password
        </p>
      </div>

      <div className="bg-card border border-neutral-200 p-6 space-y-6 shadow-xs">
        {error && (
          <div className="border border-red-200 bg-red-50 text-[#b2533e] text-[9px] font-bold p-3 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9.5px] font-bold text-[#615e56] uppercase tracking-wider block">Current Password</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9.5px] font-bold text-[#615e56] uppercase tracking-wider block">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9.5px] font-bold text-[#615e56] uppercase tracking-wider block">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" 
            />
          </div>

          <div className="pt-4 flex justify-end border-t border-neutral-200/60 mt-5">
            <button 
              type="submit"
              className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9.5px] font-black tracking-widest px-5 py-2.5 uppercase cursor-pointer border-none rounded-none transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#224870] text-white text-[9px] font-bold tracking-widest px-5 py-3 uppercase z-50 flex items-center gap-2 shadow-xl animate-fade-in">
          <Check className="w-3.5 h-3.5" /> Password Updated
        </div>
      )}
    </div>
  );
}
