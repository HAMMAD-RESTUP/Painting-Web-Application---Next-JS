"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  PlayCircle,
  RefreshCw,
  Video,
} from "lucide-react";

import { useCourseVideos } from "../../../hooks/useCourseVideos";

const getResponseData = (response) => {
  return (
    response?.data?.data ||
    response?.data ||
    response ||
    {}
  );
};

const getCourseImage = (course) => {
  return (
    course?.thumbnail?.url ||
    course?.image?.url ||
    course?.thumbnail ||
    course?.image ||
    course?.imageUrl ||
    "/images/course-hero.png"
  );
};

const getCategoryName = (course) => {
  if (
    typeof course?.category === "object"
  ) {
    return (
      course?.category?.title ||
      course?.category?.name ||
      "Course"
    );
  }

  return course?.category || "Course";
};

const normalizeLesson = (
  lesson,
  index
) => ({
  id: String(
    lesson?._id ||
      lesson?.id ||
      `lesson-${index + 1}`
  ),

  title:
    lesson?.title ||
    `Lesson ${index + 1}`,

  description:
    lesson?.description || "",

  duration:
    lesson?.duration || "",

  type:
    lesson?.type || "Video",

  order: Number(
    lesson?.order ?? index + 1
  ),

  playbackId:
    lesson?.mux?.playbackId ||
    lesson?.playbackId ||
    lesson?.muxPlaybackId ||
    "",

  playbackStatus:
    lesson?.mux?.status ||
    lesson?.playbackStatus ||
    "",

  videoUrl:
    lesson?.videoUrl ||
    lesson?.url ||
    lesson?.video?.url ||
    "",
});

const getYoutubeEmbedUrl = (url) => {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname.includes(
        "youtu.be"
      )
    ) {
      const videoId =
        parsedUrl.pathname.replace(
          "/",
          ""
        );

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "";
    }

    if (
      parsedUrl.hostname.includes(
        "youtube.com"
      )
    ) {
      if (
        parsedUrl.pathname.startsWith(
          "/embed/"
        )
      ) {
        return url;
      }

      const videoId =
        parsedUrl.searchParams.get("v");

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "";
    }
  } catch {
    return "";
  }

  return "";
};

