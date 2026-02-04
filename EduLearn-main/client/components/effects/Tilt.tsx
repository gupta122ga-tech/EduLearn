import { useRef } from "react";

type TiltProps = {
  children: React.ReactNode;
  max?: number; // max degrees
  scale?: number;
  className?: string;
};

export default function Tilt({ children, max = 10, scale = 1.02, className }: TiltProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  let frame = 0 as unknown as number;

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = (+py * max).toFixed(2);
    const ry = (-px * max).toFixed(2);
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      el.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  };

  return (
    <div
      className={className}
      style={{ transformStyle: "preserve-3d", transition: "transform 200ms ease" }}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
