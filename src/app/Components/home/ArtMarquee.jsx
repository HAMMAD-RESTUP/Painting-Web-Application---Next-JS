"use client";

import Image from "next/image";

const LOGOS = [
  {
    name: "Alserkal Avenue",
    src: "/images/alserkal-avenue.png",
  },
  {
    name: "Tashkeel",
    src: "/images/tashkeel.png",
  },
  {
    name: "World Art Dubai",
    src: "/images/world-art-dubai.png",
  },
  {
    name: "Jameel Arts Centre",
    src: "/images/jameel-arts-centre.png",
  },
  {
    name: "Funun Arts Group",
    src: "/images/funun-arts.png",
  },
  {
    name: "Dubai Culture",
    src: "/images/dubai-culture.png",
  },
];

const ITEMS = [...LOGOS, ...LOGOS];

export default function ArtMarquee() {
  return (
    <section
      aria-label="Art platform logos"
      className="
        group
        relative
        overflow-hidden
        bg-[#f7f3ee]
        py-5
        sm:py-7
      "
    >
      {/* Left Fade */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-10
          w-16
          bg-gradient-to-r
          from-[#f7f3ee]
          via-[#f7f3ee]/90
          to-transparent
          sm:w-32
        "
      />

      {/* Right Fade */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          z-10
          w-16
          bg-gradient-to-l
          from-[#f7f3ee]
          via-[#f7f3ee]/90
          to-transparent
          sm:w-32
        "
      />

      <div
        className="
          animate-marquee
          flex
          w-max
          items-center
          will-change-transform
          group-hover:[animation-play-state:paused]
        "
      >
        {ITEMS.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="
              flex
              h-16
              w-36
              shrink-0
              items-center
              justify-center
              px-5
              sm:h-20
              sm:w-44
              sm:px-7
              lg:w-52
            "
          >
            <Image
              src={logo.src}
              alt={`${logo.name} logo`}
              width={180}
              height={80}
              className="
                h-full
                w-full
                object-contain
                opacity-70
                grayscale
                transition
                duration-300
                hover:scale-105
                hover:opacity-100
                hover:grayscale-0
              "
            />
          </div>
        ))}
      </div>
    </section>
  );
}