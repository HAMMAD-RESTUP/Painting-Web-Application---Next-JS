"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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
    suffix: "",
    label: "Guided Courses",
  },
  {
    value: 12,
    suffix: "K+",
    label: "Students Taught",
  },
  {
    value: 8,
    suffix: "",
    label: "Years Creating",
  },
];

export default function StudioStats() {
  return (
    <section
      id="studio-stats"
      aria-label="Studio highlights"
      className="relative scroll-mt-28 border-y border-[#e8ddd0]/60 bg-[#f7f3ee] py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-x-5 gap-y-10 px-5 sm:grid-cols-4 sm:gap-0 sm:px-8 lg:px-10">
        {STATS.map(
          (stat, index) => (
            <StatItem
              key={stat.label}
              stat={stat}
              index={index}
              isLast={
                index ===
                STATS.length - 1
              }
            />
          )
        )}
      </div>
    </section>
  );
}

function StatItem({
  stat,
  index,
  isLast,
}) {
  const itemRef = useRef(null);

  const animationFrameRef =
    useRef(null);

  const shouldReduceMotion =
    useReducedMotion();

  const isInView = useInView(
    itemRef,
    {
      once: true,
      amount: 0.55,
    }
  );

  const [
    count,
    setCount,
  ] = useState(
    shouldReduceMotion
      ? stat.value
      : 0
  );

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    if (shouldReduceMotion) {
      setCount(stat.value);
      return undefined;
    }

    const duration = 1400;
    const startTime =
      performance.now();

    const updateCount = (
      currentTime
    ) => {
      const progress = Math.min(
        (
          currentTime -
          startTime
        ) / duration,
        1
      );

      const easedProgress =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      setCount(
        Math.round(
          stat.value *
            easedProgress
        )
      );

      if (progress < 1) {
        animationFrameRef.current =
          requestAnimationFrame(
            updateCount
          );
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(
        updateCount
      );

    return () => {
      if (
        animationFrameRef.current
      ) {
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
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 20,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.55,
      }}
      transition={{
        delay:
          shouldReduceMotion
            ? 0
            : index * 0.08,

        duration: 0.6,

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={`relative flex flex-col items-center justify-center text-center sm:min-h-[105px] ${
        !isLast
          ? "sm:after:absolute sm:after:right-0 sm:after:top-1/2 sm:after:h-14 sm:after:w-px sm:after:-translate-y-1/2 sm:after:bg-[#d9cbbb]/70"
          : ""
      }`}
    >
      <p className="font-special text-[42px] font-normal italic leading-none tracking-[-0.04em] text-[#2f2a24] sm:text-[50px] lg:text-[56px]">
        {count}

        <span className="text-[#b07f59]">
          {stat.suffix}
        </span>
      </p>

      <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#8f6b52]/85 sm:text-[10px]">
        {stat.label}
      </p>
    </motion.div>
  );
}