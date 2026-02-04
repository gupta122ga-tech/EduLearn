import { useEffect } from "react";

export default function AutoReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.sr-hidden'));
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          (e.target as HTMLElement).classList.add('sr-show');
          (e.target as HTMLElement).classList.remove('sr-hidden');
          io.unobserve(e.target);
        }
      })
    }, { threshold: 0.15 });
    els.forEach(el=>io.observe(el));
    return ()=> io.disconnect();
  }, []);
  return null;
}
