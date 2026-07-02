import { api } from "../lib/api";

export const getActiveCategories = async () => {
  const { data } = await api.get(
    "/category/get-all"
  );

  return data;
};