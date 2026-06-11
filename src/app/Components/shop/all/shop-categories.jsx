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

const collections = [
  {
    title: "Original Paintings",
    label: "Hand Painted",
    description:
      "One-of-a-kind original artworks created with emotion, detail and timeless colour.",
    image: "/images/shop-category1.png",
    href: "/shop/original-paintings",
  },
  {
    title: "Fine Art Prints",
    label: "Archival Prints",
    description:
      "Premium quality prints designed for elegant homes, calm spaces and meaningful gifts.",
    image: "/images/shop-category3.png",
    href: "/shop/prints",
  },
  {
    title: "Calligraphy Kit",
    label: "Creative Tools",
    description:
      "A thoughtful starter kit with essential tools to begin your calligraphy practice.",
    image: "/images/shop-category2.png",
    href: "/shop/calligraphy-kit",
  },
];

export default function ShopCategories() {
  return (
    <section className="relative overflow-hidden bg-[#f7f3ee] px-4 py-16 text-[#1e1e1c] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Soft background */}
      <div className="pointer-events-none absolute -left-44 top-12 h-[360px] w-[360px] rounded-full bg-[#eadcca] blur-3xl" />
      <div className="pointer-events-none absolute -right-44 bottom-12 h-[420px] w-[420px] rounded-full bg-[#ead8c2] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1240px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b8964f] sm:text-[11px]">
            Shop Collection
          </p>

          <h2
            className={`${cormorant.className} text-[48px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#171717] sm:text-[66px] md:text-[80px] lg:text-[94px]`}
          >
            Choose Your
            <span className="block">Creative Collection</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[14px] leading-7 text-[#625b52] sm:text-[16px]">
            Explore original paintings, premium art prints and creative tools
            crafted for collectors, calm homes and meaningful gifts.
          </p>
        </motion.div>

        {/* Creative Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {collections.map((item, index) => (
            <CollectionCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ item, index }) {
  const isCenter = index === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`${isCenter ? "lg:mt-12" : "lg:mt-0"}`}
    >
      <Link href={item.href} className="group block h-full">
        <div className="relative h-full rounded-[30px] bg-[#efe5da] p-[10px] shadow-[0_20px_60px_rgba(45,35,24,0.10)] transition duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_34px_90px_rgba(45,35,24,0.16)]">
          <div className="relative h-full overflow-hidden rounded-[23px] bg-white/70">
            {/* Image */}
            <div
              className={`relative overflow-hidden ${
                isCenter
                  ? "h-[390px] sm:h-[470px] lg:h-[520px]"
                  : "h-[360px] sm:h-[430px] lg:h-[480px]"
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center transition duration-[1200ms] ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />

              <div className="absolute left-5 top-5 rounded-full bg-white/85 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1c] shadow-sm backdrop-blur-md">
                {item.label}
              </div>

              <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#1e1e1c] shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-[#1e1e1c] group-hover:text-white">
                <ArrowUpRight size={18} />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-7">
              <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#a2844d]">
                Collection {String(index + 1).padStart(2, "0")}
              </p>

              <h3
                className={`${cormorant.className} text-[40px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#1e1e1c] sm:text-[48px]`}
              >
                {item.title}
              </h3>

              <p className="mt-4 text-[13px] leading-6 text-[#665f56] sm:text-[14px]">
                {item.description}
              </p>

              <div className="mt-6 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8f6f39]">
                Shop Now
                <span className="h-px w-8 bg-[#b38d51] transition-all duration-300 group-hover:w-14" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}