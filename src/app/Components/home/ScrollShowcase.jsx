"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PANELS = [
  {
    image: "/images/artist-rakhshinda.png",
    tag: "Original Paintings",
    title: "Every stroke tells a story",
    text: "Hand-painted originals crafted with patience, pigment and meaning — made to live in your space.",
    href: "/shop/original-paintings",
  },
  {
    image: "/images/calligraphy-bg.png",
    tag: "Arabic Calligraphy",
    title: "Sacred words, timeless form",
    text: "Traditional letterforms reimagined with modern elegance for walls that inspire reflection.",
    href: "/shop",
  },
  {
    image: "/images/islamic-geometry.jpg",
    tag: "Islamic Geometry",
    title: "Symmetry that soothes the soul",
    text: "Precise patterns rooted in heritage — balance, rhythm and spiritual harmony in every line.",
    href: "/courses/islamic-geometry-workshop",
  },
];

export default function ScrollShowcase() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#f7f3ee]"
      style={{ height: `${PANELS.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {PANELS.map((panel, i) => (
          <ShowcasePanel
            key={panel.title}
            panel={panel}
            index={i}
            total={PANELS.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Progress pills */}
        <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {PANELS.map((_, i) => (
            <ProgressPill key={i} index={i} total={PANELS.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcasePanel({ panel, index, total, progress }) {
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;

  const opacity = useTransform(progress, [start, mid - 0.05, mid + 0.05, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, mid, end], [1.12, 1, 0.96]);
  const textY = useTransform(progress, [start, mid, end], [60, 0, -40]);
  const imageX = useTransform(progress, [start, mid, end], [index % 2 === 0 ? 80 : -80, 0, index % 2 === 0 ? -40 : 40]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex items-center"
    >
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <motion.div style={{ y: textY }} className="order-2 lg:order-1">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a8876d]">
            {panel.tag}
          </p>
          <h2
            className={`font-special text-[44px] font-normal italic leading-[0.9] tracking-[-0.05em] text-[#1e1a16] sm:text-[58px] lg:text-[72px]`}
          >
            {panel.title}
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-[#625a52]">
            {panel.text}
          </p>
          <Link
            href={panel.href}
            data-cursor-label="Discover"
            className="group mt-8 inline-flex items-center gap-3 rounded-full border border-[#2f2a24]/20 bg-white/70 px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f2a24] backdrop-blur-sm transition duration-300 hover:bg-[#2f2a24] hover:text-white"
          >
            Discover More
            <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        <motion.div
          style={{ scale, x: imageX }}
          className="order-1 lg:order-2"
        >
          <div className="relative overflow-hidden rounded-[28px] bg-[#e0d6c8] p-3 shadow-[0_30px_80px_rgba(45,35,24,0.14)]">
            <div className="overflow-hidden rounded-[22px]">
              <img
                src={panel.image}
                alt={panel.title}
                className="aspect-[4/5] w-full object-cover object-center sm:aspect-[5/6]"
              />
            </div>
            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full border border-[#d8b07c]/40" />
            <div className="pointer-events-none absolute -bottom-3 -left-3 h-16 w-16 rounded-full bg-[#d8b07c]/20 blur-xl" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProgressPill({ index, total, progress }) {
  const start = index / total;
  const end = (index + 1) / total;
  const width = useTransform(progress, [start, end], ["20px", "40px"]);
  const bg = useTransform(
    progress,
    [start, (start + end) / 2, end],
    ["rgba(196,181,160,0.5)", "rgba(216,176,124,1)", "rgba(196,181,160,0.5)"]
  );

  return <motion.span style={{ width, backgroundColor: bg }} className="block h-[3px] rounded-full" />;
}
