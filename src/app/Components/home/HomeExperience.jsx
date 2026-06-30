"use client";

import { useState } from "react";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";


import ArtMarquee from "./ArtMarquee";
import SectionNavigator from "./SectionNavigator";

/*
|--------------------------------------------------------------------------
| Home Experience
|--------------------------------------------------------------------------
*/

export default function HomeExperience({
  children,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const {
    scrollYProgress,
  } = useScroll();

  const progressScale =
    useSpring(scrollYProgress, {
      stiffness: 120,
      damping: 30,
      mass: 0.25,
      restDelta: 0.001,
    });

  const [
    scrollPercentage,
    setScrollPercentage,
  ] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Scroll Percentage
  |--------------------------------------------------------------------------
  */

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (latestValue) => {
      const nextPercentage =
        Math.min(
          100,
          Math.max(
            0,
            Math.round(
              latestValue * 100
            )
          )
        );

      setScrollPercentage(
        (currentPercentage) => {
          if (
            currentPercentage ===
            nextPercentage
          ) {
            return currentPercentage;
          }

          return nextPercentage;
        }
      );
    }
  );

  return (
    <div className="home-experience relative isolate min-w-0 overflow-clip">
   

      {/* Section Navigator */}
      <SectionNavigator />

      {/* Top Scroll Progress */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[2px] origin-left bg-gradient-to-r from-[#d8b07c] via-[#c9a06a] to-[#b8964f]"
        style={{
          scaleX:
            shouldReduceMotion
              ? scrollYProgress
              : progressScale,
        }}
      />

      {/* Desktop Side Scroll Indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-6 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex"
      >
        <span className="rotate-180 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#a8876d]/70 [writing-mode:vertical-rl]">
          Scroll
        </span>

        <div className="relative h-24 w-px overflow-hidden bg-[#d8c4a8]/40">
          <motion.div
            className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-[#d8b07c]"
            style={{
              scaleY:
                shouldReduceMotion
                  ? scrollYProgress
                  : progressScale,
            }}
          />
        </div>

        <span className="min-w-[24px] text-center text-[9px] tabular-nums tracking-wider text-[#a8876d]/70">
          {String(
            scrollPercentage
          ).padStart(2, "0")}
        </span>
      </div>

      {/* Film Grain */}
      {!shouldReduceMotion && (
        <div
          aria-hidden="true"
          className="home-grain pointer-events-none fixed inset-0 z-[50]"
        />
      )}

      {/* Home Sections */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Marquee Divider
|--------------------------------------------------------------------------
*/

export function MarqueeDivider() {
  return (
    <div
      aria-label="Art collection highlights"
      className="relative overflow-hidden"
    >
      <ArtMarquee />
    </div>
  );
}