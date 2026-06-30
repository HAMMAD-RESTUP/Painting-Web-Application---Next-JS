"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  signupUser,
  signupVerifyOtp,
  loginUser,
  loginVerifyOtp,
  getMe,
} from "../api/authApi";

/*
|--------------------------------------------------------------------------
| Extract Authenticated User
|--------------------------------------------------------------------------
| Axios response aur response.data dono structures handle karega.
*/
const extractUser = (response) => {
  /*
    Agar authApi axios ka complete response
    return kar raha ho:
    response.data.data = user
  */
  if (response?.data?.data) {
    return response.data.data;
  }

  /*
    Agar authApi response.data return kar raha ho:
    response.data = user profile
  */
  if (
    response?.success !== undefined &&
    response?.data
  ) {
    return response.data;
  }

  if (response?.data?.user) {
    return response.data.user;
  }

  if (response?.user) {
    return response.user;
  }

  /*
    Agar direct user object return ho.
  */
  if (
    response?._id ||
    response?.id ||
    response?.email
  ) {
    return response;
  }

  return null;
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
  });
};

export const useSignupVerifyOtp = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: signupVerifyOtp,

    onSuccess: async () => {
      /*
        Backend OTP verify ke baad HTTP-only
        cookie set karta hai.

        User verify response mein return nahi hota,
        isliye user ko localStorage mein save nahi karenge.
      */

      if (
        typeof window !== "undefined"
      ) {
        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "token"
        );
      }

      /*
        Purana unauthenticated "me" cache remove.
      */
      queryClient.removeQueries({
        queryKey: ["me"],
      });

      /*
        Agli protected page par /auth/me
        fresh user profile fetch karega.
      */
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useLoginVerifyOtp = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: loginVerifyOtp,

    onSuccess: async () => {
      /*
        Authentication secure HTTP-only
        cookie ke through hogi.
      */

      if (
        typeof window !== "undefined"
      ) {
        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "token"
        );
      }

      queryClient.removeQueries({
        queryKey: ["me"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],

    queryFn: getMe,

    /*
      Ye file client hook hai, isliye extra
      window-based enabled condition ki zarurat nahi.
    */
    retry: false,

    staleTime:
      5 * 60 * 1000,

    refetchOnWindowFocus: false,

    select: extractUser,
  });
};