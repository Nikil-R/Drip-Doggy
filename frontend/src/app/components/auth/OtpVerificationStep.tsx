import { OTPInput } from "input-otp";
import { ShieldCheck, Zap, ArrowLeft } from "lucide-react";

interface OtpVerificationStepProps {
  otp: string;
  onOtpChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onAutoFill?: () => void;
  isSubmitting: boolean;
  error: string | null;
  showDevHelper?: boolean;
  submitLabel?: string;
}

const MOCK_OTP = "123456";

export function OtpVerificationStep({
  otp,
  onOtpChange,
  onSubmit,
  onBack,
  onAutoFill,
  isSubmitting,
  error,
  showDevHelper = true,
  submitLabel = "VERIFY OTP",
}: OtpVerificationStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleAutoFill = () => {
    onOtpChange(MOCK_OTP);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* OTP Input */}
      <div className="flex justify-center py-2">
        <OTPInput
          maxLength={6}
          value={otp}
          onChange={(val) => onOtpChange(val.replace(/\D/g, ""))}
          disabled={isSubmitting}
          containerClassName="flex items-center gap-2 sm:gap-3"
          render={({ slots }) => (
            <>
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`w-10 sm:w-12 h-12 sm:h-14 flex items-center justify-center text-lg sm:text-xl font-mono font-extrabold bg-white border rounded-md transition-all duration-200 ${
                    slot.isActive
                      ? "border-[#B89C72] ring-1 ring-[#B89C72]/20 scale-105"
                      : "border-neutral-200"
                  } ${otp.length === 6 && !slot.isActive ? "border-[#B89C72]/30" : ""}`}
                >
                  {slot.char ? (
                    <span className="animate-in fade-in duration-100">{slot.char}</span>
                  ) : (
                    <span className="text-neutral-300 text-base">•</span>
                  )}
                </div>
              ))}
            </>
          )}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50/50 border border-red-200/50 px-4 py-3 text-center">
          <p className="text-[10px] font-bold text-red-600 tracking-wider uppercase">
            {error}
          </p>
        </div>
      )}

      {/* Dev Mode Helper */}
      {showDevHelper && (
        <div className="bg-[#FAF8F5] border border-neutral-200/60 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-5 bg-neutral-200 rounded-none flex items-center justify-center">
              <ShieldCheck className="h-3 w-3 text-neutral-500 stroke-[1.5]" />
            </div>
            <span className="text-[8px] font-mono font-bold text-neutral-500 tracking-wider uppercase leading-tight">
              DEV MODE — MOCK OTP: <span className="text-neutral-900 font-extrabold text-[9px]">{MOCK_OTP}</span>
            </span>
          </div>
          {onAutoFill && (
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 text-[8px] font-extrabold tracking-widest uppercase text-[#b2533e] hover:text-[#a04835] transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <Zap className="h-3 w-3" />
              AUTO-FILL
            </button>
          )}
        </div>
      )}

      {/* Verify Button */}
      <button
        type="submit"
        disabled={isSubmitting || otp.length !== 6}
        className="w-full bg-[#1c1c1c] hover:bg-[#2c2c2c] disabled:bg-neutral-200 text-[#c5a880] disabled:text-neutral-400 rounded-md py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              VERIFYING...
            </>
          ) : (
            submitLabel
          )}
        </span>
      </button>

      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isSubmitting}
        className="group w-full bg-transparent text-neutral-500 hover:text-[#B89C72] py-3 text-[9px] font-black tracking-[0.2em] uppercase transition-colors border-none cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
      >
        <ArrowLeft className="h-3 w-3 stroke-[2] transition-transform duration-200 group-hover:-translate-x-0.5" />
        CHANGE EMAIL / PHONE
      </button>
    </form>
  );
}
