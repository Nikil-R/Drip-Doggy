import { useState } from "react";
import { useAuthStore } from "@/app/store/auth-store";
import { User, Mail, Shield, Check } from "lucide-react";

export function ProfilePage() {
  const { user } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.name.split(" ")[0] || "Nikil");
  const [lastName, setLastName] = useState(user?.name.split(" ")[1] || "R");
  const [email] = useState(user?.email || "nikil@dripdoggy.com");
  const [toast, setToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-[#382d24]">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
          <User className="w-5 h-5 text-[#224870]" /> My Profile
        </h1>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">
          Manage your administrator profile details
        </p>
      </div>

      <div className="bg-card border border-neutral-200 p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-4 border-b border-neutral-100 pb-4">
          <div className="w-12 h-12 bg-[#224870] text-white flex items-center justify-center text-sm font-black tracking-widest uppercase">
            {firstName[0] || ""}{lastName[0] || ""}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider">{firstName} {lastName}</h3>
            <span className="text-[8px] font-extrabold tracking-wider bg-[#224870]/10 border border-[#224870]/20 px-2 py-0.5 uppercase text-[#224870] mt-1 inline-block">
              Administrator
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-bold text-[#615e56] uppercase tracking-wider block">First Name</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)}
                className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-bold text-[#615e56] uppercase tracking-wider block">Last Name</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={e => setLastName(e.target.value)}
                className="w-full bg-[#faf8f5] border border-neutral-300 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9.5px] font-bold text-[#615e56] uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                value={email} 
                disabled
                className="w-full bg-[#faf8f5]/50 cursor-not-allowed border border-neutral-200 px-3.5 py-2.5 text-xs font-bold text-neutral-450 focus:outline-none rounded-none" 
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            </div>
            <span className="text-[7.5px] text-neutral-400 uppercase tracking-wider block mt-1">To change your email address, contact workspace authority.</span>
          </div>

          <div className="pt-4 flex justify-end border-t border-neutral-200/60 mt-5">
            <button 
              type="submit"
              className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9.5px] font-black tracking-widest px-5 py-2.5 uppercase cursor-pointer border-none rounded-none transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#224870] text-white text-[9px] font-bold tracking-widest px-5 py-3 uppercase z-50 flex items-center gap-2 shadow-xl animate-fade-in">
          <Check className="w-3.5 h-3.5" /> Profile Updated
        </div>
      )}
    </div>
  );
}
