"use client";

import {
  Suspense,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Eye,
  Filter,
  Heart,
  Loader2,
  PlayCircle,
  ShoppingBag,
} from "lucide-react";

import { useCourses } from "../hooks/useCourses";
import { useActiveCategories } from "../hooks/useCategories";
import { useMe } from "../hooks/useAuth";

const priceFormatter = new Intl.NumberFormat("en-AE", {
  maximumFractionDigits: 2,
});

const extractCourses = (response) => {
  const possibleCourses = [
    response?.data?.data?.courses,
    response?.data?.courses,
    response?.data?.data,
    response?.data,
    response?.courses,
    response,
  ];

  return (
    possibleCourses.find((value) => Array.isArray(value)) || []
  );
};

const extractCategories = (response) => {
  const possibleCategories = [
    response?.data?.data?.categories,
    response?.data?.categories,
    response?.data?.data,
    response?.data,
    response?.categories,
    response,
  ];

  return (
    possibleCategories.find((value) => Array.isArray(value)) || []
  );
};

const extractUser = (response) => {
  const possibleUsers = [
    response?.data?.data?.user,
    response?.data?.user,
    response?.user,
    response?.data?.data,
    response?.data,
    response,
  ];

  return (
    possibleUsers.find((value) => {
      return (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Boolean(value?._id || value?.id || value?.email)
      );
    }) || null
  );
};

const getCourseId = (course) => {
  return String(course?._id || course?.id || "").trim();
};

const getCategoryId = (category) => {
  return String(category?._id || category?.id || "").trim();
};

const getCategoryTitle = (category) => {
  return String(
    category?.title ||
      category?.name ||
      "Category"
  ).trim();
};

const getCourseCategoryId = (course) => {
  const category = course?.category;

  if (category && typeof category === "object") {
    return String(category?._id || category?.id || "").trim();
  }

  return String(
    category ||
      course?.categoryId ||
      ""
  ).trim();
};

const getCourseCategoryName = (course, categoryMap) => {
  const category = course?.category;

  if (category && typeof category === "object") {
    return String(
      category?.title ||
        category?.name ||
        "Art Course"
    ).trim();
  }

  const categoryId = getCourseCategoryId(course);

  return (
    categoryMap.get(categoryId) ||
    course?.categoryName ||
    "Art Course"
  );
};

const getCourseImage = (course) => {
  const possibleImages = [
    course?.thumbnail?.url,
    course?.image?.url,
    course?.coverImage?.url,
    typeof course?.thumbnail === "string"
      ? course.thumbnail
      : "",
    typeof course?.image === "string"
      ? course.image
      : "",
    typeof course?.coverImage === "string"
      ? course.coverImage
      : "",
    course?.imageUrl,
  ];

  return (
    possibleImages.find(
      (value) =>
        typeof value === "string" &&
        value.trim()
    ) || ""
  );
};

const getCourseDuration = (course) => {
  return String(
    course?.duration ||
      course?.courseDuration ||
      "Self-paced"
  ).trim();
};

const getCourseLessons = (course) => {
  if (Array.isArray(course?.lectures)) {
    const total = course.lectures.length;

    return `${total} ${total === 1 ? "Lesson" : "Lessons"}`;
  }

  if (Array.isArray(course?.videos)) {
    const total = course.videos.length;

    return `${total} ${total === 1 ? "Lesson" : "Lessons"}`;
  }

  const total =
    course?.totalVideos ??
    course?.totalLessons ??
    course?.totalLectures ??
    course?.lectureCount ??
    course?.lecturesCount ??
    course?.lessonCount;

  if (total !== undefined && total !== null) {
    const numericTotal = Number(total);

    return `${total} ${
      numericTotal === 1 ? "Lesson" : "Lessons"
    }`;
  }

  return "Course Lessons";
};

