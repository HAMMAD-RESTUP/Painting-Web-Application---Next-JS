"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const collaborators = [
  {
    title: "Funun Arts\nGroup",
    desc: "A creative collaboration with an art community focused on exhibitions, cultural expression, and meaningful artistic presence.",
    image: "/images/funun-arts-group.png",
    logo: "FUNUN ARTS GROUP",
  },
  {
    title: "The Dubai\nWorkshop",
    desc: "A hands-on workshop collaboration built around art learning, guided practice, creative sessions, and community engagement.",
    image: "/images/dubai-workshop.png",
    logo: "THE DUBAI WORKSHOP",
  },
  {
    title: "Kutubna Cultural\nCenter",
    desc: "A cultural collaboration connecting art, storytelling, learning, creative dialogue, and community-based artistic exchange.",
    image: "/images/kutubna-cultural-center.jpg",
    logo: "KUTUBNA CULTURAL CENTER",
  },
];

export default function CollaboratorsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f7f3ee] text-[#1e1e1c]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-44 top-20 h-[380px] w-[380px] rounded-full bg-[#e9dccb]/65 blur-3xl" />

      <div className="pointer-events-none absolute -right-44 bottom-24 h-[440px] w-[440px] rounded-full bg-[#ead8c2]/65 blur-3xl" />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-9 pt-14 text-center sm:px-8 sm:pb-11 sm:pt-20 lg:pt-24">
        <motion.p
          initial={{
            opacity: 0,
            y: 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.65,
          }}
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b8964f] sm:text-[11px] sm:tracking-[0.32em]"
        >
          Creative Collaborations
        </motion.p>

        <motion.h2
          initial={{
            opacity: 0,
            y: 22,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.75,
            delay: 0.05,
          }}
          className="font-special text-[44px] font-normal italic leading-[0.9] tracking-[-0.05em] text-[#171717] sm:text-[62px] md:text-[76px] lg:text-[88px]"
        >
          Trusted Collaborators
        </motion.h2>

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.75,
            delay: 0.1,
          }}
          className="mx-auto mt-5 max-w-2xl text-[14px] leading-7 text-[#625b52] sm:mt-6 sm:text-[16px]"
        >
          Rakhshinda Art collaborates with creative groups, workshops, and
          cultural spaces to bring painting, calligraphy, heritage, and
          meaningful visual storytelling into shared artistic experiences.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="relative z-10 px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {collaborators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.985,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.18,
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-[10px]
                bg-[#211e1a]
                shadow-[0_16px_42px_rgba(45,35,24,0.1)]
                transition
                duration-500

                hover:-translate-y-1.5
                hover:shadow-[0_24px_60px_rgba(45,35,24,0.16)]
              "
            >
              <div
                className="
                  relative
                  min-h-[430px]
                  overflow-hidden

                  sm:min-h-[470px]
                  md:min-h-[500px]
                  lg:min-h-[540px]
                "
              >
                <img
                  src={item.image}
                  alt={`${item.logo} collaboration with Rakhshinda Art`}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                    transition
                    duration-700
                    ease-out

                    group-hover:scale-[1.04]
                  "
                />

                {/* Dark image overlay */}
                <div className="absolute inset-0 bg-black/30 transition duration-500 group-hover:bg-black/20" />

                {/* Content gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/38 to-black/5" />

                {/* Soft bottom glow */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#1d1712]/45 to-transparent" />

                <div
                  className="
                    relative
                    z-10
                    flex
                    min-h-[430px]
                    flex-col
                    justify-end
                    px-5
                    pb-7
                    pt-20
                    text-center
                    text-white

                    sm:min-h-[470px]
                    sm:px-6
                    sm:pb-8

                    md:min-h-[500px]
                    lg:min-h-[540px]
                    lg:px-7
                    lg:pb-9
                  "
                >
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.6,
                      delay:
                        0.22 +
                        index * 0.1,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e1bd78] sm:text-[10px] lg:text-[11px]"
                  >
                    {item.logo}
                  </motion.p>

                  <motion.h3
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.7,
                      delay:
                        0.3 +
                        index * 0.1,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      font-special
                      whitespace-pre-line
                      text-[36px]
                      font-normal
                      italic
                      leading-[0.92]
                      tracking-[-0.04em]
                      text-white

                      sm:text-[40px]
                      md:text-[44px]
                      lg:text-[48px]
                    "
                  >
                    {item.title}
                  </motion.h3>

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.7,
                      delay:
                        0.38 +
                        index * 0.1,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      mx-auto
                      mt-4
                      max-w-[315px]
                      text-[13px]
                      font-medium
                      leading-6
                      text-white/82

                      sm:mt-5
                      sm:text-[14px]
                    "
                  >
                    {item.desc}
                  </motion.p>

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.65,
                      delay:
                        0.48 +
                        index * 0.1,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >
                    <Link
                      href="/collaborations"
                      className="
                        group/button
                        mt-6
                        inline-flex
                        min-h-[43px]
                        items-center
                        justify-center
                        gap-2
                        rounded-[6px]
                        border
                        border-white/30
                        bg-black/15
                        px-5
                        py-2.5

                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-white

                        backdrop-blur-md
                        transition
                        duration-300

                        hover:border-[#d8b26e]
                        hover:bg-[#d8b26e]
                        hover:text-[#211e1a]

                        sm:text-[10px]
                      "
                    >
                      View Collaboration

                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                      />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="mt-9 flex justify-center sm:mt-11">
          <Link
            href="/collaborations"
            className="
              group
              inline-flex
              min-h-[48px]
              items-center
              justify-center
              gap-3
              rounded-[6px]
              border
              border-[#ded3c5]
              bg-[#fffdfb]/65
              px-6
              py-3

              text-[10px]
              font-semibold
              uppercase
              tracking-[0.17em]
              text-[#1e1e1c]

              shadow-[0_10px_30px_rgba(0,0,0,0.05)]
              backdrop-blur-md
              transition
              duration-300

              hover:-translate-y-1
              hover:border-[#1e1e1c]
              hover:bg-[#1e1e1c]
              hover:text-white

              sm:px-8
              sm:text-[11px]
              sm:tracking-[0.2em]
            "
          >
            Browse Collaborations

            <ArrowUpRight
              size={15}
              className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}