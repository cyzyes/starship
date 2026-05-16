/**
 * Decorative cursor: spaceship sprite + comet tail on canvas (fade over time).
 * pointer-events: none — does not block clicks.
 * Skipped when primary pointer is coarse (touch-first tablets / phones).
 */

import { useEffect, useId, useRef, useState } from "react";
import "@/styles/CometCursor.css";

type TrailPoint = { x: number; y: number; t: number };

const MAX_TRAIL = 96;
const TRAIL_MS = 540;
const LERP = 0.29;
const MIN_DIST = 1.85;

export function CometCursor() {
  const gid = useId().replace(/:/g, "");

  const [finePointer, setFinePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
  );

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetRef = useRef({ x: -100, y: -100 });
  const shipRef = useRef({ x: -100, y: -100, angle: -55 });
  const trailRef = useRef<TrailPoint[]>([]);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const onMq = () => setFinePointer(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    if (!finePointer) return;

    document.documentElement.classList.add("use-comet-cursor");

    const elShip = (): HTMLElement | null =>
      wrapRef.current?.querySelector("[data-comet-ship]") ?? null;

    const resizeCanvas = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      c.width = Math.floor(ww * dpr);
      c.height = Math.floor(wh * dpr);
      c.style.width = `${ww}px`;
      c.style.height = `${wh}px`;
      const ctx = c.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    function drawTrail() {
      const c = canvasRef.current;
      const ctx = c?.getContext("2d");
      if (!ctx || !c) return;

      const now = performance.now();
      const ww = window.innerWidth;
      const wh = window.innerHeight;

      trailRef.current = trailRef.current.filter((p) => now - p.t < TRAIL_MS);
      ctx.clearRect(0, 0, ww, wh);

      const trail = trailRef.current;
      if (trail.length < 2) return;

      const strokeSeg = (
        magenta: boolean,
        widthMul: number,
        alphaBoost: number,
      ) => {
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1];
          const p1 = trail[i];
          const af = Math.min(
            Math.max(0, 1 - (now - p1.t) / TRAIL_MS),
            Math.max(0, 1 - (now - p0.t) / TRAIL_MS),
          );
          const t = i / trail.length;

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = magenta ? widthMul * (0.65 + t * 0.8) : widthMul * (0.45 + t * 1.05);

          if (magenta) {
            ctx.strokeStyle = `rgba(255, 0, 255, ${af * 0.35 * alphaBoost})`;
          } else {
            ctx.strokeStyle = `rgba(0, 251, 251, ${af * 0.7 * alphaBoost})`;
          }
          ctx.stroke();
        }
      };

      strokeSeg(true, 18, 0.9);
      strokeSeg(false, 7.5, 1);

      const head = trail[trail.length - 1];
      const headA = Math.max(0, 1 - (now - head.t) / TRAIL_MS);
      const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 22);
      g.addColorStop(0, `rgba(243,218,254,${0.8 * headA})`);
      g.addColorStop(0.38, `rgba(0,251,251,${0.45 * headA})`);
      g.addColorStop(1, "rgba(0,251,251,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    function syncShip() {
      const s = elShip();
      if (!s) return;
      const { x, y, angle } = shipRef.current;
      if (x < -50) {
        s.style.opacity = "0";
        return;
      }
      s.style.opacity = "1";
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.transform = `translate(-50%, -55%) rotate(${angle}deg)`;
    }

    let raf = 0;

    const frame = () => {
      const tgt = targetRef.current;
      const ship = shipRef.current;

      if (tgt.x > -40) {
        ship.x += (tgt.x - ship.x) * LERP;
        ship.y += (tgt.y - ship.y) * LERP;

        const dx = tgt.x - ship.x;
        const dy = tgt.y - ship.y;
        if (Math.hypot(dx, dy) > 0.5) {
          const want = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
          let d = want - ship.angle;
          while (d > 180) d -= 360;
          while (d < -180) d += 360;
          ship.angle += d * 0.21;
        }
      }

      drawTrail();
      syncShip();
      raf = requestAnimationFrame(frame);
    };

    frame();

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      targetRef.current = { x, y };

      const now = performance.now();
      const last = lastRef.current;

      if (!last) {
        lastRef.current = { x, y };
        shipRef.current.x = x;
        shipRef.current.y = y;
        trailRef.current.push({ x, y, t: now });
      } else {
        const dist = Math.hypot(x - last.x, y - last.y);
        lastRef.current = { x, y };

        const tailTip = trailRef.current[trailRef.current.length - 1];
        const needSample =
          dist >= MIN_DIST || tailTip === undefined || now - tailTip.t >= 44;

        if (needSample) {
          trailRef.current.push({ x, y, t: now });
          if (trailRef.current.length > MAX_TRAIL) {
            trailRef.current.splice(0, trailRef.current.length - MAX_TRAIL);
          }
        }
      }

      trailRef.current = trailRef.current.filter((p) => now - p.t < TRAIL_MS);
    };

    const onBlur = () => {
      trailRef.current = [];
    };

    const onResize = () => resizeCanvas();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onBlur);
    window.addEventListener("resize", onResize);

    return () => {
      document.documentElement.classList.remove("use-comet-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      trailRef.current = [];
      lastRef.current = null;
    };
  }, [finePointer]);

  if (!finePointer) return null;

  return (
    <div ref={wrapRef} className="comet-cursor-root" aria-hidden="true">
      <canvas ref={canvasRef} className="comet-cursor-canvas" />
      <div className="comet-cursor-ship" data-comet-ship="">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48">
          <defs>
            <linearGradient id={`comet-${gid}-hull`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff00ff" />
              <stop offset="55%" stopColor="#ffabf3" />
              <stop offset="100%" stopColor="#00fbfb" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#comet-${gid}-hull)`}
            stroke="#ff00ff"
            strokeWidth="1.1"
            d="M24 6 38 34H10L24 6Zm0 8-9 17h18L24 14Zm-2 12h4v10h-4V26Z"
          />
          <path d="M14 36h20l2 6H12l2-6Z" fill="#00fbfb" fillOpacity={0.45} />
        </svg>
      </div>
    </div>
  );
}
