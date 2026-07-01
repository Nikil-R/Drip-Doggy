import { cn } from "../ui/utils";
import { useInView } from "../../hooks/useInView";

type RevealVariant = "up" | "left" | "right" | "zoom" | "mask";

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  once?: boolean;
}) {
  const { ref, isInView } = useInView<HTMLDivElement>({ once });

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        ...(variant === "mask" && !isInView ? { clipPath: "inset(0 0 100% 0)" } : {}),
        ...(variant === "mask" && isInView ? { clipPath: "inset(0)" } : {}),
      }}
      className={cn(
        "opacity-0 will-change-transform will-change-opacity transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        variant === "up" && "translate-y-9",
        variant === "left" && "-translate-x-10",
        variant === "right" && "translate-x-10",
        variant === "zoom" && "scale-[0.96] blur-[6px]",
        isInView && "!opacity-100 !translate-y-0 !translate-x-0 !scale-100 !blur-0",
        className
      )}
    >
      {children}
    </div>
  );
}
