"use client";

const PHRASES = [
  "Original Paintings",
  "Arabic Calligraphy",
  "Islamic Illustration",
  "Fine Art Prints",
  "Creative Courses",
  "Timeless Beauty",
];

const ITEMS = [...PHRASES, ...PHRASES];

export default function ArtMarquee() {
  return (
    <div
      aria-hidden
      className="group relative overflow-hidden border-y border-[#e8ddd0]/60 bg-[#f3ece3] py-4"
    >
      <div className="animate-marquee flex w-max gap-0 group-hover:[animation-play-state:paused]">
        {ITEMS.map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="flex shrink-0 items-center gap-6 px-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#9a7d4e]/80 sm:text-[12px] sm:tracking-[0.36em]"
          >
            {phrase}
            <span className="inline-block h-1 w-1 rounded-full bg-[#d8b07c]/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
