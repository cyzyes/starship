import { TerminalWindow } from "@/components/TerminalWindow";

const posts = [
  { slug: "void", title: "VOID_MANIFEST · 初始化", hue: "magenta" as const },
  { slug: "grid", title: "PERSPECTIVE_GRID · Outrun geometry", hue: "cyan" as const },
  { slug: "signal", title: "SIGNAL_DROP · Synth pads & hiss", hue: "magenta" as const },
];

export function PlazaPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gutter)" }}>
      <TerminalWindow title="blog_plaza_index.dat" accent="cyan" showWindowDots={false}>
        <p className="font-label" style={{ color: "var(--cyan)", opacity: 0.75, marginBottom: 0 }}>
          Broadcast channel · select a feed
        </p>
      </TerminalWindow>
      <div style={{ display: "grid", gap: "var(--gutter)", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {posts.map((p) => (
          <TerminalWindow key={p.slug} title={`${p.slug}.md`} accent={p.hue}>
            <h2
              className="font-headline"
              style={{
                color: p.hue === "cyan" ? "var(--cyan)" : "var(--primary)",
                fontSize: "1.05rem",
                marginBottom: "0.5rem",
              }}
            >
              {p.title}
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--on-surface-variant)", marginBottom: "0.75rem" }}>
              Teaser placeholder — swap for real posts or Markdown routes.
            </p>
            <span className="font-label" style={{ color: "var(--cyan)" }}>
              SYNC WHEN READY
            </span>
          </TerminalWindow>
        ))}
      </div>
    </div>
  );
}
