import { useId, useState } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";

export function WritePage() {
  const titleId = useId();
  const bodyId = useId();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <TerminalWindow title="compose_session.tmp" accent="magenta">
      <p className="font-label" style={{ color: "var(--cyan)", opacity: 0.75, marginBottom: "1.25rem" }}>
        Underlined inputs · block caret
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "42rem" }}>
        <label htmlFor={titleId} className="font-label" style={{ color: "var(--primary)" }}>
          ENTRY_TITLE
        </label>
        <input
          id={titleId}
          type="text"
          value={title}
          placeholder="neon headline…"
          onChange={(e) => setTitle(e.target.value)}
          className="vapor-input"
        />
        <label htmlFor={bodyId} className="font-label" style={{ color: "var(--primary)" }}>
          PAYLOAD_BODY
        </label>
        <textarea
          id={bodyId}
          value={body}
          placeholder="pour bytes into the void…"
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="vapor-input vapor-textarea"
        />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="font-label" style={{ color: "var(--cyan)" }}>
            root@starship:~$
          </span>
          <button type="button" className="btn-neon" style={{ fontSize: "0.95rem", padding: "0.65rem 1.75rem" }}>
            COMMIT_BROADCAST
          </button>
          <span className="caret-blink" aria-hidden />
        </div>
      </div>
    </TerminalWindow>
  );
}
