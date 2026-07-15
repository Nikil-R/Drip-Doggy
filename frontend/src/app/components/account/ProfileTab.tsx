import { useState } from "react";
import { User, Mail, Phone, BadgeCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PhoneVerification } from "./PhoneVerification";
import { validateName, validatePhone } from "../../utils/validation";

interface ProfileTabProps {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
  }>>;
  phoneVerified: boolean;
  setPhoneVerified: (v: boolean) => void;
}

export function ProfileTab({ profile, setProfile, phoneVerified, setPhoneVerified }: ProfileTabProps) {
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const firstErr = validateName("First Name", profile.firstName);
    if (firstErr) {
      setError(firstErr);
      return;
    }
    const lastErr = validateName("Last Name", profile.lastName);
    if (lastErr) {
      setError(lastErr);
      return;
    }
    const phoneErr = validatePhone(profile.phone);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }

    setSuccessMsg("Profile updated successfully!");
  };

  return (
    <div className="bg-white border border-neutral-200/80 p-8">
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 mb-8">
        <User className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
        <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase">User Profile</h1>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
              First Name
            </label>
            <input type="text" required value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2.5 text-xs font-bold tracking-wide focus:outline-none focus:border-[#030213] transition-colors uppercase placeholder-neutral-300"
              placeholder="FIRST NAME" />
          </div>
          <div>
            <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
              Last Name
            </label>
            <input type="text" required value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2.5 text-xs font-bold tracking-wide focus:outline-none focus:border-[#030213] transition-colors uppercase placeholder-neutral-300"
              placeholder="LAST NAME" />
          </div>
        </div>

        {/* Email — Read-only, verified */}
        <div>
          <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
            Email Address
          </label>
          <div className="flex items-center gap-3 bg-green-50/50 border border-green-200/60 px-3.5 py-2.5">
            <Mail className="h-4 w-4 text-green-600 stroke-[1.5] flex-shrink-0" />
            <span className="flex-1 text-xs font-bold tracking-wide text-neutral-700 lowercase">{profile.email}</span>
            <span className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest text-green-600 uppercase">
              <BadgeCheck className="h-3.5 w-3.5 stroke-[1.5]" />
              Verified
            </span>
          </div>
          <p className="text-[7px] text-neutral-400 font-medium mt-1 tracking-wide">
            Email is verified and cannot be changed. Contact support for email changes.
          </p>
        </div>

        {/* Phone — Editable with verify button */}
        <div>
          <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
            Phone Number
          </label>
          <div className="flex items-center gap-3 bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2.5">
            <Phone className="h-4 w-4 text-neutral-400 stroke-[1.5] flex-shrink-0" />
            <input type="tel" required value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="flex-1 bg-transparent border-none p-0 text-xs font-bold tracking-wide focus:outline-none text-neutral-700 placeholder-neutral-300"
              placeholder="PHONE NUMBER" />
            <div className="flex-shrink-0">
              {phoneVerified ? (
                <span className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest text-green-600 uppercase">
                  <BadgeCheck className="h-3.5 w-3.5 stroke-[1.5]" />
                  Verified
                </span>
              ) : (
                <PhoneVerification phone={profile.phone} onVerified={() => setPhoneVerified(true)} />
              )}
            </div>
          </div>
        </div>

        {/* Date of Birth & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
              Date of Birth
            </label>
            <input type="text" readOnly value={profile.dateOfBirth}
              className="w-full bg-neutral-100/60 border border-neutral-200 px-3.5 py-2.5 text-xs font-bold tracking-wide text-neutral-500 focus:outline-none cursor-not-allowed uppercase"
              placeholder="NOT PROVIDED" />
          </div>
          <div>
            <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
              Gender
            </label>
            <input type="text" readOnly value={profile.gender}
              className="w-full bg-neutral-100/60 border border-neutral-200 px-3.5 py-2.5 text-xs font-bold tracking-wide text-neutral-500 focus:outline-none cursor-not-allowed uppercase"
              placeholder="NOT PROVIDED" />
          </div>
        </div>

        {error && (
          <p className="text-[10px] font-extrabold text-red-600 tracking-wider uppercase">✕ {error}</p>
        )}
        {successMsg && (
          <p className="text-[10px] font-extrabold text-green-600 tracking-wider uppercase">✓ {successMsg}</p>
        )}

        <div className="pt-4 border-t border-neutral-100">
          <button type="submit"
            className="bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-200 border-none cursor-pointer">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
