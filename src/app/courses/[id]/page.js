"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  PlayCircle,
  ShoppingBag,
} from "lucide-react";

import {
  useSingleCourse,
  useMyCourses,
} from "../../hooks/useCourses";

import {
  useMe,
} from "../../hooks/useAuth";

const extractCourse = (
  response
) => {
  const possibleCourses = [
    response?.data?.course,
    response?.data,
    response?.course,
    response,
  ];

  return (
    possibleCourses.find(
      (value) =>
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        (
          value?._id ||
          value?.id ||
          value?.title
        )
    ) || null
  );
};

const extractMyCourses = (
  response
) => {
  const possibleCourses = [
    response?.data?.courses,
    response?.courses,
    response?.data,
    response,
  ];

  return (
    possibleCourses.find(
      (value) =>
        Array.isArray(value)
    ) || []
  );
};

const getCourseId = (
  course
) => {
  return String(
    course?._id ||
      course?.id ||
      ""
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

const getCategoryName = (
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
      category?.title ||
      category?.name ||
      "Art Course"
    );
  }

  return (
    course?.categoryName ||
    category ||
    "Art Course"
  );
};

const getDuration = (
  course
) => {
  return String(
    course?.duration ||
      course?.courseDuration ||
      "Self Paced"
  );
};

const getLessons = (
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

  const count =
    course?.totalVideos ??
    course?.totalLessons ??
    course?.totalLectures ??
    course?.lessonCount ??
    course?.lectureCount ??
    course?.lecturesCount;

  if (
    count !== undefined &&
    count !== null
  ) {
    return `${count} ${
      Number(count) === 1
        ? "Lesson"
        : "Lessons"
    }`;
  }

  return "Course Lessons";
};

const getLearningPoints = (
  course
) => {
  const possiblePoints =
    course?.learningOutcomes ||
    course?.whatYouWillLearn ||
    course?.features ||
    course?.outcomes;

  if (
    !Array.isArray(
      possiblePoints
    )
  ) {
    return [];
  }

  return possiblePoints
    .map((item) => {
      if (
        typeof item ===
        "string"
      ) {
        return item;
      }

      return (
        item?.title ||
        item?.text ||
        item?.name ||
        ""
      );
    })
    .filter(Boolean);
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
    "Course details could not be loaded."
  );
};

