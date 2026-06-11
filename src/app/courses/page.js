"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Filter,
  Heart,
  ShoppingBag,
  CheckCircle2,
  Eye,
  GraduationCap,
  PlayCircle,
  BadgeCheck,
} from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const categories = [
  { label: "All", slug: "all" },
  { label: "Arabic Calligraphy", slug: "arabic-calligraphy" },
  { label: "Islamic Geometry", slug: "islamic-geometry" },
  { label: "Painting Workshop", slug: "painting-workshop" },
];

const courses = [
  {
    id: "course-001",
    categorySlug: "arabic-calligraphy",
    categoryName: "Arabic Calligraphy",
    title: "Arabic Calligraphy Basics",
    image: "/images/calligraphy-bg.png",
    href: "/courses/arabic-calligraphy-basics",
    duration: "6 Weeks",
    lectures: "18 Lectures",
    price: 49,
  },
  {
    id: "course-002",
    categorySlug: "arabic-calligraphy",
    categoryName: "Arabic Calligraphy",
    title: "Calligraphy Composition",
    image: "/images/calligraphy-bg.png",
    href: "/courses/calligraphy-composition",
    duration: "5 Weeks",
    lectures: "15 Lectures",
    price: 59,
  },
  {
    id: "course-003",
    categorySlug: "islamic-geometry",
    categoryName: "Islamic Geometry",
    title: "Islamic Geometry Workshop",
    image: "/images/islamic-geometry.jpg",
    href: "/courses/islamic-geometry-workshop",
    duration: "4 Weeks",
    lectures: "12 Lectures",
    price: 45,
  },
  {
    id: "course-004",
    categorySlug: "islamic-geometry",
    categoryName: "Islamic Geometry",
    title: "Advanced Geometry Patterns",
    image: "/images/islamic-geometry.jpg",
    href: "/courses/advanced-geometry-patterns",
    duration: "6 Weeks",
    lectures: "20 Lectures",
    price: 69,
  },
  {
    id: "course-005",
    categorySlug: "painting-workshop",
    categoryName: "Painting Workshop",
    title: "Painting Creative Art",
    image: "/images/prints.jpg",
    href: "/courses/painting-creative-art",
    duration: "5 Weeks",
    lectures: "14 Lectures",
    price: 55,
  },
  {
    id: "course-006",
    categorySlug: "painting-workshop",
    categoryName: "Painting Workshop",
    title: "Modern Painting Techniques",
    image: "/images/prints.jpg",
    href: "/courses/modern-painting-techniques",
    duration: "4 Weeks",
    lectures: "13 Lectures",
    price: 50,
  },
];

export default function CoursesPage() {
  return (
    <Suspense fallback={null}>
      <CoursesPageContent />
    </Suspense>
  );
}

function CoursesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "all";

  const validCategory = categories.some((cat) => cat.slug === categoryFromUrl)
    ? categoryFromUrl
    : "all";

  const [successMessage, setSuccessMessage] = useState("");

  const filteredCourses = useMemo(() => {
    if (validCategory === "all") return courses;
    return courses.filter((course) => course.categorySlug === validCategory);
  }, [validCategory]);

  const handleCategoryChange = (slug) => {
    if (slug === "all") {
      router.push("/courses");
    } else {
      router.push(`/courses?category=${slug}`);
    }
  };

  const handleBuyCourse = (course) => {
    let existingCart = [];

    if (typeof window !== "undefined") {
      try {
        existingCart = JSON.parse(localStorage.getItem("courseCart") || "[]");
      } catch {
        existingCart = [];
      }
    }

    const alreadyAdded = existingCart.find((item) => item.id === course.id);

    const updatedCart = alreadyAdded
      ? existingCart.map((item) =>
        item.id === course.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      : [
        ...existingCart,
        {
          id: course.id,
          type: "course",
          title: course.title,
          category: course.categoryName,
          image: course.image,
          price: course.price,
          quantity: 1,
          duration: course.duration,
          lectures: course.lectures,
        },
      ];

    localStorage.setItem("courseCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("courseCartUpdated"));

    setSuccessMessage(`${course.title} added to cart.`);

    setTimeout(() => {
      router.push("/cart");
    }, 650);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f7f4ef] text-[#1e1e1c]">
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed right-4 top-5 z-50 flex items-center gap-2 rounded-full bg-[#1e1e1c] px-5 py-3 text-[12px] font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
          >
            <CheckCircle2 size={16} className="text-[#d6b980]" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <HeroBanner />

  <section className="relative z-10 mx-auto max-w-[1280px] overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    className="w-full overflow-hidden rounded-[24px] border border-[#e8e2d7] bg-white/70 p-4 shadow-[0_16px_45px_rgba(45,35,24,0.07)] backdrop-blur-xl"
  >
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center justify-center gap-2 rounded-full bg-[#f8f4ed] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#685f56] md:justify-start md:bg-transparent md:px-0 md:py-0 md:text-[11px]">
        <Filter size={14} className="shrink-0 text-[#a98745]" />
        <span>
          Showing {filteredCourses.length}{" "}
          {filteredCourses.length === 1 ? "Course" : "Courses"}
        </span>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 rounded-[20px] bg-[#efe7dc]/80 p-2 backdrop-blur-sm sm:grid-cols-4 md:w-auto md:flex md:flex-wrap md:justify-end">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => handleCategoryChange(cat.slug)}
            className={`relative min-h-[40px] w-full overflow-hidden rounded-full px-3 py-2 text-center text-[10px] font-medium tracking-wide transition-colors duration-300 sm:text-[11px] md:w-auto md:px-5 ${
              validCategory === cat.slug
                ? "text-white"
                : "text-[#5f554b] hover:text-[#1e1e1c]"
            }`}
          >
            {validCategory === cat.slug && (
              <motion.span
                layoutId="activeTab"
                className="absolute inset-0 rounded-full bg-[#1e1e1c]"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}

            <span className="relative z-10 block leading-4">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  </motion.div>
</section>
      <section
        id="courses-list"
        className="relative z-10 mx-auto max-w-[1280px] px-4 py-4 sm:px-6 lg:px-8 lg:pb-20"
      >
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onBuy={handleBuyCourse}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCourses.length === 0 && (
          <div className="rounded-[28px] border border-[#e8e2d7] bg-white/60 p-10 text-center">
            <h3
              className={`${cormorant.className} text-[38px] font-normal italic text-[#191714]`}
            >
              No courses found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-[#685f56]">
              This category does not have any courses right now.
            </p>
          </div>
        )}
      </section>

      <section className="relative z-10 mx-auto max-w-[1100px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-[#eaddcb]/70 bg-white/52 p-8 text-center shadow-[0_18px_55px_rgba(45,35,24,0.07)] backdrop-blur-xl sm:p-12">
          <Heart
            size={20}
            className="mx-auto mb-4 animate-pulse text-[#a98745]"
          />

          <h4
            className={`${cormorant.className} text-[34px] font-normal italic text-[#191714] sm:text-[44px]`}
          >
            The Studio Experience
          </h4>

          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-[#685f56]">
            Every course includes lifetime access, downloadable guide-sheets,
            high-definition step-by-step videos, and access to your learning
            portal.
          </p>
        </div>
      </section>
    </main>
  );
}

function HeroBanner() {
  return (
    <section className="relative z-10 w-full">
      <div className="relative min-h-[760px] w-full overflow-hidden bg-[#211e1a] sm:min-h-[780px] lg:min-h-[calc(100vh-82px)]">
        <div className="absolute inset-0">
          <img
            src="/images/course-hero.png"
            alt="Rakhshanda guided courses"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#15110d]/96 via-[#211e1a]/76 to-[#211e1a]/14" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#211e1a]/70 via-transparent to-[#211e1a]/35" />

        <div className="absolute -left-32 top-24 h-[360px] w-[360px] rounded-full bg-[#d8b26e]/18 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[220px] w-full bg-gradient-to-t from-[#211e1a]/85 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1280px] items-center px-4 pb-16 pt-[132px] sm:min-h-[780px] sm:px-6 sm:pt-[145px] lg:min-h-[calc(100vh-82px)] lg:px-8 lg:pt-[118px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-[780px]"
          >
       

            <h1
              className={`${cormorant.className} text-[54px] font-normal italic leading-[0.9] tracking-[-0.055em] text-white sm:text-[76px] md:text-[90px] lg:text-[104px]`}
            >
              Learn Rakhshinda
              <span className="block text-[#d8b26e]">
                Online Guided Courses
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-[15px] leading-7 text-white/86 sm:text-[16px]">
              Explore structured art courses, learn step by step, view complete
              course details, and unlock your personal learning portal after
              purchase.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#courses-list"
                className="group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-white px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#211e1a] shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#d8b26e]"
              >
                Browse Courses
                <ArrowUpRight
                  size={15}
                  className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>

              <Link
                href="/courses"
                className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-white/24 bg-white/10 px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                View All
                <PlayCircle size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


function CourseCard({ course, index, onBuy }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 14 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="min-w-0"
    >
      <div className="group h-full rounded-[30px] border border-white/75 bg-white/36 p-2.5 shadow-[0_18px_55px_rgba(45,35,24,0.08)] backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(45,35,24,0.16)]">
        <div className="flex h-full flex-col overflow-hidden rounded-[24px] bg-white/78 backdrop-blur-xl">
          <Link href={course.href} className="block">
            <div className="relative h-[245px] overflow-hidden rounded-t-[24px] sm:h-[265px] lg:h-[285px]">
              <img
                src={course.image}
                alt={course.title}
                loading="lazy"
                className="h-full w-full object-cover object-center transition duration-[1000ms] ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-black/10 to-transparent" />

              <div className="absolute left-4 top-4 rounded-full bg-white/92 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#1e1e1c] shadow-sm backdrop-blur-md">
                {course.categoryName}
              </div>

              <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/94 text-[#211d18] shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-[#a98745] group-hover:text-white">
                <ArrowUpRight size={18} strokeWidth={1.8} />
              </span>

              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2">
                <InfoBadge icon={<Clock3 size={17} />} text={course.duration} />
                <InfoBadge icon={<BookOpen size={17} />} text={course.lectures} />
              </div>
            </div>
          </Link>

          <div className="flex flex-1 flex-col rounded-b-[24px] border border-t-0 border-white/75 bg-white/68 p-5 shadow-[0_18px_45px_rgba(45,35,24,0.06)] backdrop-blur-xl sm:p-6">
            <Link href={course.href}>
              <h3
                className={`${cormorant.className} min-h-[82px] text-[34px] font-normal italic leading-[0.94] tracking-[-0.04em] text-[#211e1a] transition duration-300 hover:text-[#a98745] sm:text-[38px] lg:text-[42px]`}
              >
                {course.title}
              </h3>
            </Link>

            <div className="mt-5 flex items-center justify-between rounded-[18px] border border-[#eadfce] bg-[#f8f4ed] px-4 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7d70]">
                Course Price
              </span>

              <span className="text-[20px] font-semibold text-[#211e1a]">
                AED {course.price}
              </span>
            </div>

            <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
              <Link
                href={course.href}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#d8cbbd] bg-white/80 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#211e1a] transition duration-300 hover:border-[#211e1a] hover:bg-[#211e1a] hover:text-white"
              >
                <Eye size={14} />
                Details
              </Link>

              <button
                type="button"
                onClick={() => onBuy(course)}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#a98745]"
              >
                <ShoppingBag size={14} />
                Buy Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function InfoBadge({ icon, text }) {
  return (
    <span className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-white/92 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#1e1e1c] shadow-sm backdrop-blur-md">
      <span className="shrink-0 text-[#aa8747]">{icon}</span>
      {text}
    </span>
  );
}