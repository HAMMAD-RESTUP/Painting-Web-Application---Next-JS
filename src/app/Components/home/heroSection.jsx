"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import {
  ArrowRight,
  ChevronDown,
} from "lucide-react";

import HeroPaintCanvas from "./HeroPaintCanvas";

/*
|--------------------------------------------------------------------------
| Hero Slides
|--------------------------------------------------------------------------
*/

const SLIDES = [
  {
    image: "/images/banner3.png",

    titlePart1: "Rakhshinda",
    titlePart2: "Art",

    description:
      "Discover original paintings, Arabic calligraphy and Islamic illustrations thoughtfully created with detail, emotion and timeless beauty.",
  },
];

/*
|--------------------------------------------------------------------------
| Hero Section
|--------------------------------------------------------------------------
*/

export default function HeroSection() {
  const sectionRef = useRef(null);

  const shouldReduceMotion =
    useReducedMotion();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useSpring(
    mouseX,
    {
      stiffness: 60,
      damping: 20,
      mass: 0.6,
    }
  );

  const parallaxY = useSpring(
    mouseY,
    {
      stiffness: 60,
      damping: 20,
      mass: 0.6,
    }
  );

  const currentSlide =
    SLIDES[currentIndex];

  /*
  |--------------------------------------------------------------------------
  | Auto Slider
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      SLIDES.length <= 1 ||
      shouldReduceMotion
    ) {
      return undefined;
    }

    const timer = window.setInterval(
      () => {
        setCurrentIndex(
          (previousIndex) =>
            (
              previousIndex + 1
            ) % SLIDES.length
        );
      },
      6000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [shouldReduceMotion]);

  /*
  |--------------------------------------------------------------------------
  | Desktop Mouse Parallax
  |--------------------------------------------------------------------------
  */

  const handleMouseMove = (
    event
  ) => {
    if (
      !sectionRef.current ||
      shouldReduceMotion
    ) {
      return;
    }

    if (
      typeof window !==
        "undefined" &&
      window.innerWidth < 768
    ) {
      return;
    }

    const sectionRect =
      sectionRef.current.getBoundingClientRect();

    const horizontalPosition =
      (
        event.clientX -
        sectionRect.left
      ) /
        sectionRect.width -
      0.5;

    const verticalPosition =
      (
        event.clientY -
        sectionRect.top
      ) /
        sectionRect.height -
      0.5;

    mouseX.set(
      horizontalPosition * 26
    );

    mouseY.set(
      verticalPosition * 16
    );
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Original art for meaningful spaces"
      className="
        hero-section
        relative
        isolate
        w-full
        overflow-hidden
        bg-[#f7f1e8]
      "
    >
      <div
        className="
          relative
          min-h-[590px]
          w-full

          min-[390px]:min-h-[620px]
          sm:min-h-[640px]
          md:min-h-[650px]
          lg:min-h-[680px]
          xl:min-h-[720px]
        "
      >
        {/* Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#f7f1e8]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                    }
              }
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.9,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="absolute inset-0"
            >
              {/* Mobile Image */}
              <motion.img
                src={currentSlide.image}
                alt=""
                aria-hidden="true"
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        scale: 1.02,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 1.05,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="
                  absolute
                  inset-0
                  block
                  h-full
                  w-full
                  object-cover
                  object-[64%_center]
                  brightness-[1.02]
                  contrast-[0.98]
                  saturate-[0.86]

                  min-[390px]:object-[63%_center]
                  min-[390px]:saturate-[0.88]

                  sm:object-[61%_center]
                  sm:saturate-[0.91]

                  md:hidden
                "
              />

              {/* Desktop Background */}
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        scale: 1.05,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 1.2,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="
                  absolute
                  inset-[-3%]
                  hidden
                  bg-cover
                  bg-center
                  bg-no-repeat
                  md:block
                "
                style={{
                  backgroundImage: `url("${currentSlide.image}")`,

                  x: shouldReduceMotion
                    ? 0
                    : parallaxX,

                  y: shouldReduceMotion
                    ? 0
                    : parallaxY,
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Left Overlay */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-[1]
            hidden
            w-[68%]
            bg-gradient-to-r
            from-[#f7f1e8]/95
            via-[#f7f1e8]/72
            to-transparent
            md:block
          "
        />

        {/* Mobile Left Overlay */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            bg-gradient-to-r
            from-[#f7f1e8]/90
            via-[#f7f1e8]/58
            to-transparent
            md:hidden
          "
        />

        {/* Mobile Local Text Support */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-[1]
            w-[72%]
            bg-gradient-to-r
            from-[#f7f1e8]/22
            to-transparent
            md:hidden
          "
        />

        {/* Mobile Bottom Blend */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-[1]
            h-[24%]
            bg-gradient-to-t
            from-[#f7f1e8]/65
            via-[#f7f1e8]/12
            to-transparent
            md:hidden
          "
        />

        {/* Desktop Bottom Gradient */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-[1]
            hidden
            h-[38%]
            bg-gradient-to-t
            from-[#f7f1e8]/70
            via-[#f7f1e8]/18
            to-transparent
            md:block
          "
        />

        {/* Decorative Glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            hidden
            overflow-hidden
            md:block
          "
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [
                      0,
                      28,
                      0,
                    ],

                    y: [
                      0,
                      -18,
                      0,
                    ],
                  }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              -left-24
              top-1/4
              h-72
              w-72
              rounded-full
              bg-[#d8b07c]/14
              blur-3xl
            "
          />

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [
                      0,
                      -22,
                      0,
                    ],

                    y: [
                      0,
                      15,
                      0,
                    ],
                  }
            }
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              -right-20
              bottom-1/4
              h-80
              w-80
              rounded-full
              bg-[#b07f59]/10
              blur-3xl
            "
          />
        </div>

        {/* Paint Effect Desktop Only */}
        <div className="hidden md:block">
          <HeroPaintCanvas />
        </div>

        {/* Main Content */}
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[590px]
            max-w-[1440px]
            items-center
            px-5
            pb-12
            pt-24

            min-[390px]:min-h-[620px]
            min-[390px]:pt-28

            sm:min-h-[640px]
            sm:px-9
            sm:py-16

            md:min-h-[650px]
            md:px-12

            lg:min-h-[680px]
            lg:px-16

            xl:min-h-[720px]
            xl:px-20
          "
        >
          <div className="w-full max-w-[680px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 22,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -18,
                }}
                transition={{
                  duration: 0.65,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                {/* Main Heading */}
                <h1
                  className="
                    font-special
                    max-w-[680px]
                    font-normal
                    italic
                    leading-[0.86]
                    tracking-[-0.05em]
                  "
                >
                  <span
                    className="
                      block
                      overflow-hidden
                      text-[46px]
                      text-[#3b2f2a]

                      min-[375px]:text-[52px]
                      sm:text-[72px]
                      md:text-[88px]
                      lg:text-[100px]
                      xl:text-[112px]
                    "
                  >
                    <SplitReveal
                      text={
                        currentSlide.titlePart1
                      }
                      reduceMotion={
                        shouldReduceMotion
                      }
                    />
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      overflow-hidden
                      text-[46px]
                      text-[#b07f59]

                      min-[375px]:text-[52px]
                      sm:text-[72px]
                      md:text-[88px]
                      lg:text-[100px]
                      xl:text-[112px]
                    "
                  >
                    <SplitReveal
                      text={
                        currentSlide.titlePart2
                      }
                      delay={0.06}
                      reduceMotion={
                        shouldReduceMotion
                      }
                    />
                  </span>
                </h1>

                {/* Decorative Line */}
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          scaleX: 0,
                        }
                  }
                  animate={{
                    scaleX: 1,
                  }}
                  transition={{
                    delay: 0.32,
                    duration: 0.7,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="
                    mt-5
                    h-px
                    w-[66px]
                    origin-left
                    bg-[#b07f59]/85

                    sm:mt-6
                    sm:w-[78px]
                  "
                />

                {/* Description */}
                <motion.p
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 10,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.23,
                    duration: 0.55,
                  }}
                  className="
                    mt-4
                    max-w-[305px]
                    text-[13px]
                    leading-6
                    text-[#4f453d]

                    min-[390px]:max-w-[345px]
                    min-[390px]:text-[14px]
                    min-[390px]:leading-7

                    sm:mt-5
                    sm:max-w-[540px]
                    sm:text-[15px]

                    md:max-w-[610px]
                    md:text-[16px]

                    lg:text-[17px]
                    lg:leading-8
                  "
                >
                  {
                    currentSlide.description
                  }
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* CTA Buttons */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 16,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.42,
                duration: 0.55,
              }}
              className="
                mt-6
                flex
                flex-col
                gap-2.5

                min-[470px]:flex-row
                sm:mt-7
                sm:gap-3
              "
            >
              <MagneticLink
                href="/shop"
                disabledMotion={
                  shouldReduceMotion
                }
                className="
                  group
                  inline-flex
                  min-h-[46px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-[#6f5543]
                  bg-[#6f5543]
                  px-6
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.13em]
                  text-white
                  shadow-[0_8px_18px_rgba(75,50,35,0.14)]
                  transition
                  duration-300

                  hover:border-[#b07f59]
                  hover:bg-[#b07f59]

                  min-[470px]:w-auto
                  min-[470px]:px-7

                  sm:min-h-[50px]
                  sm:px-8
                  sm:text-[10px]
                  sm:tracking-[0.15em]

                  md:text-[11px]
                  md:shadow-[0_10px_24px_rgba(75,50,35,0.16)]
                "
              >
                Explore Artwork

                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </MagneticLink>

              <MagneticLink
                href="/artist"
                disabledMotion={
                  shouldReduceMotion
                }
                className="
                  group
                  inline-flex
                  min-h-[46px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-[#6f5543]/25
                  bg-[#fffdfb]/72
                  px-6
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.13em]
                  text-[#51473f]
                  shadow-[0_6px_16px_rgba(75,50,35,0.06)]
                  backdrop-blur-[2px]
                  transition
                  duration-300

                  hover:border-[#b07f59]
                  hover:bg-[#f8efe8]
                  hover:text-[#b07f59]

                  min-[470px]:w-auto
                  min-[470px]:px-7

                  sm:min-h-[50px]
                  sm:bg-[#fffdfb]/88
                  sm:px-8
                  sm:text-[10px]
                  sm:tracking-[0.15em]

                  md:text-[11px]
                  md:shadow-[0_8px_20px_rgba(75,50,35,0.08)]
                "
              >
                About the Artist

                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </MagneticLink>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        {SLIDES.length > 1 && (
          <div
            className="
              absolute
              bottom-8
              left-1/2
              z-20
              flex
              -translate-x-1/2
              items-center
              gap-2
              sm:bottom-10
            "
          >
            {SLIDES.map(
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${
                    index + 1
                  }`}
                  aria-current={
                    index ===
                    currentIndex
                      ? "true"
                      : undefined
                  }
                  onClick={() =>
                    setCurrentIndex(
                      index
                    )
                  }
                  className="
                    group
                    flex
                    h-8
                    w-10
                    items-center
                    justify-center
                  "
                >
                  <span
                    className={`block h-[2px] rounded-full transition-all duration-500 ${
                      index ===
                      currentIndex
                        ? "w-10 bg-[#b07f59]"
                        : "w-5 bg-[#51473f]/25 group-hover:w-7 group-hover:bg-[#51473f]/50"
                    }`}
                  />
                </button>
              )
            )}
          </div>
        )}

        {/* Scroll Cue */}
        <motion.a
          href="#studio-stats"
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                }
          }
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
            duration: 0.7,
          }}
          className="
            absolute
            bottom-8
            right-6
            z-20
            hidden
            flex-col
            items-center
            gap-2
            text-[#6f5543]

            sm:flex
            md:right-10
            lg:right-16
          "
          aria-label="Scroll to the next section"
        >
          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.28em]
            "
          >
            Scroll
          </span>

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [
                      0,
                      6,
                      0,
                    ],
                  }
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown
              size={18}
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Split Reveal Text
|--------------------------------------------------------------------------
*/

function SplitReveal({
  text,
  delay = 0,
  reduceMotion = false,
}) {
  if (reduceMotion) {
    return text;
  }

  return (
    <span
      className="inline-block"
      aria-label={text}
    >
      {text
        .split("")
        .map(
          (
            character,
            index
          ) => (
            <motion.span
              key={`${text}-${index}`}
              aria-hidden="true"
              initial={{
                y: "110%",
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay:
                  delay +
                  index * 0.025,

                duration: 0.55,

                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="inline-block"
              style={{
                display:
                  character === " "
                    ? "inline"
                    : "inline-block",
              }}
            >
              {character === " "
                ? "\u00A0"
                : character}
            </motion.span>
          )
        )}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Magnetic Link
|--------------------------------------------------------------------------
*/

function MagneticLink({
  href,
  children,
  className,
  disabledMotion = false,
  ...props
}) {
  const linkRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(
    x,
    {
      stiffness: 300,
      damping: 20,
    }
  );

  const springY = useSpring(
    y,
    {
      stiffness: 300,
      damping: 20,
    }
  );

  const handleMouseMove = (
    event
  ) => {
    if (
      !linkRef.current ||
      disabledMotion
    ) {
      return;
    }

    if (
      typeof window !==
        "undefined" &&
      window.innerWidth < 768
    ) {
      return;
    }

    const linkRect =
      linkRef.current.getBoundingClientRect();

    const distanceX =
      event.clientX -
      (
        linkRect.left +
        linkRect.width / 2
      );

    const distanceY =
      event.clientY -
      (
        linkRect.top +
        linkRect.height / 2
      );

    x.set(distanceX * 0.16);
    y.set(distanceY * 0.16);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={linkRef}
      style={{
        x: disabledMotion
          ? 0
          : springX,

        y: disabledMotion
          ? 0
          : springY,
      }}
      onMouseMove={
        handleMouseMove
      }
      onMouseLeave={
        handleMouseLeave
      }
      className="w-full min-[470px]:w-auto"
    >
      <Link
        href={href}
        className={className}
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  );
}