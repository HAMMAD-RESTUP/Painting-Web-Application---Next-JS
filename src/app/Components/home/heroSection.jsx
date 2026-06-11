"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import { ChevronDown } from "lucide-react";
import HeroPaintCanvas from "./HeroPaintCanvas";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const SLIDES = [
  {
    image: "/images/banner2.png",
    titlePart1: "Rakhshinda",
    titlePart2: "Art",
    description:
      "Discover original paintings, Arabic calligraphy and Islamic illustrations thoughtfully created with detail, emotion and timeless beauty.",
  },
  {
    image: "/images/banner1.png",
    titlePart1: "Arabic",
    titlePart2: "Calligraphy",
    description:
      "Experience the spiritual beauty of sacred verses, crafted with traditional elegance and modern artistic expression.",
  },
  {
    image: "/images/banner3.png",
    titlePart1: "Islamic",
    titlePart2: "Exhibits",
    description:
      "Bringing timeless culture and detailed masterworks directly into your living spaces and galleries.",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const parallaxY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 28);
    mouseY.set(y * 18);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero-section relative isolate w-full overflow-hidden bg-[#f4f4f2]"
    >
      <div className="relative h-[510px] w-full sm:h-[550px] md:h-[590px] lg:h-[620px] xl:h-[660px] 2xl:h-[700px]">
        {/* Parallax background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-[-4%] bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${SLIDES[currentIndex].image}')`,
                x: parallaxX,
                y: parallaxY,
              }}
            />
          </AnimatePresence>
        </div>

        {/* Ambient floating orbs */}
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-[#d8b07c]/12 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-[#c4a882]/10 blur-3xl"
          />
        </div>

        <div className="absolute inset-y-0 left-0 z-[2] w-[58%] bg-gradient-to-r from-[#f7f1e8]/55 via-[#f7f1e8]/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-[2] h-[35%] bg-gradient-to-t from-[#f7f1e8]/28 to-transparent" />

        <HeroPaintCanvas />

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-5 sm:px-9 md:px-12 lg:px-16 xl:px-20">
          <div className="max-w-[650px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.p
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#a8876d] sm:text-[11px]"
                >
                  Studio & Gallery
                </motion.p>

                <h1
                  className={`${cormorant.className} overflow-hidden text-[55px] font-normal italic leading-[0.88] tracking-[-0.06em] text-[#2f2a24] sm:text-[72px] md:text-[86px] lg:text-[98px] xl:text-[108px]`}
                >
                  <SplitReveal text={SLIDES[currentIndex].titlePart1} />
                </h1>

                <h1
                  className={`${cormorant.className} overflow-hidden text-[55px] font-normal italic leading-[0.88] tracking-[-0.06em] text-[#d8b07c] sm:text-[72px] md:text-[86px] lg:text-[98px] xl:text-[108px]`}
                >
                  <SplitReveal text={SLIDES[currentIndex].titlePart2} delay={0.06} />
                </h1>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-5 h-px origin-left bg-[#d8b07c] w-[74px] sm:mt-6"
                />

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.55 }}
                  className="mt-5 max-w-[600px] text-[13px] leading-6 text-[#2f2a24] sm:text-[15px] sm:leading-7 md:text-[16px] lg:text-[17px] lg:leading-8"
                >
                  {SLIDES[currentIndex].description}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
              className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row"
            >
              <MagneticLink
                href="/shop"
                data-cursor-label="Explore"
                className="inline-flex w-full items-center justify-center border border-[#2f2a24] bg-[#2f2a24] px-6 py-[13px] text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:bg-[#1f1b17] sm:w-auto sm:px-8 sm:py-[14px] sm:text-[10px] md:text-[11px]"
              >
                Explore Artwork
              </MagneticLink>

              <MagneticLink
                href="/about"
                data-cursor-label="About"
                className="inline-flex w-full items-center justify-center border border-[#2f2a24]/25 bg-white/90 px-6 py-[13px] text-[9px] font-semibold uppercase tracking-[0.16em] text-[#2f2a24] transition duration-300 hover:bg-[#2f2a24] hover:text-white sm:w-auto sm:px-8 sm:py-[14px] sm:text-[10px] md:text-[11px]"
              >
                About the Artist
              </MagneticLink>
            </motion.div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrentIndex(i)}
              className="group relative flex h-8 w-8 items-center justify-center"
              data-cursor-hover
            >
              <span
                className={`block h-[2px] rounded-full transition-all duration-500 ${
                  i === currentIndex
                    ? "w-10 bg-[#d8b07c]"
                    : "w-5 bg-[#2f2a24]/25 group-hover:w-7 group-hover:bg-[#2f2a24]/45"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 right-6 z-20 hidden flex-col items-center gap-2 sm:flex md:right-10 lg:right-16"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#6b635a]/70">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} strokeWidth={1.5} className="text-[#a8876d]/70" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SplitReveal({ text, delay = 0 }) {
  return (
    <span className="inline-block">
      {text.split("").map((char, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: delay + i * 0.025,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function MagneticLink({ href, children, className, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.18);
    y.set(dy * 0.18);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="w-full sm:w-auto"
    >
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    </motion.div>
  );
}
