import { useEffect, useRef, useState } from "react";

export default function PdfPreview({ url, onDownload }: { url: string; onDownload: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const pdfjs = await import("pdfjs-dist");
      const workerUrl = (await import("pdfjs-dist/build/pdf.worker.mjs?url")).default as string;
      (pdfjs as any).GlobalWorkerOptions.workerSrc = workerUrl;
      const { getDocument } = await import("pdfjs-dist");
      const task = (getDocument as any)({ url });
      const pdf = await task.promise;
      const pagesToRender = Math.min(2, pdf.numPages);
      const container = containerRef.current!;
      container.innerHTML = "";
      for (let i = 1; i <= pagesToRender; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        container.appendChild(canvas);
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (i === 2) {
          // Add gating overlay at ~half of page 2
          const gate = document.createElement("div");
          gate.style.position = "relative";
          gate.style.marginTop = "-45%";
          gate.style.height = "45%";
          const overlay = document.createElement("div");
          overlay.style.position = "absolute";
          overlay.style.inset = "0";
          overlay.style.backdropFilter = "blur(3px)";
          overlay.style.background = "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.35))";
          overlay.style.display = "flex";
          overlay.style.alignItems = "center";
          overlay.style.justifyContent = "center";
          overlay.innerHTML = `<button style="padding:10px 16px;border-radius:8px;background:linear-gradient(135deg,#6200EE,#03DAC6);color:white;border:none;cursor:pointer;">Download to continue</button>`;
          overlay.querySelector("button")?.addEventListener("click", onDownload);
          gate.appendChild(overlay);
          container.appendChild(gate);
        }
      }
      if (mounted) setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, [url, onDownload]);

  return (
    <div className="relative">
      <div ref={containerRef} className="space-y-4" />
      {!ready && <div className="h-40 flex items-center justify-center text-muted-foreground">Loading preview…</div>}
    </div>
  );
}
