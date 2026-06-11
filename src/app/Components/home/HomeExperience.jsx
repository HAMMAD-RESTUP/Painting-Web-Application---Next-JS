"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import CustomCursor from "./CustomCursor";
import ArtMarquee from "./ArtMarquee";
import CursorSpotlight from "./CursorSpotlight";
import SectionNavigator from "./SectionNavigator";

export default function HomeExperience({ children }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setScrollPct(Math.round(v * 100));
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <div className="home-experience relative">
      <CustomCursor />
      <CursorSpotlight />
      <SectionNavigator />

      {/* Scroll progress */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 right-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-[#d8b07c] via-[#c9a06a] to-[#b8964f]"
        style={{ scaleX }}
      />

      {/* Side scroll indicator — desktop only */}
      <div
        aria-hidden
        className="pointer-events-none fixed right-6 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#a8876d]/70 [writing-mode:vertical-rl] rotate-180">
          Scroll
        </span>
        <div className="relative h-24 w-px bg-[#d8c4a8]/40 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-[#d8b07c]"
            style={{ height: `${scrollPct}%` }}
          />
        </div>
        <span className="text-[9px] tabular-nums tracking-wider text-[#a8876d]/60">
          {scrollPct}
        </span>
      </div>

      {/* Film grain */}
      <div aria-hidden className="home-grain pointer-events-none fixed inset-0 z-[50]" />

      {children}

      {/* Marquee bands injected between major sections via slots */}
    </div>
  );
}

export function MarqueeDivider() {
  return <ArtMarquee />;
}
