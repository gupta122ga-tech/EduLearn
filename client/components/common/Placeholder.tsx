interface PlaceholderProps { title: string; description?: string }

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="container-max py-24">
      <div className="bg-card rounded-xl p-10 elevate text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-muted-foreground">
          {description ?? "This is a notes platform: anyone can upload, read, and download study notes for free."}
        </p>
      </div>
    </div>
  );
}
