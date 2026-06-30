"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "../lib/api";

export const CART_QUERY_KEY = ["cart"];

/*
|--------------------------------------------------------------------------
| Get Logged-in User Cart
|--------------------------------------------------------------------------
*/

export const useCart = () => {
  return useQuery({
    queryKey: CART_QUERY_KEY,

    queryFn: async () => {
      const response = await api.get("/cart");

      return response.data;
    },

    staleTime: 15 * 1000,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

/*
|--------------------------------------------------------------------------
| Add Course or Painting to Cart
|--------------------------------------------------------------------------
*/

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemType,
      itemId,
      quantity = 1,
    }) => {
      if (
        !["course", "painting"].includes(
          itemType
        )
      ) {
        throw new Error(
          "Valid item type is required."
        );
      }

      if (!itemId) {
        throw new Error(
          "Item ID is required."
        );
      }

      const response = await api.post(
        "/cart/add",
        {
          itemType,
          itemId,

          /*
            Courses ki quantity hamesha 1 hogi.
          */
          quantity:
            itemType === "course"
              ? 1
              : Number(quantity || 1),
        }
      );

      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| Remove Item from Cart
|--------------------------------------------------------------------------
*/

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId) => {
      if (!cartItemId) {
        throw new Error(
          "Cart item ID is required."
        );
      }

      const response = await api.delete(
        `/cart/item/${cartItemId}`
      );

      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| Update Painting Quantity
|--------------------------------------------------------------------------
*/

export const useUpdateCartQuantity =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: async ({
        cartItemId,
        quantity,
      }) => {
        if (!cartItemId) {
          throw new Error(
            "Cart item ID is required."
          );
        }

        const parsedQuantity =
          Number(quantity);

        if (
          !Number.isInteger(
            parsedQuantity
          ) ||
          parsedQuantity < 1
        ) {
          throw new Error(
            "Quantity must be a positive whole number."
          );
        }

        const response = await api.patch(
          `/cart/item/${cartItemId}`,
          {
            quantity: parsedQuantity,
          }
        );

        return response.data;
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: CART_QUERY_KEY,
        });
      },
    });
  };