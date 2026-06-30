"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "featured", label: "Featured" },
  { id: "recent", label: "Recent" },
  { id: "courses", label: "Courses" },
  { id: "gallery", label: "Gallery" },
  { id: "subscribe", label: "Join" },
];

export default function SectionNavigator() {
  const [active, setActive] = useState("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse || window.innerWidth < 1280) return;

    const onScroll = () => setVisible(window.scrollY > 280);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      aria-label="Page sections"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -12 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none fixed left-6 top-1/2 z-[65] hidden -translate-y-1/2 flex-col gap-4 xl:flex"
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollTo(id)}
          className="pointer-events-auto group flex items-center gap-3"
          data-cursor-hover
          aria-label={`Go to ${label}`}
          aria-current={active === id ? "true" : undefined}
        >
          <span
            className={`block rounded-full transition-all duration-500 ${
              active === id
                ? "h-2.5 w-2.5 bg-[#d8b07c] shadow-[0_0_10px_rgba(216,176,124,0.6)]"
                : "h-1.5 w-1.5 bg-[#c4b5a0]/60 group-hover:bg-[#d8b07c]/70 group-hover:scale-125"
            }`}
          />
          <span
            className={`text-[9px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${
              active === id
                ? "translate-x-0 opacity-100 text-[#8a6d3f]"
                : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70 text-[#a8876d]"
            }`}
          >
            {label}
          </span>
        </button>
      ))}
    </motion.nav>
  );
}
