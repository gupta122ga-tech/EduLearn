import type { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { ContactSubmission } from "@shared/api";
import { sendContactEmailWithReply } from "../mailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");
const dataDir = path.join(rootDir, "server", "data");
const dataFile = path.join(dataDir, "contacts.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function readContacts(): ContactSubmission[] {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    return [];
  }
}

function writeContacts(list: ContactSubmission[]) {
  fs.writeFileSync(dataFile, JSON.stringify(list, null, 2));
}

export const handleContact: RequestHandler = async (req, res) => {
  const { name, email, subject, category, message } = req.body as Partial<ContactSubmission>;
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "name, email, and message are required" });
  }

  const entry: ContactSubmission = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: String(name),
    email: String(email),
    subject: subject ? String(subject) : undefined,
    category: category ? String(category) : undefined,
    message: String(message),
    createdAt: new Date().toISOString(),
  };

  const list = readContacts();
  list.push(entry);
  writeContacts(list);

  let previewUrl: string | undefined = undefined;
  try {
    const emailSubject = subject ? `[Contact] ${subject}` : `[Contact] New message from ${entry.name}`;
    const text = `From: ${entry.name} <${entry.email}>\nCategory: ${entry.category || "-"}\n\n${entry.message}`;
    const html = `<p><strong>From:</strong> ${entry.name} &lt;${entry.email}&gt;</p><p><strong>Category:</strong> ${entry.category || "-"}</p><p>${entry.message.replace(/\n/g, '<br/>')}</p>`;
    const sent = await sendContactEmailWithReply(emailSubject, text, html, entry.email, entry.name);
    previewUrl = sent.previewUrl;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Contact email send failed:", (err as any)?.message || err);
  }

  res.json({ ok: true, previewUrl });
};
