import { createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import me from "@/assets/me.png";
import { ConfettiBurst } from "@/components/confetti-burst";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Antony Johny" },
      {
        name: "description",
        content: "Antony Johny, first-year BCA student learning and building for the web.",
      },
      { property: "og:title", content: "Antony Johny" },
      { property: "og:description", content: "BCA student building things on the web." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EMAIL = "aj@4ofl.dev";
const SOCIALS = [
  { name: "GitHub", href: "https://github.com/antonyrockin" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/antony-johny-6770b9404" },
  { name: "Instagram", href: "https://instagram.com/_an.tonyy_johnyy_" },
] as const;

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const k = reduceMotion ? 0 : 1;

  // Normalized mouse coords (-1 to 1) for tactile 3D parallax
  const mouseNormX = useMotionValue(0);
  const mouseNormY = useMotionValue(0);

  // Absolute mouse coords for spotlight
  const spotX = useMotionValue(800);
  const spotY = useMotionValue(450);

  // Smooth physics springs
  const springConfig = { damping: 28, stiffness: 160, mass: 0.6 };
  const smoothMouseX = useSpring(mouseNormX, springConfig);
  const smoothMouseY = useSpring(mouseNormY, springConfig);

  const lightSpringConfig = { damping: 32, stiffness: 140, mass: 0.8 };
  const smoothSpotX = useSpring(spotX, lightSpringConfig);
  const smoothSpotY = useSpring(spotY, lightSpringConfig);

  useEffect(() => {
    if (typeof window !== "undefined") {
      spotX.set(window.innerWidth / 2);
      spotY.set(window.innerHeight * 0.55);
    }
  }, [spotX, spotY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const { clientX, clientY } = e;
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;

    const nx = (clientX / w - 0.5) * 2;
    const ny = (clientY / h - 0.5) * 2;

    mouseNormX.set(Math.max(-1, Math.min(1, nx)));
    mouseNormY.set(Math.max(-1, Math.min(1, ny)));
    spotX.set(clientX);
    spotY.set(clientY);
  };

  const handleMouseLeave = () => {
    mouseNormX.set(0);
    mouseNormY.set(0);
    if (typeof window !== "undefined") {
      spotX.set(window.innerWidth / 2);
      spotY.set(window.innerHeight * 0.55);
    }
  };

  // Dynamic cursor-following lighting gradient (richer core & wide falloff)
  const dynamicSpotlight = useMotionTemplate`radial-gradient(800px circle at ${smoothSpotX}px ${smoothSpotY}px, oklch(0.72 0.14 65 / 30%), oklch(0.72 0.12 65 / 8%) 45%, transparent 75%)`;

  // --- Background "ANTONY" transforms (deepest layer, slides opposite to mouse) ---
  const nameScrollX = useTransform(scrollYProgress, [0, 0.65], [0, -160 * k]);
  const nameScrollY = useTransform(scrollYProgress, [0, 0.65], [0, -60 * k]);
  const nameMouseX = useTransform(smoothMouseX, [-1, 1], [40 * k, -40 * k]);
  const nameMouseY = useTransform(smoothMouseY, [-1, 1], [22 * k, -22 * k]);
  const totalNameX = useTransform([nameScrollX, nameMouseX], ([s, m]) => Number(s) + Number(m));
  const totalNameY = useTransform([nameScrollY, nameMouseY], ([s, m]) => Number(s) + Number(m));

  // --- Middle Portrait Cutout transforms (mid layer, shift + 3D tilt + dynamic shadow) ---
  const portraitScrollY = useTransform(scrollYProgress, [0, 0.65], [0, 90 * k]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.65], [1, 1 - 0.06 * k]);
  const portraitMouseX = useTransform(smoothMouseX, [-1, 1], [-22 * k, 22 * k]);
  const portraitMouseY = useTransform(smoothMouseY, [-1, 1], [-15 * k, 15 * k]);
  const rotateX = useTransform(smoothMouseY, [-1, 1], [7.5 * k, -7.5 * k]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-8.5 * k, 8.5 * k]);
  const shadowX = useTransform(smoothMouseX, [-1, 1], [-24 * k, 24 * k]);
  const shadowY = useTransform(smoothMouseY, [-1, 1], [-16 * k, 16 * k]);
  const portraitFilter = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px 32px oklch(0 0 0 / 65%))`;
  const totalPortraitX = portraitMouseX;
  const totalPortraitY = useTransform(
    [portraitScrollY, portraitMouseY],
    ([s, m]) => Number(s) + Number(m),
  );

  // --- Foreground Outline "JOHNY" transforms (closest layer, slides most with mouse) ---
  const surnameScrollX = useTransform(scrollYProgress, [0, 0.65], [0, 160 * k]);
  const surnameMouseX = useTransform(smoothMouseX, [-1, 1], [-55 * k, 55 * k]);
  const surnameMouseY = useTransform(smoothMouseY, [-1, 1], [-26 * k, 26 * k]);
  const totalSurnameX = useTransform(
    [surnameScrollX, surnameMouseX],
    ([s, m]) => Number(s) + Number(m),
  );
  const totalSurnameY = surnameMouseY;

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3, 0.65], [1, 1, 1 - k]);

  return (
    <main className="grain relative overflow-x-clip">
      <ConfettiBurst />
      {/* nav */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 text-xs uppercase tracking-[0.2em] md:px-12">
        <span className="select-none font-serif text-2xl normal-case italic tracking-normal">
          aj.
        </span>
        <nav className="select-none flex gap-6 text-muted-foreground">
          <a href="#about" className="transition-colors hover:text-foreground">
            About
          </a>
          <a href="#contact" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </nav>
      </header>

      {/* hero */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="select-none relative h-[160svh] min-h-[900px] motion-reduce:h-svh motion-reduce:min-h-[560px]"
      >
        <motion.div
          className="sticky top-0 flex h-svh min-h-[560px] items-end justify-center overflow-hidden [perspective:1000px]"
          style={{ opacity: heroOpacity }}
        >
          {/* base ambient warm glow */}
          <div className="glow-floor absolute inset-0 opacity-50" />

          {/* dynamic cursor-tracking spotlight */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: dynamicSpotlight }}
          />

          {/* back text (layer 1: deepest background) */}
          <motion.h1
            aria-label="Antony Johny"
            style={{ x: totalNameX, y: totalNameY }}
            className="hero-name pointer-events-none absolute inset-x-0 top-[10%] select-none text-center font-display uppercase leading-[0.8] text-foreground md:top-[10%]"
          >
            Antony
          </motion.h1>

          {/* me (layer 2: middle cutout with 3D rotation & parallax) */}
          <motion.img
            src={me}
            alt="Antony Johny"
            draggable={false}
            style={{
              x: totalPortraitX,
              y: totalPortraitY,
              rotateX,
              rotateY,
              scale: portraitScale,
              filter: portraitFilter,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.9 }}
            className="pointer-events-none relative z-10 h-[88%] w-auto max-w-full select-none origin-bottom object-contain object-bottom"
          />

          {/* front outline text (layer 3: foreground holographic layer) */}
          <motion.div
            aria-hidden
            style={{ x: totalSurnameX, y: totalSurnameY }}
            className="hero-surname text-outline pointer-events-none absolute inset-x-0 bottom-[10%] z-20 select-none text-center font-display uppercase leading-none before:content-['Johny']"
          />

          {/* side notes */}
          <div className="select-none absolute bottom-6 left-6 z-20 max-w-[14rem] text-xs leading-relaxed text-muted-foreground md:bottom-8 md:left-12">
            <span className="mb-3 block h-px w-8 bg-primary" />
            BCA, first year.
            <br />
            Learning by building.
          </div>
          <div className="select-none absolute bottom-6 right-6 z-20 text-right text-xs uppercase tracking-[0.2em] text-muted-foreground md:bottom-8 md:right-12">
            <span className="font-serif text-lg normal-case italic tracking-normal text-primary">
              A work in progress
            </span>
            <br />
            Since 2026
          </div>

          {/* vertical label */}
          <span className="select-none absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 rotate-90 text-[10px] uppercase tracking-[0.4em] text-muted-foreground md:block">
            scroll ↓
          </span>
        </motion.div>
      </section>

      {/* about */}
      <section
        id="about"
        className="relative overflow-hidden border-t px-6 py-28 md:px-12 md:py-40"
      >
        <span className="pointer-events-none absolute -top-4 right-4 select-none font-display text-[22vw] uppercase leading-none text-ghost md:text-[14vw]">
          01
        </span>
        <Reveal className="relative grid gap-12 md:grid-cols-12">
          <p className="select-none text-xs uppercase tracking-[0.3em] text-primary md:col-span-3">
            (About)
          </p>
          <div className="md:col-span-8">
            <p className="font-serif text-4xl leading-[1.1] md:text-6xl">
              I'm Antony, a first-year <em className="text-primary">BCA</em> student. Curious about
              how things work. Learning by making them.
            </p>
            <div className="mt-12 grid gap-8 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
              <p>More about what I'm learning and making — coming soon.</p>
              <p>A little about life away from the screen — coming soon.</p>
            </div>
            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-foreground/70">
              <li>First year, just getting started</li>
              <li>/</li>
              <li>One thing at a time</li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* contact */}
      <section
        id="contact"
        className="relative overflow-hidden border-t px-6 py-28 md:px-12 md:py-40"
      >
        <span className="pointer-events-none absolute -top-4 right-4 select-none font-display text-[22vw] uppercase leading-none text-ghost md:text-[14vw]">
          02
        </span>
        <Reveal className="relative grid gap-12 md:grid-cols-12">
          <p className="select-none text-xs uppercase tracking-[0.3em] text-primary md:col-span-3">
            (Contact)
          </p>
          <div className="md:col-span-9">
            <p className="font-serif text-3xl italic text-muted-foreground md:text-4xl">
              Say hello —
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="contact-email group mt-4 inline-block max-w-full font-display uppercase leading-none transition-colors hover:text-primary"
            >
              {EMAIL}
              <span className="block h-[3px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </a>

            <div className="select-none mt-8 flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <span className="transition-colors group-hover:text-primary">{social.name}</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="flex justify-between border-t px-6 py-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:px-12">
        <span>© 2026 Antony Johny</span>
        <a href="#" className="select-none transition-colors hover:text-primary">
          Back to top ↑
        </a>
      </footer>
    </main>
  );
}