export default function LearningCoursePage() {
  const params = useParams();

  const courseId = Array.isArray(
    params?.id
  )
    ? params.id[0]
    : params?.id;

  const {
    data: videosResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourseVideos(courseId);

  const [
    activeLessonIndex,
    setActiveLessonIndex,
  ] = useState(0);

  const responseData = useMemo(() => {
    return getResponseData(
      videosResponse
    );
  }, [videosResponse]);

  const course = useMemo(() => {
    return (
      responseData?.course || {
        _id: courseId,
        title: "Course Learning",
      }
    );
  }, [responseData, courseId]);

  const lessons = useMemo(() => {
    const videos =
      responseData?.videos ||
      responseData?.lessons ||
      [];

    if (!Array.isArray(videos)) {
      return [];
    }

    return videos
      .map(normalizeLesson)
      .sort(
        (
          firstLesson,
          secondLesson
        ) =>
          firstLesson.order -
          secondLesson.order
      );
  }, [responseData]);

  const activeLesson =
    lessons[activeLessonIndex] ||
    null;

  const isFirstLesson =
    activeLessonIndex === 0;

  const isLastLesson =
    lessons.length > 0 &&
    activeLessonIndex ===
      lessons.length - 1;

  const progress = useMemo(() => {
    if (lessons.length === 0) {
      return 0;
    }

    return Math.round(
      ((activeLessonIndex + 1) /
        lessons.length) *
        100
    );
  }, [
    activeLessonIndex,
    lessons.length,
  ]);

  useEffect(() => {
    setActiveLessonIndex(0);
  }, [courseId]);

  useEffect(() => {
    if (
      lessons.length > 0 &&
      activeLessonIndex >=
        lessons.length
    ) {
      setActiveLessonIndex(
        lessons.length - 1
      );
    }
  }, [
    lessons.length,
    activeLessonIndex,
  ]);

  const goToNextLesson = () => {
    if (
      activeLessonIndex <
      lessons.length - 1
    ) {
      setActiveLessonIndex(
        (previousIndex) =>
          previousIndex + 1
      );
    }
  };

  const goToPreviousLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(
        (previousIndex) =>
          previousIndex - 1
      );
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <ErrorPage
        message={
          error?.response?.data
            ?.message ||
          error?.message ||
          "Course videos could not be loaded."
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#211e1a]">
      <header className="border-b border-[#e7dfd5] bg-[#faf8f4]">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <Link
              href="/courses/learning"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a715c] transition hover:text-[#211e1a]"
            >
              <ArrowLeft
                size={14}
              />

              My Courses
            </Link>

            <h1 className="mt-2 truncate text-[20px] font-semibold text-[#211e1a] sm:text-[22px]">
              {course?.title ||
                "Course Learning"}
            </h1>
          </div>

          {lessons.length > 0 && (
            <div className="w-full max-w-[280px]">
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#776d64]">
                  Lesson{" "}
                  {activeLessonIndex + 1}{" "}
                  of {lessons.length}
                </p>

                <span className="text-[11px] font-semibold text-[#a98745]">
                  {progress}%
                </span>
              </div>

              <div className="h-[5px] overflow-hidden rounded-full bg-[#e3ddd5]">
                <div
                  className="h-full rounded-full bg-[#a98745] transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="mx-auto grid max-w-[1380px] gap-7 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_350px] lg:px-8 lg:py-10">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-[22px] border border-[#e5ddd4] bg-white shadow-[0_14px_40px_rgba(45,35,24,0.06)]">
            <div className="relative aspect-video overflow-hidden bg-black">
              <LessonPlayer
                lesson={activeLesson}
                course={course}
              />
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-7">
              {lessons.length === 0 ? (
                <NoLessons />
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f7f1e9] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9b7943]">
                      {getCategoryName(
                        course
                      )}
                    </span>

                    {activeLesson
                      ?.duration && (
                      <InfoBadge
                        icon={
                          <Clock3
                            size={12}
                          />
                        }
                        text={
                          activeLesson.duration
                        }
                      />
                    )}

                    <InfoBadge
                      icon={
                        <Video
                          size={12}
                        />
                      }
                      text={
                        activeLesson?.type ||
                        "Video"
                      }
                    />
                  </div>

                  <h2
                    className={`font-special mt-4 text-[38px] font-medium leading-[1.05] text-[#211e1a] sm:text-[46px]`}
                  >
                    {
                      activeLesson?.title
                    }
                  </h2>

                  <p className="mt-4 max-w-3xl text-[14px] leading-7 text-[#70675f]">
                    {activeLesson
                      ?.description ||
                      "Watch the lesson carefully and continue when you are ready."}
                  </p>

                  <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#eee7df] pt-6">
                    <button
                      type="button"
                      onClick={
                        goToPreviousLesson
                      }
                      disabled={
                        isFirstLesson
                      }
                      className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#ddd4cb] bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#211e1a] transition hover:border-[#211e1a] hover:bg-[#211e1a] hover:text-white disabled:cursor-not-allowed disabled:border-[#e8e2dc] disabled:bg-[#f1ede8] disabled:text-[#aaa19a]"
                    >
                      <ArrowLeft
                        size={14}
                      />

                      Previous
                    </button>

                    <p className="hidden text-[11px] font-medium text-[#8a8178] sm:block">
                      Lesson{" "}
                      {activeLessonIndex +
                        1}{" "}
                      of {lessons.length}
                    </p>

                    {!isLastLesson ? (
                      <button
                        type="button"
                        onClick={
                          goToNextLesson
                        }
                        disabled={
                          !activeLesson
                        }
                        className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[#a98745] disabled:cursor-not-allowed disabled:bg-[#d8d2cb]"
                      >
                        Next Lesson

                        <ArrowRight
                          size={14}
                        />
                      </button>
                    ) : (
                      <div className="w-[120px]" />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <aside className="h-fit overflow-hidden rounded-[22px] border border-[#e5ddd4] bg-white lg:sticky lg:top-6">
          <div className="border-b border-[#eee7df] px-5 py-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a98745]">
              Course Content
            </p>

            <div className="mt-2 flex items-end justify-between gap-4">
              <h2
                className={`font-special text-[36px] font-medium leading-none text-[#211e1a]`}
              >
                Lessons
              </h2>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#7a7067]">
                <BookOpen
                  size={13}
                />

                {lessons.length}
              </span>
            </div>
          </div>

          {lessons.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Video
                size={29}
                className="mx-auto text-[#a98745]"
              />

              <p className="mt-4 text-[13px] leading-6 text-[#70675f]">
                Abhi koi lesson add
                nahi hui.
              </p>
            </div>
          ) : (
            <div className="max-h-[calc(100vh-230px)] overflow-y-auto p-2">
              {lessons.map(
                (lesson, index) => {
                  const isActive =
                    activeLesson?.id ===
                    lesson.id;

                  return (
                    <button
                      type="button"
                      key={lesson.id}
                      onClick={() =>
                        setActiveLessonIndex(
                          index
                        )
                      }
                      className={`group flex w-full items-start gap-3 rounded-[16px] px-3 py-3.5 text-left transition ${
                        isActive
                          ? "bg-[#f4eee6]"
                          : "hover:bg-[#faf7f2]"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition ${
                          isActive
                            ? "bg-[#211e1a] text-white"
                            : "bg-[#f1ece6] text-[#796f65] group-hover:bg-[#e8dfd5]"
                        }`}
                      >
                        {isActive ? (
                          <PlayCircle
                            size={16}
                          />
                        ) : (
                          index + 1
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[9px] font-semibold uppercase tracking-[0.14em] ${
                            isActive
                              ? "text-[#a98745]"
                              : "text-[#9b9188]"
                          }`}
                        >
                          Lesson{" "}
                          {index + 1}
                        </span>

                        <span className="mt-1 block text-[13px] font-semibold leading-5 text-[#292520]">
                          {lesson.title}
                        </span>

                        <span className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#81776e]">
                          <Video
                            size={11}
                          />

                          {lesson.duration ||
                            lesson.type ||
                            "Video"}
                        </span>
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

function LessonPlayer({
  lesson,
  course,
}) {
  if (lesson?.playbackId) {
    return (
      <MuxPlayer
        key={lesson.playbackId}
        playbackId={
          lesson.playbackId
        }
        metadata={{
          video_id: lesson.id,
          video_title:
            lesson.title,
        }}
        accentColor="#a98745"
        className="h-full w-full"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    );
  }

  const youtubeEmbedUrl =
    getYoutubeEmbedUrl(
      lesson?.videoUrl
    );

  if (youtubeEmbedUrl) {
    return (
      <iframe
        src={youtubeEmbedUrl}
        title={
          lesson?.title ||
          "Course video"
        }
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (lesson?.videoUrl) {
    return (
      <video
        key={lesson.videoUrl}
        src={lesson.videoUrl}
        className="h-full w-full bg-black object-contain"
        controls
        controlsList="nodownload"
        preload="metadata"
      >
        Your browser does not
        support this video.
      </video>
    );
  }

  const status =
    lesson?.playbackStatus
      ?.toLowerCase()
      ?.trim();

  const message = [
    "preparing",
    "processing",
    "waiting",
  ].includes(status)
    ? "Video is still processing."
    : lesson
    ? "Video playback is not available yet."
    : "Select a lesson to start watching.";

  return (
    <>
      <img
        src={getCourseImage(course)}
        alt={
          course?.title ||
          "Course"
        }
        className="h-full w-full object-cover opacity-45"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#211e1a] shadow-[0_14px_35px_rgba(0,0,0,0.24)]">
          <PlayCircle
            size={31}
            strokeWidth={1.5}
          />
        </div>

        <p className="mt-4 text-[13px] font-medium">
          {message}
        </p>
      </div>
    </>
  );
}

function NoLessons() {
  return (
    <div className="py-9 text-center">
      <Video
        size={32}
        className="mx-auto text-[#a98745]"
      />

      <h3
        className={`font-special mt-4 text-[36px] font-medium text-[#211e1a]`}
      >
        No Lessons Yet
      </h3>

      <p className="mt-3 text-[14px] text-[#70675f]">
        Admin panel se lessons add
        hone ke baad yahan show hongi.
      </p>
    </div>
  );
}

function ErrorPage({
  message,
  onRetry,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee6dc] text-[#a98745]">
          <Video size={29} />
        </div>

        <h1
          className={`font-special mt-5 text-[42px] font-medium text-[#211e1a]`}
        >
          Videos Could Not Load
        </h1>

        <p className="mt-4 text-[14px] leading-7 text-[#70675f]">
          {message}
        </p>

        <button
          type="button"
          onClick={() => onRetry()}
          className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#a98745]"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    </main>
  );
}

function InfoBadge({
  icon,
  text,
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3ed] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#665c53]">
      <span className="text-[#a98745]">
        {icon}
      </span>

      {text}
    </span>
  );
}

function LoadingPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef]">
      <div className="border-b border-[#e7dfd5] px-4 py-6">
        <div className="mx-auto h-12 max-w-[1380px] animate-pulse rounded-xl bg-[#e5dfd7]" />
      </div>

      <div className="mx-auto grid max-w-[1380px] animate-pulse gap-7 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div>
          <div className="aspect-video rounded-[22px] bg-[#ddd6ce]" />

          <div className="mt-4 h-56 rounded-[22px] bg-white/70" />
        </div>

        <div className="h-[570px] rounded-[22px] bg-white/70" />
      </div>
    </main>
  );
}