export default function CourseDetailsPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const routeCourseId =
    Array.isArray(params?.id)
      ? params.id[0]
      : params?.id;

  const {
    data: courseResponse,
    isLoading:
      courseLoading,
    isError: courseError,
    error:
      courseRequestError,
  } = useSingleCourse(
    routeCourseId
  );

  const {
    data: user,
    isLoading: authLoading,
    isFetching: authFetching,
  } = useMe();

  const {
    data: myCoursesResponse,
    isLoading:
      myCoursesLoading,
  } = useMyCourses();

  const [
    isRedirecting,
    setIsRedirecting,
  ] = useState(false);

  const course =
    useMemo(() => {
      return extractCourse(
        courseResponse
      );
    }, [courseResponse]);

  const learningPoints =
    useMemo(() => {
      if (!course) {
        return [];
      }

      return getLearningPoints(
        course
      );
    }, [course]);

  const courseId =
    getCourseId(course) ||
    String(routeCourseId || "");

  const isAuthenticated =
    Boolean(user);

  const isPurchased =
    useMemo(() => {
      if (!courseId) {
        return false;
      }

      const purchasedCourses =
        extractMyCourses(
          myCoursesResponse
        );

      return purchasedCourses.some(
        (purchasedCourse) => {
          const purchasedCourseId =
            getCourseId(
              purchasedCourse
            );

          const status =
            String(
              purchasedCourse
                ?.enrollmentStatus ||
                "active"
            )
              .toLowerCase()
              .trim();

          return (
            purchasedCourseId ===
              courseId &&
            status === "active"
          );
        }
      );
    }, [
      courseId,
      myCoursesResponse,
    ]);

  const isCheckingAccess =
    authLoading ||
    authFetching ||
    (
      isAuthenticated &&
      myCoursesLoading
    );

  const handleCourseAction =
    () => {
      if (
        !courseId ||
        isCheckingAccess ||
        isRedirecting
      ) {
        return;
      }

      setIsRedirecting(true);

      if (isPurchased) {
        router.push(
          `/courses/learning/${courseId}`
        );

        return;
      }

      const checkoutPath =
        `/course-checkout/${courseId}`;

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

  const actionText =
    isRedirecting
      ? "Opening..."
      : isCheckingAccess
      ? "Checking..."
      : isPurchased
      ? "Continue Learning"
      : "Buy Course";

  const ActionIcon =
    isRedirecting ||
    isCheckingAccess
      ? Loader2
      : isPurchased
      ? PlayCircle
      : ShoppingBag;

  if (courseLoading) {
    return (
      <CourseDetailsLoading />
    );
  }

  if (courseError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f4ef] px-5 py-20">
        <div className="w-full max-w-xl rounded-[28px] border border-red-200 bg-red-50 p-10 text-center shadow-sm">
          <h1
            className={`font-special text-[42px] font-medium italic text-[#211e1a]`}
          >
            Course Could Not Be Loaded
          </h1>

          <p className="mt-4 text-[14px] leading-7 text-red-700">
            {getErrorMessage(
              courseRequestError
            )}
          </p>

          <Link
            href="/courses"
            className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#a98745]"
          >
            <ArrowLeft
              size={15}
            />

            Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f4ef] px-5 py-20">
        <div className="w-full max-w-xl rounded-[28px] border border-[#e8e2d7] bg-white/70 p-10 text-center">
          <h1
            className={`font-special text-[42px] font-medium italic text-[#211e1a]`}
          >
            Course Not Found
          </h1>

          <p className="mt-4 text-[14px] text-[#685f56]">
            This course is not
            available or may have
            been removed.
          </p>

          <Link
            href="/courses"
            className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#a98745]"
          >
            <ArrowLeft
              size={15}
            />

            Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  const image =
    getCourseImage(course);

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#211e1a]">
      <section className="relative overflow-hidden bg-[#211e1a]">
        <div className="absolute -left-32 top-20 h-[360px] w-[360px] rounded-full bg-[#d8b26e]/20 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#a98745]/15 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-5 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-36">
          <div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:text-[#d8b26e]"
            >
              <ArrowLeft
                size={14}
              />

              Back to Courses
            </Link>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d8b26e]">
              {getCategoryName(
                course
              )}
            </p>

            <h1
              className={`font-special mt-4 text-[52px] font-normal italic leading-[0.92] tracking-[-0.05em] text-white sm:text-[68px] lg:text-[82px]`}
            >
              {course?.title}
            </h1>

            <p className="mt-6 max-w-2xl text-[15px] leading-8 text-white/78">
              {course?.description ||
                course?.shortDescription ||
                "Learn through calm, structured and guided creative lessons."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <InfoPill
                icon={
                  <Clock3
                    size={17}
                  />
                }
                text={getDuration(
                  course
                )}
              />

              <InfoPill
                icon={
                  <BookOpen
                    size={17}
                  />
                }
                text={getLessons(
                  course
                )}
              />

              <InfoPill
                icon={
                  <GraduationCap
                    size={17}
                  />
                }
                text="Lifetime Access"
              />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={
                  handleCourseAction
                }
                disabled={
                  isCheckingAccess ||
                  isRedirecting
                }
                className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#d8b26e] px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#211e1a] transition duration-300 hover:-translate-y-1 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <ActionIcon
                  size={16}
                  className={
                    isCheckingAccess ||
                    isRedirecting
                      ? "animate-spin"
                      : ""
                  }
                />

                {actionText}
              </button>

              <div className="rounded-full border border-white/15 bg-white/10 px-7 py-4 text-center backdrop-blur-md">
                <span className="text-[11px] uppercase tracking-[0.14em] text-white/60">
                  Price
                </span>

                <strong className="ml-3 text-[20px] font-semibold text-white">
                  AED{" "}
                  {Number(
                    course?.price ||
                      0
                  ).toLocaleString()}
                </strong>
              </div>
            </div>

            {isPurchased && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-300/20 bg-green-300/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-green-200">
                <CheckCircle2
                  size={15}
                />

                Your course access is
                active
              </div>
            )}
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[34px] border border-white/15 bg-white/10 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] bg-[#e9dccb]">
                {image ? (
                  <img
                    src={image}
                    alt={
                      course?.title ||
                      "Course"
                    }
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#a98745]">
                    <BookOpen
                      size={72}
                      strokeWidth={
                        1.15
                      }
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-[20px] border border-white/20 bg-black/25 px-5 py-4 text-white backdrop-blur-md">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      Course Access
                    </p>

                    <p className="mt-1 text-[13px] font-medium">
                      {isPurchased
                        ? "Continue your course lessons"
                        : "Start learning after purchase"}
                    </p>
                  </div>

                  <PlayCircle
                    size={31}
                    strokeWidth={
                      1.45
                    }
                    className="shrink-0 text-[#d8b26e]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8 lg:py-24">
        <div className="rounded-[30px] border border-[#e7dfd6] bg-white/70 p-7 shadow-[0_18px_55px_rgba(45,35,24,0.06)] backdrop-blur-md sm:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a98745]">
            About This Course
          </p>

          <h2
            className={`font-special mt-3 text-[42px] font-normal italic leading-none text-[#211e1a] sm:text-[52px]`}
          >
            Course Overview
          </h2>

          <p className="mt-6 whitespace-pre-line text-[15px] leading-8 text-[#685f56]">
            {course?.description ||
              course?.shortDescription ||
              "This course includes structured lessons designed to help you learn step by step."}
          </p>

          {learningPoints.length >
            0 && (
            <div className="mt-10">
              <h3
                className={`font-special text-[34px] font-medium italic text-[#211e1a]`}
              >
                What You Will Learn
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {learningPoints.map(
                  (
                    point,
                    index
                  ) => (
                    <div
                      key={`${point}-${index}`}
                      className="flex items-start gap-3 rounded-[18px] border border-[#eadfce] bg-[#f8f4ed] p-4"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#a98745]"
                      />

                      <p className="text-[13px] leading-6 text-[#5f554b]">
                        {point}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[30px] border border-[#e7dfd6] bg-[#211e1a] p-7 text-white shadow-[0_22px_65px_rgba(33,30,26,0.16)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d8b26e]">
            Course Includes
          </p>

          <div className="mt-6 space-y-4">
            <AsideItem
              icon={
                <Clock3
                  size={18}
                />
              }
              label="Duration"
              value={getDuration(
                course
              )}
            />

            <AsideItem
              icon={
                <BookOpen
                  size={18}
                />
              }
              label="Lessons"
              value={getLessons(
                course
              )}
            />

            <AsideItem
              icon={
                <GraduationCap
                  size={18}
                />
              }
              label="Access"
              value="Lifetime"
            />
          </div>

          <div className="mt-8 border-t border-white/12 pt-7">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">
              Course Price
            </p>

            <p className="mt-2 text-[32px] font-semibold">
              AED{" "}
              {Number(
                course?.price || 0
              ).toLocaleString()}
            </p>

            <button
              type="button"
              onClick={
                handleCourseAction
              }
              disabled={
                isCheckingAccess ||
                isRedirecting
              }
              className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-[#d8b26e] px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#211e1a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ActionIcon
                size={16}
                className={
                  isCheckingAccess ||
                  isRedirecting
                    ? "animate-spin"
                    : ""
                }
              />

              {actionText}
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoPill({
  icon,
  text,
}) {
  return (
    <span className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-md">
      <span className="text-[#d8b26e]">
        {icon}
      </span>

      {text}
    </span>
  );
}

function AsideItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-white/10 bg-white/5 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d8b26e]">
        {icon}
      </div>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/50">
          {label}
        </p>

        <p className="mt-1 text-[13px] font-medium text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function CourseDetailsLoading() {
  return (
    <main className="min-h-screen bg-[#f7f4ef]">
      <section className="bg-[#211e1a] px-5 pb-20 pt-32">
        <div className="mx-auto grid max-w-[1280px] animate-pulse gap-12 lg:grid-cols-2">
          <div>
            <div className="h-4 w-32 rounded bg-white/10" />

            <div className="mt-10 h-16 w-4/5 rounded bg-white/10" />

            <div className="mt-5 h-16 w-full rounded bg-white/10" />

            <div className="mt-8 h-5 w-full rounded bg-white/10" />

            <div className="mt-4 h-5 w-4/5 rounded bg-white/10" />

            <div className="mt-9 h-14 w-52 rounded-full bg-white/10" />
          </div>

          <div className="aspect-[4/3] rounded-[34px] bg-white/10" />
        </div>
      </section>
    </main>
  );
}