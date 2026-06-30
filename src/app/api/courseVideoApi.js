import { api } from "../lib/api";

export const getCourseVideos = async (courseId) => {
  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  const response = await api.get(
    `/course-video/${courseId}`
  );

  return response.data;
};