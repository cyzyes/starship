import type { ReactNode } from "react";

type Accent = "magenta" | "cyan";

const headerBg: Record<Accent, string> = {
  magenta: "#ff00ff",
  cyan: "#00fbfb",
};

type Props = {
  title: string;
  accent: Accent;
  children: ReactNode;
  className?: string;
  showWindowDots?: boolean;
};

export function TerminalWindow({
  title,
  accent,
  children,
  className,
  showWindowDots = true,
}: Props) {
  const border = accent === "magenta" ? "#ff00ff" : "#00fbfb";
  const hdrBg = headerBg[accent];
  const hdrFg = accent === "magenta" ? "#510051" : "#002020";
  const shadow =
    accent === "magenta"
      ? "0 0 15px rgba(255, 0, 255, 0.28)"
      : "0 0 15px rgba(0, 251, 251, 0.28)";
  const bodyInset =
    accent === "magenta"
      ? "inset 0 0 12px rgba(255, 0, 255, 0.1)"
      : "inset 0 0 12px rgba(0, 251, 251, 0.12)";

  return (
    <article
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        border: `2px solid ${border}`,
        overflow: "hidden",
        boxShadow: shadow,
      }}
    >
      <div
        style={{
          background: hdrBg,
          padding: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: `inset 0 0 10px ${border}`,
        }}
      >
        <span className="font-label" style={{ color: hdrFg }}>
          {title}
        </span>
        {showWindowDots ? (
          <div className="window-controls" aria-hidden>
            <span style={{ background: "#ff00ff" }} />
            <span style={{ background: "#00fbfb" }} />
            <span style={{ background: "#ffb86f" }} />
          </div>
        ) : null}
      </div>
      <div
        className="glass-panel"
        style={{
          padding: "1.25rem",
          minHeight: 180,
          flex: 1,
          boxShadow: bodyInset,
        }}
      >
        {children}
      </div>
    </article>
  );
}