const cleanDescription = (value) => {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeCourse = (course, categoryMap) => {
  const id = getCourseId(course);
  const rawPrice = Number(course?.price ?? 0);

  return {
    id,
    categoryId: getCourseCategoryId(course),
    categoryName: getCourseCategoryName(
      course,
      categoryMap
    ),
    title: String(
      course?.title || "Untitled Course"
    ).trim(),
    image: getCourseImage(course),
    href: `/courses/${id}`,
    duration: getCourseDuration(course),
    lessons: getCourseLessons(course),
    price: Number.isFinite(rawPrice) ? rawPrice : 0,
    description: cleanDescription(
      course?.shortDescription ||
        course?.description ||
        ""
    ),
  };
};

const getErrorMessage = (error) => {
  return (
    error?.userMessage ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Courses could not be loaded."
  );
};

export default function CoursesPage() {
  return (
    <Suspense fallback={<CoursesPageLoading />}>
      <CoursesPageContent />
    </Suspense>
  );
}

function CoursesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const selectedCategoryFromUrl =
    searchParams.get("category") || "";

  const {
    data: coursesResponse,
    isLoading: coursesLoading,
    isError: coursesError,
    error: coursesRequestError,
  } = useCourses();

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useActiveCategories();

  const {
    data: userResponse,
    isLoading: authLoading,
    isFetching: authFetching,
  } = useMe();

  const currentUser = useMemo(() => {
    return extractUser(userResponse);
  }, [userResponse]);

  const isAuthenticated = Boolean(currentUser);

  const isCheckingAuth =
    authLoading ||
    (authFetching && !currentUser);

  const courseCategories = useMemo(() => {
    return extractCategories(categoriesResponse).filter(
      (category) => {
        const type = String(category?.type || "")
          .toLowerCase()
          .trim();

        return (
          type === "course" &&
          category?.isActive !== false &&
          Boolean(getCategoryId(category))
        );
      }
    );
  }, [categoriesResponse]);

  const categoryMap = useMemo(() => {
    return new Map(
      courseCategories.map((category) => [
        getCategoryId(category),
        getCategoryTitle(category),
      ])
    );
  }, [courseCategories]);

  const allCourses = useMemo(() => {
    return extractCourses(coursesResponse)
      .filter((course) => {
        return (
          Boolean(getCourseId(course)) &&
          course?.draft !== true
        );
      })
      .map((course) =>
        normalizeCourse(course, categoryMap)
      );
  }, [coursesResponse, categoryMap]);

  const selectedCategoryId = useMemo(() => {
    if (!selectedCategoryFromUrl) return "";

    const existsInCategories = courseCategories.some(
      (category) =>
        getCategoryId(category) === selectedCategoryFromUrl
    );

    const existsInCourses = allCourses.some(
      (course) =>
        course.categoryId === selectedCategoryFromUrl
    );

    return existsInCategories || existsInCourses
      ? selectedCategoryFromUrl
      : "";
  }, [
    selectedCategoryFromUrl,
    courseCategories,
    allCourses,
  ]);

  const filteredCourses = useMemo(() => {
    if (!selectedCategoryId) {
      return allCourses;
    }

    return allCourses.filter(
      (course) =>
        course.categoryId === selectedCategoryId
    );
  }, [allCourses, selectedCategoryId]);

  const handleCategoryChange = (categoryId) => {
    const nextPath = categoryId
      ? `/courses?category=${encodeURIComponent(categoryId)}`
      : "/courses";

    router.replace(nextPath, {
      scroll: false,
    });
  };

  const handleBuyCourse = (course) => {
    if (!course?.id || isCheckingAuth) return;

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

    router.push(checkoutPath);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f7f3ee] text-[#1e1e1c]">
      <HeroBanner
        shouldReduceMotion={shouldReduceMotion}
      />

      <div className="pointer-events-none absolute -left-40 top-[720px] h-[360px] w-[360px] rounded-full bg-[#eadcc9]/70 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-[1050px] h-[420px] w-[420px] rounded-full bg-[#ead8c2]/70 blur-3xl" />

      <CategoryFilters
        categories={courseCategories}
        selectedCategoryId={selectedCategoryId}
        courseCount={filteredCourses.length}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        onCategoryChange={handleCategoryChange}
        shouldReduceMotion={shouldReduceMotion}
      />

      <section
        id="courses-list"
        className="relative z-10 mx-auto w-full max-w-[1280px] scroll-mt-24 px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20"
      >
        {coursesLoading && <CoursesGridLoading />}

        {coursesError && !coursesLoading && (
          <ErrorState
            message={getErrorMessage(
              coursesRequestError
            )}
          />
        )}

        {!coursesLoading &&
          !coursesError &&
          filteredCourses.length > 0 && (
            <motion.div
              layout
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0 }
              }
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
            >
              <AnimatePresence
                initial={false}
                mode="popLayout"
              >
                {filteredCourses.map(
                  (course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      onBuy={handleBuyCourse}
                      isCheckingAuth={isCheckingAuth}
                      shouldReduceMotion={
                        shouldReduceMotion
                      }
                    />
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}

        {!coursesLoading &&
          !coursesError &&
          filteredCourses.length === 0 && (
            <EmptyCoursesState
              hasSelectedCategory={Boolean(
                selectedCategoryId
              )}
              onViewAll={() =>
                handleCategoryChange("")
              }
            />
          )}
      </section>

      <StudioExperience
        shouldReduceMotion={shouldReduceMotion}
      />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .course-category-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .course-category-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}

function HeroBanner({ shouldReduceMotion }) {
  return (
    <section className="relative z-10 w-full">
      <div className="relative min-h-[620px] w-full overflow-hidden bg-[#211e1a] sm:min-h-[700px] lg:min-h-[calc(100vh-82px)] lg:max-h-[920px]">
        <img
          src="/images/course-hero.png"
          alt="Online guided art courses by Rakhshinda"
          className="absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#15110d]/95 via-[#211e1a]/75 to-[#211e1a]/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#211e1a]/80 via-transparent to-[#211e1a]/35" />

        <div className="pointer-events-none absolute -left-36 top-20 h-[340px] w-[340px] rounded-full bg-[#d8b26e]/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-0 h-[240px] w-full bg-gradient-to-t from-[#211e1a]/90 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[620px] w-full max-w-[1280px] items-center px-4 pb-16 pt-28 sm:min-h-[700px] sm:px-6 sm:pb-20 sm:pt-32 lg:min-h-[calc(100vh-82px)] lg:max-h-[920px] lg:px-8 lg:py-24">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 24,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-[820px]"
          >
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#dfbd7d] sm:text-[11px]">
              Learn From The Studio
            </p>

            <h1 className="font-special max-w-[850px] text-[clamp(3.2rem,9vw,6.5rem)] font-normal italic leading-[0.88] tracking-[-0.055em] text-white">
              Learn Rakhshinda

              <span className="mt-1 block text-[#d8b26e]">
                Online Guided Courses
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-[14px] leading-7 text-white/80 sm:mt-7 sm:text-[16px]">
              Explore structured art courses, learn
              step by step, view complete course
              details and unlock your personal
              learning portal after purchase.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row">
              <a
                href="#courses-list"
                className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-full bg-white px-7 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#211e1a] shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#d8b26e] sm:min-h-[52px] sm:w-auto sm:px-8 sm:text-[11px]"
              >
                Browse Courses

                <ArrowUpRight
                  size={15}
                  className="transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>

              <Link
                href="/my-courses"
                className="inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-full border border-white/25 bg-white/10 px-7 text-[10px] font-semibold uppercase tracking-[0.17em] text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20 sm:min-h-[52px] sm:w-auto sm:px-8 sm:text-[11px]"
              >
                My Courses

                <PlayCircle size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CategoryFilters({
  categories,
  selectedCategoryId,
  courseCount,
  categoriesLoading,
  categoriesError,
  onCategoryChange,
  shouldReduceMotion,
}) {
  return (
    <section className="relative z-20 mx-auto w-full max-w-[1280px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 16,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.5,
        }}
        className="overflow-hidden rounded-[22px] border border-white/80 bg-white/70 p-3 shadow-[0_16px_50px_rgba(45,35,24,0.07)] backdrop-blur-xl sm:rounded-[26px] sm:p-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-[16px] bg-[#f5efe7] px-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#685f56] sm:text-[10px] lg:justify-start lg:bg-transparent lg:px-2">
            <Filter
              size={15}
              className="shrink-0 text-[#a98745]"
            />

            <span>
              Showing {courseCount}{" "}
              {courseCount === 1
                ? "Course"
                : "Courses"}
            </span>
          </div>

          <div className="course-category-scroll flex w-full items-center gap-2 overflow-x-auto rounded-[17px] bg-[#eee5d9]/80 p-2 lg:w-auto lg:max-w-[75%] lg:justify-end">
            <CategoryButton
              label="All Courses"
              active={!selectedCategoryId}
              onClick={() => onCategoryChange("")}
            />

            {categoriesLoading &&
              [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-white/70"
                />
              ))}

            {!categoriesLoading &&
              categories.map((category) => {
                const categoryId =
                  getCategoryId(category);

                return (
                  <CategoryButton
                    key={categoryId}
                    label={getCategoryTitle(category)}
                    active={
                      selectedCategoryId === categoryId
                    }
                    onClick={() =>
                      onCategoryChange(categoryId)
                    }
                  />
                );
              })}
          </div>
        </div>

        {categoriesError && (
          <p className="mt-3 text-center text-[11px] leading-5 text-red-600">
            Categories could not be loaded. All
            available courses are still shown.
          </p>
        )}
      </motion.div>
    </section>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative min-h-[40px] shrink-0 overflow-hidden rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.04em] transition-colors duration-300 sm:px-5 sm:text-[11px] ${
        active
          ? "text-white"
          : "bg-white/50 text-[#5f554b] hover:bg-white hover:text-[#1e1e1c]"
      }`}
    >
      {active && (
        <motion.span
          layoutId="active-course-category"
          className="absolute inset-0 rounded-full bg-[#1e1e1c]"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}

      <span className="relative z-10 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function CourseCard({
  course,
  index,
  onBuy,
  isCheckingAuth,
  shouldReduceMotion,
}) {
  return (
    <motion.article
      layout
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 22,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.97,
        y: 12,
      }}
      transition={{
        duration: 0.42,
        delay: Math.min(index * 0.04, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="min-w-0"
    >
      <div className="group h-full rounded-[24px] border border-white/80 bg-white/40 p-2 shadow-[0_18px_50px_rgba(45,35,24,0.08)] backdrop-blur-md transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_75px_rgba(45,35,24,0.14)] sm:rounded-[30px] sm:p-2.5">
        <div className="flex h-full flex-col overflow-hidden rounded-[19px] bg-white/85 sm:rounded-[24px]">
          <Link
            href={course.href}
            className="block"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#e9dccb] sm:aspect-[5/4]">
              <CourseImage course={course} />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

              <div className="absolute left-3 top-3 max-w-[calc(100%-72px)] truncate rounded-full bg-white/90 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.13em] text-[#1e1e1c] shadow-sm backdrop-blur-md sm:left-4 sm:top-4 sm:px-4 sm:py-2.5 sm:text-[9px]">
                {course.categoryName}
              </div>

              <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211d18] shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-[#a98745] group-hover:text-white sm:right-4 sm:top-4 sm:h-11 sm:w-11">
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.8}
                />
              </span>

              <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2 sm:bottom-4 sm:left-4 sm:right-4">
                <InfoBadge
                  icon={<Clock3 size={15} />}
                  text={course.duration}
                />

                <InfoBadge
                  icon={<BookOpen size={15} />}
                  text={course.lessons}
                />
              </div>
            </div>
          </Link>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <Link href={course.href}>
              <h3 className="font-special text-[30px] font-normal italic leading-[0.94] tracking-[-0.04em] text-[#211e1a] transition duration-300 hover:text-[#a98745] sm:min-h-[72px] sm:text-[36px] lg:text-[38px]">
                {course.title}
              </h3>
            </Link>

            {course.description && (
              <p className="mt-3 line-clamp-2 min-h-[44px] text-[12px] leading-[22px] text-[#756b61] sm:text-[13px]">
                {course.description}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between gap-3 rounded-[16px] border border-[#eadfce] bg-[#f8f4ed] px-4 py-3 sm:rounded-[18px]">
              <span className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#8a7d70] sm:text-[10px]">
                Course Price
              </span>

              <span className="shrink-0 text-[18px] font-semibold text-[#211e1a] sm:text-[20px]">
                AED {priceFormatter.format(course.price)}
              </span>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5 sm:gap-3 sm:pt-6">
              <Link
                href={course.href}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#d8cbbd] bg-white px-3 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#211e1a] transition duration-300 hover:border-[#211e1a] hover:bg-[#211e1a] hover:text-white sm:min-h-[46px] sm:px-5 sm:text-[9px] sm:tracking-[0.15em]"
              >
                <Eye size={14} />

                Details
              </Link>

              <button
                type="button"
                disabled={isCheckingAuth}
                onClick={() => onBuy(course)}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-3 text-[8px] font-semibold uppercase tracking-[0.12em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#a98745] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:min-h-[46px] sm:px-5 sm:text-[9px] sm:tracking-[0.15em]"
              >
                {isCheckingAuth ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <ShoppingBag size={14} />
                )}

                <span className="whitespace-nowrap">
                  {isCheckingAuth
                    ? "Checking"
                    : "Buy Now"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CourseImage({ course }) {
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center bg-[#e9dccb] text-[#aa8747]">
        <BookOpen
          size={52}
          strokeWidth={1.2}
        />
      </div>

      {course.image && !imageError && (
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-[1000ms] ease-out group-hover:scale-105"
        />
      )}
    </>
  );
}

function InfoBadge({ icon, text }) {
  return (
    <span className="flex min-h-[38px] min-w-0 items-center justify-center gap-1.5 rounded-full bg-white/90 px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.05em] text-[#1e1e1c] shadow-sm backdrop-blur-md sm:min-h-[42px] sm:gap-2 sm:px-3 sm:text-[9px]">
      <span className="shrink-0 text-[#aa8747]">
        {icon}
      </span>

      <span className="truncate">
        {text}
      </span>
    </span>
  );
}

function EmptyCoursesState({
  hasSelectedCategory,
  onViewAll,
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/65 px-6 py-12 text-center shadow-[0_18px_55px_rgba(45,35,24,0.06)] backdrop-blur-xl sm:rounded-[30px] sm:px-10 sm:py-16">
      <BookOpen
        size={28}
        strokeWidth={1.4}
        className="mx-auto mb-4 text-[#a98745]"
      />

      <h3 className="font-special text-[36px] font-normal italic text-[#191714] sm:text-[44px]">
        No courses found
      </h3>

      <p className="mx-auto mt-3 max-w-md text-[13px] leading-6 text-[#685f56] sm:text-[14px]">
        This category does not have any available
        courses right now.
      </p>

      {hasSelectedCategory && (
        <button
          type="button"
          onClick={onViewAll}
          className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#211e1a] px-7 text-[9px] font-semibold uppercase tracking-[0.15em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#a98745]"
        >
          View All Courses
        </button>
      )}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="rounded-[24px] border border-red-200 bg-red-50/90 px-6 py-12 text-center shadow-sm sm:rounded-[30px] sm:px-10">
      <h3 className="font-special text-[34px] font-normal italic text-red-800 sm:text-[42px]">
        Courses unavailable
      </h3>

      <p className="mx-auto mt-3 max-w-lg text-[13px] leading-6 text-red-700 sm:text-[14px]">
        {message}
      </p>
    </div>
  );
}

function StudioExperience({ shouldReduceMotion }) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-[1100px] px-4 pb-16 pt-2 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 20,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/60 px-6 py-10 text-center shadow-[0_20px_65px_rgba(45,35,24,0.07)] backdrop-blur-xl sm:rounded-[34px] sm:px-10 sm:py-12"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-[180px] w-[180px] rounded-full bg-[#ead8c2]/60 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -right-16 h-[200px] w-[200px] rounded-full bg-[#eadcc9]/60 blur-3xl" />

        <div className="relative z-10">
          <Heart
            size={20}
            className="mx-auto mb-4 text-[#a98745]"
          />

          <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.25em] text-[#a98745] sm:text-[9px]">
            Learn At Your Own Pace
          </p>

          <h4 className="font-special text-[34px] font-normal italic leading-none text-[#191714] sm:text-[44px]">
            The Studio Experience
          </h4>

          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-[#685f56] sm:text-[14px] sm:leading-7">
            Every course includes lifetime access,
            downloadable guide sheets, high-definition
            step-by-step videos and access to your
            personal learning portal.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function CoursesGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-[24px] border border-white/80 bg-white/40 p-2 sm:rounded-[30px] sm:p-2.5"
        >
          <div className="overflow-hidden rounded-[19px] bg-white/75 sm:rounded-[24px]">
            <div className="aspect-[4/3] bg-[#e4d9cc] sm:aspect-[5/4]" />

            <div className="p-5 sm:p-6">
              <div className="h-9 w-4/5 rounded bg-[#e4d9cc]" />

              <div className="mt-3 h-5 w-full rounded bg-[#eee7df]" />

              <div className="mt-5 h-14 rounded-[16px] bg-[#eee7df]" />

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="h-11 rounded-full bg-[#e4d9cc]" />

                <div className="h-11 rounded-full bg-[#e4d9cc]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoursesPageLoading() {
  return (
    <main className="min-h-screen bg-[#f7f3ee]">
      <div className="min-h-[620px] animate-pulse bg-[#211e1a] sm:min-h-[700px]" />

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-24 animate-pulse rounded-[24px] bg-white/70" />
      </div>
    </main>
  );
}