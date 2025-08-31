import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { handleDemo } from "./routes/demo";
import { listNotes, uploadNote, deleteNote, updateNote, addView, getNote } from "./routes/notes";
import { handleContact } from "./routes/contact";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static hosting for uploaded files
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const uploadsPath = path.resolve(__dirname, "uploads");
  app.use("/uploads", express.static(uploadsPath));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Notes API
  app.get("/api/notes", listNotes);
  app.post("/api/notes", uploadNote);
  app.delete("/api/notes/:id", deleteNote);
  app.patch("/api/notes/:id", updateNote);
  app.post("/api/notes/:id/view", addView);
  app.get("/api/notes/:id", getNote);

  // Contact API
  app.post("/api/contact", handleContact);

  return app;
}
