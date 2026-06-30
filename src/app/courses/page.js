"use client";

import {
  Suspense,
  useMemo,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Filter,
  Heart,
  ShoppingBag,
  Eye,
  PlayCircle,
  Loader2,
} from "lucide-react";

import {
  useCourses,
} from "../hooks/useCourses";


import {
  useActiveCategories,
} from "../hooks/useCategories";

import {
  useMe,
} from "../hooks/useAuth";

const extractCourses = (
  response
) => {
  const possibleCourses = [
    response?.data?.courses,
    response?.data,
    response?.courses,
    response,
  ];

  return (
    possibleCourses.find(
      (value) =>
        Array.isArray(value)
    ) || []
  );
};

const extractCategories = (
  response
) => {
  const possibleCategories = [
    response?.data?.categories,
    response?.data,
    response?.categories,
    response,
  ];

  return (
    possibleCategories.find(
      (value) =>
        Array.isArray(value)
    ) || []
  );
};

const getCourseId = (
  course
) => {
  return (
    course?._id ||
    course?.id ||
    ""
  );
};

const getCategoryId = (
  category
) => {
  return (
    category?._id ||
    category?.id ||
    ""
  );
};

const getCategoryTitle = (
  category
) => {
  return (
    category?.title ||
    category?.name ||
    "Category"
  );
};

const getCourseCategoryId = (
  course
) => {
  const category =
    course?.category;

  if (
    category &&
    typeof category ===
      "object"
  ) {
    return (
      category?._id ||
      category?.id ||
      ""
    );
  }

  return (
    category ||
    course?.categoryId ||
    ""
  );
};

const getCourseCategoryName = (
  course,
  categoryMap
) => {
  const category =
    course?.category;

  if (
    category &&
    typeof category ===
      "object"
  ) {
    return (
      category?.title ||
      category?.name ||
      "Art Course"
    );
  }

  const categoryId =
    getCourseCategoryId(course);

  return (
    categoryMap.get(
      categoryId
    ) ||
    course?.categoryName ||
    "Art Course"
  );
};

const getCourseImage = (
  course
) => {
  if (
    course?.thumbnail?.url
  ) {
    return course.thumbnail.url;
  }

  if (
    course?.image?.url
  ) {
    return course.image.url;
  }

  if (
    course?.coverImage?.url
  ) {
    return course.coverImage.url;
  }

  if (
    typeof course?.thumbnail ===
    "string"
  ) {
    return course.thumbnail;
  }

  if (
    typeof course?.image ===
    "string"
  ) {
    return course.image;
  }

  if (
    typeof course?.coverImage ===
    "string"
  ) {
    return course.coverImage;
  }

  if (course?.imageUrl) {
    return course.imageUrl;
  }

  return "";
};

const getCourseDuration = (
  course
) => {
  return String(
    course?.duration ||
      course?.courseDuration ||
      "Self Paced"
  );
};

const getCourseLessons = (
  course
) => {
  if (
    Array.isArray(
      course?.lectures
    )
  ) {
    const total =
      course.lectures.length;

    return `${total} ${
      total === 1
        ? "Lesson"
        : "Lessons"
    }`;
  }

  if (
    Array.isArray(
      course?.videos
    )
  ) {
    const total =
      course.videos.length;

    return `${total} ${
      total === 1
        ? "Lesson"
        : "Lessons"
    }`;
  }

  const total =
    course?.totalVideos ??
    course?.totalLessons ??
    course?.totalLectures ??
    course?.lectureCount ??
    course?.lecturesCount ??
    course?.lessonCount;

  if (
    total !== undefined &&
    total !== null
  ) {
    return `${total} ${
      Number(total) === 1
        ? "Lesson"
        : "Lessons"
    }`;
  }

  return "Course Lessons";
};

const normalizeCourse = (
  course,
  categoryMap
) => {
  const id =
    getCourseId(course);

  return {
    id,

    categoryId:
      getCourseCategoryId(
        course
      ),

    categoryName:
      getCourseCategoryName(
        course,
        categoryMap
      ),

    title:
      course?.title ||
      "Untitled Course",

    image:
      getCourseImage(course),

    href:
      `/courses/${id}`,

    duration:
      getCourseDuration(
        course
      ),

    lessons:
      getCourseLessons(
        course
      ),

    price: Number(
      course?.price || 0
    ),

    description:
      course?.description ||
      course?.shortDescription ||
      "",

    raw: course,
  };
};

