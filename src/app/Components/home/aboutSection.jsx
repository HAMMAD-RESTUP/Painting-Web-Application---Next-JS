"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic"],
});

const EASE = [0.22, 1, 0.36, 1];

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f4f2] px-5 py-16 text-black sm:px-6 sm:py-20 md:py-24 lg:px-8">
      {/* Same soft background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(180,155,69,0.10),transparent_28%),radial-gradient(circle_at_88%_14%,rgba(180,155,69,0.08),transparent_30%),linear-gradient(180deg,#f4f4f2_0%,#eeeeea_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[360px] w-[360px] rounded-full bg-[#d8d1bf]/45 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Left Content */}
        <div className="max-w-xl text-left">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b49b45] sm:text-[12px]"
          >
            About Rakhshinda Art
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
            className={`${cormorant.className} text-[46px] font-normal italic leading-[0.9] tracking-[-0.055em] text-black sm:text-[62px] md:text-[76px] lg:text-[88px]`}
          >
            Art made with
            <span className="block">patience and soul.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.14, ease: EASE }}
            className="mt-6 max-w-lg text-left text-[14px] font-normal leading-7 text-[#2f2f2c] sm:text-[16px] sm:leading-8"
          >
            RakhshindasArt is a calm and meaningful art space built around
            original paintings, Islamic-inspired details and expressive fine
            art. Every piece is created to bring warmth, emotion and quiet
            beauty into your home.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
            className="mt-4 max-w-lg text-left text-[14px] leading-7 text-[#555] sm:text-[16px] sm:leading-8"
          >
            From hand-painted originals to carefully finished prints, the work
            is designed for people who love soft colors, thoughtful details and
            art that feels personal.{" "}
            <span className="font-medium text-[#b49b45]">
              Learn more and shop.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-8 flex justify-start"
          >
            <Link
              href="/about"
              className="group inline-flex items-center justify-center gap-2 border-b border-black pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black transition duration-300 hover:border-[#b49b45] hover:text-[#b49b45] sm:text-[12px]"
            >
              Read Her Story
              <ArrowRight
                size={14}
                className="transition duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* Right Image Area */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto"
        >
          <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-[#b49b45]/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-black/10 blur-3xl" />

          <motion.img
            src="/images/about.png"
            alt="RakhshindasArt artist portrait"
            initial={{ scale: 1.03 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
            className="relative h-[360px] w-full rounded-[26px] object-cover object-top shadow-[0_24px_70px_rgba(0,0,0,0.14)] transition duration-700 hover:-translate-y-2 hover:scale-[1.02] sm:h-[460px] sm:rounded-[32px] md:h-[520px] lg:h-[560px]"
          />
        </motion.div>
      </div>
    </section>
  );
}