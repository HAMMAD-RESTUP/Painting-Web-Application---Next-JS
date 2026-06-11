"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic"],
});

export default function CalligraphySection() {
  return (
    <section className="relative min-h-[620px] w-full overflow-hidden bg-black sm:min-h-[660px] md:min-h-[680px] lg:min-h-[720px]">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 1.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute inset-0 bg-cover 
          bg-[position:62%_center]
          sm:bg-[position:center_center]
          md:bg-center
        "
        style={{
          backgroundImage: "url('/images/calligraphy-bg.png')",
        }}
      />

      {/* Premium Overlays */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-14 sm:min-h-[660px] sm:px-6 sm:py-16 md:min-h-[680px] lg:min-h-[720px] lg:px-8">
        <div className="max-w-[720px] text-center text-white sm:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#d6b08a] sm:text-[12px] md:text-[13px]"
          >
            Arabic Calligraphy Course
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`${cormorant.className} text-[50px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#f3eee6] sm:text-[68px] md:text-[84px] lg:text-[98px]`}
          >
            Begin your journey
            <span className="block text-[#d6b08a]">into Arabic</span>
            Calligraphy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.75,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-5 max-w-[620px] text-[14px] font-medium leading-7 text-white/85 sm:mx-0 sm:mt-6 sm:text-[16px] sm:leading-8 md:text-[17px]"
          >
            Learn the beauty of Arabic calligraphy with Rakhshinda through a
            calm, guided course made for creative beginners and art lovers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.75,
              delay: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href="/courses/arabic-calligraphy"
              className="mt-8 inline-flex min-h-[48px] w-full items-center justify-center bg-white px-7 py-3 text-[14px] font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-[#d6b08a] hover:text-white hover:shadow-xl sm:w-auto sm:px-8"
            >
              Learn with Rakhshinda
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}