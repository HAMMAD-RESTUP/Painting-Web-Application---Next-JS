"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const artworks = [
  {
    title: "Blue Rhythm",
    category: "New Artwork",
    image: "/images/original-paintings.jpg",
    href: "/shop/blue-rhythm",
  },
  {
    title: "Silent Colors",
    category: "Recently Added",
    image: "/images/prints.jpg",
    href: "/shop/silent-colors",
  },
  {
    title: "The Birds",
    category: "New Arrival",
    image: "/images/product1.jpg",
    href: "/shop/the-birds",
  },
  {
    title: "Golden Memory",
    category: "Fresh Collection",
    image: "/images/original-painting hero.png",
    href: "/shop/golden-memory",
  },
  {
    title: "Good Morning",
    category: "New Artwork",
    image: "/images/hero-1.jpg",
    href: "/shop/good-morning",
  },
  {
    title: "Soft Morning",
    category: "Recently Added",
    image: "/images/hero-3.jpg",
    href: "/shop/soft-morning",
  },
];

export default function RecentArtworksSection() {
  const scrollRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [scrollLeft, setScrollLeft] = useState(0);
  const [screenCenter, setScreenCenter] = useState(600);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const updateCenter = () => setScreenCenter(window.innerWidth / 2);
    updateCenter();
    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onPointerDown = (e) => {
    if (!scrollRef.current) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: scrollRef.current.scrollLeft,
      moved: false,
    };
    scrollRef.current.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active || !scrollRef.current) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    scrollRef.current.scrollLeft = drag.current.scrollLeft - dx;
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onPointerUp = (e) => {
    drag.current.active = false;
    setIsDragging(false);
    scrollRef.current?.releasePointerCapture(e.pointerId);
  };

  const onCardEnter = (art) => {
    if (drag.current.moved) return;
    setPreview({ ...art });
  };

  const onCardMove = (e) => {
    if (!preview) return;
    setPreview((p) => (p ? { ...p, x: e.clientX, y: e.clientY } : null));
  };

  const onCardLeave = () => setPreview(null);

  const blockClick = (e) => {
    if (drag.current.moved) e.preventDefault();
    drag.current.moved = false;
  };

  return (
    <section
      id="recent"
      className="relative w-full overflow-hidden bg-[#f7f3ee] py-14 text-[#1e1e1c] sm:py-16 md:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-40 top-10 h-[300px] w-[300px] rounded-full bg-[#eadcc9] blur-3xl sm:h-[360px] sm:w-[360px]" />
      <div className="pointer-events-none absolute -right-44 bottom-16 h-[330px] w-[330px] rounded-full bg-[#ead8c2] blur-3xl sm:h-[430px] sm:w-[430px]" />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl px-5 text-center"
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b8964f] sm:text-[11px]">
            Latest Artwork
          </p>

          <h2
            className={`${cormorant.className} text-[42px] font-normal italic leading-[0.92] tracking-[-0.055em] text-[#171717] xs:text-[46px] sm:text-[62px] md:text-[76px] lg:text-[92px]`}
          >
            Recent Artworks
            <span className="block">From Rakhshinda</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[14px] leading-7 text-[#625b52] sm:mt-6 sm:text-[16px]">
            Discover the latest original artworks, fresh paintings and newly
            completed pieces added to the collection.
          </p>

          <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#b8964f]/70">
            ← Drag to explore →
          </p>
        </motion.div>

        <div className="relative mt-10 sm:mt-12 md:mt-14 lg:mt-16">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className={`recent-art-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-10 select-none sm:gap-7 sm:px-8 md:gap-8 lg:gap-10 lg:px-10 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {artworks.map((art, index) => {
              const cardWidth = 275;
              const gap = 40;
              const itemWidth = cardWidth + gap;
              const itemCenter =
                index * itemWidth - scrollLeft + cardWidth / 2 + 40;
              const distance = itemCenter - screenCenter;
              const rotateY = Math.max(-7, Math.min(7, distance * -0.014));
              const scale = Math.max(0.965, 1 - Math.abs(distance) / 4800);
              const isLowerCard = index % 3 === 1;

              return (
                <motion.div
                  key={art.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`shrink-0 snap-center ${
                    isLowerCard ? "mt-7 sm:mt-9 md:mt-10" : "mt-0"
                  }`}
                  style={{
                    transform: `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`,
                    transformOrigin:
                      distance < 0 ? "right center" : "left center",
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  <Link
                    href={art.href}
                    draggable={false}
                    onClick={blockClick}
                    onMouseEnter={() => onCardEnter(art)}
                    onMouseMove={onCardMove}
                    onMouseLeave={onCardLeave}
                    data-cursor-label="View"
                    className="group block w-[185px] xs:w-[200px] sm:w-[230px] md:w-[255px] lg:w-[275px]"
                  >
                    <div className="relative rounded-[22px] bg-[#eee5da] p-[8px] shadow-[0_18px_50px_rgba(0,0,0,0.10)] transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_80px_rgba(0,0,0,0.15)] sm:rounded-[24px] sm:p-[10px]">
                      <div className="relative overflow-hidden rounded-[17px] bg-[#faf6f0] p-[6px] sm:p-[7px]">
                        <div className="relative h-[230px] overflow-hidden rounded-[12px] bg-[#efe8de] xs:h-[250px] sm:h-[295px] md:h-[325px] lg:h-[355px]">
                          <img
                            src={art.image}
                            alt={art.title}
                            draggable={false}
                            className="h-full w-full object-cover object-center transition duration-[1200ms] ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                          <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#1e1e1c] opacity-0 shadow-sm backdrop-blur-md transition duration-300 group-hover:opacity-100 sm:left-4 sm:top-4 sm:px-3.5 sm:py-2 sm:text-[9px]">
                            {art.category}
                          </div>
                          <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-[#1e1e1c] group-hover:text-white sm:bottom-4 sm:right-4 sm:h-10 sm:w-10">
                            <ArrowUpRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-1 pt-4 text-left sm:pt-5">
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a2844d] sm:text-[10px]">
                        {art.category}
                      </p>
                      <h3
                        className={`${cormorant.className} text-[26px] font-normal italic leading-none tracking-[-0.035em] text-[#1e1e1c] sm:text-[30px] md:text-[32px]`}
                      >
                        {art.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-1 flex flex-col items-center gap-7 px-5 sm:mt-2">
          <Link
            href="/new-artworks"
            data-cursor-label="View All"
            className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full bg-white/65 px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1c] shadow-[0_12px_35px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-[#1e1e1c] hover:text-white sm:px-8 sm:text-[11px] sm:tracking-[0.2em]"
          >
            View New Artworks
            <ArrowUpRight
              size={15}
              className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>

      {/* Floating artwork preview */}
      <AnimatePresence>
        {preview && preview.x && !isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed z-[90] hidden lg:block"
            style={{
              left: Math.min(
                preview.x + 28,
                (typeof window !== "undefined" ? window.innerWidth : 1200) - 260
              ),
              top: Math.max(preview.y - 200, 80),
            }}
          >
            <div className="overflow-hidden rounded-[18px] bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
              <img
                src={preview.image}
                alt={preview.title}
                className="h-[200px] w-[220px] rounded-[14px] object-cover"
              />
              <p
                className={`${cormorant.className} mt-2 px-2 text-[22px] font-normal italic text-[#1e1e1c]`}
              >
                {preview.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .recent-art-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .recent-art-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