const getErrorMessage = (
  error
) => {
  return (
    error?.userMessage ||
    error?.response?.data
      ?.message ||
    error?.response?.data
      ?.error ||
    error?.message ||
    "Courses could not be loaded."
  );
};

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <CoursesPageLoading />
      }
    >
      <CoursesPageContent />
    </Suspense>
  );
}

function CoursesPageContent() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const selectedCategoryId =
    searchParams.get(
      "category"
    ) || "";

  const {
    data: coursesResponse,
    isLoading:
      coursesLoading,
    isError: coursesError,
    error:
      coursesRequestError,
  } = useCourses();

  const {
    data: categoriesResponse,
    isLoading:
      categoriesLoading,
    isError:
      categoriesError,
  } = useActiveCategories();

  const {
    data: user,
    isLoading:
      authLoading,
    isFetching:
      authFetching,
  } = useMe();

  const isCheckingAuth =
    authLoading ||
    authFetching;

  const isAuthenticated =
    Boolean(user);

  const courseCategories =
    useMemo(() => {
      return extractCategories(
        categoriesResponse
      ).filter((category) => {
        const type = String(
          category?.type || ""
        )
          .toLowerCase()
          .trim();

        return (
          type === "course" &&
          category?.isActive !==
            false &&
          Boolean(
            getCategoryId(
              category
            )
          )
        );
      });
    }, [categoriesResponse]);

  const categoryMap =
    useMemo(() => {
      return new Map(
        courseCategories.map(
          (category) => [
            getCategoryId(
              category
            ),

            getCategoryTitle(
              category
            ),
          ]
        )
      );
    }, [courseCategories]);

  const allCourses =
    useMemo(() => {
      return extractCourses(
        coursesResponse
      )
        .filter((course) => {
          return (
            Boolean(
              getCourseId(
                course
              )
            ) &&
            course?.draft !==
              true
          );
        })
        .map((course) =>
          normalizeCourse(
            course,
            categoryMap
          )
        );
    }, [
      coursesResponse,
      categoryMap,
    ]);

  const filteredCourses =
    useMemo(() => {
      if (
        !selectedCategoryId
      ) {
        return allCourses;
      }

      return allCourses.filter(
        (course) =>
          course.categoryId ===
          selectedCategoryId
      );
    }, [
      allCourses,
      selectedCategoryId,
    ]);

  const handleCategoryChange = (
    categoryId
  ) => {
    if (!categoryId) {
      router.push(
        "/courses"
      );

      return;
    }

    router.push(
      `/courses?category=${encodeURIComponent(
        categoryId
      )}`
    );
  };

  const handleBuyCourse = (
    course
  ) => {
    if (
      !course?.id ||
      isCheckingAuth
    ) {
      return;
    }

    const checkoutPath =
      `/course-checkout/${course.id}`;

    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          checkoutPath
        )}`
      );

      return;
    }

    router.push(
      checkoutPath
    );
  };

  const isLoading =
    coursesLoading ||
    categoriesLoading;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f7f4ef] text-[#1e1e1c]">
      <HeroBanner />

      <section className="relative z-10 mx-auto max-w-[1280px] overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="w-full overflow-hidden rounded-[24px] border border-[#e8e2d7] bg-white/70 p-4 shadow-[0_16px_45px_rgba(45,35,24,0.07)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-center gap-2 rounded-full bg-[#f8f4ed] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#685f56] md:justify-start md:bg-transparent md:px-0 md:py-0 md:text-[11px]">
              <Filter
                size={14}
                className="shrink-0 text-[#a98745]"
              />

              <span>
                Showing{" "}
                {
                  filteredCourses.length
                }{" "}
                {filteredCourses.length ===
                1
                  ? "Course"
                  : "Courses"}
              </span>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 rounded-[20px] bg-[#efe7dc]/80 p-2 backdrop-blur-sm sm:grid-cols-4 md:w-auto md:flex md:flex-wrap md:justify-end">
              <button
                type="button"
                onClick={() =>
                  handleCategoryChange(
                    ""
                  )
                }
                className={`relative min-h-[40px] w-full overflow-hidden rounded-full px-3 py-2 text-center text-[10px] font-medium tracking-wide transition-colors duration-300 sm:text-[11px] md:w-auto md:px-5 ${
                  !selectedCategoryId
                    ? "text-white"
                    : "text-[#5f554b] hover:text-[#1e1e1c]"
                }`}
              >
                {!selectedCategoryId && (
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
                  All
                </span>
              </button>

              {courseCategories.map(
                (category) => {
                  const categoryId =
                    getCategoryId(
                      category
                    );

                  const isActive =
                    selectedCategoryId ===
                    categoryId;

                  return (
                    <button
                      key={
                        categoryId
                      }
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          categoryId
                        )
                      }
                      className={`relative min-h-[40px] w-full overflow-hidden rounded-full px-3 py-2 text-center text-[10px] font-medium tracking-wide transition-colors duration-300 sm:text-[11px] md:w-auto md:px-5 ${
                        isActive
                          ? "text-white"
                          : "text-[#5f554b] hover:text-[#1e1e1c]"
                      }`}
                    >
                      {isActive && (
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
                        {getCategoryTitle(
                          category
                        )}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {categoriesError && (
            <p className="mt-4 text-center text-[12px] text-red-600">
              Categories could not
              be loaded. All courses
              are still available.
            </p>
          )}
        </motion.div>
      </section>

      <section
        id="courses-list"
        className="relative z-10 mx-auto max-w-[1280px] px-4 py-4 sm:px-6 lg:px-8 lg:pb-20"
      >
        {isLoading && (
          <CoursesGridLoading />
        )}

        {coursesError &&
          !coursesLoading && (
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-10 text-center text-red-700">
              {getErrorMessage(
                coursesRequestError
              )}
            </div>
          )}

        {!isLoading &&
          !coursesError &&
          filteredCourses.length >
            0 && (
            <motion.div
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredCourses.map(
                  (
                    course,
                    index
                  ) => (
                    <CourseCard
                      key={
                        course.id
                      }
                      course={
                        course
                      }
                      index={
                        index
                      }
                      onBuy={
                        handleBuyCourse
                      }
                      isCheckingAuth={
                        isCheckingAuth
                      }
                    />
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}

        {!isLoading &&
          !coursesError &&
          filteredCourses.length ===
            0 && (
            <div className="rounded-[28px] border border-[#e8e2d7] bg-white/60 p-10 text-center">
              <h3
                className={`font-special text-[38px] font-normal italic text-[#191714]`}
              >
                No courses found
              </h3>

              <p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-[#685f56]">
                This category does not
                have any courses right
                now.
              </p>

              {selectedCategoryId && (
                <button
                  type="button"
                  onClick={() =>
                    handleCategoryChange(
                      ""
                    )
                  }
                  className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#211e1a] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#a98745]"
                >
                  View All Courses
                </button>
              )}
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
            className={`font-special text-[34px] font-normal italic text-[#191714] sm:text-[44px]`}
          >
            The Studio Experience
          </h4>

          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-[#685f56]">
            Every course includes
            lifetime access,
            downloadable guide-sheets,
            high-definition
            step-by-step videos, and
            access to your learning
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
            alt="Rakhshinda guided courses"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#15110d]/96 via-[#211e1a]/76 to-[#211e1a]/14" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#211e1a]/70 via-transparent to-[#211e1a]/35" />

        <div className="absolute -left-32 top-24 h-[360px] w-[360px] rounded-full bg-[#d8b26e]/18 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-[220px] w-full bg-gradient-to-t from-[#211e1a]/85 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1280px] items-center px-4 pb-16 pt-[132px] sm:min-h-[780px] sm:px-6 sm:pt-[145px] lg:min-h-[calc(100vh-82px)] lg:px-8 lg:pt-[118px]">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
            }}
            className="max-w-[780px]"
          >
            <h1
              className={`font-special text-[54px] font-normal italic leading-[0.9] tracking-[-0.055em] text-white sm:text-[76px] md:text-[90px] lg:text-[104px]`}
            >
              Learn Rakhshinda

              <span className="block text-[#d8b26e]">
                Online Guided Courses
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-[15px] leading-7 text-white/86 sm:text-[16px]">
              Explore structured art
              courses, learn step by
              step, view complete
              course details, and
              unlock your personal
              learning portal after
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
                href="/courses/learning"
                className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-white/24 bg-white/10 px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                My Courses

                <PlayCircle
                  size={15}
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CourseCard({
  course,
  index,
  onBuy,
  isCheckingAuth,
}) {
  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.96,
        y: 14,
      }}
      transition={{
        duration: 0.4,
        delay:
          index * 0.04,
      }}
      className="min-w-0"
    >
      <div className="group h-full rounded-[30px] border border-white/75 bg-white/36 p-2.5 shadow-[0_18px_55px_rgba(45,35,24,0.08)] backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(45,35,24,0.16)]">
        <div className="flex h-full flex-col overflow-hidden rounded-[24px] bg-white/78 backdrop-blur-xl">
          <Link
            href={course.href}
            className="block"
          >
            <div className="relative h-[245px] overflow-hidden rounded-t-[24px] bg-[#e9dccb] sm:h-[265px] lg:h-[285px]">
              {course.image ? (
                <img
                  src={
                    course.image
                  }
                  alt={
                    course.title
                  }
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition duration-[1000ms] ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#aa8747]">
                  <BookOpen
                    size={52}
                    strokeWidth={
                      1.2
                    }
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-black/10 to-transparent" />

              <div className="absolute left-4 top-4 rounded-full bg-white/92 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#1e1e1c] shadow-sm backdrop-blur-md">
                {
                  course.categoryName
                }
              </div>

              <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/94 text-[#211d18] shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-[#a98745] group-hover:text-white">
                <ArrowUpRight
                  size={18}
                  strokeWidth={
                    1.8
                  }
                />
              </span>

              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2">
                <InfoBadge
                  icon={
                    <Clock3
                      size={17}
                    />
                  }
                  text={
                    course.duration
                  }
                />

                <InfoBadge
                  icon={
                    <BookOpen
                      size={17}
                    />
                  }
                  text={
                    course.lessons
                  }
                />
              </div>
            </div>
          </Link>

          <div className="flex flex-1 flex-col rounded-b-[24px] border border-t-0 border-white/75 bg-white/68 p-5 shadow-[0_18px_45px_rgba(45,35,24,0.06)] backdrop-blur-xl sm:p-6">
            <Link
              href={course.href}
            >
              <h3
                className={`font-special min-h-[82px] text-[34px] font-normal italic leading-[0.94] tracking-[-0.04em] text-[#211e1a] transition duration-300 hover:text-[#a98745] sm:text-[38px] lg:text-[42px]`}
              >
                {course.title}
              </h3>
            </Link>

            <div className="mt-5 flex items-center justify-between rounded-[18px] border border-[#eadfce] bg-[#f8f4ed] px-4 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7d70]">
                Course Price
              </span>

              <span className="text-[20px] font-semibold text-[#211e1a]">
                AED{" "}
                {course.price.toLocaleString()}
              </span>
            </div>

            <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
              <Link
                href={
                  course.href
                }
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#d8cbbd] bg-white/80 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#211e1a] transition duration-300 hover:border-[#211e1a] hover:bg-[#211e1a] hover:text-white"
              >
                <Eye size={14} />

                Details
              </Link>

              <button
                type="button"
                disabled={
                  isCheckingAuth
                }
                onClick={() =>
                  onBuy(course)
                }
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#a98745] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isCheckingAuth ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <ShoppingBag
                    size={14}
                  />
                )}

                {isCheckingAuth
                  ? "Checking"
                  : "Buy Course"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function InfoBadge({
  icon,
  text,
}) {
  return (
    <span className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-white/92 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#1e1e1c] shadow-sm backdrop-blur-md">
      <span className="shrink-0 text-[#aa8747]">
        {icon}
      </span>

      {text}
    </span>
  );
}

function CoursesGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {[1, 2, 3, 4, 5, 6].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse rounded-[30px] border border-white/75 bg-white/36 p-2.5"
          >
            <div className="h-[285px] rounded-t-[24px] bg-[#e4d9cc]" />

            <div className="rounded-b-[24px] bg-white/68 p-6">
              <div className="h-9 w-4/5 rounded bg-[#e4d9cc]" />

              <div className="mt-5 h-16 rounded-[18px] bg-[#eee7df]" />

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="h-12 rounded-full bg-[#e4d9cc]" />

                <div className="h-12 rounded-full bg-[#e4d9cc]" />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function CoursesPageLoading() {
  return (
    <main className="min-h-screen bg-[#f7f4ef]">
      <div className="h-[760px] animate-pulse bg-[#211e1a]" />
    </main>
  );
}