"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  signupUser,
  signupVerifyOtp,
  loginUser,
  loginVerifyOtp,
  getMe,
} from "../api/authApi";

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
  });
};

export const useSignupVerifyOtp = () => {
  return useMutation({
    mutationFn: signupVerifyOtp,
    onSuccess: (data) => {
      const token = data?.token || data?.accessToken;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useLoginVerifyOtp = () => {
  return useMutation({
    mutationFn: loginVerifyOtp,
    onSuccess: (data) => {
      const token = data?.token || data?.accessToken;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });
};