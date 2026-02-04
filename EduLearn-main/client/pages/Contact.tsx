import { Mail, MapPin, MessageSquare, Phone, Send, ShieldQuestion } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setStatus(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    if (!payload.name || !payload.email || !payload.message) {
      setStatus({ ok: false, msg: "Please fill name, email and message." });
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus({ ok: true, msg: "Thanks! We received your message." });
      form.reset();
    } catch (err: any) {
      setStatus({ ok: false, msg: err.message || "Failed to send" });
    } finally {
      setPending(false);
    }
  };

  return (
    <main>
      <section className="container-max py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
          <p className="mt-3 text-lg text-muted-foreground">We’re here to help. Send us a message about feedback, content reports, or partnership opportunities.</p>
        </div>

        {/* Contact Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-card rounded-xl p-5 elevate">
            <div className="flex items-start gap-3"><Mail className="h-6 w-6 text-primary" /><div><div className="font-semibold">Email</div><p className="text-sm text-muted-foreground mt-1">luffy123.ly@gmail.com</p></div></div>
          </div>
          <div className="bg-card rounded-xl p-5 elevate">
            <div className="flex items-start gap-3"><Phone className="h-6 w-6 text-primary" /><div><div className="font-semibold">Phone</div><p className="text-sm text-muted-foreground mt-1">+91 8005561314</p></div></div>
          </div>
          <div className="bg-card rounded-xl p-5 elevate">
            <div className="flex items-start gap-3"><MapPin className="h-6 w-6 text-primary" /><div><div className="font-semibold">Location</div><p className="text-sm text-muted-foreground mt-1">Remote‑first worldwide</p></div></div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="container-max py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <form onSubmit={onSubmit} className="md:col-span-2 bg-card rounded-xl p-6 elevate" aria-label="Contact form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                <input id="name" name="name" required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input id="email" name="email" type="email" required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
                <input id="subject" name="subject" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium">Category</label>
                <select id="category" name="category" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="general">General</option>
                  <option value="feedback">Feedback</option>
                  <option value="report">Report content</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium">Message</label>
                <textarea id="message" name="message" required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 h-36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
            </div>
            <button disabled={pending} className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-md bg-gradient-brand text-white hover:brightness-110 ripple">
              <Send className="h-4 w-4" /> {pending ? "Sending..." : "Send message"}
            </button>
            {status && (
              <p className={`mt-3 text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}>{status.msg}</p>
            )}
          </form>

          {/* FAQ */}
          <div className="bg-card rounded-xl p-6 elevate">
            <h3 className="font-semibold flex items-center gap-2"><ShieldQuestion className="h-5 w-5 text-primary" /> FAQ</h3>
            <div className="mt-3 space-y-3">
              <details className="rounded-md border border-input p-3">
                <summary className="font-medium cursor-pointer">Is EduLearn free?</summary>
                <p className="mt-2 text-sm text-muted-foreground">Yes, uploading and downloading notes is free.</p>
              </details>
              <details className="rounded-md border border-input p-3">
                <summary className="font-medium cursor-pointer">What file types do you support?</summary>
                <p className="mt-2 text-sm text-muted-foreground">Common formats like PDF, DOCX, PPT, and images.</p>
              </details>
              <details className="rounded-md border border-input p-3">
                <summary className="font-medium cursor-pointer">How do I report content?</summary>
                <p className="mt-2 text-sm text-muted-foreground">Choose "Report content" in the form above and include details.</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-max py-12">
        <div className="bg-gradient-brand text-white rounded-2xl p-8 md:p-10 elevate-lg">
          <h2 className="text-2xl md:text-3xl font-bold">Prefer email?</h2>
          <p className="mt-2 text-white/90">Reach us directly at luffy123.ly@gmail.com and we’ll get back within 2 business days.</p>
          <a href="mailto:luffy123.ly@gmail.com" className="mt-6 inline-flex items-center justify-center h-11 px-6 rounded-md bg-white/10 hover:bg-white/20 transition text-white underline-animation"><MessageSquare className="h-4 w-4 mr-2" /> Email support</a>
        </div>
      </section>
    </main>
  );
}
