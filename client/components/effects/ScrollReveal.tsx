import { useEffect, useRef } from "react";

export default function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current!;
    if (!el) return;
    el.classList.add("sr-hidden");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("sr-show");
            el.classList.remove("sr-hidden");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
