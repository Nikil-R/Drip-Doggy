"use client";
import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "motion/react";
import { cn } from "./utils";

interface MagneticDockProps {
  items: DockItemData[];
  iconSize?: number;
  maxScale?: number;
  magneticDistance?: number;
  showLabels?: boolean;
  position?: "bottom" | "top" | "left" | "right";
  variant?: "glass" | "solid" | "transparent";
  className?: string;
}

interface DockItemData {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  badge?: number;
}

interface DockItemProps {
  item: DockItemData;
  mouseX: MotionValue<number>;
  iconSize: number;
  maxScale: number;
  magneticDistance: number;
  showLabels: boolean;
  isVertical: boolean;
}

function DockItem({
  item,
  mouseX,
  iconSize,
  maxScale,
  magneticDistance,
  showLabels,
  isVertical,
}: DockItemProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    if (!ref.current) return magneticDistance + 1;
    const rect = ref.current.getBoundingClientRect();
    const center = isVertical
      ? rect.top + rect.height / 2
      : rect.left + rect.width / 2;
    return val - center;
  });

  const scale = useTransform(
    distance,
    [-magneticDistance, 0, magneticDistance],
    [1, maxScale, 1]
  );

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothScale = useSpring(scale, springConfig);
  const size = useTransform(smoothScale, (s) => s * iconSize);

  const y = useTransform(smoothScale, (s) => (s - 1) * -10);
  const smoothY = useSpring(y, springConfig);

  const handleClick = () => {
    item.onClick?.();
    const section = document.getElementById(item.id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.button
      ref={ref}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex items-center justify-center rounded-none",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
        item.isActive && "bg-neutral-200/50"
      )}
      style={{
        width: size,
        height: size,
        y: isVertical ? 0 : smoothY,
        x: isVertical ? smoothY : 0,
      }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Icon Container */}
      <motion.div
        className={cn(
          "relative w-full h-full overflow-hidden",
          "bg-gradient-to-b from-neutral-100 to-neutral-50",
          "border border-neutral-300",
          "shadow-lg shadow-black/10",
          "flex items-center justify-center",
          "transition-all duration-200"
        )}
        style={{
          boxShadow: isHovered
            ? "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)"
            : "0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        <div className="w-[60%] h-[60%] flex items-center justify-center text-neutral-700">
          {item.icon}
        </div>
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, transparent 100%)",
            opacity: isHovered ? 0.9 : 0.5,
          }}
        />
      </motion.div>

      {/* Badge */}
      <AnimatePresence>
        {item.badge !== undefined && item.badge > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={cn(
              "absolute -top-1 -right-1",
              "min-w-[20px] h-5 px-1.5",
              "rounded-full bg-red-500",
              "text-white text-xs font-semibold",
              "flex items-center justify-center",
              "border-2 border-white",
              "shadow-lg"
            )}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Indicator */}
      <AnimatePresence>
        {item.isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={cn(
              "absolute -bottom-2",
              "w-1.5 h-1.5 rounded-full",
              "bg-neutral-600"
            )}
          />
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {showLabels && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute -top-10 left-1/2 -translate-x-1/2",
              "px-3 py-1.5",
              "bg-white",
              "text-neutral-800 text-sm font-medium whitespace-nowrap",
              "border border-neutral-200",
              "shadow-xl shadow-black/10",
              "pointer-events-none z-50"
            )}
          >
            {item.label}
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 -bottom-1",
                "w-2 h-2 rotate-45",
                "bg-white",
                "border-r border-b border-neutral-200"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? "0 0 30px rgba(255,255,255,0.15)"
            : "0 0 0px rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}

export function MagneticDock({
  items,
  iconSize = 52,
  maxScale = 1.5,
  magneticDistance = 150,
  showLabels = true,
  position = "bottom",
  variant = "glass",
  className,
}: MagneticDockProps) {
  const mousePosition = useMotionValue(Infinity);
  const isVertical = position === "left" || position === "right";

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (isVertical) {
        mousePosition.set(e.clientY);
      } else {
        mousePosition.set(e.clientX);
      }
    },
    [mousePosition, isVertical]
  );

  const handleMouseLeave = () => {
    mousePosition.set(Infinity);
  };

  const variantStyles = {
    glass: cn(
      "bg-white/80 backdrop-blur-xl backdrop-saturate-150",
      "border border-neutral-200"
    ),
    solid: cn(
      "bg-neutral-100",
      "border border-neutral-300"
    ),
    transparent: "bg-transparent border-0",
  };

  const positionStyles = {
    bottom: "flex-row",
    top: "flex-row",
    left: "flex-col",
    right: "flex-col",
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "inline-flex items-end gap-2 p-3",
        variantStyles[variant],
        positionStyles[position],
        "shadow-xl shadow-black/10",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {items.map((item) => (
        <DockItem
          key={item.id}
          item={item}
          mouseX={mousePosition}
          iconSize={iconSize}
          maxScale={maxScale}
          magneticDistance={magneticDistance}
          showLabels={showLabels}
          isVertical={isVertical}
        />
      ))}
    </motion.div>
  );
}

export type { MagneticDockProps, DockItemData };
