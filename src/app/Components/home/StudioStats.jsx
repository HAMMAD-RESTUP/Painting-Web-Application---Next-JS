"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

const STATS = [
  {
    value: 120,
    suffix: "+",
    label: "Original Works",
  },
  {
    value: 18,
    suffix: "+",
    label: "Guided Courses",
  },
  {
    value: 12,
    suffix: "K+",
    label: "Students Taught",
  },
  {
    value: 8,
    suffix: "+",
    label: "Years Creating",
  },
];

export default function StudioStats() {
  return (
    <section
      id="studio-stats"
      aria-label="Studio highlights"
      className="relative isolate scroll-mt-28 overflow-hidden bg-[#f7f3ee] py-12 sm:py-14 lg:py-16"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-[#d9b99f]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-[#c9b8a7]/10 blur-3xl"
      />

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 overflow-hidden rounded-[24px] bg-white/35 backdrop-blur-sm sm:grid-cols-4 sm:rounded-[28px]">
          {STATS.map((stat, index) => (
            <StatItem
              key={stat.label}
              stat={stat}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat, index }) {
  const itemRef = useRef(null);
  const animationFrameRef = useRef(null);

  const shouldReduceMotion = useReducedMotion();

  const isInView = useInView(itemRef, {
    once: true,
    amount: 0.45,
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;

    if (shouldReduceMotion) {
      setCount(stat.value);
      return undefined;
    }

    const duration = 1500;
    const startTime = performance.now();

    const animateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        1 - Math.pow(1 - progress, 4);

      setCount(
        Math.round(stat.value * easedProgress)
      );

      if (progress < 1) {
        animationFrameRef.current =
          requestAnimationFrame(animateCount);
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(animateCount);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, [
    isInView,
    shouldReduceMotion,
    stat.value,
  ]);

  return (
    <motion.div
      ref={itemRef}
      aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 18,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.45,
      }}
      transition={{
        delay: shouldReduceMotion
          ? 0
          : index * 0.09,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex min-h-[145px] flex-col items-center justify-center px-3 py-8 text-center transition-colors duration-300 sm:min-h-[165px] sm:px-5 lg:min-h-[180px]"
    >
      <span
        aria-hidden="true"
        className="mb-5 h-px w-7 bg-[#b07f59]/60 transition-all duration-300 group-hover:w-10"
      />

      <p
        aria-hidden="true"
        className="min-w-[110px] whitespace-nowrap font-special text-[42px] font-normal italic leading-none tracking-[-0.045em] text-[#302922] [font-variant-numeric:tabular-nums] sm:text-[50px] lg:text-[58px]"
      >
        {count.toLocaleString()}

        <span className="ml-0.5 text-[0.58em] not-italic text-[#b07f59]">
          {stat.suffix}
        </span>
      </p>

      <p className="mt-4 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.22em] text-[#806653] sm:text-[10px] sm:tracking-[0.25em]">
        {stat.label}
      </p>
    </motion.div>
  );
}