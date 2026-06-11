"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label, [data-cursor-hover]";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [label, setLabel] = useState("");

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  const dotX = useSpring(0, { stiffness: 900, damping: 55, mass: 0.15 });
  const dotY = useSpring(0, { stiffness: 900, damping: 55, mass: 0.15 });
  const ringX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.4 });
  const ringY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.4 });

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 1024;
    if (coarse || narrow) return;

    setEnabled(true);
    document.documentElement.classList.add("home-custom-cursor");

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.14);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.14);
      ringX.set(ring.current.x);
      ringY.set(ring.current.y);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onOver = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (!target) return;
      setHovering(true);
      setLabel(target.getAttribute("data-cursor-label") || "");
    };

    const onOut = (e) => {
      const related = e.relatedTarget;
      if (related?.closest?.(INTERACTIVE_SELECTOR)) return;
      setHovering(false);
      setLabel("");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.documentElement.classList.remove("home-custom-cursor");
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [dotX, dotY, ringX, ringY, visible]);

  if (!enabled) return null;

  const size = hovering ? 64 : clicking ? 28 : 42;
  const dotSize = hovering ? 6 : clicking ? 14 : 8;

  return (
    <>
      {/* Outer ring — brush halo */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? (hovering ? 0.95 : 0.75) : 0,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d8b07c]/70 bg-[#d8b07c]/[0.06] backdrop-blur-[1px]"
          style={{ width: size, height: size }}
        />
        {hovering && label && (
          <span className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a6d3f]">
            {label}
          </span>
        )}
      </motion.div>

      {/* Inner dot — paint tip */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[10000]"
        style={{ x: dotX, y: dotY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.75 : hovering ? 0.4 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8b07c] shadow-[0_0_12px_rgba(216,176,124,0.55)]"
          style={{ width: dotSize, height: dotSize }}
        />
      </motion.div>

      {/* Paint splatter trail dots */}
      <PaintTrail active={visible && !hovering} />
    </>
  );
}

function PaintTrail({ active }) {
  const [splats, setSplats] = useState([]);
  const lastPos = useRef({ x: 0, y: 0, t: 0 });
  const id = useRef(0);

  useEffect(() => {
    if (!active) return;

    const onMove = (e) => {
      const now = Date.now();
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 18 || now - lastPos.current.t < 60) return;

      lastPos.current = { x: e.clientX, y: e.clientY, t: now };
      const splatId = id.current++;

      setSplats((prev) => [
        ...prev.slice(-14),
        {
          id: splatId,
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          size: 3 + Math.random() * 5,
          hue: 38 + Math.random() * 12,
        },
      ]);

      setTimeout(() => {
        setSplats((prev) => prev.filter((s) => s.id !== splatId));
      }, 700);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [active]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9998]">
      {splats.map((s) => (
        <motion.span
          key={s.id}
          initial={{ opacity: 0.55, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            background: `hsla(${s.hue}, 48%, 58%, 0.65)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
