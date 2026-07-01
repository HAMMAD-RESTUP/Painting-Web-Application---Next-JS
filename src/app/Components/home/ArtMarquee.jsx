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
          w-12
          bg-gradient-to-r
          from-[#f7f3ee]
          via-[#f7f3ee]/90
          to-transparent
          sm:w-28
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
          w-12
          bg-gradient-to-l
          from-[#f7f3ee]
          via-[#f7f3ee]/90
          to-transparent
          sm:w-28
        "
      />

      {/* Marquee */}
      <div
        className="
          animate-marquee
          flex
          w-max
          items-center
          will-change-transform
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
              px-4
              sm:h-20
              sm:w-44
              sm:px-6
              lg:h-24
              lg:w-52
              lg:px-8
            "
          >
            <div className="relative h-full w-full">
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                fill
                sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 208px"
                quality={100}
                className="
                  select-none
                  object-contain
                  opacity-100
                "
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}