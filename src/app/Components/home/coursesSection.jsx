"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import { useFeaturedCourses } from "../../hooks/useCourses";

/*
|--------------------------------------------------------------------------
| Course Helpers
|--------------------------------------------------------------------------
*/

const extractCourses = (response) => {
  const possibleCourses = [
    response?.data?.data?.courses,
    response?.data?.courses,
    response?.courses,
    response?.data?.data,
    response?.data,
    response,
  ];

  return possibleCourses.find(Array.isArray) || [];
};

const getCourseId = (course) => {
  return (
    course?._id ||
    course?.id ||
    course?.courseId ||
    ""
  );
};

const getCourseImage = (course) => {
  return (
    course?.thumbnail?.url ||
    course?.image?.url ||
    course?.coverImage?.url ||
    course?.thumbnail ||
    course?.image ||
    course?.coverImage ||
    course?.imageUrl ||
    ""
  );
};

const getCategoryName = (course) => {
  if (
    course?.category &&
    typeof course.category === "object"
  ) {
    return (
      course.category?.title ||
      course.category?.name ||
      "Art Course"
    );
  }

  return (
    course?.categoryName ||
    course?.category ||
    "Art Course"
  );
};

const getCoursePrice = (course) => {
  const value =
    course?.price ??
    course?.salePrice ??
    course?.coursePrice ??
    0;

  const price = Number(value);

  return Number.isFinite(price)
    ? Math.max(0, price)
    : 0;
};

const formatPrice = (price) => {
  const numericPrice = Number(price || 0);

  if (numericPrice === 0) {
    return "Free";
  }

  return `AED ${numericPrice.toFixed(2)}`;
};

const getApiErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

/*
|--------------------------------------------------------------------------
| Featured Courses Section
|--------------------------------------------------------------------------
*/

