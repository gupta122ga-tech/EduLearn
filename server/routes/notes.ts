import type { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import type { NoteItem, NotesListResponse, NoteUploadResponse } from "@shared/api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");
const uploadsDir = path.join(rootDir, "server", "uploads");
const dataDir = path.join(rootDir, "server", "data");
const dataFile = path.join(dataDir, "notes.json");

for (const dir of [uploadsDir, dataDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

function readNotes(): NoteItem[] {
  try {
    const raw = fs.readFileSync(dataFile, "utf8");
    const parsed = JSON.parse(raw) as NoteItem[];
    // ensure defaults
    return parsed.map((n) => ({ views: 0, subject: n.subject ?? undefined, course: n.course ?? undefined, ...n }));
  } catch {
    return [];
  }
}

function writeNotes(notes: NoteItem[]) {
  fs.writeFileSync(dataFile, JSON.stringify(notes, null, 2), "utf8");
}

export const listNotes: RequestHandler = (_req, res) => {
  const notes = readNotes();
  const sorted = notes
    .map((n) => ({ ...n, views: typeof n.views === "number" ? n.views : 0 }))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  res.json(sorted as NotesListResponse);
};

export const uploadNote: RequestHandler = [
  upload.single("file"),
  (req, res) => {
    const file = req.file;
    const { title, description, ownerEmail, ownerName, subject, course } = req.body as { title?: string; description?: string; ownerEmail?: string; ownerName?: string; subject?: string; course?: string };

    if (!file) {
      return res.status(400).json({ ok: false, error: "File is required" });
    }

    // Enforce authentication: require ownerEmail in payload
    if (!ownerEmail || !ownerEmail.trim()) {
      try { fs.unlinkSync(path.join(uploadsDir, file.filename)); } catch {}
      return res.status(401).send("Authentication required. Please login to upload notes.");
    }

    // Validate required fields: title and course
    if (!title || !title.trim()) {
      try { fs.unlinkSync(path.join(uploadsDir, file.filename)); } catch {}
      return res.status(400).send("Title is required");
    }
    if (!course || !course.trim()) {
      try { fs.unlinkSync(path.join(uploadsDir, file.filename)); } catch {}
      return res.status(400).send("Course is required");
    }

    const id = path.parse(file.filename).name;
    const note: NoteItem = {
      id,
      title: title?.trim() || file.originalname,
      description: description?.trim() || undefined,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url: `/uploads/${file.filename}`,
      uploadedAt: new Date().toISOString(),
      ownerEmail: ownerEmail?.trim() || undefined,
      ownerName: ownerName?.trim() || undefined,
      subject: subject?.trim() || undefined,
      course: course?.trim() || undefined,
      views: 0,
    };

    const notes = readNotes();
    notes.push(note);
    writeNotes(notes);

    res.json({ ok: true, note } as NoteUploadResponse);
  },
] as unknown as RequestHandler;

export const deleteNote: RequestHandler = (req, res) => {
  const { id } = req.params as { id: string };
  const notes = readNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
  const [removed] = notes.splice(idx, 1);
  writeNotes(notes);
  try { fs.unlinkSync(path.join(uploadsDir, removed.filename)); } catch {}
  res.json({ ok: true });
};

export const updateNote: RequestHandler = (req, res) => {
  const { id } = req.params as { id: string };
  const { title, description } = req.body as { title?: string; description?: string };
  const notes = readNotes();
  const note = notes.find((n) => n.id === id);
  if (!note) return res.status(404).json({ ok: false, error: "Not found" });
  if (typeof title === "string") note.title = title.trim();
  if (typeof description === "string") note.description = description.trim();
  writeNotes(notes);
  res.json({ ok: true, note });
};

export const addView: RequestHandler = (req, res) => {
  const { id } = req.params as { id: string };
  const notes = readNotes();
  const note = notes.find((n) => n.id === id);
  if (!note) return res.status(404).json({ ok: false, error: "Not found" });
  note.views = (note.views ?? 0) + 1;
  writeNotes(notes);
  res.json({ ok: true, views: note.views });
};

export const getNote: RequestHandler = (req, res) => {
  const { id } = req.params as { id: string };
  const notes = readNotes();
  const note = notes.find((n) => n.id === id);
  if (!note) return res.status(404).json({ ok: false, error: "Not found" });
  res.json(note);
};
