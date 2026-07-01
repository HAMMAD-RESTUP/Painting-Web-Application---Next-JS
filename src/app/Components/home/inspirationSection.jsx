"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const galleryImages = [
  {
    title: "Soft Floral Study",
    image: "/images/inspiration-artist.jpg",
    href: "/shop",
  },
  {
    title: "Soft Flowers Prints",
    image: "/images/soft-flowers.jpg",
    href: "/shop",
  },
  {
    title: "Original Painting",
    image: "/images/original-paintings.jpg",
    href: "/shop",
  },
  {
    title: "Pattern Memory",
    image: "/images/islamic-geometry.jpg",
    href: "/shop",
  },
  {
    title: "Quiet Bloom",
    image: "/images/hero-1.jpg",
    href: "/shop",
  },
  {
    title: "Window Light",
    image: "/images/inspiration-window.jpg",
    href: "/shop",
  },
  {
    title: "Fine Lines",
    image: "/images/product1.jpg",
    href: "/shop",
  },
  {
    title: "Colourful Prints",
    image: "/images/prints.jpg",
    href: "/shop",
  },
];

const featuredPainting = {
  title: "A World Shaped by Colour",
  image: "/images/hero-4.jpg",
  href: "/shop",
};

const desktopTilePositions = [
  "col-start-1 row-start-1",
  "col-start-2 row-start-1",
  "col-start-4 row-start-1",
  "col-start-5 row-start-1",
  "col-start-1 row-start-2",
  "col-start-2 row-start-2",
  "col-start-4 row-start-2",
  "col-start-5 row-start-2",
];

export default function PastPaintingsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="gallery"
      className="relative w-full overflow-hidden bg-[#f7f3ee] py-12 text-[#1e1e1c] sm:py-16 md:py-20 lg:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-36 top-8 h-[280px] w-[280px] rounded-full bg-[#eadcc9]/80 blur-3xl sm:h-[380px] sm:w-[380px]" />

      <div className="pointer-events-none absolute -right-40 bottom-12 h-[320px] w-[320px] rounded-full bg-[#ead8c2]/80 blur-3xl sm:h-[440px] sm:w-[440px]" />

      <div className="pointer-events-none absolute left-1/2 top-[48%] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-white/50 blur-3xl md:h-[400px] md:w-[400px]" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="mx-auto max-w-[1240px] px-4 text-center sm:px-6 lg:px-8">
          <motion.p
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 12,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mb-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#ad8b43] sm:mb-4 sm:text-[11px] sm:tracking-[0.34em]"
          >
            Curated Art Gallery
          </motion.p>

          <motion.h2
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 18,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.68,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-special text-[clamp(2.6rem,8vw,5.9rem)] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#171512]"
          >
            Art in every
            <span className="block">
              detail and brushstroke.
            </span>
          </motion.h2>

          <motion.p
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 14,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.58,
              delay: 0.06,
            }}
            className="mx-auto mt-5 max-w-2xl px-1 text-[13px] leading-6 text-[#696158] sm:mt-6 sm:text-[15px] sm:leading-7 md:text-base"
          >
            Explore a selected collection of original
            paintings, intricate details and timeless
            artwork created with care.
          </motion.p>
        </div>

        {/* Gallery */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 24,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-9 w-full max-w-[1500px] px-4 sm:mt-12 sm:px-6 lg:px-8"
        >
          {/* Desktop mosaic */}
          <div className="hidden h-[500px] grid-cols-[0.9fr_0.9fr_2.65fr_0.9fr_0.9fr] grid-rows-2 gap-3 lg:grid xl:h-[560px] xl:gap-4">
            {galleryImages.map((artwork, index) => (
              <GalleryTile
                key={artwork.title}
                artwork={artwork}
                className={desktopTilePositions[index]}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}

            <div className="col-start-3 row-span-2 row-start-1 min-h-0">
              <FeaturedTile artwork={featuredPainting} />
            </div>
          </div>

          {/* Mobile and tablet gallery */}
          <div className="lg:hidden">
            <div className="aspect-[4/5] w-full sm:aspect-[16/10]">
              <FeaturedTile artwork={featuredPainting} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-4 sm:gap-4">
              {galleryImages.map((artwork) => (
                <GalleryTile
                  key={artwork.title}
                  artwork={artwork}
                  className="aspect-square sm:aspect-[4/5]"
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 14,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.58,
            delay: 0.08,
          }}
          className="mt-9 flex justify-center px-4 sm:mt-12"
        >
          <Link
            href="/shop"
            data-cursor-label="View Gallery"
            className="group inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full border border-[#28231d]/15 bg-white/75 px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#29251f] shadow-[0_12px_35px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-[#29251f] hover:text-white sm:min-h-[48px] sm:gap-3 sm:px-8 sm:text-[10px] sm:tracking-[0.2em]"
          >
            Explore The Gallery

            <ArrowUpRight
              size={15}
              className="shrink-0 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function GalleryTile({
  artwork,
  className = "",
  shouldReduceMotion,
}) {
  return (
    <TiltCard
      disabled={shouldReduceMotion}
      className={`relative min-h-0 w-full overflow-hidden rounded-[14px] bg-[#eee7df] shadow-[0_14px_35px_rgba(0,0,0,0.08)] sm:rounded-[18px] ${className}`}
    >
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                scale: 0.97,
              }
        }
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.48,
          ease: "easeOut",
        }}
        className="h-full w-full"
      >
        <Link
          href={artwork.href}
          data-cursor-label="View"
          className="group relative block h-full w-full overflow-hidden"
        >
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 15vw"
            className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-35 transition duration-300 sm:opacity-0 sm:group-hover:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 translate-y-0 p-3 transition duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <p className="text-[8px] font-semibold uppercase leading-4 tracking-[0.14em] text-white sm:text-[9px] sm:tracking-[0.16em]">
              {artwork.title}
            </p>
          </div>

          <div className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1e1e1c] opacity-100 shadow-sm backdrop-blur-md transition duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <ArrowUpRight size={14} />
          </div>
        </Link>
      </motion.div>
    </TiltCard>
  );
}

