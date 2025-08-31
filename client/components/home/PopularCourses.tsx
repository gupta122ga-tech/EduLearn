import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { NoteItem } from "@shared/api";
import Tilt from "@/components/effects/Tilt";
import ScrollReveal from "@/components/effects/ScrollReveal";

export default function PopularCourses() {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data: NoteItem[]) => setNotes(data.slice(0, 2)))
      .catch(() => setNotes([]));
  }, []);

  return (
    <section className="container-max mt-20" aria-labelledby="popular-notes-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="popular-notes-title" className="text-3xl md:text-4xl font-bold text-foreground">
            Popular Notes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Recently uploaded community notes
          </p>
        </div>
        <Link to="/courses" className="hidden md:inline text-primary underline-animation">View all notes →</Link>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((n) => (
          <ScrollReveal key={n.id}>
            <Tilt>
              <a
                href={n.url}
                className="group bg-card text-card-foreground rounded-xl p-4 md:p-5 elevate hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  alt=""
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 animate-fadeTransition"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold group-hover:text-foreground">{n.title}</h3>
                <span className="text-sm font-medium text-primary">{(n.size/1024).toFixed(1)} KB</span>
              </div>
              {n.description && (
                <p className="text-sm text-muted-foreground mt-1">{n.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{n.course ? `${n.course} • ` : ""}{n.subject || "General"}</p>
              <div className="mt-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground/90">Uploaded by {n.ownerName || 'Anonymous'} • {(n.views ?? 0)} views</span>
              </div>
              <div className="mt-4">
                <span className="text-primary underline-animation">Download →</span>
              </div>
              </a>
            </Tilt>
          </ScrollReveal>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full text-muted-foreground">
            No notes yet. Be the first to upload on the Courses page.
          </div>
        )}
      </div>

      <div className="mt-6 md:hidden">
        <Link to="/courses" className="text-primary underline-animation">View all notes →</Link>
      </div>
    </section>
  );
}
