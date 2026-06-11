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

const artworks = [
  {
    title: "Kun Fayakun",
    category: "Arabic Calligraphy",
    price: "£1,200.00",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
    href: "/shop/kun-fayakun",
  },
  {
    title: "Nafas",
    category: "Original Painting",
    price: "£1,350.00",
    image:
      "https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=900&q=85",
    href: "/shop/nafas",
  },
  {
    title: "Alif Laam Meem",
    category: "Islamic Art",
    price: "£550.00",
    image:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=85",
    href: "/shop/alif-laam-meem",
  },
  {
    title: "Layl",
    category: "Canvas Artwork",
    price: "£1,350.00",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",
    href: "/shop/layl",
  },
];

export default function FeaturedArtworksSection() {
  return (
    <section id="featured" className="relative w-full overflow-hidden bg-[#f7f3ee] text-[#1e1e1c]">
      {/* Background shapes */}
      <div className="pointer-events-none absolute -left-44 top-20 h-[380px] w-[380px] rounded-full bg-[#e9dccb] blur-3xl" />
      <div className="pointer-events-none absolute -right-44 bottom-40 h-[440px] w-[440px] rounded-full bg-[#ead8c2] blur-3xl" />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-10 pt-16 text-center sm:pt-20 lg:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b8964f] sm:text-[11px]"
        >
          Featured Art Work
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 0.05 }}
          className={`${cormorant.className} text-[48px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#171717] sm:text-[64px] md:text-[78px] lg:text-[92px]`}
        >
          Original Paintings
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-[14px] leading-7 text-[#625b52] sm:text-[16px]"
        >
          A curated selection of original paintings, Arabic calligraphy and
          Islamic illustrations created with detail, emotion and timeless beauty.
        </motion.p>
      </div>

      {/* Artworks */}
      <div className="relative z-10 pb-16">
        {/* Mobile slider */}
        <div className="block md:hidden">
          <div className="artworks-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-6">
            {artworks.map((art, index) => (
              <ArtworkCard key={art.title} art={art} index={index} mobile />
            ))}
          </div>

    
        </div>

        {/* Desktop grid */}
        <div className="hidden px-5 sm:px-6 md:block lg:px-8">
          <div className="mx-auto grid max-w-[1200px] grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8">
            {artworks.map((art, index) => (
              <ArtworkCard key={art.title} art={art} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center px-5">
          <Link
            href="/collections"
            className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full bg-white/60 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1e1e1c] shadow-[0_12px_35px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-[#1e1e1c] hover:text-white"
          >
            View All Artwork
            <ArrowUpRight
              size={15}
              className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>

      {/* Bottom Banners */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureBanner
          href="/prints"
          image="/images/limited-prints.png"
          label="Fine Art Prints"
          title="Limited Edition Prints"
          text="Premium archival-quality prints designed for calm homes, meaningful gifts and elegant wall spaces."
          button="Shop Prints"
        />

        <FeatureBanner
          href="/calligraphy-kit"
          image="/images/calligraphy-bg.png"
          label="Creative Kit"
          title="Calligraphy Kit"
          text="A thoughtful starter kit with essential tools to begin your calligraphy practice with confidence."
          button="Shop Kit"
        />
      </div>

      <style jsx>{`
        .artworks-scroll {
          scrollbar-width: none;
        }
        .artworks-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function ArtworkCard({ art, index, mobile = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.65,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={mobile ? "w-[255px] shrink-0 snap-center" : "w-full"}
    >
      <Link href={art.href} className="group block">
        <div className="relative overflow-hidden rounded-[22px] bg-transparent p-0 shadow-none transition duration-500 group-hover:shadow-[0_25px_70px_rgba(0,0,0,0.15)] group-hover:-translate-y-1">
          <div className="relative aspect-[0.82/1] overflow-hidden rounded-[16px] border-0">
            {/* Frame style */}
            <div className="absolute inset-0 rounded-[16px] border-[3px] border-transparent group-hover:border-[#b49b45] pointer-events-none" />

            <img
              src={art.image}
              alt={art.title}
              className="h-full w-full object-cover object-center transition duration-[1200ms] ease-out group-hover:scale-105 rounded-[16px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100 rounded-[16px]" />

            <div className="absolute left-4 top-4 rounded-full bg-white/85 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1c] opacity-0 shadow-sm backdrop-blur-md transition duration-300 group-hover:opacity-100">
              {art.category}
            </div>

            <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-[#1e1e1c] group-hover:text-white">
              <ArrowUpRight size={17} />
            </div>
          </div>
        </div>

        <div className="px-1 pt-5 text-left">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a2844d]">
            {art.category}
          </p>

          <h3
            className={`${cormorant.className} text-[27px] font-normal italic leading-none tracking-[-0.035em] text-[#1e1e1c] sm:text-[31px]`}
          >
            {art.title}
          </h3>

          <p className="mt-2 text-[14px] font-medium text-[#756756] sm:text-[15px]">
            {art.price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function FeatureBanner({ href, image, label, title, text, button }) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[390px] items-end overflow-hidden bg-[#ded6cc] sm:min-h-[460px] lg:min-h-[520px]"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-[1300ms] ease-out group-hover:scale-[1.06]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_78%,rgba(255,255,255,0.18),transparent_34%)]" />

      <div className="relative z-10 w-full px-6 pb-8 pt-16 text-white sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e6c5a5]">
          {label}
        </p>

        <h3
          className={`${cormorant.className} max-w-[540px] text-[44px] font-normal italic leading-[0.9] tracking-[-0.055em] text-white sm:text-[58px] lg:text-[70px]`}
        >
          {title}
        </h3>

        <p className="mt-5 max-w-[510px] text-[14px] font-normal leading-7 text-white/88 sm:text-[15px]">
          {text}
        </p>

        <span className="mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1e1e1c] transition duration-300 group-hover:bg-[#1e1e1c] group-hover:text-white">
          {button}
          <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}