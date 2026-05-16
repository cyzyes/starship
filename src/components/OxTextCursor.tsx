/**
 * Bull-head idle; moving cycles 房→…→人 by travelled distance (isotropic).
 * Step ≈ one imprint glyph advance (gauge box width): ~1 letter spacing along path, non-overlap.
 * Imprints interpolated along motion segment so batches don’t stack. Same order resumes after idle.
 */

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "@/styles/OxTextCursor.css";

const CHARS = ["房", "哥", "牛", "头", "人"] as const;
const IDLE_MS = 135;

/** 页面烙印数量上限 */
const MAX_IMPRINTS = 140;

/** min step safeguard (px) — jitter / degenerate layouts */
const MIN_STEP_PX = 10;

const SEG_EPS = 0.001;

type OxImprint = {
  id: string;
  char: string;
  x: number;
  y: number;
};

export function OxTextCursor() {
  const [finePointer, setFinePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
  );

  const followerRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<HTMLSpanElement>(null);
  const idleTimerRef = useRef<number | undefined>(undefined);
  const pendingMoveRef = useRef(false);

  const [hasEntered, setHasEntered] = useState(false);
  const [moving, setMoving] = useState(false);

  /** 与光标、烙字节拍一致 — 不因重新移动而归零 */
  const charIdxRef = useRef(0);
  const [charIndex, setCharIndex] = useState(0);

  const prevMovingRef = useRef(false);
  const imprintSeqRef = useRef(0);
  const [imprints, setImprints] = useState<OxImprint[]>([]);

  const charStepPxRef = useRef(28);
  const lastPtRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const distAccumRef = useRef(0);

  const measureCharStep = () => {
    const g = gaugeRef.current;
    if (!g) return;
    const w = g.getBoundingClientRect().width;
    if (Number.isFinite(w) && w > 2) {
      /** ~one character box along path — any move direction counts scalar distance only */
      charStepPxRef.current = Math.max(MIN_STEP_PX, w * 1.02);
      return;
    }
    const fs = parseFloat(getComputedStyle(g).fontSize || "26");
    if (Number.isFinite(fs) && fs > 2) {
      charStepPxRef.current = Math.max(MIN_STEP_PX, fs * 1.02);
    }
  };

  useLayoutEffect(() => {
    if (!finePointer) return;
    measureCharStep();
    const onResize = () => measureCharStep();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [finePointer]);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const onMq = () => setFinePointer(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    const wasMoving = prevMovingRef.current;
    prevMovingRef.current = moving;

    if (!moving) {
      distAccumRef.current = 0;
      lastPtRef.current = null;
      return;
    }

    /** 从静止再开始：字序续接；清零步进余量与首点后略过第一帧漂移 */
    if (!wasMoving) {
      distAccumRef.current = 0;
      lastPtRef.current = null;
    }
  }, [moving]);

  useEffect(() => {
    if (!finePointer) return;

    document.documentElement.classList.add("use-ox-text-cursor");

    const clearIdleTimer = () => {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = undefined;
    };

    const armIdle = () => {
      idleTimerRef.current = window.setTimeout(() => setMoving(false), IDLE_MS);
    };

    const onMove = (e: MouseEvent) => {
      if (!followerRef.current) return;

      pendingMoveRef.current = true;
      window.requestAnimationFrame(() => {
        if (!pendingMoveRef.current || !followerRef.current) return;
        pendingMoveRef.current = false;
        followerRef.current.style.left = `${e.clientX}px`;
        followerRef.current.style.top = `${e.clientY}px`;
      });

      setHasEntered(true);

      setMoving(true);
      clearIdleTimer();
      armIdle();

      const now = performance.now();
      const prev = lastPtRef.current;
      lastPtRef.current = { x: e.clientX, y: e.clientY, t: now };

      if (!prev) return;

      measureCharStep();
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      const segLen = Math.hypot(dx, dy);
      const stepPx = Math.max(charStepPxRef.current, MIN_STEP_PX);
      const imprintBatch: OxImprint[] = [];

      if (segLen < SEG_EPS) {
        return;
      }

      /** Scalar arc length; spaced ~one glyph centre-to-centre along stroke — direction-free distance */
      const ux = dx / segLen;
      const uy = dy / segLen;
      const carryBeforeSeg = distAccumRef.current;
      const carryAfterSeg = carryBeforeSeg + segLen;
      let distFromPrev = stepPx - carryBeforeSeg;

      let guard = 0;
      while (guard < 120 && distFromPrev <= segLen + SEG_EPS) {
        guard += 1;
        imprintSeqRef.current += 1;
        imprintBatch.push({
          id: `ox-ip-${now}-${imprintSeqRef.current}`,
          char: CHARS[charIdxRef.current],
          x: prev.x + ux * distFromPrev,
          y: prev.y + uy * distFromPrev,
        });
        charIdxRef.current = (charIdxRef.current + 1) % CHARS.length;
        distFromPrev += stepPx;
      }

      const emitted = imprintBatch.length;
      let remainder = carryAfterSeg - emitted * stepPx;
      if (!Number.isFinite(remainder) || remainder < 0) remainder = 0;
      /** avoid float drift pinning remainder to ~stepPx */
      if (remainder >= stepPx) remainder = remainder % stepPx;
      distAccumRef.current = remainder;

      if (emitted > 0) {
        setCharIndex(charIdxRef.current);
        setImprints((prev) =>
          [...prev, ...imprintBatch].slice(-MAX_IMPRINTS),
        );
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      document.documentElement.classList.remove("use-ox-text-cursor");
      window.removeEventListener("mousemove", onMove);
      clearIdleTimer();
    };
  }, [finePointer]);

  if (!finePointer) return null;

  const show = hasEntered;

  return (
    <>
      <span
        ref={gaugeRef}
        className="ox-imprint ox-imprint--gauge"
        aria-hidden
      >
        房
      </span>

      <div className="ox-imprints-root" aria-hidden="true">
        {imprints.map((p) => (
          <span key={p.id} className="ox-imprint" style={{ left: p.x, top: p.y }}>
            {p.char}
          </span>
        ))}
      </div>
      <div
        ref={followerRef}
        className="ox-text-cursor"
        style={{
          visibility: show ? "visible" : "hidden",
          opacity: show ? 1 : 0,
        }}
        aria-hidden
      >
        {moving ? (
          <span className="ox-text-cursor__char">{CHARS[charIndex]}</span>
        ) : (
          <OxHeadSvg className="ox-text-cursor__ox" />
        )}
      </div>
    </>
  );
}

function OxHeadSvg({ className }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  const gidTag = `ox-ring-${gid}`;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      height="52"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gidTag} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff00ff" />
          <stop offset="55%" stopColor="#ffabf3" />
          <stop offset="100%" stopColor="#00fbfb" />
        </linearGradient>
      </defs>
      <path
        stroke={`url(#${gidTag})`}
        strokeWidth={2}
        strokeLinecap="round"
        d="M12 42 Q8 10 26 22 M52 42 Q56 10 38 22"
      />
      <path
        stroke={`url(#${gidTag})`}
        strokeWidth={2}
        strokeLinejoin="round"
        d="M18 46 V28 q14-14 28 0 v18 q-14 8-28 0Z"
      />
      <circle cx={26} cy={36} r={2} fill="#00fbfb" />
      <circle cx={38} cy={36} r={2} fill="#00fbfb" />
      <ellipse cx={30} cy={52} rx={2} ry={3} fill="#ffb86f" fillOpacity={0.9} />
      <ellipse cx={34} cy={52} rx={2} ry={3} fill="#ffb86f" fillOpacity={0.9} />
    </svg>
  );
}
