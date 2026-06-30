"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  LogIn,
  PlayCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import {
  useMyCourses,
} from "../../hooks/useCourses";

/*
|--------------------------------------------------------------------------
| Extract Purchased Courses
|--------------------------------------------------------------------------
| Backend response ke different possible structures handle karega.
*/
function extractCourses(response) {
  const possibleCourses = [
    response?.data?.data?.courses,
    response?.data?.courses,
    response?.courses,
    response?.data?.data,
    response?.data,
    response,
  ];

  return (
    possibleCourses.find(
      (value) => Array.isArray(value)
    ) || []
  );
}

function getCourseId(course) {
  return course?._id || course?.id || "";
}

function getCourseImage(course) {
  return (
    course?.thumbnail?.url ||
    course?.image?.url ||
    course?.coverImage?.url ||
    course?.thumbnail ||
    course?.image ||
    course?.coverImage ||
    course?.imageUrl ||
    "/images/course-hero.png"
  );
}

function getCategoryName(course) {
  if (
    course?.category &&
    typeof course.category === "object"
  ) {
    return (
      course.category.title ||
      course.category.name ||
      "Course"
    );
  }

  return (
    course?.category ||
    course?.categoryName ||
    "Course"
  );
}

function getLectureText(course) {
  const lectures =
    course?.lectures ||
    course?.totalLectures ||
    course?.lessonCount ||
    course?.totalVideos;

  if (!lectures) {
    return "";
  }

  if (typeof lectures === "string") {
    return lectures;
  }

  return `${lectures} ${
    Number(lectures) === 1
      ? "Lesson"
      : "Lessons"
  }`;
}

export default function LearningDashboardPage() {
  /*
    Public useCourses() nahi chalega.

    useMyCourses() sirf logged-in user ki
    active CourseEnrollment wali courses layega.
  */
  const {
    data: coursesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyCourses();

  const courses = useMemo(() => {
    return extractCourses(coursesResponse);
  }, [coursesResponse]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    const status =
      error?.response?.status;

    if (status === 401) {
      return <LoginRequiredPage />;
    }

    return (
      <ErrorPage
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Your purchased courses could not be loaded."
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#1e1e1c]">
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
                className={`font-special max-w-4xl text-[56px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#191714] sm:text-[76px] lg:text-[92px]`}
              >
                Continue Your

                <span className="block text-[#a98745]">
                  Art Learning
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6c635a]">
                Access the courses you have purchased and
                continue watching your lessons.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#e8dfd2] bg-white/75 p-5 shadow-[0_18px_55px_rgba(45,35,24,0.07)] backdrop-blur-md">
              <div className="grid grid-cols-2 gap-3">
                <HeroStat
                  label="My Courses"
                  value={courses.length}
                />

                <HeroStat
                  label="Access"
                  value={
                    courses.length > 0
                      ? "Active"
                      : "None"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a98745]">
            Purchased Courses
          </p>

          <h2
            className={`font-special mt-2 text-[44px] font-normal italic leading-none text-[#211e1a]`}
          >
            My Course Library
          </h2>
        </div>

        {courses.length === 0 ? (
          <EmptyCoursesState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const courseId =
                getCourseId(course);

              if (!courseId) {
                return null;
              }

              return (
                <CourseCard
                  key={courseId}
                  course={course}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function CourseCard({ course }) {
  const courseId = getCourseId(course);
  const courseLink =
    `/courses/learning/${courseId}`;

  const lectureText =
    getLectureText(course);

  return (
    <article className="group rounded-[28px] border border-[#e8e2d7] bg-white/75 p-3 shadow-[0_18px_55px_rgba(45,35,24,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(45,35,24,0.1)]">
      <Link
        href={courseLink}
        className="block"
      >
        <div className="relative h-[245px] overflow-hidden rounded-[22px] bg-[#efe7dc]">
          <img
            src={getCourseImage(course)}
            alt={
              course?.title ||
              "Course"
            }
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#211e1a]">
            {getCategoryName(course)}
          </div>

          <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#211e1a] shadow-sm transition group-hover:bg-[#d8b26e]">
            <PlayCircle
              size={20}
              strokeWidth={1.6}
            />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3
          className={`font-special min-h-[78px] text-[38px] font-normal italic leading-[0.95] tracking-[-0.04em] text-[#211e1a]`}
        >
          {course?.title ||
            "Untitled Course"}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {course?.duration && (
            <InfoBadge
              icon={<Clock3 size={12} />}
              text={course.duration}
            />
          )}

          {lectureText && (
            <InfoBadge
              icon={<BookOpen size={12} />}
              text={lectureText}
            />
          )}

          {course?.activatedAt && (
            <InfoBadge
              icon={<PlayCircle size={12} />}
              text="Access Active"
            />
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

function EmptyCoursesState() {
  return (
    <div className="rounded-[34px] border border-[#e8dfd2] bg-white/75 px-6 py-16 text-center shadow-[0_20px_65px_rgba(45,35,24,0.07)] sm:px-10">
      <BookOpen
        size={38}
        className="mx-auto text-[#a98745]"
      />

      <h3
        className={`font-special mt-5 text-[44px] font-normal italic text-[#211e1a]`}
      >
        No Purchased Courses
      </h3>

      <p className="mx-auto mt-4 max-w-xl text-[14px] leading-7 text-[#6c635a]">
        You have not purchased any course yet.
        Browse the available courses and complete
        payment to start learning.
      </p>

      <Link
        href="/courses"
        className="mt-7 inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-[#211e1a] px-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#a98745]"
      >
        Browse Courses
        <ShoppingBag size={15} />
      </Link>
    </div>
  );
}

function LoginRequiredPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4">
      <div className="w-full max-w-xl rounded-[34px] border border-[#e8e2d7] bg-white/80 p-9 text-center shadow-[0_22px_65px_rgba(45,35,24,0.08)]">
        <LogIn
          size={40}
          className="mx-auto text-[#a98745]"
        />

        <h1
          className={`font-special mt-5 text-[46px] font-normal italic text-[#211e1a]`}
        >
          Login Required
        </h1>

        <p className="mt-4 text-[14px] leading-7 text-[#6c635a]">
          Please login to view your purchased
          courses and continue learning.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#a98745]"
          >
            Login
            <LogIn size={15} />
          </Link>

          <Link
            href="/courses"
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-[#d8cdbf] bg-white px-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#211e1a] transition hover:border-[#a98745]"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorPage({
  message,
  onRetry,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4">
      <div className="w-full max-w-xl rounded-[34px] border border-[#e8e2d7] bg-white/80 p-9 text-center shadow-[0_22px_65px_rgba(45,35,24,0.08)]">
        <BookOpen
          size={40}
          className="mx-auto text-[#a98745]"
        />

        <h1
          className={`font-special mt-5 text-[46px] font-normal italic text-[#211e1a]`}
        >
          Courses Could Not Load
        </h1>

        <p className="mt-4 text-[14px] leading-7 text-[#6c635a]">
          {message}
        </p>

        <button
          type="button"
          onClick={() => onRetry()}
          className="mt-7 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#a98745]"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    </main>
  );
}

function HeroStat({
  label,
  value,
}) {
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

function InfoBadge({
  icon,
  text,
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f4ed] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#5f554b]">
      <span className="text-[#aa8747]">
        {icon}
      </span>

      {text}
    </span>
  );
}

function LoadingPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto max-w-[1240px] px-4 py-16">
        <div className="animate-pulse">
          <div className="h-16 max-w-xl rounded-2xl bg-[#ded7cf]" />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[440px] rounded-[28px] bg-white/70"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}