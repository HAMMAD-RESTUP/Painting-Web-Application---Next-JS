"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    LockKeyhole,
    PlayCircle,
    ShoppingBag,
    Video,
} from "lucide-react";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
});

function createDefaultLessons(course) {
    const courseId = course?.id || "course";

    return [
        {
            id: `${courseId}-lesson-01`,
            title: "Course Introduction",
            duration: "05:20",
            type: "Video",
            videoUrl:"https://www.youtube.com/embed/hTThbxGPinY?si=YBiU9piiKlCqfHCr",
        },
        {
            id: `${courseId}-lesson-02`,
            title: "Materials & Setup",
            duration: "08:45",
            type: "Video",
            videoUrl: "https://youtu.be/xB28DYQHXEE?si=MQut0MsfG9sifQtc",
        },
        {
            id: `${courseId}-lesson-03`,
            title: "Step by Step Practice",
            duration: "14:30",
            type: "Video",
            videoUrl: "https://youtu.be/wCVbUFO-Kno?si=4ovdBQdoJEy85jZ2",
        },
        {
            id: `${courseId}-lesson-04`,
            title: "Final Guided Session",
            duration: "18:10",
            type: "Video",
            videoUrl: "https://youtu.be/AWPbkJi75tU?si=4eXV5v_ykBmZZZDi",
        },
    ];
}

