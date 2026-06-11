"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import { ArrowUpRight, BookOpen, Clock3 } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const courses = [
  {
    title: "Arabic Calligraphy",
    category: "Calligraphy",
    duration: "6 Weeks",
    lectures: "18 Lectures",
    image: "/images/calligraphy-bg.png",
    href: "/courses?category=arabic-calligraphy",
    description:
      "Learn graceful Arabic letterforms, pen control and traditional composition techniques through calm guided lessons.",
  },
  {
    title: "Islamic Geometry",
    category: "Geometry",
    duration: "4 Weeks",
    lectures: "12 Lectures",
    image: "/images/islamic-geometry.jpg",
    href: "/courses?category=islamic-geometry",
    description:
      "Discover symmetry, structure and meaningful geometric patterns through a simple step-by-step process.",
  },
  {
    title: "Painting Workshop",
    category: "Painting",
    duration: "5 Weeks",
    lectures: "14 Lectures",
    image: "/images/prints.jpg",
    href: "/courses?category=painting-workshop",
    description:
      "Explore colour, texture and composition while developing your own expressive and confident painting style.",
  },
];

export default function CoursesSection() {
  return (
    <section
      id="courses"
      className="relative w-full overflow-hidden bg-[#f7f3ee] text-[#1e1e1c]"
    >
      <div className="pointer-events-none absolute -left-44 top-20 h-[380px] w-[380px] rounded-full bg-[#e9dccb] blur-3xl" />
      <div className="pointer-events-none absolute -right-44 bottom-40 h-[440px] w-[440px] rounded-full bg-[#ead8c2] blur-3xl" />

      {/* Heading - moved down */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-12 pt-24 text-center sm:pt-28 lg:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65 }}
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b8964f] sm:text-[11px]"
        >
          Learn With Rakhshinda
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 0.05 }}
          className={`${cormorant.className} text-[48px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#171717] sm:text-[64px] md:text-[78px] lg:text-[92px]`}
        >
          Explore Art Courses
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-[14px] leading-7 text-[#625b52] sm:text-[16px]"
        >
          Thoughtfully designed course categories for beginners and art lovers.
          Learn Arabic calligraphy, Islamic geometry and painting through calm,
          guided creative lessons.
        </motion.p>
      </div>

      <div className="relative z-10 pb-16">
        {/* Mobile Slider */}
        <div className="block md:hidden">
          <div className="courses-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-6">
            {courses.map((course, index) => (
              <CourseCard
                key={course.title}
                course={course}
                index={index}
                mobile
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden px-5 sm:px-6 md:block lg:px-8">
          <div className="mx-auto grid max-w-[1080px] grid-cols-3 gap-x-8 gap-y-12">
            {courses.map((course, index) => (
              <CourseCard key={course.title} course={course} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-11 flex justify-center px-5">
          <Link
            href="/courses"
            className="group inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-white/65 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1e1e1c] shadow-[0_14px_38px_rgba(45,35,24,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-[#1e1e1c] hover:text-white"
          >
            View All Courses
            <ArrowUpRight
              size={15}
              className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .courses-scroll {
          scrollbar-width: none;
        }

        .courses-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function CourseCard({ course, index, mobile = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.65,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={mobile ? "w-[270px] shrink-0 snap-center" : "w-full"}
    >
      <Link href={course.href} className="group block h-full">
        <div className="rounded-[28px] border border-white/70 bg-white/35 p-2 shadow-[0_18px_50px_rgba(45,35,24,0.07)] backdrop-blur-md transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_28px_75px_rgba(45,35,24,0.15)]">
          {/* Image */}
          <div className="relative aspect-[1/0.9] overflow-hidden rounded-t-[24px] bg-[#e9dccb]">
            <div className="pointer-events-none absolute inset-0 z-20 border-[3px] border-transparent transition duration-300 group-hover:border-[#b49b45]" />

            <img
              src={course.image}
              alt={course.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center transition duration-[1200ms] ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-90 transition duration-500 group-hover:opacity-100" />

            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1c] shadow-sm backdrop-blur-md">
              {course.category}
            </div>

            {/* Bigger duration + lectures badges */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1e1e1c] shadow-sm backdrop-blur-md">
                <Clock3 size={16} className="text-[#a2844d]" />
                {course.duration}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1e1e1c] shadow-sm backdrop-blur-md">
                <BookOpen size={16} className="text-[#a2844d]" />
                {course.lectures}
              </span>
            </div>

            <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-[#1e1e1c] group-hover:text-white">
              <ArrowUpRight size={18} />
            </div>
          </div>

          {/* Glassy Content */}
          <div className="flex min-h-[260px] flex-col rounded-b-[24px] border border-t-0 border-white/70 bg-white/65 p-5 text-left shadow-[0_18px_45px_rgba(45,35,24,0.08)] backdrop-blur-xl transition duration-300 group-hover:bg-white/80 group-hover:shadow-[0_24px_60px_rgba(45,35,24,0.12)] sm:p-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a2844d]">
              {course.category}
            </p>

            <h3
              className={`${cormorant.className} text-[31px] font-normal italic leading-none tracking-[-0.035em] text-[#1e1e1c] sm:text-[35px]`}
            >
              {course.title}
            </h3>

            <p className="mt-3 text-[13px] leading-6 text-[#756756] sm:text-[14px]">
              {course.description}
            </p>

            <div className="mt-auto pt-6">
              <span className="inline-flex min-h-[46px] w-full items-center justify-center gap-3 rounded-full bg-[#1e1e1c] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_35px_rgba(0,0,0,0.10)] transition duration-300 group-hover:bg-[#b8964f]">
                View Courses
                <ArrowUpRight
                  size={14}
                  className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}