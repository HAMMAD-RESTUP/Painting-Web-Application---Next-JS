
import { api } from "../lib/api";

export const getMyCourses = async () => {
  const response = await api.get(
    "/course-enrollment/my-courses"
  );

  return response.data;
};