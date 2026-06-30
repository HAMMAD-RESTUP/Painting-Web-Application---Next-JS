import { api } from "../lib/api";

export const getAllCourses = async () => {
  const { data } = await api.get(
    "/course/get-all"
  );

  return data;
};

export const getFeaturedCourses = async () => {
  const { data } = await api.get(
    "/course/featured"
  );

  return data;
};

export const getSingleCourse = async (
  courseId
) => {
  if (!courseId) {
    throw new Error(
      "Course id is required."
    );
  }

  const { data } = await api.get(
    `/course/${courseId}`
  );

  return data;
};

export const getMyCourses = async () => {
  const { data } = await api.get(
    "/course-enrollment/my-courses"
  );

  return data;
};