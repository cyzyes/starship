import { TerminalWindow } from "@/components/TerminalWindow";

export function AboutPage() {
  return (
    <TerminalWindow title="Bio.sys" accent="magenta">
      <h1 className="font-headline" style={{ color: "var(--primary)", marginBottom: "1rem" }}>
        ABOUT · NEURAL TRACE
      </h1>
      <p style={{ color: "var(--on-surface-variant)", lineHeight: 1.65, marginBottom: "1rem" }}>
        Starship surfaces as a vaporwave terminal: magenta tubes, cyan streams, CRT hum. Compose in{" "}
        <span style={{ color: "var(--cyan)" }}>FREE_OS</span> and ship through the grid.
      </p>
      <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
        <li>
          <span style={{ color: "var(--tertiary)" }}>Stacks:</span> React + Vite · terminal chrome in CSS.
        </li>
        <li>
          <span style={{ color: "var(--cyan)" }}>Signal:</span> Perspective floor + scanlines always on.
        </li>
      </ul>
    </TerminalWindow>
  );
}
