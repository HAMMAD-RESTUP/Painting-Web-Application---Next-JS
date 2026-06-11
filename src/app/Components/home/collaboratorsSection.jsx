"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

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
      <div className="pointer-events-none absolute -left-44 top-20 h-[380px] w-[380px] rounded-full bg-[#e9dccb] blur-3xl" />
      <div className="pointer-events-none absolute -right-44 bottom-24 h-[440px] w-[440px] rounded-full bg-[#ead8c2] blur-3xl" />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-10 pt-16 text-center sm:pt-20 lg:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b8964f] sm:text-[11px]"
        >
          Creative Collaborations
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 0.05 }}
          className={`${cormorant.className} text-[48px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#171717] sm:text-[64px] md:text-[78px] lg:text-[92px]`}
        >
          Trusted Collaborators
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-[14px] leading-7 text-[#625b52] sm:text-[16px]"
        >
          Rakhshinda Art collaborates with creative groups, workshops, and
          cultural spaces to bring painting, calligraphy, heritage, and
          meaningful visual storytelling into shared artistic experiences.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="relative z-10 px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collaborators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 42, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group rounded-[34px] border border-[#e8e2d7] bg-white/75 p-3 shadow-[0_18px_55px_rgba(45,35,24,0.06)] backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(45,35,24,0.12)]"
            >
              <div className="relative min-h-[390px] overflow-hidden rounded-[26px] bg-[#211e1a] sm:min-h-[470px] md:min-h-[500px] lg:min-h-[540px]">
                <img
                  src={item.image}
                  alt={`${item.logo} collaboration with Rakhshinda Art`}
                  className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/40 transition duration-500 group-hover:bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                <div className="relative z-10 flex h-full min-h-[390px] flex-col justify-end px-5 pb-7 text-center text-white sm:min-h-[470px] sm:px-6 sm:pb-8 md:min-h-[500px] lg:min-h-[540px]">
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.22 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8b26e] sm:text-[11px]"
                  >
                    {item.logo}
                  </motion.p>

                  <motion.h3
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: 0.3 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`${cormorant.className} whitespace-pre-line text-[34px] font-normal italic leading-[0.92] tracking-[-0.04em] text-white sm:text-[42px] md:text-[48px]`}
                  >
                    {item.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: 0.38 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mx-auto mt-5 max-w-[315px] text-[13px] font-medium leading-6 text-white/80 sm:text-[14px]"
                  >
                    {item.desc}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.65,
                      delay: 0.48 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href="/collaborations"
                      className="mt-7 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md transition duration-300 hover:border-[#d8b26e] hover:bg-[#d8b26e] hover:text-[#211e1a]"
                    >
                      View Collaboration <span className="ml-2">›</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom Button */}
     <div className="mt-10 flex justify-center">
  <Link
    href="/collaborations"
    className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full bg-white/60 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1e1e1c] shadow-[0_12px_35px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-[#1e1e1c] hover:text-white"
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