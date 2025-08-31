import { useEffect, useRef } from "react";

export default function Parallax({ children, speed = 0.2 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const y = rect.top + rect.height * 0.5 - window.innerHeight * 0.5;
        const t = -y * speed;
        el.style.transform = `translate3d(0, ${t.toFixed(2)}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);
  return <div ref={ref} style={{ willChange: "transform" }}>{children}</div>;
}
