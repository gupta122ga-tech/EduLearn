import { useEffect, useState } from "react";
import type { NoteItem, NotesListResponse, NoteUploadResponse } from "@shared/api";
import { useAuth } from "@/context/AuthContext";
import Tilt from "@/components/effects/Tilt";
import { Link, useNavigate } from "react-router-dom";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Courses() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const COURSES = ["BCA", "BBA", "BTech", "MBA", "MCA", "Others"];

  const refresh = () => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data: NotesListResponse) => setNotes(data))
      .catch(() => setNotes([]));
  };

  useEffect(() => {
    refresh();
  }, []);

  const trackView = (id: string) => {
    const url = `/api/notes/${id}/view`;
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' , keepalive: true}).catch(()=>{});
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError("Please login or register to upload notes.");
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const course = String(fd.get("course") || "").trim();
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!course) {
      setError("Course is required");
      return;
    }
    if (user?.email) fd.append("ownerEmail", user.email);
    if (user?.name) fd.append("ownerName", user.name);
    const file = fd.get("file") as File | null;
    if (!file || (file as any).size === 0) {
      setError("Please select a file to upload.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const msg = await res.text().catch(()=>"");
        throw new Error(msg || "Upload failed");
      }
      const data = (await res.json()) as NoteUploadResponse;
      setNotes((prev) => [data.note, ...prev]);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <main>
      <section className="container-max py-10">
        <h1 className="text-3xl md:text-4xl font-bold">Community Notes Library</h1>
        <p className="mt-2 text-muted-foreground">Upload your study notes and browse downloads from the community.</p>

        {!user ? (
          <div className="mt-8 bg-card rounded-xl p-6 elevate">
            <h2 className="text-xl font-semibold">Sign in required</h2>
            <p className="mt-2 text-muted-foreground">Please login or create an account to upload notes.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/login" className="h-10 inline-flex items-center justify-center px-4 rounded-md border border-input">Login</Link>
              <Link to="/register" className="h-10 inline-flex items-center justify-center px-4 rounded-md bg-gradient-brand text-white">Register</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 bg-card rounded-xl p-6 elevate grid gap-4 md:grid-cols-2" aria-label="Upload a note">
            <div className="space-y-3">
              <label className="block text-sm font-medium" htmlFor="title">Title</label>
              <input id="title" name="title" type="text" placeholder="e.g. Calculus Chapter 1 Summary" className="w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="block text-sm font-medium" htmlFor="subject">Subject</label>
                  <input id="subject" name="subject" placeholder="e.g. Data Structures" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium" htmlFor="course">Course</label>
                  <select id="course" name="course" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" required>
                    <option value="">Select course</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="block text-sm font-medium mt-4" htmlFor="description">Description</label>
              <textarea id="description" name="description" placeholder="Short description" className="w-full rounded-md border border-input bg-background px-3 py-2 h-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium" htmlFor="file">Select file</label>
              <input id="file" name="file" type="file" className="w-full rounded-md border border-input bg-background px-3 py-2" />
              <button disabled={pending} className="mt-4 inline-flex items-center justify-center h-11 px-5 rounded-md text-white bg-gradient-brand hover:brightness-110 ripple">
                {pending ? "Uploading..." : "Upload Note"}
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </form>
        )}

        <div className="mt-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-2xl font-semibold">All Notes</h2>
            <div className="flex items-center gap-3">
              <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by subject..." className="rounded-md border border-input bg-background px-3 py-2 w-56" />
              <select value={courseFilter} onChange={(e)=>setCourseFilter(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2" aria-label="Filter by course">
                <option value="">All courses</option>
                {COURSES.map((c)=> <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={refresh} className="text-sm text-primary underline-animation">Refresh</button>
            </div>
          </div>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes
              .filter((n)=> (courseFilter? n.course===courseFilter : true))
              .filter((n)=> (search? (n.subject||"").toLowerCase().includes(search.toLowerCase()) : true))
              .map((n) => (
              <li key={n.id}>
                <Tilt>
                  <div className="bg-card rounded-lg p-4 elevate">
                    <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{n.title}</h3>
                    {n.description && (
                      <p className="text-sm text-muted-foreground mt-1">{n.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{n.originalName} • {formatSize(n.size)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.course ? `${n.course} • ` : ""}{n.subject || "General"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Uploaded by {n.ownerName || "Anonymous"} • {n.views ?? 0} views</p>
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <a href={`/notes/${n.id}`} className="text-primary underline-animation">View</a>
                    <a href={`/notes/${n.id}`} target="_blank" rel="noreferrer" className="text-primary underline-animation">Preview</a>
                    <a href={n.url} onClick={() => trackView(n.id)} className="text-primary underline-animation">Download</a>
                  </div>
                    </div>
                  </div>
                </Tilt>
              </li>
            ))}
            {notes.length === 0 && (
              <li className="text-muted-foreground">No notes uploaded yet.</li>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
