"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

const collaborations = [
  {
    title: "Funun Arts Group",
    label: "Art Community & Exhibition",
    location: "Dubai, UAE",
    image: "/images/funun-arts-group.png",
    desc: "A creative collaboration with an art community focused on exhibitions, cultural expression, and meaningful artistic presence. Through Funun Arts Group, Rakhshinda Art connects with artists, collectors, and cultural audiences through visual storytelling.",
  },
  {
    title: "The Dubai Workshop",
    label: "Creative Workshop",
    location: "Dubai, UAE",
    image: "/images/dubai-workshop.png",
    desc: "A hands-on creative workshop collaboration built around art learning, guided practice, and community engagement. This collaboration reflects Rakhshinda Art’s mission to make painting, calligraphy, and creative learning more accessible.",
  },
  {
    title: "Kutubna Cultural Center",
    label: "Culture & Community",
    location: "Dubai, UAE",
    image: "/images/kutubna-cultural-center.jpg",
    desc: "A cultural collaboration connecting art, storytelling, learning, and creative dialogue within a thoughtful community space. Kutubna Cultural Center supports the connection between creativity, heritage, literature, and cultural exchange.",
  },
];

export default function CollaborationsPage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Collaborations | Rakhshinda Art",
    description:
      "Rakhshinda Art collaborations with Funun Arts Group, The Dubai Workshop, and Kutubna Cultural Center.",
    url: "/collaborations",
    mainEntity: collaborations.map((item) => ({
      "@type": "CreativeWork",
      name: item.title,
      description: item.desc,
      image: item.image,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main className="min-h-screen bg-[#f7f4ef] text-[#211e1a]">
        <section className="relative overflow-hidden border-b border-[#e8e2d7] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="pointer-events-none absolute -left-32 top-10 h-[360px] w-[360px] rounded-full bg-[#eadcc9]/80 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-[#efe2d0]/80 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[1240px] text-center">
      

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1 }}
              className={`font-special mx-auto mt-6 max-w-5xl text-[58px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#191714] sm:text-[78px] lg:text-[104px]`}
            >
              Trusted
              <span className="block text-[#a98745]">Collaborations</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="mx-auto mt-6 max-w-3xl text-[15px] leading-8 text-[#6c635a]"
            >
              Rakhshinda Art collaborates with creative groups, workshops, and
              cultural spaces to bring painting, calligraphy, heritage, and
              meaningful visual storytelling into shared artistic experiences.
            </motion.p>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="space-y-12 lg:space-y-16">
            {collaborations.map((item, index) => {
              const isReverse = index % 2 === 1;

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
                    isReverse ? "lg:[&_.image-box]:order-2" : ""
                  }`}
                >
                  <div className="image-box">
                    <div className="group overflow-hidden rounded-[34px] border border-[#e8e2d7] bg-white/75 p-3 shadow-[0_18px_55px_rgba(45,35,24,0.07)] backdrop-blur-md">
                      <div className="relative h-[360px] overflow-hidden rounded-[26px] bg-[#efe7dc] sm:h-[460px] lg:h-[520px]">
                        <img
                          src={item.image}
                          alt={`${item.title} collaboration with Rakhshinda Art`}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                        <div className="absolute bottom-5 left-5 right-5">
                          <p className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#211e1a]">
                            <MapPin size={13} />
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[34px] border border-[#e8e2d7] bg-white/65 p-7 shadow-[0_18px_55px_rgba(45,35,24,0.05)] backdrop-blur-md sm:p-9 lg:p-10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a98745]">
                      {item.label}
                    </p>

                    <h2
                      className={`font-special mt-4 text-[48px] font-normal italic leading-[0.92] tracking-[-0.045em] text-[#191714] sm:text-[62px] lg:text-[72px]`}
                    >
                      {item.title}
                    </h2>

                    <p className="mt-6 text-[15px] leading-8 text-[#6c635a]">
                      {item.desc}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/contact"
                        className="inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-[#211e1a] px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#a98745]"
                      >
                        Discuss Collaboration
                        <ArrowRight size={15} />
                      </Link>

                      <Link
                        href="/artist"
                        className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[#d8cbbd] bg-white/70 px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#211e1a] transition duration-300 hover:-translate-y-1 hover:border-[#a98745] hover:text-[#a98745]"
                      >
                        Meet Artist
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[36px] border border-[#e8e2d7] bg-[#211e1a] p-8 text-white shadow-[0_28px_80px_rgba(45,35,24,0.16)] sm:p-10 lg:p-12">
            <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d8b26e]">
                  Work With Rakhshinda Art
                </p>

                <h2
                  className={`font-special mt-4 max-w-3xl text-[44px] font-normal italic leading-[0.95] tracking-[-0.04em] sm:text-[62px]`}
                >
                  Planning an art workshop, exhibition, or creative project?
                </h2>
              </div>

              <Link
                href="/contact"
                className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-white px-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#211e1a] transition duration-300 hover:-translate-y-1 hover:bg-[#d8b26e]"
              >
                Get In Touch
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}