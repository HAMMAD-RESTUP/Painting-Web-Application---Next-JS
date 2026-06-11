"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: 120, suffix: "+", label: "Original Works" },
  { value: 18, suffix: "", label: "Guided Courses" },
  { value: 12, suffix: "K+", label: "Students Taught" },
  { value: 8, suffix: "", label: "Years Creating" },
];

export default function StudioStats() {
  return (
    <section
      aria-label="Studio highlights"
      className="relative border-y border-[#e8ddd0]/50 bg-[#f0e9df] py-10 sm:py-12"
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-8 px-6 sm:grid-cols-4 sm:gap-4 lg:px-8">
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}

function StatItem({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(stat.value * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <p className="font-[family-name:var(--font-cormorant)] text-[42px] font-normal italic leading-none tracking-[-0.04em] text-[#2f2a24] sm:text-[52px]">
        {count}
        <span className="text-[#d8b07c]">{stat.suffix}</span>
      </p>
      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9a7d4e]/80 sm:text-[10px]">
        {stat.label}
      </p>
    </motion.div>
  );
}
