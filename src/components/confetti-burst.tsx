import { useEffect, useRef } from "react";

/**
 * A single paper-confetti pop on page load: two short bursts fired from the
 * bottom corners in the site's own palette. No sound, no looping, and skipped
 * entirely when the visitor prefers reduced motion.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  rot: number;
  vrot: number;
  phase: number;
  spin: number;
  life: number;
  decay: number;
};

const GRAVITY = 0.115;
const DRAG = 0.995;

/** Resolve a theme token (oklch, etc.) to a canvas-safe rgb() string. */
function toRgb(value: string, fallback: string) {
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = value || fallback;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color || fallback;
  probe.remove();
  return rgb;
}

function readPalette() {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) =>
    toRgb(css.getPropertyValue(name).trim(), fallback);
  return [
    token("--primary", "#c9873f"),
    token("--foreground", "#efe7da"),
    token("--accent", "#c9873f"),
    token("--muted-foreground", "#9a9086"),
  ];
}

export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let dpr = 1;
    let width = 0;
    let height = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();

    const colors = readPalette();
    const particles: Particle[] = [];
    const timers: number[] = [];
    let raf = 0;
    let last = 0;

    function tick(now: number) {
      const dt = Math.min((now - last) / 16.67, 2.4);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.vy += GRAVITY * dt;
        p.vx *= Math.pow(DRAG, dt);
        p.vy *= Math.pow(DRAG, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;
        p.phase += p.spin * dt;
        p.life -= p.decay * dt;

        if (p.life <= 0 || p.y - 40 > height) {
          particles.splice(i, 1);
          continue;
        }

        // Squash on one axis to fake a sheet of paper fluttering.
        const flip = Math.max(0.18, Math.abs(Math.cos(p.phase)));
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life * 1.8);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, (-p.h * flip) / 2, p.w, p.h * flip);
        ctx.restore();
      }

      raf = particles.length ? requestAnimationFrame(tick) : 0;
    }

    const spawn = (x: number, y: number, angle: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const spread = (Math.random() - 0.5) * 1.0;
        const speed = 8 + Math.random() * 8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle + spread) * speed,
          vy: Math.sin(angle + spread) * speed,
          w: 4 + Math.random() * 4,
          h: 9 + Math.random() * 12,
          color: colors[particles.length % colors.length]!,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.22,
          phase: Math.random() * Math.PI * 2,
          spin: 0.05 + Math.random() * 0.09,
          life: 1,
          decay: 0.004 + Math.random() * 0.005,
        });
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    // Two pops, one from each bottom corner, just inside the viewport.
    const fire = () => {
      spawn(Math.max(28, width * 0.04), height - 40, -1.35, 46);
      timers.push(
        window.setTimeout(
          () => spawn(Math.min(width - 28, width * 0.96), height - 40, -Math.PI + 1.35, 40),
          200,
        ),
      );
    };

    // Wait until the page has genuinely finished loading, then a short beat.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      timers.push(window.setTimeout(fire, 300));
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    window.addEventListener("resize", resize);
    return () => {
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", start);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[60]" />
  );
}
