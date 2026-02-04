/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Notes API types
export interface NoteItem {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string; // /uploads/...
  uploadedAt: string; // ISO string
  ownerEmail?: string; // optional owner attribution (not displayed)
  ownerName?: string; // display name
  subject?: string; // e.g., Data Structures
  course?: string; // e.g., BCA, BBA, BTech
  views: number; // number of downloads/views
}

export type NotesListResponse = NoteItem[];

export interface NoteUploadResponse {
  ok: true;
  note: NoteItem;
}

// Contact API
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  category?: string;
  message: string;
  createdAt: string;
}

export interface ContactResponse {
  ok: true;
}
