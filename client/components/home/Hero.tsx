import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Download, FileCheck2, BadgeCheck } from "lucide-react";
import HeroCanvas from "@/components/effects/HeroCanvas";
import Tilt from "@/components/effects/Tilt";
import ScrollReveal from "@/components/effects/ScrollReveal";
import Parallax from "@/components/effects/Parallax";

export default function Hero() {
  return (
    <section
      className="relative isolate"
      aria-labelledby="hero-title"
    >
      <div
        className="relative h-[520px] md:h-[600px] w-full bg-center bg-cover bg-no-repeat bg-fixed bg-gradient-brand"
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-white/10 mix-blend-overlay" />
        <HeroCanvas />
        <div className="relative z-10 h-full" style={{ perspective: "1200px" }}>
          <div className="container-max h-full flex flex-col items-start justify-center text-white">
            <Parallax speed={0.12}>
              <div className="animate-fadeIn">
                <h1 id="hero-title" className="text-[2.5rem] md:text-6xl font-bold leading-tight">
                  Learn Anything, Anytime, Anywhere
                </h1>
                <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90">
                  Upload your study notes and access a community library to read or download for free.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <Button asChild className="h-12 px-6 text-base bg-gradient-brand hover:brightness-110 text-white elevate-lg ripple">
                    <Link to="/courses">Browse Notes</Link>
                  </Button>
                </div>
              </div>
            </Parallax>
          </div>
        </div>
      </div>

      {/* Feature badges under hero */}
      <div className="-mt-10 relative z-20">
        <div className="container-max grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { Icon: Video, title: "Live Classes", description: "Attend real-time sessions with experts." },
            { Icon: Download, title: "Course Materials", description: "Download videos and PDFs anytime." },
            { Icon: FileCheck2, title: "Assignments", description: "Submit work and get personalized feedback." },
            { Icon: BadgeCheck, title: "Certificates", description: "Earn verified credentials upon completion." },
          ].map((f) => (
            <ScrollReveal>
              <Tilt>
                <div className="bg-card text-card-foreground rounded-xl p-4 md:p-5 elevate">
                  <div className="flex items-start gap-3">
                    <f.Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">{f.title}</div>
                      <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
                    </div>
                  </div>
                </div>
              </Tilt>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
