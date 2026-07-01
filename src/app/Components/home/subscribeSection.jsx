"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Mail,
} from "lucide-react";

export default function SubscribeSection() {
  const cardRef = useRef(null);
  const timeoutRef = useRef(null);

  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [glow, setGlow] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) return;

    /*
     * Newsletter API yahan connect karein:
     *
     * await fetch("/api/subscribe", {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *   },
     *   body: JSON.stringify({
     *     email: normalizedEmail,
     *   }),
     * });
     */

    setSubmitted(true);
    setEmail("");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  const handleCardMove = (event) => {
    if (
      !cardRef.current ||
      event.pointerType !== "mouse" ||
      typeof window === "undefined" ||
      window.innerWidth < 1024
    ) {
      return;
    }

    const rect =
      cardRef.current.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    setGlow({
      x,
      y,
    });
  };

  const handleCardLeave = () => {
    setGlow({
      x: 50,
      y: 50,
    });
  };

  return (
    <section
      id="subscribe"
      className="relative w-full overflow-hidden bg-[#f7f3ee] px-4 py-12 text-[#1e1e1c] sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-36 top-4 h-[280px] w-[280px] rounded-full bg-[#eadcc9]/80 blur-3xl sm:h-[380px] sm:w-[380px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[320px] w-[320px] rounded-full bg-[#ead8c2]/80 blur-3xl sm:h-[440px] sm:w-[440px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl sm:h-[460px] sm:w-[460px]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#cdbda8]/40 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        <motion.div
          ref={cardRef}
          onPointerMove={handleCardMove}
          onPointerLeave={handleCardLeave}
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 30,
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
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative isolate overflow-hidden rounded-[22px] border border-white/80 px-5 py-10 text-center shadow-[0_24px_80px_rgba(49,39,28,0.09)] backdrop-blur-xl sm:rounded-[28px] sm:px-10 sm:py-14 md:px-14 md:py-16 lg:rounded-[34px] lg:px-16 lg:py-20"
          style={{
            background: `
              radial-gradient(
                500px circle at ${glow.x}% ${glow.y}%,
                rgba(216, 176, 124, 0.18),
                transparent 55%
              ),
              rgba(255, 253, 249, 0.92)
            `,
          }}
        >
          {/* Card inner decoration */}
          <div className="pointer-events-none absolute inset-[6px] rounded-[17px] border border-[#d8b07c]/10 sm:inset-[8px] sm:rounded-[21px] lg:rounded-[27px]" />

          <div className="pointer-events-none absolute -left-20 -top-20 h-[220px] w-[220px] rounded-full border border-[#d8b07c]/10" />

          <div className="pointer-events-none absolute -bottom-24 -right-20 h-[260px] w-[260px] rounded-full border border-[#d8b07c]/10" />

          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d4b787]/45 to-transparent" />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={
                    shouldReduceMotion
                      ? {
                          opacity: 0,
                        }
                      : {
                          opacity: 0,
                          scale: 0.94,
                          y: 12,
                        }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex min-h-[280px] flex-col items-center justify-center py-6 sm:min-h-[320px]"
                  role="status"
                  aria-live="polite"
                >
                  <motion.div
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            scale: 0,
                            rotate: -10,
                          }
                    }
                    animate={{
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 360,
                      damping: 20,
                    }}
                    className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#b8955d]/20 bg-[#d8b07c]/20 text-[#80643a] shadow-[0_10px_30px_rgba(142,107,57,0.12)] sm:h-16 sm:w-16"
                  >
                    <Check
                      size={27}
                      strokeWidth={2}
                    />
                  </motion.div>

                  <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#ad8b50] sm:text-[10px]">
                    Subscription Confirmed
                  </p>

                  <h2 className="font-special text-[38px] font-normal italic leading-[0.94] tracking-[-0.045em] text-[#1b1814] sm:text-[52px] md:text-[60px]">
                    You&apos;re on the list
                  </h2>

                  <p className="mx-auto mt-4 max-w-[520px] text-[13px] leading-6 text-[#6a6259] sm:text-[15px] sm:leading-7">
                    Thank you. New artwork, studio
                    stories and thoughtful updates
                    are on their way.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <motion.div
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 10,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.08,
                    }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9c6a9]/50 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ad8b50]" />

                    <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#96743f] sm:text-[9px]">
                      Studio Newsletter
                    </span>
                  </motion.div>

                  <h2 className="font-special mx-auto max-w-[900px] text-[clamp(2.5rem,7vw,4.75rem)] font-normal italic leading-[0.91] tracking-[-0.055em] text-[#1b1814]">
                    Subscribe for thoughtful
                    <span className="block">
                      updates from Rakhshinda.
                    </span>
                  </h2>

                  <p className="mx-auto mt-5 max-w-[630px] px-1 text-[13px] leading-6 text-[#6a6259] sm:mt-6 sm:text-[15px] sm:leading-7 md:text-base">
                    Be the first to discover new
                    artwork, upcoming workshops and
                    creative stories from the studio.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="mx-auto mt-7 flex w-full max-w-[700px] flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-2"
                  >
                    <label className="relative block min-w-0 flex-1">
                      <span className="sr-only">
                        Email address
                      </span>

                      <Mail
                        size={17}
                        strokeWidth={1.6}
                        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9c9185] sm:left-5"
                      />

                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(
                            event.target.value
                          )
                        }
                        placeholder="Enter your email address"
                        autoComplete="email"
                        inputMode="email"
                        required
                        className="h-[54px] w-full rounded-full border border-[#d6cec3] bg-[#faf7f1]/90 pl-11 pr-4 text-[13px] text-[#29251f] outline-none transition duration-300 placeholder:text-[#a0978d] hover:border-[#c9b99f] focus:border-[#ad8b50] focus:bg-white focus:shadow-[0_0_0_4px_rgba(216,176,124,0.14)] sm:h-[58px] sm:pl-12 sm:text-[15px]"
                      />
                    </label>

                    <button
                      type="submit"
                      data-cursor-label="Join"
                      className="group flex h-[54px] shrink-0 items-center justify-center gap-3 rounded-full bg-[#1e1e1c] px-7 text-[9px] font-semibold uppercase tracking-[0.17em] text-white shadow-[0_10px_28px_rgba(30,30,28,0.16)] transition duration-300 hover:-translate-y-1 hover:bg-[#3a342d] hover:shadow-[0_16px_38px_rgba(30,30,28,0.24)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d8b07c]/30 sm:h-[58px] sm:px-10 sm:text-[10px] sm:tracking-[0.19em]"
                    >
                      Subscribe

                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.8}
                        className="shrink-0 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                      />
                    </button>
                  </form>

                  <div className="mx-auto mt-4 flex max-w-[620px] items-center justify-center gap-2">
                    <span className="hidden h-px w-6 bg-[#cbbda9] sm:block" />

                    <p className="text-[10px] leading-5 text-[#8b837a] sm:text-[11px]">
                      No spam, only occasional studio
                      updates. Unsubscribe at any time.
                    </p>

                    <span className="hidden h-px w-6 bg-[#cbbda9] sm:block" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}