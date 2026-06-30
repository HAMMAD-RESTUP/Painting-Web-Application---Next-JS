"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCcw,
  Clock3,
  LockKeyhole,
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
  if (typeof window === "undefined") {
    return "/courses/learning";
  }

  const params = new URLSearchParams(
    window.location.search
  );

  const redirect = params.get("redirect");

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

  useEffect(() => {
    if (
      step !== "code" ||
      secondsLeft <= 0
    ) {
      return undefined;
    }

    const timer = window.setInterval(
      () => {
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
      },
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [step, otpSession]);

  useEffect(() => {
    if (step !== "code") {
      return undefined;
    }

    const focusTimer =
      window.setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

    return () => {
      window.clearTimeout(
        focusTimer
      );
    };
  }, [step, otpSession]);

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
          /*
           * Backend HTTP-only cookie set karega.
           * Token localStorage mein save nahi hoga.
           */

          if (typeof window !== "undefined") {
            localStorage.setItem("art_store_authenticated", "true");
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
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap");

        :root {
          --page-background: #f5f1ec;
          --text-primary: #302b27;
          --text-secondary: #756e68;
          --accent: #927157;
          --accent-dark: #71533e;
          --accent-light: #f4ede7;
          --border: #ded3ca;
          --success: #287044;
          --success-background: #edf8f1;
          --error: #a44234;
          --error-background: #fff1ef;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        button,
        input {
          font-family: inherit;
        }

        .login-page {
          width: 100%;
          min-height: 100vh;
          padding: 48px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at top left,
              rgba(159, 121, 91, 0.13),
              transparent 34%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(92, 69, 52, 0.09),
              transparent 32%
            ),
            var(--page-background);
          color: var(--text-primary);
          font-family: "Jost", sans-serif;
        }

        .login-content {
          width: 100%;
          max-width: 470px;
        }

        .brand-section {
          margin-bottom: 34px;
          text-align: center;
        }

        .logo-link {
          display: inline-block;
          text-decoration: none;
        }

        .logo-wrapper {
          width: 200px;
          height: 95px;
          position: relative;
          margin: 0 auto 13px;
        }

        .brand-logo {
          object-fit: contain;
          object-position: center;
        }

        .brand-subtitle {
          width: fit-content;
          margin: 0 auto;
          padding: 7px 14px;
          border: 1px solid
            rgba(146, 113, 87, 0.2);
          border-radius: 999px;
          background:
            rgba(255, 255, 255, 0.42);
          color: var(--accent-dark);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }

        .back-link {
          width: fit-content;
          margin-bottom: 30px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition:
            color 160ms ease,
            transform 160ms ease;
        }

        .back-link:hover {
          color: var(--accent-dark);
          transform: translateX(-2px);
        }

        .form-heading {
          margin: 0;
          color: var(--text-primary);
          font-family:
            "Playfair Display",
            serif;
          font-size: 42px;
          font-weight: 600;
          line-height: 1.12;
          letter-spacing: -0.02em;
        }

        .form-description {
          max-width: 430px;
          margin: 14px 0 0;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.65;
        }

        .form-description strong {
          color: var(--text-primary);
          font-weight: 600;
          word-break: break-word;
        }

        .login-form {
          margin-top: 30px;
        }

        .field-group {
          margin-bottom: 19px;
        }

        .field-label {
          display: block;
          margin-bottom: 9px;
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          top: 50%;
          left: 17px;
          transform: translateY(-50%);
          color: #9c806a;
          pointer-events: none;
        }

        .email-input {
          width: 100%;
          height: 56px;
          padding: 0 17px 0 49px;
          border: 1px solid var(--border);
          border-radius: 12px;
          outline: none;
          background:
            rgba(255, 255, 255, 0.72);
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 500;
          backdrop-filter: blur(8px);
          transition:
            background 160ms ease,
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .email-input::placeholder {
          color: #aaa19a;
          font-weight: 400;
        }

        .email-input:hover:not(:disabled) {
          border-color: #c4af9d;
          background:
            rgba(255, 255, 255, 0.88);
        }

        .email-input:focus {
          border-color: var(--accent);
          background: #ffffff;
          box-shadow:
            0 0 0 4px
            rgba(146, 113, 87, 0.11);
        }

        .email-input:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .primary-button {
          width: 100%;
          height: 56px;
          border: none;
          border-radius: 12px;
          background: var(--text-primary);
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          transition:
            background 160ms ease,
            transform 160ms ease,
            box-shadow 160ms ease;
        }

        .primary-button:hover:not(:disabled) {
          background: #443d37;
          transform: translateY(-1px);
          box-shadow:
            0 12px 24px
            rgba(48, 43, 39, 0.16);
        }

        .primary-button:disabled {
          opacity: 0.58;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .otp-header {
          margin-bottom: 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .timer {
          padding: 7px 10px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background:
            rgba(255, 255, 255, 0.55);
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
        }

        .timer.expired {
          border-color: #edc8c2;
          background:
            var(--error-background);
          color: var(--error);
        }

        .otp-grid {
          display: grid;
          grid-template-columns:
            repeat(6, 1fr);
          gap: 8px;
        }

        .otp-input {
          width: 100%;
          height: 56px;
          padding: 0;
          border: 1px solid var(--border);
          border-radius: 11px;
          outline: none;
          background:
            rgba(255, 255, 255, 0.72);
          color: var(--text-primary);
          font-size: 21px;
          font-weight: 700;
          text-align: center;
          transition:
            background 160ms ease,
            border-color 160ms ease,
            box-shadow 160ms ease,
            transform 160ms ease;
        }

        .otp-input:hover:not(:disabled) {
          border-color: #c4af9d;
          background:
            rgba(255, 255, 255, 0.9);
        }

        .otp-input:focus {
          border-color: var(--accent);
          background: #ffffff;
          box-shadow:
            0 0 0 4px
            rgba(146, 113, 87, 0.11);
          transform: translateY(-1px);
        }

        .otp-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .secondary-actions {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .text-button {
          padding: 0;
          border: none;
          background: transparent;
          color: var(--accent);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 600;
          transition: color 160ms ease;
        }

        .text-button:hover:not(:disabled) {
          color: var(--accent-dark);
        }

        .text-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .alert {
          margin-top: 18px;
          padding: 13px 14px;
          border-radius: 11px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 13px;
          line-height: 1.5;
        }

        .success-alert {
          border: 1px solid #cce6d5;
          background:
            var(--success-background);
          color: var(--success);
        }

        .error-alert {
          border: 1px solid #efcac5;
          background:
            var(--error-background);
          color: var(--error);
        }

        .alert-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .register-note {
          margin: 25px 0 0;
          color: var(--text-secondary);
          font-size: 14px;
          text-align: center;
        }

        .register-link {
          color: var(--accent-dark);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: color 160ms ease;
        }

        .register-link:hover {
          color: var(--text-primary);
          text-decoration: underline;
        }

        .security-note {
          margin-top: 23px;
          padding-top: 20px;
          border-top: 1px solid
            rgba(146, 113, 87, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #8c8279;
          font-size: 12px;
          text-align: center;
        }

        .spin {
          animation:
            spin 0.85s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 560px) {
          .login-page {
            padding: 35px 22px;
            align-items: flex-start;
          }

          .login-content {
            max-width: 100%;
          }

          .logo-wrapper {
            width: 170px;
            height: 80px;
          }

          .brand-section {
            margin-bottom: 28px;
          }

          .back-link {
            margin-bottom: 25px;
          }

          .form-heading {
            font-size: 35px;
          }

          .otp-grid {
            gap: 6px;
          }

          .otp-input {
            height: 48px;
            border-radius: 9px;
            font-size: 18px;
          }

          .secondary-actions {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 380px) {
          .login-page {
            padding: 28px 16px;
          }

          .form-heading {
            font-size: 32px;
          }

          .otp-grid {
            gap: 4px;
          }

          .otp-input {
            height: 44px;
            font-size: 17px;
          }
        }
      `}</style>

      <main className="login-page">
        <div className="login-content">
          <div className="brand-section">
            <Link
              href="/"
              className="logo-link"
              aria-label="Rakhshinda Art Home"
            >
              <div className="logo-wrapper">
                <Image
                  src="/images/footer-logo.png"
                  alt="Rakhshinda Art Logo"
                  fill
                  priority
                  quality={100}
                  sizes="200px"
                  className="brand-logo"
                />
              </div>
            </Link>

            <p className="brand-subtitle">
              Creative Learning Portal
            </p>
          </div>

          <Link
            href="/"
            className="back-link"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          {step === "email" ? (
            <>
              <h1 className="form-heading">
                Welcome back
              </h1>

              <p className="form-description">
                Enter your registered email
                address. We will send you a
                secure OTP for verification.
              </p>

              <form
                className="login-form"
                onSubmit={
                  handleEmailSubmit
                }
                noValidate
              >
                <div className="field-group">
                  <label
                    className="field-label"
                    htmlFor="email"
                  >
                    Email address
                  </label>

                  <div className="input-wrapper">
                    <Mail
                      className="input-icon"
                      size={18}
                      strokeWidth={1.8}
                    />

                    <input
                      id="email"
                      type="email"
                      className="email-input"
                      placeholder="Enter your email address"
                      value={email}
                      autoComplete="email"
                      disabled={isBusy}
                      onChange={(event) => {
                        setEmail(
                          event.target
                            .value
                        );

                        setError("");
                        setMessage("");
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2
                        size={18}
                        className="spin"
                      />

                      Sending OTP
                    </>
                  ) : (
                    <>
                      Continue

                      <ArrowRight
                        size={18}
                      />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="form-heading">
                Enter your OTP
              </h1>

              <p className="form-description">
                We sent a 6-digit
                verification code to{" "}

                <strong>
                  {email}
                </strong>
                .
              </p>

              <form
                className="login-form"
                onSubmit={
                  handleCodeSubmit
                }
              >
                <div className="field-group">
                  <div className="otp-header">
                    <label
                      className="field-label"
                      style={{
                        marginBottom: 0,
                      }}
                    >
                      Verification code
                    </label>

                    <div
                      className={`timer ${
                        isExpired
                          ? "expired"
                          : ""
                      }`}
                    >
                      <Clock3 size={14} />

                      {isExpired
                        ? "Expired"
                        : formatTime(
                            secondsLeft
                          )}
                    </div>
                  </div>

                  <div
                    className="otp-grid"
                    onPaste={
                      handleOtpPaste
                    }
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
                          className="otp-input"
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
                        />
                      )
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    isVerifyingOtp ||
                    isExpired ||
                    code.length !==
                      OTP_LENGTH
                  }
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2
                        size={18}
                        className="spin"
                      />

                      Verifying
                    </>
                  ) : (
                    <>
                      Verify and continue

                      <ArrowRight
                        size={18}
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="secondary-actions">
                <button
                  type="button"
                  className="text-button"
                  disabled={isBusy}
                  onClick={
                    handleChangeEmail
                  }
                >
                  <ArrowLeft size={15} />

                  Change email
                </button>

                <button
                  type="button"
                  className="text-button"
                  onClick={
                    handleResendCode
                  }
                  disabled={isSendingOtp}
                >
                  <RefreshCcw
                    size={15}
                    className={
                      isSendingOtp
                        ? "spin"
                        : ""
                    }
                  />

                  {isSendingOtp
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              </div>
            </>
          )}

          <div aria-live="polite">
            {message && (
              <div className="alert success-alert">
                <CheckCircle2
                  size={18}
                  className="alert-icon"
                />

                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="alert error-alert">
                <AlertCircle
                  size={18}
                  className="alert-icon"
                />

                <span>{error}</span>
              </div>
            )}
          </div>

          {step === "email" && (
            <p className="register-note">
              Don&apos;t have an
              account?{" "}

              <Link
                href="/register"
                className="register-link"
              >
                Create account
              </Link>
            </p>
          )}

          <div className="security-note">
            <LockKeyhole size={15} />

            Your account is protected
            with secure email
            verification.
          </div>
        </div>
      </main>
    </>
  );
}