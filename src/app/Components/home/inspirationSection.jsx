"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const galleryImages = [
  { title: "Soft Floral Study", image: "/images/inspiration-artist.jpg", href: "/shop" },
  { title: "Arabic Calligraphy", image: "/images/calligraphy-bg.png", href: "/shop" },
  { title: "Original Painting", image: "/images/original-paintings.jpg", href: "/shop" },
  { title: "Pattern Memory", image: "/images/islamic-geometry.jpg", href: "/shop" },
  { title: "Quiet Bloom", image: "/images/hero-1.jpg", href: "/shop" },
  { title: "Window Light", image: "/images/inspiration-window.jpg", href: "/shop" },
  { title: "Fine Lines", image: "/images/product1.jpg", href: "/shop" },
  { title: "Colourful Prints", image: "/images/prints.jpg", href: "/shop" },
];

const featuredPainting = { title: "A World Shaped by Colour", image: "/images/hero-3.jpg", href: "/shop" };

export default function PastPaintingsSection() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-gradient-to-b from-[#fdf8f2] to-[#f7f4ee] py-16 text-[#1e1e1c] sm:py-20 lg:py-24">
      {/* Heading */}
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#ad8b43] sm:text-[11px]"
        >
          Curated Art Gallery
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.68 }}
          className={`font-special text-[48px] font-normal italic leading-[0.88] tracking-[-0.055em] text-[#171512] sm:text-[68px] md:text-[82px] lg:text-[94px]`}
        >
          Art in every
          <span className="block">detail and brushstroke.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.58, delay: 0.06 }}
          className="mx-auto mt-5 max-w-2xl text-[14px] leading-7 text-[#696158] sm:text-[15px] sm:leading-7"
        >
          Explore a selected collection of original paintings, intricate
          details and timeless artwork created with care.
        </motion.p>
      </div>

      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.72 }}
        className="mx-auto mt-12 max-w-[1500px] px-3 sm:px-5 lg:px-6"
      >
        {/* Desktop Mosaic */}
        <div className="hidden lg:grid grid-cols-[0.88fr_0.88fr_2.65fr_0.88fr_0.88fr] grid-rows-2 gap-3 h-[480px]">
          <GalleryTile artwork={galleryImages[0]} />
          <GalleryTile artwork={galleryImages[1]} />
          <FeaturedTile artwork={featuredPainting} />
          <GalleryTile artwork={galleryImages[2]} />
          <GalleryTile artwork={galleryImages[3]} />
          <GalleryTile artwork={galleryImages[4]} />
          <GalleryTile artwork={galleryImages[5]} />
          <GalleryTile artwork={galleryImages[6]} />
          <GalleryTile artwork={galleryImages[7]} />
        </div>

        {/* Mobile / Tablet */}
        <div className="lg:hidden">
          <FeaturedTile artwork={featuredPainting} />
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {galleryImages.map((art, idx) => (
              <GalleryTile key={idx} artwork={art} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.58, delay: 0.08 }}
        className="mt-12 flex justify-center px-4"
      >
        <Link
          href="/shop"
          className="group inline-flex items-center gap-3 rounded-full border border-[#28231d]/20 bg-white/80 px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#29251f] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-[#29251f] hover:text-white"
        >
          Explore The Gallery
          <ArrowUpRight
            size={15}
            className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>
    </section>
  );
}

function GalleryTile({ artwork }) {
  return (
    <TiltCard className="relative h-full w-full overflow-hidden rounded-[18px] bg-[#eee7df]">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.48, ease: "easeOut" }}
        className="h-full w-full"
      >
        <Link
          href={artwork.href}
          className="group block h-full w-full"
          data-cursor-label="View"
        >
          <img
            src={artwork.image}
            alt={artwork.title}
            className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <p className="absolute bottom-2 left-2 right-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition duration-300 group-hover:opacity-100">
            {artwork.title}
          </p>
        </Link>
      </motion.div>
    </TiltCard>
  );
}

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("perspective(800px) rotateX(0deg) rotateY(0deg)");

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(800px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.02)`
    );
  };

  const onLeave = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transform, transition: "transform 0.35s ease-out" }}
    >
      {children}
    </div>
  );
}

function FeaturedTile({ artwork }) {
  return (
    <Link
      href={artwork.href}
      className="group relative block h-full w-full overflow-hidden rounded-[20px] bg-[#d9d1c8]"
    >
      <img
        src={artwork.image}
        alt={artwork.title}
        className="h-full w-full object-cover object-center transition duration-1000 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/5" />
      <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-6">
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e0c79d]">
          Featured Artwork
        </p>
        <h3 className={`font-special text-[32px] font-normal italic leading-[0.9] text-white sm:text-[48px] lg:text-[56px]`}>
          {artwork.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/85">
          View Collection
          <span className="h-px w-8 bg-white/75 transition-all duration-300 group-hover:w-14" />
        </div>
      </div>
    </Link>
  );
}