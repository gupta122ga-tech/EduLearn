export default function FeaturesGrid() {
  const features = [
    { icon: "/assets/live-class.svg", title: "Live Classes", description: "Attend real-time sessions with experts." },
    { icon: "/assets/download.svg", title: "Course Materials", description: "Download videos and PDFs anytime." },
    { icon: "/assets/assignment.svg", title: "Assignments", description: "Submit work and get personalized feedback." },
    { icon: "/assets/certificate.svg", title: "Certificates", description: "Earn verified credentials upon completion." },
  ];

  return (
    <section className="container-max mt-12" aria-label="Platform features">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f) => (
          <div key={f.title} className="bg-card text-card-foreground rounded-xl p-4 md:p-5 elevate animate-slideInUp">
            <div className="flex items-start gap-3">
              <img src={f.icon} alt="" className="h-8 w-8" aria-hidden="true" />
              <div>
                <div className="font-semibold">{f.title}</div>
                <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
