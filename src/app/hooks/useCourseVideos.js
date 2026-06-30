"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getCourseVideos,
} from "../api/courseVideoApi";

export const useCourseVideos = (courseId) => {
  return useQuery({
    queryKey: [
      "course-videos",
      courseId,
    ],

    queryFn: () =>
      getCourseVideos(courseId),

    enabled: Boolean(courseId),

    staleTime: 2 * 60 * 1000,

    retry: (failureCount, error) => {
      const status =
        error?.response?.status;

      if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        status === 404
      ) {
        return false;
      }

      return failureCount < 1;
    },

    refetchOnWindowFocus: false,
  });
};