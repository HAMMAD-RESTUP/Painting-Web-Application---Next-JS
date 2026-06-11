"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "rgba(216, 176, 124, 0.55)",
  "rgba(191, 150, 21, 0.45)",
  "rgba(168, 135, 109, 0.5)",
  "rgba(47, 42, 36, 0.35)",
];

export default function HeroPaintCanvas() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const colorIdx = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [hint, setHint] = useState(true);
  const [hasPainted, setHasPainted] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fadeInterval = setInterval(() => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.018)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
    }, 50);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(fadeInterval);
    };
  }, [enabled]);

  if (!enabled) return null;

  const paint = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const lx = last.current.x;
    const ly = last.current.y;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5 + Math.random() * 4;
    ctx.strokeStyle = COLORS[colorIdx.current % COLORS.length];
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo(lx, ly, (lx + x) / 2, (ly + y) / 2);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (Math.random() > 0.7) {
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[(colorIdx.current + 1) % COLORS.length];
      ctx.fill();
    }

    last.current = { x, y };
  };

  const onDown = (e) => {
    drawing.current = true;
    setHint(false);
    setHasPainted(true);
    colorIdx.current++;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
    last.current = { x, y };
    paint(x, y);
  };

  const onMove = (e) => {
    if (!drawing.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    paint(x, y);
  };

  const onUp = () => {
    drawing.current = false;
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[6] touch-none"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      />

      <AnimatePresence>
        {hint && !hasPainted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="pointer-events-none absolute bottom-24 right-8 z-[15] hidden items-center gap-3 lg:flex"
          >
            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#d8b07c]"
            >
              ✦
            </motion.span>
            <span className="rounded-full border border-[#d8b07c]/30 bg-white/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#8a6d3f] backdrop-blur-md">
              Drag to paint
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
