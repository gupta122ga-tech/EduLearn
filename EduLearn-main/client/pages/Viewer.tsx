import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { NoteItem } from "@shared/api";
import PdfPreview from "@/components/viewer/PdfPreview";

export default function Viewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<NoteItem | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/notes/${id}`).then((r) => r.json()).then(setNote).catch(() => setNote(null));
  }, [id]);

  const onDownload = () => {
    if (!note) return;
    fetch(`/api/notes/${note.id}/view`, { method: "POST" });
    window.location.href = note.url;
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/courses");
  };

  if (!note) return (
    <main className="container-max py-12"><div className="text-muted-foreground">Loading note…</div></main>
  );

  const isPDF = note.mimeType?.includes("pdf");
  const isImage = note.mimeType?.startsWith("image/");

  return (
    <main className="container-max py-10">
      <div className="mb-3">
        <button onClick={goBack} className="text-sm text-primary underline-animation" aria-label="Go back">← Back</button>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold">{note.title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{note.course ? `${note.course} • ` : ''}{note.subject || 'General'}</p>

      <div className="mt-6 bg-card rounded-xl p-4 elevate">
        {isPDF ? (
          <PdfPreview url={note.url} onDownload={onDownload} />
        ) : isImage ? (
          <div className="relative">
            <img src={note.url} alt="Preview" className="w-full max-h-[1200px] object-contain" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black/40 flex items-end justify-center">
              <button onClick={onDownload} className="mb-6 h-11 px-6 rounded-md bg-gradient-brand text-white ripple">Download to continue</button>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">Preview not available for this file type.
            <button onClick={onDownload} className="ml-2 text-primary underline-animation">Download</button>
          </div>
        )}
      </div>
    </main>
  );
}
