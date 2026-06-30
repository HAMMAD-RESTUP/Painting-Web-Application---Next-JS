"use client";

import {
  BookOpen,
  Brush,
  Frame,
  GraduationCap,
  PenTool,
  Sparkles,
} from "lucide-react";

const PHRASES = [
  {
    label: "Original Paintings",
    icon: Brush,
    iconColor: "text-[#b85f54]",
    iconBg: "bg-[#f8e7e4]",
    iconBorder: "border-[#e8bdb7]",
  },
  {
    label: "Arabic Calligraphy",
    icon: PenTool,
    iconColor: "text-[#8f6b52]",
    iconBg: "bg-[#f2e7de]",
    iconBorder: "border-[#dbc3b2]",
  },
  {
    label: "Islamic Illustration",
    icon: Sparkles,
    iconColor: "text-[#b08a3e]",
    iconBg: "bg-[#f8f0d8]",
    iconBorder: "border-[#e5d49c]",
  },
  {
    label: "Fine Art Prints",
    icon: Frame,
    iconColor: "text-[#6f7f68]",
    iconBg: "bg-[#eaf0e7]",
    iconBorder: "border-[#c8d6c1]",
  },
  {
    label: "Creative Courses",
    icon: GraduationCap,
    iconColor: "text-[#7b6a9a]",
    iconBg: "bg-[#eee9f5]",
    iconBorder: "border-[#d2c7e4]",
  },
  {
    label: "Timeless Beauty",
    icon: BookOpen,
    iconColor: "text-[#a16f5f]",
    iconBg: "bg-[#f6e9e3]",
    iconBorder: "border-[#dfc2b7]",
  },
];

const ITEMS = [...PHRASES, ...PHRASES];

export default function ArtMarquee() {
  return (
    <section
      aria-label="Art categories and creative services"
      className="
        group
        relative
        overflow-hidden
        border-y
        border-[#e8ddd0]/70
       bg-[#f7f3ee]
        py-4
        sm:py-5
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
          w-14
          bg-gradient-to-r
          from-[#f3ece3]
          via-[#f3ece3]/90
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
          w-14
          bg-gradient-to-l
          from-[#f3ece3]
          via-[#f3ece3]/90
          to-transparent
          sm:w-28
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
        {ITEMS.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.label}-${index}`}
              className="
                flex
                shrink-0
                items-center
                gap-4
                px-5
                sm:gap-5
                sm:px-8
              "
            >
              {/* Colored Icon */}
              <span
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  shadow-[0_5px_14px_rgba(75,50,35,0.08)]
                  backdrop-blur-sm
                  transition
                  duration-300
                  group-hover:scale-105
                  ${item.iconBg}
                  ${item.iconBorder}
                  ${item.iconColor}
                `}
              >
                <Icon
                  size={17}
                  strokeWidth={1.8}
                />
              </span>

              {/* Label */}
              <span
                className="
                  whitespace-nowrap
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.26em]
                  text-[#6f5543]/90
                  sm:text-[11px]
                  sm:tracking-[0.3em]
                "
              >
                {item.label}
              </span>

              {/* Separator */}
              <span
                aria-hidden="true"
                className="
                  ml-1
                  inline-block
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#b07f59]/45
                "
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}