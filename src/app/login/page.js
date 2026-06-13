"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Paintbrush,
  ArrowLeft,
  RefreshCcw,
  Clock3,
} from "lucide-react";
import { useLogin, useLoginVerifyOtp } from "../hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const inputRefs = useRef([]);

  const loginMutation = useLogin();
  const verifyLoginOtpMutation = useLoginVerifyOtp();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const code = otp.join("");
  const isExpired = secondsLeft <= 0;

  const isSendingOtp = loginMutation.isPending;
  const isVerifyingOtp = verifyLoginOtpMutation.isPending;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getRedirectPath = () => {
    if (typeof window === "undefined") return "/courses/learning";

    const params = new URLSearchParams(window.location.search);

    const redirect = params.get("redirect");
    const courseId = params.get("courseId") || params.get("id");

    if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
      return redirect;
    }

    if (courseId) {
      return `/courses/learning/${courseId}`;
    }

    return "/courses/learning";
  };

  const addDemoLearningAccess = () => {
    const existingCourses = JSON.parse(
      localStorage.getItem("purchasedCourses") || "[]"
    );

    if (Array.isArray(existingCourses) && existingCourses.length > 0) {
      return;
    }

    const demoCourse = {
      id: "demo-course-id",
      title: "Demo Guided Art Course",
      category: "Rakhshinda Art",
      image: "/images/course-hero.png",
      duration: "4 Weeks",
      lectures: "8 Lectures",
      learningUrl: "/courses/learning/demo-course-id",
      purchasedAt: new Date().toISOString(),
    };

    localStorage.setItem("purchasedCourses", JSON.stringify([demoCourse]));
  };

  useEffect(() => {
    if (step !== "code") return;
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setError("OTP expired. Please resend OTP.");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, secondsLeft]);

  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const resetOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setSecondsLeft(300);
    setError("");
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    loginMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          setStep("code");
          resetOtp();
          setMessage(data?.message || "OTP has been sent to your email.");
        },
        onError: (error) => {
          setError(
            error?.response?.data?.message ||
              "Login failed. Please check your email."
          );
        },
      }
    );
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);
    setError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updatedOtp = [...otp];
        updatedOtp[index] = "";
        setOtp(updatedOtp);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();

        const updatedOtp = [...otp];
        updatedOtp[index - 1] = "";
        setOtp(updatedOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const updatedOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const focusIndex = Math.min(pastedValue.length, 6) - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (isExpired) {
      setError("OTP expired. Please resend OTP.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter complete 6 digit OTP.");
      return;
    }

    verifyLoginOtpMutation.mutate(
      {
        email,
        otp: code,
      },
      {
        onSuccess: (data) => {
          const redirectPath = getRedirectPath();

          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("loggedInEmail", email);
          localStorage.setItem("loginTime", new Date().toISOString());

          const token = data?.token || data?.accessToken;

          if (token) {
            localStorage.setItem("token", token);
          }

          if (data?.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }

          if (redirectPath.startsWith("/courses/learning")) {
            addDemoLearningAccess();
          }

          router.push(redirectPath);
        },
        onError: (error) => {
          setError(error?.response?.data?.message || "Invalid or expired OTP.");
        },
      }
    );
  };

  const handleResendCode = () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is missing. Please enter email again.");
      setStep("email");
      return;
    }

    loginMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          resetOtp();
          setMessage(data?.message || "A new OTP has been sent.");

          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 100);
        },
        onError: (error) => {
          setError(error?.response?.data?.message || "Could not resend OTP.");
        },
      }
    );
  };

  const handleChangeEmail = () => {
    setStep("email");
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setSecondsLeft(300);
    setError("");
    setMessage("");
  };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap");

        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(168, 135, 109, 0.22), transparent 34%),
            radial-gradient(circle at bottom right, rgba(41, 39, 36, 0.12), transparent 34%),
            linear-gradient(135deg, #fbfaf8 0%, #f4eee7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 18px;
          font-family: "Jost", sans-serif;
          color: #292724;
        }

        .login-shell {
          width: 100%;
          max-width: 1080px;
          min-height: 640px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(235, 231, 226, 0.95);
          border-radius: 34px;
          overflow: hidden;
          box-shadow: 0 34px 90px rgba(41, 39, 36, 0.14);
          backdrop-filter: blur(18px);
        }

        .login-art {
          position: relative;
          padding: 46px;
          background:
            linear-gradient(160deg, rgba(41, 39, 36, 0.84), rgba(90, 70, 54, 0.76)),
            url("/images/course-hero.png");
          background-size: cover;
          background-position: center;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .login-art::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(20, 18, 16, 0.48), transparent 55%);
          pointer-events: none;
        }

        .brand-box,
        .art-content {
          position: relative;
          z-index: 2;
        }

        .brand-box {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(8px);
        }

        .brand-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          line-height: 1;
        }

        .brand-subtitle {
          margin: 7px 0 0;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.46em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.76);
        }

        .art-badge {
          width: fit-content;
          padding: 9px 13px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.86);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }

        .art-content h1 {
          max-width: 430px;
          margin: 22px 0 0;
          font-family: "Playfair Display", serif;
          font-size: 50px;
          font-weight: 400;
          line-height: 1.04;
        }

        .art-content p {
          max-width: 390px;
          margin: 18px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 15px;
          line-height: 1.8;
        }

        .login-form-area {
          padding: 54px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.74));
        }

        .back-home {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 28px;
          color: #8a7767;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 180ms ease, transform 180ms ease;
        }

        .back-home:hover {
          color: #292724;
          transform: translateX(-2px);
        }

        .step-pill {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f6f1eb;
          color: #9a7657;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .login-heading {
          margin: 18px 0 0;
          font-family: "Playfair Display", serif;
          font-size: 42px;
          font-weight: 500;
          line-height: 1.1;
          color: #292724;
        }

        .login-text {
          margin: 14px 0 0;
          max-width: 430px;
          color: #756e68;
          font-size: 15px;
          line-height: 1.75;
        }

        .login-text strong {
          color: #292724;
        }

        .login-form {
          margin-top: 30px;
        }

        .input-group {
          margin-bottom: 16px;
        }

        .input-label {
          display: block;
          margin-bottom: 9px;
          color: #292724;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .input-box {
          position: relative;
        }

        .input-icon {
          position: absolute;
          top: 50%;
          left: 17px;
          transform: translateY(-50%);
          color: #a8876d;
        }

        .login-input {
          width: 100%;
          height: 56px;
          padding: 0 18px 0 49px;
          border: 1px solid #e2d8ce;
          border-radius: 18px;
          outline: none;
          background: rgba(255, 255, 255, 0.86);
          color: #292724;
          font-family: "Jost", sans-serif;
          font-size: 15px;
          font-weight: 500;
          transition:
            border 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .login-input:focus {
          border-color: #a8876d;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(168, 135, 109, 0.13);
        }

        .otp-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .timer-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border-radius: 999px;
          background: #fbf7f2;
          border: 1px solid #e2d8ce;
          color: #8a715c;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .timer-pill.expired {
          background: #fff1ee;
          border-color: #f2cfc7;
          color: #a23f2f;
        }

        .otp-boxes {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
        }

        .otp-input {
          width: 100%;
          height: 58px;
          border: 1px solid #e2d8ce;
          border-radius: 17px;
          outline: none;
          background: rgba(255, 255, 255, 0.92);
          color: #292724;
          font-family: "Jost", sans-serif;
          font-size: 23px;
          font-weight: 700;
          text-align: center;
          transition:
            border 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease,
            transform 180ms ease;
        }

        .otp-input:focus {
          border-color: #a8876d;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(168, 135, 109, 0.13);
          transform: translateY(-1px);
        }

        .otp-input:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .primary-btn {
          width: 100%;
          height: 56px;
          margin-top: 8px;
          border: none;
          border-radius: 999px;
          background: #292724;
          color: #ffffff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: "Jost", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition:
            background 180ms ease,
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .primary-btn:hover {
          background: #3f3933;
          transform: translateY(-1px);
          box-shadow: 0 16px 34px rgba(41, 39, 36, 0.18);
        }

        .primary-btn:disabled {
          opacity: 0.72;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .secondary-actions {
          margin-top: 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .text-btn {
          border: none;
          background: transparent;
          color: #9a7657;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: "Jost", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0;
        }

        .text-btn:hover {
          color: #292724;
        }

        .message-box,
        .error-box {
          margin-top: 16px;
          padding: 13px 14px;
          border-radius: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          line-height: 1.55;
        }

        .message-box {
          background: #eef8ef;
          color: #27733a;
          border: 1px solid #cfead3;
        }

        .error-box {
          background: #fff1ee;
          color: #a23f2f;
          border: 1px solid #f2cfc7;
        }

        .spin {
          animation: spin 900ms linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .login-shell {
            grid-template-columns: 1fr;
            max-width: 560px;
          }

          .login-art {
            min-height: 330px;
            padding: 34px;
          }

          .art-content h1 {
            font-size: 38px;
          }

          .login-form-area {
            padding: 36px 26px;
          }

          .login-heading {
            font-size: 34px;
          }
        }

        @media (max-width: 520px) {
          .login-page {
            padding: 18px 12px;
          }

          .login-shell {
            border-radius: 24px;
          }

          .login-art {
            padding: 28px 22px;
            min-height: 300px;
          }

          .brand-title {
            font-size: 19px;
          }

          .art-content h1 {
            font-size: 32px;
          }

          .login-form-area {
            padding: 30px 20px;
          }

          .login-heading {
            font-size: 30px;
          }

          .otp-boxes {
            gap: 7px;
          }

          .otp-input {
            height: 50px;
            border-radius: 14px;
            font-size: 20px;
          }

          .secondary-actions {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <main className="login-page">
        <section className="login-shell">
          <div className="login-art">
            <div className="brand-box">
              <div className="brand-icon">
                <Paintbrush size={22} strokeWidth={1.7} />
              </div>

              <div>
                <h2 className="brand-title">Rakhshinda</h2>
                <p className="brand-subtitle">Art</p>
              </div>
            </div>

            <div className="art-content">
              <div className="art-badge">Private Course Access</div>

              <h1>Continue your creative learning journey.</h1>

              <p>
                Login with your email, verify your OTP, and continue directly to
                your learning portal.
              </p>
            </div>
          </div>

          <div className="login-form-area">
            <Link href="/" className="back-home">
              <ArrowLeft size={15} />
              Back Home
            </Link>

            {step === "email" ? (
              <>
                <div className="step-pill">
                  <Mail size={14} />
                  Email Login
                </div>

                <h1 className="login-heading">Welcome back</h1>

                <p className="login-text">
                  Enter your email address. We will send you a secure 6 digit
                  OTP to access your learning portal.
                </p>

                <form className="login-form" onSubmit={handleEmailSubmit}>
                  <div className="input-group">
                    <label className="input-label">Email Address</label>

                    <div className="input-box">
                      <Mail className="input-icon" size={19} strokeWidth={1.7} />

                      <input
                        type="email"
                        className="login-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 size={17} className="spin" />
                        Sending OTP
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="step-pill">
                  <ShieldCheck size={14} />
                  Verify OTP
                </div>

                <h1 className="login-heading">Enter your OTP</h1>

                <p className="login-text">
                  We sent a 6 digit OTP to <strong>{email}</strong>. This OTP
                  will expire in 5 minutes.
                </p>

                <form className="login-form" onSubmit={handleCodeSubmit}>
                  <div className="input-group">
                    <div className="otp-top-row">
                      <label className="input-label" style={{ marginBottom: 0 }}>
                        Verification OTP
                      </label>

                      <div className={`timer-pill ${isExpired ? "expired" : ""}`}>
                        <Clock3 size={14} />
                        {isExpired ? "Expired" : formatTime(secondsLeft)}
                      </div>
                    </div>

                    <div className="otp-boxes" onPaste={handleOtpPaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(element) => {
                            inputRefs.current[index] = element;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          disabled={isExpired || isVerifyingOtp}
                          className="otp-input"
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={isVerifyingOtp || isExpired}
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 size={17} className="spin" />
                        Verifying
                      </>
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </form>

                <div className="secondary-actions">
                  <button
                    type="button"
                    className="text-btn"
                    onClick={handleChangeEmail}
                  >
                    <ArrowLeft size={14} />
                    Change Email
                  </button>

                  <button
                    type="button"
                    className="text-btn"
                    onClick={handleResendCode}
                    disabled={isSendingOtp}
                  >
                    <RefreshCcw size={14} />
                    Resend OTP
                  </button>
                </div>
              </>
            )}

            {message && (
              <div className="message-box">
                <CheckCircle2 size={18} />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="error-box">
                <ShieldCheck size={18} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}