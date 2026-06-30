import { useQuery } from "@tanstack/react-query";
import { getActiveCategories } from "../api/categoryApi";

export const useActiveCategories = () => {
  return useQuery({
    queryKey: ["active-categories"],
    queryFn: getActiveCategories,

    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};