"use client";

import Link from "next/link";
import { motion } from "framer-motion";
const instagramImages = [
  "/images/insta-1.png",
  "/images/insta-2.png",
  "/images/insta-3.png",
  "/images/insta-4.png",
  "/images/insta-5.png",
  "/images/insta-6.png",
];

export default function FollowSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f3ed] py-16 text-[#1e1e1c]">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[900px] px-5 text-center sm:px-6 lg:px-8"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#b8964f] sm:text-[12px]">
          Follow
        </p>

        <h2
          className={`font-special mt-3 text-[44px] font-normal italic leading-tight sm:text-[58px] md:text-[66px]`}
        >
          @Rakhshanda Arts
        </h2>

        <Link
          href="https://www.instagram.com/rakhshindasart/"
          target="_blank"
          className="mt-7 inline-flex h-[48px] items-center justify-center rounded-full bg-[#1e1e1c] px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#b79b83]"
        >
          Follow Rakhshanda
        </Link>
      </motion.div>

      {/* Sliding Images */}
      <div className="mt-16 w-full overflow-hidden">
        <div className="flex w-max animate-insta-slide gap-4">
          {[...instagramImages, ...instagramImages].map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.8, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.05 }}
              className="h-[260px] w-[250px] shrink-0 overflow-hidden rounded-[18px] bg-white sm:h-[300px] sm:w-[280px] md:h-[318px] md:w-[300px]"
            >
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="h-full w-full object-cover object-center transition duration-700 ease-out hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes insta-slide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-insta-slide {
          animation: insta-slide 35s linear infinite;
        }
      `}</style>
    </section>
  );
}