export default function LearningCoursePage() {
    const params = useParams();
    const courseId = params?.id;

    const [mounted, setMounted] = useState(false);
    const [course, setCourse] = useState(null);
    const [activeLessonIndex, setActiveLessonIndex] = useState(0);
    const [completedLessons, setCompletedLessons] = useState([]);

    useEffect(() => {
        setMounted(true);

        try {
            const purchasedCourses = JSON.parse(
                localStorage.getItem("purchasedCourses") || "[]"
            );

            const selectedCourse = purchasedCourses.find(
                (item) => String(item.id) === String(courseId)
            );

            if (!selectedCourse) {
                setCourse(null);
                return;
            }

            const courseWithLessons = {
                ...selectedCourse,
                lessons:
                    Array.isArray(selectedCourse.lessons) &&
                        selectedCourse.lessons.length > 0
                        ? selectedCourse.lessons
                        : createDefaultLessons(selectedCourse),
            };

            setCourse(courseWithLessons);

            const savedCompleted = JSON.parse(
                localStorage.getItem(`completedLessons-${courseId}`) || "[]"
            );

            setCompletedLessons(Array.isArray(savedCompleted) ? savedCompleted : []);
        } catch {
            setCourse(null);
            setCompletedLessons([]);
        }
    }, [courseId]);

    const activeLesson = useMemo(() => {
        if (!course?.lessons?.length) return null;
        return course.lessons[activeLessonIndex];
    }, [course, activeLessonIndex]);

    const progress = useMemo(() => {
        if (!course?.lessons?.length) return 0;
        return Math.round((completedLessons.length / course.lessons.length) * 100);
    }, [course, completedLessons]);

    const saveCompletedLessons = (lessons) => {
        setCompletedLessons(lessons);
        localStorage.setItem(
            `completedLessons-${courseId}`,
            JSON.stringify(lessons)
        );
    };

    const markLessonComplete = () => {
        if (!activeLesson) return;
        if (completedLessons.includes(activeLesson.id)) return;

        const updatedLessons = [...completedLessons, activeLesson.id];
        saveCompletedLessons(updatedLessons);
    };

    const goToNextLesson = () => {
        markLessonComplete();

        if (activeLessonIndex < course.lessons.length - 1) {
            setActiveLessonIndex((prev) => prev + 1);
        }
    };

    const goToPreviousLesson = () => {
        if (activeLessonIndex > 0) {
            setActiveLessonIndex((prev) => prev - 1);
        }
    };

    if (!mounted) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] text-[#1e1e1c]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#a98745] border-t-transparent" />
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#685f56]">
                        Loading Course
                    </p>
                </div>
            </main>
        );
    }

    if (!course) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 text-[#1e1e1c]">
                <div className="max-w-xl rounded-[34px] border border-[#e8e2d7] bg-white/80 p-9 text-center shadow-[0_22px_65px_rgba(45,35,24,0.08)] backdrop-blur-md">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f4ed] text-[#a98745]">
                        <LockKeyhole size={34} strokeWidth={1.5} />
                    </div>

                    <h1
                        className={`${cormorant.className} mt-6 text-[48px] font-normal italic leading-none text-[#211e1a]`}
                    >
                        Course Access Required
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-[14px] leading-7 text-[#6c635a]">
                        Ye course purchasedCourses mein nahi mila. Pehle course buy ya login
                        access complete karo.
                    </p>

                    <Link
                        href="/courses"
                        className="mt-7 inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-[#211e1a] px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#a98745]"
                    >
                        Buy Course
                        <ShoppingBag size={15} />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f4ef] text-[#1e1e1c]">
            <section className="border-b border-[#e8e2d7] bg-white/75 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <div>
                        <Link
                            href="/course/learning"
                            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a715c] transition hover:text-[#1e1e1c]"
                        >
                            <ArrowLeft size={14} />
                            Back To My Courses
                        </Link>

                        <h1 className="mt-2 text-[18px] font-semibold text-[#211e1a]">
                            {course.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#f8f4ed] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6c635a]">
                            Progress {progress}%
                        </div>

                        <div className="h-2 w-36 overflow-hidden rounded-full bg-[#e5ddd5]">
                            <div
                                className="h-full rounded-full bg-[#a98745] transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-[1400px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_390px] lg:px-8">
                <div className="min-w-0">
                    <div className="overflow-hidden rounded-[30px] border border-[#e8e2d7] bg-white shadow-[0_18px_55px_rgba(45,35,24,0.07)]">
                        <div className="relative aspect-video overflow-hidden bg-black">
                            {activeLesson?.videoUrl ? (
                                <iframe
                                    src={activeLesson.videoUrl}
                                    title={activeLesson.title}
                                    className="h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <>
                                    <img
                                        src={course.image || "/images/course-hero.png"}
                                        alt={course.title}
                                        className="h-full w-full object-cover opacity-55"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                                    <button
                                        type="button"
                                        className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#211e1a] shadow-[0_18px_45px_rgba(0,0,0,0.25)]"
                                    >
                                        <PlayCircle size={38} strokeWidth={1.5} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="p-5 sm:p-7">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a98745]">
                                        {course.category || "Course"}
                                    </p>

                                    <h3
                                        className={`${cormorant.className} mt-2 text-[42px] font-normal italic leading-none text-[#211e1a]`}
                                    >
                                        {activeLesson?.title}
                                    </h3>

                                    <p className="mt-4 max-w-2xl text-[14px] leading-7 text-[#6c635a]">
                                        Video lesson dekh kar complete mark karo. Next lesson par
                                        click karne se next video open ho jayegi.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={markLessonComplete}
                                    className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#211e1a] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-1 hover:bg-[#a98745]"
                                >
                                    <CheckCircle2 size={15} />
                                    Mark Complete
                                </button>
                            </div>

                            <div className="mt-7 flex flex-col gap-3 border-t border-[#eee6dc] pt-6 sm:flex-row sm:justify-between">
                                <button
                                    type="button"
                                    onClick={goToPreviousLesson}
                                    disabled={activeLessonIndex === 0}
                                    className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${activeLessonIndex === 0
                                            ? "cursor-not-allowed bg-[#e2ddd7] text-white"
                                            : "bg-white text-[#211e1a] hover:bg-[#211e1a] hover:text-white"
                                        }`}
                                >
                                    <ArrowLeft size={15} />
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    onClick={goToNextLesson}
                                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-1 hover:bg-[#a98745]"
                                >
                                    {activeLessonIndex === course.lessons.length - 1
                                        ? "Finish Course"
                                        : "Next Lesson"}
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="h-fit rounded-[30px] border border-[#e8e2d7] bg-white/80 p-5 shadow-[0_18px_55px_rgba(45,35,24,0.07)] backdrop-blur-md lg:sticky lg:top-24">
                    <div className="mb-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a98745]">
                            Course Content
                        </p>

                        <h2
                            className={`${cormorant.className} mt-2 text-[38px] font-normal italic leading-none text-[#211e1a]`}
                        >
                            Lessons
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {course.duration && (
                                <InfoBadge icon={<Clock3 size={12} />} text={course.duration} />
                            )}

                            {course.lectures && (
                                <InfoBadge
                                    icon={<BookOpen size={12} />}
                                    text={course.lectures}
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {course.lessons.map((lesson, index) => {
                            const isActive = activeLesson?.id === lesson.id;
                            const isCompleted = completedLessons.includes(lesson.id);

                            return (
                                <button
                                    type="button"
                                    key={lesson.id}
                                    onClick={() => setActiveLessonIndex(index)}
                                    className={`w-full rounded-[20px] border p-4 text-left transition ${isActive
                                            ? "border-[#a98745] bg-[#f8f4ed]"
                                            : "border-[#eee6dc] bg-white hover:border-[#d8cbbd] hover:bg-[#fbf7f0]"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isCompleted
                                                    ? "bg-[#a98745] text-white"
                                                    : isActive
                                                        ? "bg-[#211e1a] text-white"
                                                        : "bg-[#f8f4ed] text-[#8b7d70]"
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 size={16} />
                                            ) : (
                                                <Video size={15} />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a98745]">
                                                Lesson {index + 1}
                                            </p>

                                            <h3 className="mt-1 text-[13px] font-semibold leading-5 text-[#211e1a]">
                                                {lesson.title}
                                            </h3>

                                            <p className="mt-2 text-[11px] text-[#7a7067]">
                                                {lesson.duration} · {lesson.type}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </section>
        </main>
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