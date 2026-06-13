"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup, useSignupVerifyOtp } from "../hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();

  const signupMutation = useSignup();
  const verifyOtpMutation = useSignupVerifyOtp();

  const [step, setStep] = useState("signup");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setErrorMessage("");
    setSuccessMessage("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    signupMutation.mutate(formData, {
      onSuccess: (data) => {
        setSuccessMessage(data?.message || "OTP email par send ho gaya.");
        setStep("otp");
      },
      onError: (error) => {
        setErrorMessage(
          error?.response?.data?.message || "Signup failed. Try again."
        );
      },
    });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    verifyOtpMutation.mutate(
      {
        email: formData.email,
        otp,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          setErrorMessage(
            error?.response?.data?.message || "Invalid OTP. Try again."
          );
        },
      }
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          {step === "signup" ? "Create Account" : "Verify Email"}
        </h1>

        {errorMessage && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 p-3 rounded-md">
            {successMessage}
          </p>
        )}

        {step === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full bg-black text-white py-2 rounded-md disabled:opacity-60"
            >
              {signupMutation.isPending ? "Sending OTP..." : "Register"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              OTP sent to <strong>{formData.email}</strong>
            </p>

            <div>
              <label className="block text-sm font-medium mb-1">
                Enter OTP
              </label>

              <input
                type="text"
                name="otp"
                placeholder="Enter OTP code"
                value={otp}
                onChange={(e) => {
                  setErrorMessage("");
                  setSuccessMessage("");
                  setOtp(e.target.value);
                }}
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={verifyOtpMutation.isPending}
              className="w-full bg-black text-white py-2 rounded-md disabled:opacity-60"
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("signup");
                setOtp("");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="w-full text-sm underline"
            >
              Change email
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-semibold underline"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}