"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  LockKeyhole,
  Mail,
  RefreshCcw,
} from "lucide-react";

import {
  useLogin,
  useLoginVerifyOtp,
} from "../hooks/useAuth";

const OTP_LENGTH = 6;
const OTP_DURATION = 300;

const createEmptyOtp = () =>
  Array(OTP_LENGTH).fill("");

const getErrorMessage = (
  error,
  fallbackMessage
) => {
  return (
    error?.userMessage ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
};

export default function LoginPage() {
  const router = useRouter();
  const inputRefs = useRef([]);

  const loginMutation = useLogin();

  const verifyLoginOtpMutation =
    useLoginVerifyOtp();

  const [step, setStep] =
    useState("email");

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState(createEmptyOtp);

  const [secondsLeft, setSecondsLeft] =
    useState(OTP_DURATION);

  const [otpSession, setOtpSession] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const code = otp.join("");

  const isExpired =
    secondsLeft <= 0;

  const isSendingOtp =
    loginMutation.isPending;

  const isVerifyingOtp =
    verifyLoginOtpMutation.isPending;

  const isBusy =
    isSendingOtp ||
    isVerifyingOtp;

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const getRedirectPath = () => {
    if (
      typeof window === "undefined"
    ) {
      return "/courses/learning";
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const redirect =
      params.get("redirect");

    if (
      redirect &&
      redirect.startsWith("/") &&
      !redirect.startsWith("//")
    ) {
      return redirect;
    }

    return "/courses/learning";
  };

  const resetOtp = () => {
    setOtp(createEmptyOtp());
    setSecondsLeft(OTP_DURATION);

    setOtpSession(
      (previousSession) =>
        previousSession + 1
    );

    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | OTP Timer
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      step !== "code" ||
      secondsLeft <= 0
    ) {
      return undefined;
    }

    const timer =
      window.setInterval(() => {
        setSecondsLeft(
          (previousSeconds) => {
            if (
              previousSeconds <= 1
            ) {
              window.clearInterval(
                timer
              );

              setError(
                "OTP expired. Please resend OTP."
              );

              return 0;
            }

            return (
              previousSeconds - 1
            );
          }
        );
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [step, otpSession]);

  /*
  |--------------------------------------------------------------------------
  | Focus First OTP Input
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (step !== "code") {
      return undefined;
    }

    const focusTimer =
      window.setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 120);

    return () => {
      window.clearTimeout(
        focusTimer
      );
    };
  }, [step, otpSession]);

  /*
  |--------------------------------------------------------------------------
  | Email Submit
  |--------------------------------------------------------------------------
  */

  const handleEmailSubmit = (
    event
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "Please enter your email address."
      );

      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(cleanEmail)
    ) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    loginMutation.mutate(
      {
        email: cleanEmail,
      },
      {
        onSuccess: (response) => {
          setEmail(cleanEmail);
          setStep("code");
          resetOtp();

          setMessage(
            response?.message ||
              "OTP has been sent to your email."
          );
        },

        onError: (
          requestError
        ) => {
          setError(
            getErrorMessage(
              requestError,
              "Unable to send OTP. Please try again."
            )
          );
        },
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | OTP Input
  |--------------------------------------------------------------------------
  */

  const handleOtpChange = (
    index,
    value
  ) => {
    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    const updatedOtp = [...otp];

    updatedOtp[index] = digit;

    setOtp(updatedOtp);
    setError("");
    setMessage("");

    if (
      digit &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index,
    event
  ) => {
    if (
      event.key === "Backspace"
    ) {
      if (otp[index]) {
        const updatedOtp = [
          ...otp,
        ];

        updatedOtp[index] = "";

        setOtp(updatedOtp);

        return;
      }

      if (index > 0) {
        const updatedOtp = [
          ...otp,
        ];

        updatedOtp[index - 1] =
          "";

        setOtp(updatedOtp);

        inputRefs.current[
          index - 1
        ]?.focus();
      }
    }

    if (
      event.key ===
        "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key ===
        "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handleOtpPaste = (
    event
  ) => {
    event.preventDefault();

    const pastedValue =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, OTP_LENGTH);

    if (!pastedValue) {
      return;
    }

    const updatedOtp =
      createEmptyOtp();

    pastedValue
      .split("")
      .forEach(
        (digit, index) => {
          updatedOtp[index] =
            digit;
        }
      );

    setOtp(updatedOtp);
    setError("");
    setMessage("");

    const focusIndex =
      Math.min(
        pastedValue.length,
        OTP_LENGTH
      ) - 1;

    inputRefs.current[
      focusIndex
    ]?.focus();
  };

  /*
  |--------------------------------------------------------------------------
  | Verify OTP
  |--------------------------------------------------------------------------
  */

  const handleCodeSubmit = (
    event
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (isExpired) {
      setError(
        "OTP expired. Please resend OTP."
      );

      return;
    }

    if (
      code.length !== OTP_LENGTH
    ) {
      setError(
        "Please enter the complete 6-digit OTP."
      );

      return;
    }

    verifyLoginOtpMutation.mutate(
      {
        email,
        otp: code,
      },
      {
        onSuccess: () => {
          if (
            typeof window !==
            "undefined"
          ) {
            localStorage.setItem(
              "art_store_authenticated",
              "true"
            );
          }

          const redirectPath =
            getRedirectPath();

          router.replace(
            redirectPath
          );

          router.refresh();
        },

        onError: (
          requestError
        ) => {
          setError(
            getErrorMessage(
              requestError,
              "Invalid or expired OTP."
            )
          );
        },
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Resend OTP
  |--------------------------------------------------------------------------
  */

  const handleResendCode = () => {
    setError("");
    setMessage("");

    if (!email) {
      setStep("email");

      setError(
        "Email is missing. Please enter your email again."
      );

      return;
    }

    loginMutation.mutate(
      {
        email,
      },
      {
        onSuccess: (response) => {
          resetOtp();

          setMessage(
            response?.message ||
              "A new OTP has been sent to your email."
          );
        },

        onError: (
          requestError
        ) => {
          setError(
            getErrorMessage(
              requestError,
              "Unable to resend OTP. Please try again."
            )
          );
        },
      }
    );
  };

  const handleChangeEmail = () => {
    setStep("email");
    setEmail("");
    setOtp(createEmptyOtp());
    setSecondsLeft(OTP_DURATION);
    setMessage("");
    setError("");
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f6f1eb] px-5 py-10 text-[#29241f] sm:px-8 sm:py-14">
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#dfcbb8]/28 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-44 -right-40 h-[460px] w-[460px] rounded-full bg-[#c8a98d]/18 blur-3xl" />

      <div className="relative z-10 w-full max-w-[470px]">
        {/* Logo */}
        <div className="mb-7 text-center sm:mb-9">
          <Link
            href="/"
            aria-label="Rakhshinda Art Home"
            className="inline-block"
          >
            <div className="relative mx-auto h-[82px] w-[185px] sm:h-[92px] sm:w-[205px]">
              <Image
                src="/images/logo.png"
                alt="Rakhshinda Art"
                fill
                priority
                quality={100}
                sizes="205px"
                className="object-contain"
              />
            </div>
          </Link>

          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-[#b18b69]" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.27em] text-[#9a7658]">
              Creative Learning Portal
            </p>

            <span className="h-px w-7 bg-[#b18b69]" />
          </div>
        </div>

        {/* Back link */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#766d65] transition hover:text-[#8c684d]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back home
          </Link>

          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#aa9b8f]">
            {step === "email"
              ? "Step 01 / 02"
              : "Step 02 / 02"}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.section
              key="email-step"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.35,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <h1 className="font-special text-[46px] font-normal italic leading-[0.92] tracking-[-0.045em] text-[#211d19] sm:text-[57px]">
                Welcome back
              </h1>

              <p className="mt-5 max-w-[430px] text-[14px] leading-7 text-[#756c64] sm:text-[15px]">
                Enter your registered email
                address and we will send you a
                secure six-digit verification
                code.
              </p>

              <form
                onSubmit={handleEmailSubmit}
                noValidate
                className="mt-8"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.13em] text-[#403933]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9c8069]"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      autoFocus
                      autoComplete="email"
                      disabled={isBusy}
                      placeholder="Enter your email address"
                      onChange={(event) => {
                        setEmail(
                          event.target.value
                        );

                        setError("");
                        setMessage("");
                      }}
                      className="h-[56px] w-full rounded-[5px] border border-[#d7cbc0] bg-white/65 pl-12 pr-4 text-[14px] font-medium text-[#29241f] outline-none backdrop-blur-sm transition placeholder:font-normal placeholder:text-[#aaa099] hover:border-[#bca58f] hover:bg-white/80 focus:border-[#957054] focus:bg-white focus:shadow-[0_0_0_4px_rgba(149,112,84,0.10)] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="group mt-5 inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[5px] border border-[#29241f] bg-[#29241f] px-6 text-[11px] font-semibold uppercase tracking-[0.17em] text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#9a7658] hover:bg-[#9a7658] hover:shadow-[0_14px_30px_rgba(79,57,40,0.17)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Sending OTP
                    </>
                  ) : (
                    <>
                      Continue

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-[13px] text-[#776e66]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#8b664b] transition hover:text-[#29241f] hover:underline"
                >
                  Create account
                </Link>
              </p>
            </motion.section>
          ) : (
            <motion.section
              key="otp-step"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.35,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <h1 className="font-special text-[44px] font-normal italic leading-[0.92] tracking-[-0.045em] text-[#211d19] sm:text-[55px]">
                Verify your email
              </h1>

              <p className="mt-5 text-[14px] leading-7 text-[#756c64] sm:text-[15px]">
                We sent a six-digit
                verification code to{" "}

                <strong className="break-all font-semibold text-[#29241f]">
                  {email}
                </strong>
                .
              </p>

              <form
                className="mt-8"
                onSubmit={handleCodeSubmit}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#403933]">
                    Verification code
                  </label>

                  <div
                    className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-[4px] border px-3 text-[11px] font-semibold ${
                      isExpired
                        ? "border-[#e7bdb7] bg-[#fff0ed] text-[#a44234]"
                        : "border-[#d7cbc0] bg-white/55 text-[#937055]"
                    }`}
                  >
                    <Clock3
                      size={13}
                      strokeWidth={1.8}
                    />

                    {isExpired
                      ? "Expired"
                      : formatTime(
                          secondsLeft
                        )}
                  </div>
                </div>

                <div
                  className="grid grid-cols-6 gap-1.5 sm:gap-2"
                  onPaste={handleOtpPaste}
                >
                  {otp.map(
                    (
                      digit,
                      index
                    ) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[
                            index
                          ] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={
                          index === 0
                            ? "one-time-code"
                            : "off"
                        }
                        maxLength={1}
                        value={digit}
                        disabled={
                          isExpired ||
                          isVerifyingOtp
                        }
                        aria-label={`OTP digit ${
                          index + 1
                        }`}
                        onChange={(event) =>
                          handleOtpChange(
                            index,
                            event.target
                              .value
                          )
                        }
                        onKeyDown={(event) =>
                          handleOtpKeyDown(
                            index,
                            event
                          )
                        }
                        className="h-[49px] min-w-0 rounded-[5px] border border-[#d7cbc0] bg-white/65 p-0 text-center text-[19px] font-bold text-[#29241f] outline-none backdrop-blur-sm transition hover:border-[#bca58f] hover:bg-white/80 focus:-translate-y-0.5 focus:border-[#957054] focus:bg-white focus:shadow-[0_0_0_3px_rgba(149,112,84,0.10)] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[56px] sm:text-[21px]"
                      />
                    )
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    isVerifyingOtp ||
                    isExpired ||
                    code.length !==
                      OTP_LENGTH
                  }
                  className="group mt-5 inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[5px] border border-[#29241f] bg-[#29241f] px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#9a7658] hover:bg-[#9a7658] hover:shadow-[0_14px_30px_rgba(79,57,40,0.17)] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Verifying
                    </>
                  ) : (
                    <>
                      Verify and continue

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 flex flex-col gap-3 border-t border-[#dfd4ca] pt-5 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={
                    handleChangeEmail
                  }
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#87654c] transition hover:text-[#29241f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={14} />

                  Change email
                </button>

                <button
                  type="button"
                  onClick={
                    handleResendCode
                  }
                  disabled={isSendingOtp}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#87654c] transition hover:text-[#29241f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCcw
                    size={14}
                    className={
                      isSendingOtp
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {isSendingOtp
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Alerts */}
        <div
          aria-live="polite"
          className="mt-5"
        >
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                key={`success-${message}`}
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                className="flex items-start gap-3 rounded-[5px] border border-[#c8e2d1] bg-[#eef8f1] px-4 py-3.5 text-[12px] leading-5 text-[#287044]"
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>{message}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                key={`error-${error}`}
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                className="flex items-start gap-3 rounded-[5px] border border-[#edc8c2] bg-[#fff1ef] px-4 py-3.5 text-[12px] leading-5 text-[#a44234]"
              >
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security note */}
        <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#ded3c9] pt-6 text-center text-[11px] leading-5 text-[#8a8077]">
          <LockKeyhole
            size={14}
            strokeWidth={1.7}
          />

          Your account is protected with
          secure email verification.
        </div>
      </div>
    </main>
  );
}