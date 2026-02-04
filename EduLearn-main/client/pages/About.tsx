import { BookOpenCheck, CloudUpload, Download, ShieldCheck, Users, Zap } from "lucide-react";

export default function About() {
  return (
    <main>
      {/* Top section */}
      <section className="container-max py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">About EduLearn</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            EduLearn is a community-driven notes library. Anyone can upload their study notes, and anyone can read and download them for free. Our goal is to make high‑quality learning resources accessible to every student, everywhere.
          </p>
        </div>

        {/* Highlights */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { Icon: CloudUpload, title: "Open uploads", desc: "Share your PDFs, slides, or summaries in seconds." },
            { Icon: BookOpenCheck, title: "Easy to read", desc: "Beautiful viewer and clean layout across devices." },
            { Icon: Download, title: "Free downloads", desc: "Grab what you need without paywalls or ads." },
            { Icon: ShieldCheck, title: "Respect & safety", desc: "Report content, request takedowns, and stay compliant." },
            { Icon: Users, title: "Built by students", desc: "Guided by real learners and educators." },
            { Icon: Zap, title: "Blazing fast", desc: "Optimized for quick search and instant access." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-xl p-5 elevate">
              <div className="flex items-start gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">{title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-max py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
        <ol className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <li className="bg-card rounded-xl p-6 elevate">
            <div className="text-sm font-semibold text-primary">Step 1</div>
            <div className="mt-1 text-lg font-semibold">Upload your notes</div>
            <p className="mt-2 text-sm text-muted-foreground">Head to the Notes page, add a title and description, and upload your file.</p>
          </li>
          <li className="bg-card rounded-xl p-6 elevate">
            <div className="text-sm font-semibold text-primary">Step 2</div>
            <div className="mt-1 text-lg font-semibold">Discover resources</div>
            <p className="mt-2 text-sm text-muted-foreground">Browse the community library and find exactly what you need to study.</p>
          </li>
          <li className="bg-card rounded-xl p-6 elevate">
            <div className="text-sm font-semibold text-primary">Step 3</div>
            <div className="mt-1 text-lg font-semibold">Read or download</div>
            <p className="mt-2 text-sm text-muted-foreground">Open notes online or download them for offline learning anytime.</p>
          </li>
        </ol>
      </section>

      {/* Values */}
      <section className="container-max py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Our values</h2>
            <p className="mt-3 text-muted-foreground">We believe knowledge should be open, collaborative, and respectful. We encourage clear attribution and non‑commercial sharing of notes unless authors specify otherwise.</p>
          </div>
          <div className="bg-card rounded-xl p-6 elevate">
            <h3 className="font-semibold">Community guidelines</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Upload only materials you have the right to share.</li>
              <li>Credit original authors when applicable.</li>
              <li>Keep content helpful, accurate, and inclusive.</li>
              <li>Report issues so we can keep the library safe for everyone.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-max py-12">
        <div className="bg-gradient-brand text-white rounded-2xl p-8 md:p-10 elevate-lg">
          <h2 className="text-2xl md:text-3xl font-bold">Contribute your notes today</h2>
          <p className="mt-2 text-white/90">Help other learners by sharing what you’ve created—and discover new resources while you’re here.</p>
          <a href="/courses" className="mt-6 inline-flex items-center justify-center h-11 px-6 rounded-md bg-white/10 hover:bg-white/20 transition text-white underline-animation">Go to Notes</a>
        </div>
      </section>
    </main>
  );
}
