"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedProduct() {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#15130f] text-white sm:min-h-[760px] lg:min-h-[800px]">
      {/* Background Image */}
      <img
        src="/images/featured-product-bg.png"
        alt="Featured product background"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Luxury overlays */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[#7a4a16]/18" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-black/45 via-black/10 to-transparent" />

      {/* Warm glows */}
      <div className="pointer-events-none absolute -left-36 bottom-20 h-[360px] w-[360px] rounded-full bg-[#b49b45]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 top-24 h-[380px] w-[380px] rounded-full bg-[#ead8c2]/14 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[720px] max-w-[1200px] items-center gap-10 px-5 py-16 sm:min-h-[760px] sm:px-6 lg:min-h-[800px] lg:grid-cols-[1fr_0.78fr] lg:gap-14 lg:px-8 lg:py-20">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d8bd73] sm:text-[11px]">
            Featured Masterpiece
          </p>

          <h2
            className={`font-special text-[54px] font-normal italic leading-[0.88] tracking-[-0.055em] text-[#f4eee6] sm:text-[76px] md:text-[88px] lg:text-[104px]`}
          >
            Sacred Light
            <span className="block">of Al-Quds</span>
          </h2>

          <p className="mx-auto mt-6 max-w-[620px] text-[14px] leading-7 text-white/82 sm:text-[16px] lg:mx-0">
            A luminous artwork inspired by sacred architecture, golden tones and
            the timeless beauty of Islamic heritage.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/shop/original-paintings"
              className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1c] shadow-[0_16px_45px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#1e1e1c] hover:text-white sm:w-auto sm:min-w-[190px]"
            >
              Shop Now
              <ArrowUpRight
                size={15}
                className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              href="/shop/original-paintings"
              className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-full border border-white/50 bg-white/10 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#1e1e1c] sm:w-auto sm:min-w-[190px]"
            >
              View Details
              <ArrowUpRight
                size={15}
                className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </motion.div>

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.85,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto w-full max-w-[330px] sm:max-w-[370px] lg:max-w-[390px]"
        >
          <Link href="/shop/original-paintings" className="group block">
            <div className="rounded-[30px] bg-white/16 p-[10px] shadow-[0_28px_85px_rgba(0,0,0,0.38)] backdrop-blur-md transition duration-500 group-hover:-translate-y-2 group-hover:bg-white/22">
              <div className="rounded-[24px] bg-[#efe5da] p-[10px]">
                <div className="overflow-hidden rounded-[18px] bg-[#eadfce]">
                  <img
                    src="/images/Featured-product.png"
                    alt="Sacred Light of Al-Quds"
                    className="h-[390px] w-full object-cover object-center transition duration-[1200ms] ease-out group-hover:scale-105 sm:h-[440px] lg:h-[470px]"
                  />
                </div>
              </div>

              <div className="px-3 pb-4 pt-5 text-center">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#d8bd73]">
                  Original Painting
                </p>

                <h3
                  className={`font-special text-[38px] font-normal italic leading-[0.9] tracking-[-0.05em] text-[#f4eee6] sm:text-[44px]`}
                >
                  Sacred Light of Al-Quds
                </h3>

                <p className="mt-3 text-[16px] font-semibold text-white">
                  AED 500.00
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}