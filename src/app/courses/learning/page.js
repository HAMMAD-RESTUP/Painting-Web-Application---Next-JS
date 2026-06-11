"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
  LockKeyhole,
  PlayCircle,
  ShoppingBag,
} from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const demoCourses = [
  {
    id: "demo-course-id",
    title: "Demo Guided Art Course",
    category: "Rakhshinda Art",
    image: "/images/course-hero.png",
    duration: "4 Weeks",
    lectures: "8 Lectures",
    learningUrl: "/courses/learning/demo-course-id",
    purchasedAt: new Date().toISOString(),
  },
];

export default function LearningDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [purchasedCourses, setPurchasedCourses] = useState([]);

  useEffect(() => {
    setMounted(true);

    try {
      const storedCourses = JSON.parse(
        localStorage.getItem("purchasedCourses") || "[]"
      );

      setPurchasedCourses(Array.isArray(storedCourses) ? storedCourses : []);
    } catch {
      setPurchasedCourses([]);
    }
  }, []);

  const coursesToShow = useMemo(() => {
    return purchasedCourses.length > 0 ? purchasedCourses : demoCourses;
  }, [purchasedCourses]);

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] text-[#1e1e1c]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#a98745] border-t-transparent" />

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#685f56]">
            Loading Learning Portal
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#1e1e1c]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#e8e2d7] bg-[#f7f4ef] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-[#eadcc9]/80 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-[#efe2d0]/80 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1240px]">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a715c] transition hover:text-[#1e1e1c]"
          >
            <ArrowLeft size={15} />
            Back To Courses
          </Link>

          <div className="mt-9 grid items-end gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a98745]">
                Student Learning Portal
              </p>

              <h1
                className={`${cormorant.className} max-w-4xl text-[56px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#191714] sm:text-[76px] lg:text-[92px]`}
              >
                Continue Your
                <span className="block text-[#a98745]">Art Learning</span>
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6c635a]">
                Access your purchased courses, continue lessons, and track your
                learning journey from one clean student portal.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#e8dfd2] bg-white/75 p-5 shadow-[0_18px_55px_rgba(45,35,24,0.07)] backdrop-blur-md">
              <div className="grid grid-cols-2 gap-3">
                <HeroStat label="Courses" value={coursesToShow.length} />
                <HeroStat label="Access" value="Active" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {purchasedCourses.length === 0 && (
          <div className="mb-8 rounded-[26px] border border-[#e8e2d7] bg-white/75 p-5 shadow-[0_16px_45px_rgba(45,35,24,0.05)] backdrop-blur-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8f4ed] text-[#a98745]">
                  <LockKeyhole size={18} />
                </div>

                <div>
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#211e1a]">
                    Demo Learning Mode
                  </h2>

                  <p className="mt-2 text-[13px] leading-6 text-[#6c635a]">
                    Abhi koi purchased course localStorage mein nahi mila, isliye
                    demo course show ho raha hai.
                  </p>
                </div>
              </div>

              <Link
                href="/courses"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-1 hover:bg-[#a98745]"
              >
                Buy Course
                <ShoppingBag size={14} />
              </Link>
            </div>
          </div>
        )}

        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a98745]">
              My Courses
            </p>

            <h2
              className={`${cormorant.className} mt-2 text-[44px] font-normal italic leading-none text-[#211e1a]`}
            >
              Course Library
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coursesToShow.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}

function CourseCard({ course }) {
  const courseLink = `/courses/learning/${course.id || "demo-course-id"}`;

  return (
    <article className="group rounded-[28px] border border-[#e8e2d7] bg-white/75 p-3 shadow-[0_18px_55px_rgba(45,35,24,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(45,35,24,0.1)]">
      <Link href={courseLink} className="block">
        <div className="relative h-[245px] overflow-hidden rounded-[22px] bg-[#efe7dc]">
          <img
            src={course.image || "/images/course-hero.png"}
            alt={course.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#211e1a]">
            {course.category || "Course"}
          </div>

          <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#211e1a] shadow-sm transition group-hover:bg-[#d8b26e]">
            <PlayCircle size={20} strokeWidth={1.6} />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3
          className={`${cormorant.className} min-h-[78px] text-[38px] font-normal italic leading-[0.95] tracking-[-0.04em] text-[#211e1a]`}
        >
          {course.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {course.duration && (
            <InfoBadge icon={<Clock3 size={12} />} text={course.duration} />
          )}

          {course.lectures && (
            <InfoBadge icon={<BookOpen size={12} />} text={course.lectures} />
          )}
        </div>

        <Link
          href={courseLink}
          className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-full bg-[#211e1a] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#a98745]"
        >
          Continue Learning
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-[22px] bg-[#f8f4ed] px-4 py-5 text-center">
      <p className="text-[24px] font-bold leading-none text-[#211e1a]">
        {value}
      </p>

      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7a7067]">
        {label}
      </p>
    </div>
  );
}

function InfoBadge({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f4ed] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#5f554b]">
      <span className="text-[#aa8747]">{icon}</span>
      {text}
    </span>
  );
}