import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import me from "@/assets/me.png";
import { ConfettiBurst } from "@/components/confetti-burst";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Antony Johny — Portfolio" },
      {
        name: "description",
        content: "Antony Johny — first-year BCA student, learning by making things for the web.",
      },
      { property: "og:title", content: "Antony Johny — Portfolio" },
      { property: "og:description", content: "BCA student building things on the web." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EMAIL = "aj@4ofl.dev";

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
  // Reduced motion keeps the same props (so server and client markup match)
  // but flattens every range to its starting value.
  const k = reduceMotion ? 0 : 1;
  const nameX = useTransform(scrollYProgress, [0, 0.65], [0, -160 * k]);
  const nameY = useTransform(scrollYProgress, [0, 0.65], [0, -60 * k]);
  const portraitY = useTransform(scrollYProgress, [0, 0.65], [0, 90 * k]);
  const surnameX = useTransform(scrollYProgress, [0, 0.65], [0, 160 * k]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.65], [1, 1 - 0.06 * k]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3, 0.65], [1, 1, 1 - k]);
  return (
    <main className="grain relative overflow-x-clip">
      <ConfettiBurst />
      {/* nav */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 text-xs uppercase tracking-[0.2em] md:px-12">
        <span className="font-serif text-2xl normal-case italic tracking-normal">aj.</span>
        <nav className="flex gap-6 text-muted-foreground">
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
        className="relative h-[160svh] min-h-[900px] motion-reduce:h-svh motion-reduce:min-h-[560px]"
      >
        <motion.div
          className="sticky top-0 flex h-svh min-h-[560px] items-end justify-center overflow-hidden"
          style={{ opacity: heroOpacity }}
        >
          <div className="glow-floor absolute inset-0" />

          {/* back text */}
          <motion.h1
            aria-label="Antony Johny"
            style={{ x: nameX, y: nameY }}
            className="hero-name pointer-events-none absolute inset-x-0 top-[10%] select-none text-center font-display uppercase leading-[0.8] text-foreground md:top-[10%]"
          >
            Antony
          </motion.h1>

          {/* me */}
          <motion.img
            src={me}
            alt="Antony Johny"
            style={{ y: portraitY, scale: portraitScale }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.9 }}
            className="relative z-10 h-[88%] w-auto max-w-full origin-bottom object-contain object-bottom"
          />

          {/* front outline text, sits over the cutout */}
          <motion.div
            aria-hidden
            style={{ x: surnameX }}
            className="hero-surname text-outline pointer-events-none absolute inset-x-0 bottom-[10%] z-20 select-none text-center font-display uppercase leading-none"
          >
            Johny
          </motion.div>

          {/* side notes */}
          <div className="absolute bottom-6 left-6 z-20 max-w-[14rem] text-xs leading-relaxed text-muted-foreground md:bottom-8 md:left-12">
            <span className="mb-3 block h-px w-8 bg-primary" />
            BCA, first year.
            <br />
            Learning by building.
          </div>
          <div className="absolute bottom-6 right-6 z-20 text-right text-xs uppercase tracking-[0.2em] text-muted-foreground md:bottom-8 md:right-12">
            <span className="font-serif text-lg normal-case italic tracking-normal text-primary">
              A work in progress
            </span>
            <br />
            Since 2026
          </div>

          {/* vertical label */}
          <span className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 rotate-90 text-[10px] uppercase tracking-[0.4em] text-muted-foreground md:block">
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
          <p className="text-xs uppercase tracking-[0.3em] text-primary md:col-span-3">(About)</p>
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
          <p className="text-xs uppercase tracking-[0.3em] text-primary md:col-span-3">(Contact)</p>
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
          </div>
        </Reveal>
      </section>

      <footer className="flex justify-between border-t px-6 py-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:px-12">
        <span>© 2026 Antony Johny</span>
        <a href="#" className="transition-colors hover:text-primary">
          Back to top ↑
        </a>
      </footer>
    </main>
  );
}
