"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "../lib/api";
const getFeaturedPaintings = async (
  limit = 4
) => {
  const response = await api.get(
    "/painting/featured",
    {
      params: {
        limit,
      },
    }
  );

  return response.data?.data || [];
};

const getAllPaintings = async (
  params = {}
) => {
  const response = await api.get(
    "/painting/get-all",
    {
      params,
    }
  );

  return response.data;
};

const getPaintingBySlug = async (
  slug
) => {
  const response = await api.get(
    `/painting/slug/${encodeURIComponent(
      slug
    )}`
  );

  return response.data?.data;
};

const getPaintingById = async (
  paintingId
) => {
  try {
    const response = await api.get(
      `/painting/get-one/${encodeURIComponent(paintingId)}`
    );

    return response.data?.data;
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    const response = await api.get(
      `/painting/slug/${encodeURIComponent(paintingId)}`
    );

    return response.data?.data;
  }
};

export const useFeaturedPaintings = (
  limit = 4
) => {
  return useQuery({
    queryKey: [
      "paintings",
      "featured",
      limit,
    ],

    queryFn: () =>
      getFeaturedPaintings(limit),

    staleTime: 5 * 60 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,
  });
};

export const usePaintings = (
  params = {}
) => {
  return useQuery({
    queryKey: [
      "paintings",
      "list",
      params,
    ],

    queryFn: () =>
      getAllPaintings(params),

    staleTime: 2 * 60 * 1000,

    retry: 1,

    placeholderData: (
      previousData
    ) => previousData,
  });
};

export const usePaintingBySlug = (
  slug
) => {
  return useQuery({
    queryKey: [
      "paintings",
      "slug",
      slug,
    ],

    queryFn: () =>
      getPaintingBySlug(slug),

    enabled: Boolean(slug),

    staleTime: 5 * 60 * 1000,

    retry: 1,
  });
};

export const usePaintingById = (
  paintingId
) => {
  return useQuery({
    queryKey: [
      "paintings",
      "id",
      paintingId,
    ],

    queryFn: () =>
      getPaintingById(
        paintingId
      ),

    enabled: Boolean(
      paintingId
    ),

    staleTime: 5 * 60 * 1000,

    retry: 1,
  });
};