function TiltCard({
  children,
  className,
  disabled = false,
}) {
  const cardRef = useRef(null);

  const [transform, setTransform] = useState(
    "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)"
  );

  const handleMouseMove = (event) => {
    if (
      disabled ||
      !cardRef.current ||
      typeof window === "undefined" ||
      window.innerWidth < 1024
    ) {
      return;
    }

    const rect =
      cardRef.current.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) / rect.height -
      0.5;

    const rotateX = y * -7;
    const rotateY = x * 7;

    setTransform(
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.018)`
    );
  };

  const handleMouseLeave = () => {
    setTransform(
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)"
    );
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition:
          "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}

function FeaturedTile({ artwork }) {
  return (
    <Link
      href={artwork.href}
      data-cursor-label="View Collection"
      className="group relative block h-full w-full overflow-hidden rounded-[18px] bg-[#d9d1c8] shadow-[0_20px_55px_rgba(0,0,0,0.12)] sm:rounded-[22px]"
    >
      <Image
        src={artwork.image}
        alt={artwork.title}
        fill
        priority={false}
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 40vw"
        className="object-cover object-center transition duration-[1200ms] ease-out group-hover:scale-[1.04]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8 xl:p-10">
        <p className="mb-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#e5cca2] sm:text-[9px] sm:tracking-[0.2em]">
          Featured Artwork
        </p>

        <h3 className="font-special max-w-[650px] text-[clamp(2rem,5vw,4rem)] font-normal italic leading-[0.9] tracking-[-0.035em] text-white">
          {artwork.title}
        </h3>

        <div className="mt-4 flex items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-[9px] sm:tracking-[0.2em]">
          View Collection

          <span className="h-px w-9 bg-white/75 transition-all duration-300 group-hover:w-16" />

          <ArrowUpRight
            size={14}
            className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}