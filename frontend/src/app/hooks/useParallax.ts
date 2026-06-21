import { useEffect, useState } from "react";

export function useParallax(factor: number = 0.18, maxPx: number = 60) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setOffset(Math.min(y * factor, maxPx));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor, maxPx]);

  return offset;
}
