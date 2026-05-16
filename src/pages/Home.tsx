import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Prism from "@/components/Prism";
import { TerminalWindow } from "@/components/TerminalWindow";

export function HomePage() {
  return (
    <>
      <section style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <h1 className="font-display gradient-hero">FREE</h1>
        <p
          className="font-label"
          style={{
            color: "var(--cyan)",
            letterSpacing: "0.35em",
            marginBottom: "2.75rem",
            marginTop: "0.75rem",
          }}
        >
          Digital Manifestos &amp; Neon Echoes
        </p>
        <Link to="/write" className="btn-neon">
          WRITE POST
        </Link>
      </section>

      <section
        style={{
          width: "100%",
          maxWidth: "min(100%, 72rem)",
          marginInline: "auto",
          marginBottom: "3rem",
          border: "2px solid rgba(0, 251, 251, 0.35)",
          boxShadow: "0 0 20px rgba(0, 251, 251, 0.12)",
        }}
        aria-label="Prism hero"
      >
        <div style={{ width: "100%", height: "600px", position: "relative" }}>
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
          />
        </div>
      </section>

      <div className="bento-grid">
        <TerminalWindow title="Latest_Entry.log" accent="magenta" className="bento-featured" showWindowDots>
          <h2 className="font-headline" style={{ color: "var(--primary)", marginBottom: "1rem" }}>
            在 #090014 的 void 里写第一篇日志
          </h2>
          <p style={{ color: "var(--on-surface-variant)", marginBottom: "1.35rem", lineHeight: 1.65 }}>
            System initialization complete. The void is not empty; it is a canvas of infinite potential.
            Today we establish the grid.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
            <span className="font-label" style={{ color: "var(--cyan)" }}>
              root@FREE_OS:~$
            </span>
            <span style={{ color: "var(--cyan)" }}>read_more</span>
            <span className="caret-blink" />
          </div>
        </TerminalWindow>

        <TerminalWindow title="System_File.exe" accent="cyan" className="bento-side" showWindowDots={false}>
          <h3 className="font-headline" style={{ color: "var(--cyan)", marginBottom: "1rem" }}>
            NEON GRID: 把透视网格当作家
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.85rem" }}>
            <span className="tag-chip">Design</span>
            <span className="tag-chip">Retro</span>
          </div>
          <p style={{ color: "var(--on-surface-variant)", fontSize: "0.9rem", opacity: 0.88 }}>
            Geometry is the only language the CPU understands. We inhabit the angles…
          </p>
        </TerminalWindow>

        <aside
          className="glass-panel bento-stats"
          style={{
            padding: "1rem",
            border: "2px solid #ff00ff",
            boxShadow: "inset 0 0 10px rgba(255, 0, 255, 0.15)",
          }}
        >
          <h4
            className="font-label"
            style={{
              color: "var(--primary)",
              borderBottom: "1px solid #ff00ff",
              paddingBottom: "0.5rem",
              marginBottom: "0.85rem",
            }}
          >
            SYSTEM_STATS
          </h4>
          <StatsBlock />
        </aside>

        <div
          className="bento-wide"
          style={{
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed var(--outline-variant)",
            opacity: 0.42,
          }}
        >
          <span className="font-label" style={{ color: "var(--outline-variant)", letterSpacing: "0.2em" }}>
            INITIALIZING_FURTHER_BLOCKS…
          </span>
        </div>
      </div>
    </>
  );
}

function StatsBlock() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 100);
    return () => window.clearInterval(id);
  }, []);

  const uptime = formatUptime();
  return (
    <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <StatRow label="UPTIME:" value={uptime} accent="cyan" />
      <StatRow label="LOCATION:" value="OUTRUN_SECTOR_7" accent="cyan" />
      <StatRow label="HEARTBEAT:" value="128 BPM" accent="magenta" />
    </div>
  );
}

function StatRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "cyan" | "magenta";
}) {
  const c = accent === "cyan" ? "var(--cyan)" : "var(--primary)";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
      <span style={{ color: "var(--on-surface-variant)" }}>{label}</span>
      <span style={{ color: c, letterSpacing: "0.06em" }}>{value}</span>
    </div>
  );
}

function formatUptime(): string {
  const ms = performance.now();
  const totalSec = Math.floor(ms / 1000);
  const hh = String(Math.floor(totalSec / 3600) % 24).padStart(2, "0");
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  const frac = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `${hh}:${mm}:${ss}:${frac}`;
}
