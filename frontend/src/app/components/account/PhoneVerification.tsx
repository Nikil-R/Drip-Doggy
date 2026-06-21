import { useState } from "react";
import { BadgeCheck, ShieldCheck, Zap } from "lucide-react";
import { getMockOtp } from "../../lib/auth-storage";
import { OTPInput } from "input-otp";

export function PhoneVerification({
  phone,
  onVerified,
}: {
  phone: string;
  onVerified: () => void;
}) {
  const [step, setStep] = useState<"idle" | "otp" | "success">("idle");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number with at least 10 digits.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setStep("otp");
    setOtp("");
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    if (otp !== getMockOtp()) {
      setError("Invalid OTP. Please try again.");
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    setStep("success");
    onVerified();
  };

  const handleAutoFill = () => {
    setOtp(getMockOtp());
    setTimeout(() => handleVerifyOtp(), 150);
  };

  if (step === "success") {
    return (
      <div className="flex items-center gap-1.5 text-green-600">
        <BadgeCheck className="h-3.5 w-3.5 stroke-[1.5]" />
        <span className="text-[9px] font-extrabold tracking-wider uppercase">Phone Verified</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {step === "idle" ? (
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 text-[9px] font-extrabold tracking-widest uppercase text-[#b2533e] hover:text-[#a04835] transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50"
        >
          <ShieldCheck className="h-3 w-3 stroke-[1.5]" />
          {isSubmitting ? "SENDING..." : "VERIFY PHONE"}
        </button>
      ) : (
        <div className="space-y-3 border border-neutral-200 bg-[#FAF8F5] p-4">
          <p className="text-[8px] font-extrabold tracking-widest text-neutral-500 uppercase">
            Enter OTP sent to <span className="text-[#030213]">{phone}</span>
          </p>
          <div className="flex justify-center">
            <OTPInput
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isSubmitting}
              containerClassName="flex items-center gap-1.5"
              render={({ slots }) => (
                <>
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`w-8 h-10 flex items-center justify-center text-sm font-mono font-extrabold bg-white border transition-all duration-200 ${
                        slot.isActive
                          ? "border-[#030213] ring-1 ring-[#030213]/20"
                          : "border-neutral-200"
                      }`}
                    >
                      {slot.char ? <span>{slot.char}</span> : <span className="text-neutral-300">•</span>}
                    </div>
                  ))}
                </>
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isSubmitting || otp.length !== 6}
              className="flex-1 bg-[#030213] hover:bg-neutral-800 text-white text-[8px] font-extrabold tracking-widest py-2 uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {isSubmitting ? "VERIFYING..." : "VERIFY OTP"}
            </button>
            <button
              type="button"
              onClick={handleAutoFill}
              className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest text-[#b2533e] hover:text-[#a04835] transition-colors px-2 bg-transparent border-none cursor-pointer"
            >
              <Zap className="h-3 w-3" />
              AUTO-FILL
            </button>
          </div>
          {error && <p className="text-[8px] font-extrabold text-red-600 tracking-wider uppercase">{error}</p>}
          <button
            type="button"
            onClick={() => { setStep("idle"); setError(null); }}
            className="text-[8px] font-bold text-neutral-400 hover:text-neutral-600 underline underline-offset-2 bg-transparent border-none cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
