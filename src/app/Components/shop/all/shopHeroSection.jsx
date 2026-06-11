"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function ShopHero() {
  return (
    <section className="relative min-h-[650px] w-full overflow-hidden bg-[#111] text-white md:min-h-[700px]">
      {/* Background Image */}
      <img
        src="/images/shophero.png"
        alt="Rakhshanda Art Shop"
        className="absolute inset-0 h-full w-full object-cover object-[72%_top] sm:object-[68%_top] md:object-center"
      />

      {/* Soft Luxury Overlays */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/35 via-black/10 to-transparent" />

      {/* Warm glow */}
      <div className="pointer-events-none absolute -left-32 bottom-20 h-[340px] w-[340px] rounded-full bg-[#b49b45]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 top-24 h-[360px] w-[360px] rounded-full bg-[#ead8c2]/15 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[650px] max-w-[1200px] items-center justify-center px-5 pb-12 pt-28 text-center sm:px-6 md:min-h-[700px] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[850px]"
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d8bd73] sm:text-[11px]">
            Rakhshanda Art Shop
          </p>

          <h1
            className={`${cormorant.className} text-[52px] font-normal italic leading-[0.88] tracking-[-0.055em] text-[#f4eee6] sm:text-[72px] md:text-[88px] lg:text-[104px]`}
          >
            Collect Original
            <span className="block">Artworks & Prints</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[700px] text-[14px] font-normal leading-7 text-white/82 sm:text-[16px] md:text-[17px]">
            Discover hand-painted artworks, fine art prints and meaningful
            pieces created with detail, emotion and timeless beauty for elegant
            modern spaces.
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-[560px] flex-col items-center justify-center gap-4 sm:flex-row sm:max-w-none">
            <Link
              href="/shop/original-paintings"
              className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1c] shadow-[0_16px_45px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#1e1e1c] hover:text-white sm:w-auto sm:min-w-[235px]"
            >
              Shop Artworks
              <ArrowUpRight
                size={15}
                className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              href="/courses"
              className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-full border border-white/55 bg-white/10 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-[#1e1e1c] sm:w-auto sm:min-w-[220px]"
            >
              View Courses
              <ArrowUpRight
                size={15}
                className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}