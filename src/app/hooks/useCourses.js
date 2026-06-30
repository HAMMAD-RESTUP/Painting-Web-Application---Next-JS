"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAllCourses,
  getFeaturedCourses,
  getSingleCourse,
  getMyCourses,
} from "../api/courseApi";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,

    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: ["featured-courses"],
    queryFn: getFeaturedCourses,

    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useSingleCourse = (courseId) => {
  return useQuery({
    queryKey: [
      "single-course",
      courseId,
    ],

    queryFn: () =>
      getSingleCourse(courseId),

    enabled: Boolean(courseId),

    staleTime: 5 * 60 * 1000,

    retry: (failureCount, error) => {
      const status =
        error?.response?.status;

      if (
        status === 400 ||
        status === 404
      ) {
        return false;
      }

      return failureCount < 1;
    },

    refetchOnWindowFocus: false,
  });
};

export const useMyCourses = () => {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: getMyCourses,

    staleTime: 2 * 60 * 1000,

    retry: (failureCount, error) => {
      const status =
        error?.response?.status;

      if (
        status === 401 ||
        status === 403
      ) {
        return false;
      }

      return failureCount < 1;
    },

    refetchOnWindowFocus: false,
  });
};