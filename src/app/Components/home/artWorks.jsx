"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const artworks = [
  {
    title: "Blue Rhythm",
    category: "New Artwork",
    image: "/images/original-paintings.jpg",
    href: "/shop",
  },
  {
    title: "Silent Colors",
    category: "Recently Added",
    image: "/images/prints.jpg",
    href: "/shop",
  },
  {
    title: "The Birds",
    category: "New Arrival",
    image: "/images/product1.jpg",
    href: "/shop",
  },
  {
    title: "Golden Memory",
    category: "Fresh Collection",
    image: "/images/original-painting hero.png",
    href: "/shop",
  },
  {
    title: "Good Morning",
    category: "New Artwork",
    image: "/images/hero-1.jpg",
    href: "/shop",
  },
  {
    title: "Soft Morning",
    category: "Recently Added",
    image: "/images/hero-3.jpg",
    href: "/shop",
  },
];

export default function RecentArtworksSection() {
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);
  const animationFrameRef = useRef(null);
  const suppressClickRef = useRef(false);

  const dragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
    pointerId: null,
  });

  const shouldReduceMotion = useReducedMotion();

  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const updateCardTransforms = useCallback(() => {
    const container = scrollRef.current;

    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter =
      containerRect.left + containerRect.width / 2;

    const disableEffect =
      shouldReduceMotion || window.innerWidth < 768;

    cardRefs.current.forEach((card) => {
      if (!card) return;

      if (disableEffect) {
        card.style.transform =
          "perspective(1000px) rotateY(0deg) scale(1)";
        card.style.transformOrigin = "center";
        return;
      }

      const cardRect = card.getBoundingClientRect();
      const cardCenter =
        cardRect.left + cardRect.width / 2;

      const distance = cardCenter - containerCenter;

      const normalDistance = Math.max(
        -1,
        Math.min(
          1,
          distance / (containerRect.width * 0.65)
        )
      );

      const rotateY = normalDistance * -6;

      const scale =
        1 - Math.abs(normalDistance) * 0.025;

      card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;

      card.style.transformOrigin =
        distance < 0
          ? "right center"
          : "left center";
    });
  }, [shouldReduceMotion]);

  const scheduleTransformUpdate = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(
        animationFrameRef.current
      );
    }

    animationFrameRef.current =
      requestAnimationFrame(
        updateCardTransforms
      );
  }, [updateCardTransforms]);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return undefined;

    scheduleTransformUpdate();

    container.addEventListener(
      "scroll",
      scheduleTransformUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      scheduleTransformUpdate
    );

    const resizeObserver = new ResizeObserver(
      scheduleTransformUpdate
    );

    resizeObserver.observe(container);

    return () => {
      container.removeEventListener(
        "scroll",
        scheduleTransformUpdate
      );

      window.removeEventListener(
        "resize",
        scheduleTransformUpdate
      );

      resizeObserver.disconnect();

      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, [scheduleTransformUpdate]);

  const handlePointerDown = (event) => {
    const container = scrollRef.current;

    if (
      !container ||
      event.pointerType !== "mouse" ||
      event.button !== 0
    ) {
      return;
    }

    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
      moved: false,
      pointerId: event.pointerId,
    };

    container.setPointerCapture(
      event.pointerId
    );

    setIsDragging(true);
    setPreview(null);
  };

  const handlePointerMove = (event) => {
    const container = scrollRef.current;

    if (
      !container ||
      !dragRef.current.active
    ) {
      return;
    }

    const distance =
      event.clientX -
      dragRef.current.startX;

    if (Math.abs(distance) > 5) {
      dragRef.current.moved = true;
    }

    container.scrollLeft =
      dragRef.current.scrollLeft -
      distance;

    scheduleTransformUpdate();
  };

  const finishDragging = () => {
    const container = scrollRef.current;

    if (!dragRef.current.active) return;

    const wasMoved =
      dragRef.current.moved;

    suppressClickRef.current = wasMoved;

    dragRef.current.active = false;
    dragRef.current.moved = false;

    setIsDragging(false);

    if (
      container &&
      dragRef.current.pointerId !== null &&
      container.hasPointerCapture(
        dragRef.current.pointerId
      )
    ) {
      container.releasePointerCapture(
        dragRef.current.pointerId
      );
    }

    dragRef.current.pointerId = null;

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const handleCardClick = (event) => {
    if (suppressClickRef.current) {
      event.preventDefault();
    }
  };

  const handlePreviewEnter = (
    artwork,
    event
  ) => {
    if (
      isDragging ||
      typeof window === "undefined" ||
      window.innerWidth < 1024
    ) {
      return;
    }

    setPreview({
      ...artwork,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handlePreviewMove = (event) => {
    if (!preview || isDragging) return;

    setPreview((currentPreview) => {
      if (!currentPreview) return null;

      return {
        ...currentPreview,
        x: event.clientX,
        y: event.clientY,
      };
    });
  };

  const handlePreviewLeave = () => {
    setPreview(null);
  };

  const scrollArtworks = (direction) => {
    const container = scrollRef.current;

    if (!container) return;

    const scrollAmount = Math.min(
      container.clientWidth * 0.8,
      380
    );

    container.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  const previewPosition = (() => {
    if (
      !preview ||
      typeof window === "undefined"
    ) {
      return {
        left: 0,
        top: 0,
      };
    }

    const previewWidth = 244;
    const previewHeight = 292;
    const spacing = 24;

    return {
      left: Math.max(
        spacing,
        Math.min(
          preview.x + spacing,
          window.innerWidth -
            previewWidth -
            spacing
        )
      ),

      top: Math.max(
        spacing,
        Math.min(
          preview.y -
            previewHeight / 2,
          window.innerHeight -
            previewHeight -
            spacing
        )
      ),
    };
  })();

  return (
    <section
      id="recent"
      className="relative w-full overflow-hidden bg-[#f7f3ee] py-12 text-[#1e1e1c] sm:py-16 md:py-20 lg:py-24"
    >
      {/* Background Decorations */}

      <div className="pointer-events-none absolute -left-36 top-8 h-[260px] w-[260px] rounded-full bg-[#eadcc9]/80 blur-3xl sm:h-[360px] sm:w-[360px]" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-[300px] w-[300px] rounded-full bg-[#ead8c2]/80 blur-3xl sm:h-[430px] sm:w-[430px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        {/* Section Heading */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 22,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
        >
          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#b8964f] sm:mb-4 sm:text-[11px] sm:tracking-[0.3em]">
            Latest Artwork
          </p>

          <h2 className="font-special text-[clamp(2.5rem,8vw,5.75rem)] font-normal italic leading-[0.94] tracking-[-0.05em] text-[#171717]">
            Recent Artworks

            <span className="block">
              From Rakhshinda
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl px-1 text-[13px] leading-6 text-[#625b52] sm:mt-6 sm:text-[15px] sm:leading-7 md:text-base">
            Discover the latest original
            artworks, fresh paintings and
            newly completed pieces added to
            the collection.
          </p>
        </motion.div>

        {/* Artwork Slider */}

        <div className="relative mt-8 sm:mt-11 md:mt-14 lg:mt-16">
          <div
            ref={scrollRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDragging}
            onPointerCancel={finishDragging}
            className={`recent-art-scroll flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-9 pt-2 select-none sm:gap-6 sm:px-6 sm:pb-11 md:gap-7 lg:gap-8 lg:px-10 ${
              isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
            }`}
          >
            {artworks.map(
              (artwork, index) => {
                const isLowerCard =
                  index % 3 === 1;

                return (
                  <motion.article
                    key={`${artwork.title}-${index}`}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 28,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.05,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className={`shrink-0 snap-start ${
                      isLowerCard
                        ? "md:mt-8 lg:mt-10"
                        : ""
                    }`}
                  >
                    <div
                      ref={(element) => {
                        cardRefs.current[
                          index
                        ] = element;
                      }}
                      className="will-change-transform"
                      style={{
                        transition:
                          "transform 180ms ease-out",
                      }}
                    >
                      <Link
                        href={artwork.href}
                        draggable={false}
                        onClick={
                          handleCardClick
                        }
                        onMouseEnter={(
                          event
                        ) =>
                          handlePreviewEnter(
                            artwork,
                            event
                          )
                        }
                        onMouseMove={
                          handlePreviewMove
                        }
                        onMouseLeave={
                          handlePreviewLeave
                        }
                        data-cursor-label="View"
                        className="group block w-[82vw] max-w-[280px] sm:w-[44vw] sm:max-w-[310px] md:w-[300px] lg:w-[310px] xl:w-[330px]"
                      >
                        <div className="relative rounded-[20px] bg-[#eee5da] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.09)] transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_75px_rgba(0,0,0,0.14)] sm:rounded-[24px] sm:p-[10px]">
                          <div className="relative overflow-hidden rounded-[15px] bg-[#faf6f0] p-[5px] sm:rounded-[18px] sm:p-[7px]">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[11px] bg-[#efe8de] sm:rounded-[13px]">
                              <Image
                                src={
                                  artwork.image
                                }
                                alt={
                                  artwork.title
                                }
                                fill
                                draggable={
                                  false
                                }
                                sizes="(max-width: 639px) 82vw, (max-width: 1023px) 44vw, 330px"
                                className="pointer-events-none object-cover object-center transition duration-[1000ms] ease-out group-hover:scale-105"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-30 transition duration-500 lg:opacity-0 lg:group-hover:opacity-100" />

                              <div className="absolute left-3 top-3 max-w-[calc(100%-24px)] rounded-full bg-white/90 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#1e1e1c] shadow-sm backdrop-blur-md transition duration-300 sm:left-4 sm:top-4 sm:px-3.5 sm:py-2 sm:text-[9px] lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                                {
                                  artwork.category
                                }
                              </div>

                              <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-[#1e1e1c] group-hover:text-white sm:bottom-4 sm:right-4 sm:h-10 sm:w-10">
                                <ArrowUpRight
                                  size={16}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-1 pt-4 text-left sm:pt-5">
                          <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#a2844d] sm:mb-2 sm:text-[10px] sm:tracking-[0.2em]">
                            {
                              artwork.category
                            }
                          </p>

                          <h3 className="font-special text-[26px] font-normal italic leading-none tracking-[-0.035em] text-[#1e1e1c] sm:text-[30px] md:text-[32px]">
                            {
                              artwork.title
                            }
                          </h3>
                        </div>
                      </Link>
                    </div>
                  </motion.article>
                );
              }
            )}

            <div
              aria-hidden="true"
              className="w-px shrink-0 sm:w-2 lg:w-4"
            />
          </div>
        </div>

       
    {/* Bottom Controls */}
<div className="relative mt-1 flex w-full items-center justify-center px-4 sm:mt-3 sm:px-6 lg:px-10">
  {/* Center View All Button */}
  <Link
    href="/shop"
    data-cursor-label="View All"
    className="group inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-white/70 px-4 py-2.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#1e1e1c] shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#1e1e1c] hover:text-white sm:min-h-[48px] sm:gap-3 sm:px-7 sm:py-3 sm:text-[10px] sm:tracking-[0.18em]"
  >
    <span className="whitespace-nowrap">
      View New Artworks
    </span>

    <ArrowUpRight
      size={15}
      className="shrink-0 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
    />
  </Link>

  {/* Right End Rectangle Arrow Buttons */}
  <div className="absolute right-4 top-1/2 flex -translate-y-1/2 shrink-0 items-center overflow-hidden rounded-[6px] border border-[#c8b9a7] bg-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-md sm:right-6 lg:right-10">
    <button
      type="button"
      onClick={() => scrollArtworks(-1)}
      aria-label="View previous artworks"
      className="flex h-10 w-10 items-center justify-center border-r border-[#c8b9a7] text-[#1e1e1c] transition duration-300 hover:bg-[#1e1e1c] hover:text-white sm:h-12 sm:w-14"
    >
      <ArrowLeft size={17} />
    </button>

    <button
      type="button"
      onClick={() => scrollArtworks(1)}
      aria-label="View next artworks"
      className="flex h-10 w-10 items-center justify-center text-[#1e1e1c] transition duration-300 hover:bg-[#1e1e1c] hover:text-white sm:h-12 sm:w-14"
    >
      <ArrowRight size={17} />
    </button>
  </div>
</div>
      </div>

      {/* Desktop Floating Preview */}

      <AnimatePresence>
        {preview &&
          preview.x !== undefined &&
          !isDragging && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.88,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
              }}
              transition={{
                duration: 0.22,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="pointer-events-none fixed z-[90] hidden lg:block"
              style={previewPosition}
            >
              <div className="w-[244px] overflow-hidden rounded-[18px] bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
                <div className="relative aspect-[11/10] overflow-hidden rounded-[14px]">
                  <Image
                    src={preview.image}
                    alt={preview.title}
                    fill
                    sizes="244px"
                    className="object-cover"
                  />
                </div>

                <div className="px-2 pb-2 pt-3">
                  <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#a2844d]">
                    {preview.category}
                  </p>

                  <p className="font-special text-[22px] font-normal italic leading-tight text-[#1e1e1c]">
                    {preview.title}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      <style jsx>{`
        .recent-art-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }

        .recent-art-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}