export default function CoursesSection() {
  const router = useRouter();

  const {
    data: coursesResponse,
    isLoading,
    isError,
    error,
  } = useFeaturedCourses();

  const featuredCourses = useMemo(() => {
    return extractCourses(coursesResponse)
      .filter((course) => {
        const hasId = Boolean(
          getCourseId(course)
        );

        const isPublished =
          course?.draft !== true;

        const isFeatured =
          course?.featured === undefined ||
          course?.featured === true;

        return (
          hasId &&
          isPublished &&
          isFeatured
        );
      })
      .slice(0, 3);
  }, [coursesResponse]);

  const handleEnroll = (courseId) => {
    if (!courseId) {
      return;
    }

    const checkoutPath =
      `/course-checkout/${courseId}`;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          checkoutPath
        )}`
      );

      return;
    }

    router.push(checkoutPath);
  };

  return (
    <section
      id="courses"
      className="relative overflow-hidden bg-[#f7f3ee] py-20 text-[#211e1a] sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#eadfce]/70 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#e8d8c4]/70 blur-3xl" />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        <motion.p
          initial={{
            opacity: 0,
            y: 12,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.55,
          }}
          className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a98745]"
        >
          Learn With Rakhshinda
        </motion.p>

        <motion.h2
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
            duration: 0.65,
            delay: 0.05,
          }}
          className="font-special mt-4 text-[48px] font-normal italic leading-[0.92] tracking-[-0.045em] text-[#171717] sm:text-[64px] md:text-[74px]"
        >
          Learn art at your own pace.
        </motion.h2>

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
            duration: 0.65,
            delay: 0.1,
          }}
          className="mx-auto mt-5 max-w-2xl text-[14px] leading-7 text-[#625b52] sm:text-[15px]"
        >
          Build confidence through clear, guided
          lessons designed for beginners, art lovers
          and growing creatives anywhere in the world.
        </motion.p>
      </div>

      {/* Course listing */}
      <div className="relative z-10 mt-12">
        {isLoading && <CoursesLoading />}

        {isError && (
          <div className="mx-auto max-w-[1120px] px-5">
            <div className="rounded-[5px] border border-red-200 bg-red-50 px-6 py-10 text-center text-[14px] text-red-700">
              {getApiErrorMessage(
                error,
                "Featured courses load nahi ho sake."
              )}
            </div>
          </div>
        )}

        {!isLoading &&
          !isError &&
          featuredCourses.length === 0 && (
            <EmptyCourses />
          )}

        {!isLoading &&
          !isError &&
          featuredCourses.length > 0 && (
            <>
              {/* Mobile slider */}
              <div className="block md:hidden">
                <div className="courses-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-6">
                  {featuredCourses.map(
                    (course, index) => {
                      const courseId =
                        getCourseId(course);

                      return (
                        <CourseCard
                          key={courseId}
                          course={course}
                          index={index}
                          mobile
                          onEnroll={handleEnroll}
                        />
                      );
                    }
                  )}
                </div>
              </div>

              {/* Desktop grid */}
              <div className="hidden px-5 md:block">
                <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-7 lg:grid-cols-3">
                  {featuredCourses.map(
                    (course, index) => {
                      const courseId =
                        getCourseId(course);

                      return (
                        <CourseCard
                          key={courseId}
                          course={course}
                          index={index}
                          onEnroll={handleEnroll}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            </>
          )}

        {/* View all courses */}
        <div className="mt-11 flex justify-center px-5">
          <Link
            href="/courses"
            className="group inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-[4px] border border-[#d4c8bb] bg-[#fffdf9] px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#211e1a] shadow-[0_8px_24px_rgba(45,35,24,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-[#211e1a] hover:bg-[#211e1a] hover:text-white"
          >
            View All Courses

            <ArrowUpRight
              size={14}
              className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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

/*
|--------------------------------------------------------------------------
| Course Card
|--------------------------------------------------------------------------
*/

function CourseCard({
  course,
  index,
  mobile = false,
  onEnroll,
}) {
  const courseId =
    getCourseId(course);

  const image =
    getCourseImage(course);

  const price =
    getCoursePrice(course);

  const enrollButtonText =
    price === 0
      ? "Buy Free"
      : "Buy Now";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.58,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={
        mobile
          ? "w-[302px] shrink-0 snap-center"
          : "w-full"
      }
    >
      <div className="group flex h-full flex-col overflow-hidden rounded-[6px] border border-[#d9cfc3] bg-[#fffdf9] shadow-[0_12px_34px_rgba(45,35,24,0.065)] transition duration-500 hover:-translate-y-1 hover:border-[#c1aa8e] hover:shadow-[0_24px_60px_rgba(45,35,24,0.13)]">
        {/* Course image */}
        <Link
          href={`/courses/${courseId}`}
          aria-label={`View ${
            course?.title || "course"
          }`}
          className="relative block aspect-[16/11] overflow-hidden bg-[#e9dfd3]"
        >
          {image ? (
            <img
              src={image}
              alt={
                course?.title ||
                "Art Course"
              }
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center transition duration-[900ms] ease-out group-hover:scale-[1.045]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#eee5db] text-[#a98745]">
              <BookOpen
                size={42}
                strokeWidth={1.3}
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />

          <span className="absolute left-4 top-4 max-w-[72%] truncate rounded-[4px] border border-white/50 bg-white/90 px-3.5 py-2 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#292520] shadow-sm backdrop-blur-sm">
            {getCategoryName(course)}
          </span>

          <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-[4px] border border-white/50 bg-white/90 text-[#211e1a] shadow-sm backdrop-blur-sm transition duration-300 group-hover:bg-[#211e1a] group-hover:text-white">
            <ArrowUpRight size={15} />
          </div>
        </Link>

        {/* Course content */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
          <Link
            href={`/courses/${courseId}`}
            className="block"
          >
            <h3 className="font-special line-clamp-2 min-h-[61px] text-[29px] font-normal italic leading-[1.02] tracking-[-0.035em] text-[#211e1a] transition duration-300 hover:text-[#9b7938] sm:text-[31px]">
              {course?.title ||
                "Untitled Course"}
            </h3>
          </Link>

          <p className="mt-3 line-clamp-2 min-h-[48px] text-[13px] leading-6 text-[#71685f]">
            {course?.shortDescription ||
              course?.description ||
              "Learn through calm and guided creative lessons."}
          </p>

          {/* Price */}
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#e9e0d7] pt-4">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.17em] text-[#998e83]">
                Course Price
              </p>

              <p className="mt-1.5 text-[19px] font-semibold tracking-[-0.02em] text-[#211e1a]">
                {formatPrice(price)}
              </p>
            </div>

            <span className="pb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a98745]">
              Online Course
            </span>
          </div>

          {/* Actions */}
          <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5">
            <button
              type="button"
              onClick={() =>
                onEnroll(courseId)
              }
              aria-label={`Enroll in ${
                course?.title || "course"
              }`}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[4px] border border-[#211e1a] bg-[#211e1a] px-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#a98745] hover:bg-[#a98745]"
            >
              <GraduationCap
                size={14}
                strokeWidth={1.8}
              />

              {enrollButtonText}
            </button>

            <Link
              href={`/courses/${courseId}`}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[4px] border border-[#d4c9bd] bg-[#fffdf9] px-3 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#211e1a] transition duration-300 hover:-translate-y-0.5 hover:border-[#211e1a] hover:bg-[#211e1a] hover:text-white"
            >
              Details

              <ArrowRight
                size={13}
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyCourses() {
  return (
    <div className="mx-auto max-w-[1120px] px-5">
      <div className="rounded-[6px] border border-[#ddd3c7] bg-[#fffdf9] px-6 py-14 text-center shadow-[0_12px_32px_rgba(45,35,24,0.04)]">
        <BookOpen
          size={34}
          className="mx-auto text-[#a98745]"
          strokeWidth={1.4}
        />

        <h3 className="font-special mt-4 text-[31px] font-normal italic text-[#211e1a]">
          No Courses Available
        </h3>

        <p className="mt-2 text-[13px] text-[#756b61]">
          Featured art courses will appear here.
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading State
|--------------------------------------------------------------------------
*/

function CoursesLoading() {
  return (
    <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-7 px-5 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse overflow-hidden rounded-[6px] border border-[#ddd3c7] bg-[#fffdf9]"
        >
          <div className="aspect-[16/11] bg-[#e7ddd2]" />

          <div className="p-5">
            <div className="h-7 w-4/5 rounded-[3px] bg-[#e7ddd2]" />

            <div className="mt-3 h-7 w-3/5 rounded-[3px] bg-[#e7ddd2]" />

            <div className="mt-5 h-3 w-full rounded-[3px] bg-[#e7ddd2]" />

            <div className="mt-2 h-3 w-4/5 rounded-[3px] bg-[#e7ddd2]" />

            <div className="mt-6 border-t border-[#eee7df] pt-4">
              <div className="h-3 w-20 rounded-[3px] bg-[#e7ddd2]" />

              <div className="mt-2 h-6 w-28 rounded-[3px] bg-[#e7ddd2]" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="h-11 rounded-[4px] bg-[#e7ddd2]" />

              <div className="h-11 rounded-[4px] bg-[#e7ddd2]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}