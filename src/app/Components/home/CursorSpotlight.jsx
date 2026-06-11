"use client";

import { useEffect, useState } from "react";

export default function CursorSpotlight() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse || window.innerWidth < 768) return;
    setEnabled(true);

    const onMove = (e) => {
      document.documentElement.style.setProperty("--spot-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--spot-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45]"
      style={{
        background:
          "radial-gradient(520px circle at var(--spot-x, 50vw) var(--spot-y, 50vh), rgba(216,176,124,0.09), transparent 68%)",
      }}
    />
  );
}
