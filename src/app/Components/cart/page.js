"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "../../lib/api";

const CART_QUERY_KEY = ["cart"];

const getErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

const getCartData = (response) => {
  return response?.data || {};
};

const getCartItems = (response) => {
  const data = getCartData(response);

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.cart?.items)) {
    return data.cart.items;
  }

  return [];
};

const getCartItemId = (item) => {
  return item?._id || item?.id || "";
};

const getItemTitle = (item) => {
  return (
    item?.title ||
    item?.course?.title ||
    item?.painting?.title ||
    "Cart Item"
  );
};

const getItemImage = (item) => {
  return (
    item?.image?.url ||
    item?.course?.thumbnail?.url ||
    item?.course?.image?.url ||
    item?.painting?.image?.url ||
    ""
  );
};

const getItemPrice = (item) => {
  const value =
    item?.unitPrice ??
    item?.course?.price ??
    item?.painting?.price ??
    0;

  const price = Number(value);

  return Number.isFinite(price)
    ? price
    : 0;
};

const formatMoney = (
  amount,
  currency = "AED"
) => {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
};

export default function CartPage() {
  const queryClient = useQueryClient();

  const [actionError, setActionError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Get Backend Cart
  |--------------------------------------------------------------------------
  */

  const {
    data: cartResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: CART_QUERY_KEY,

    queryFn: async () => {
      const response = await api.get(
        "/cart"
      );

      return response.data;
    },

    /*
      /cart page open hone par latest backend
      cart lazmi fetch hogi.
    */
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: false,
  });

  const cartData = useMemo(() => {
    return getCartData(cartResponse);
  }, [cartResponse]);

  const cartItems = useMemo(() => {
    return getCartItems(cartResponse);
  }, [cartResponse]);

  const currency =
    cartData?.currency || "AED";

  const itemCount = useMemo(() => {
    const backendCount = Number(
      cartData?.itemCount
    );

    if (Number.isFinite(backendCount)) {
      return backendCount;
    }

    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item?.quantity || 1),
      0
    );
  }, [
    cartData?.itemCount,
    cartItems,
  ]);

  const subtotal = useMemo(() => {
    const backendSubtotal = Number(
      cartData?.subtotal
    );

    if (
      Number.isFinite(backendSubtotal)
    ) {
      return backendSubtotal;
    }

    return cartItems.reduce(
      (total, item) => {
        const quantity = Number(
          item?.quantity || 1
        );

        return (
          total +
          getItemPrice(item) *
            quantity
        );
      },
      0
    );
  }, [
    cartData?.subtotal,
    cartItems,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Delete Cart Item
  |--------------------------------------------------------------------------
  */

  const removeItemMutation =
    useMutation({
      mutationFn: async (cartItemId) => {
        const response = await api.delete(
          `/cart/item/${cartItemId}`
        );

        return response.data;
      },

      onMutate: () => {
        setActionError("");
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: CART_QUERY_KEY,
        });

        await refetch();

        window.dispatchEvent(
          new Event("courseCartUpdated")
        );
      },

      onError: (requestError) => {
        setActionError(
          getErrorMessage(
            requestError,
            "Item could not be removed."
          )
        );
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Update Painting Quantity
  |--------------------------------------------------------------------------
  */

  const updateQuantityMutation =
    useMutation({
      mutationFn: async ({
        cartItemId,
        quantity,
      }) => {
        const response = await api.patch(
          `/cart/item/${cartItemId}`,
          {
            quantity,
          }
        );

        return response.data;
      },

      onMutate: () => {
        setActionError("");
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: CART_QUERY_KEY,
        });

        await refetch();

        window.dispatchEvent(
          new Event("courseCartUpdated")
        );
      },

      onError: (requestError) => {
        setActionError(
          getErrorMessage(
            requestError,
            "Quantity could not be updated."
          )
        );
      },
    });

  const handleRemoveItem = (item) => {
    const cartItemId =
      getCartItemId(item);

    if (
      !cartItemId ||
      removeItemMutation.isPending
    ) {
      return;
    }

    removeItemMutation.mutate(
      cartItemId
    );
  };

  const handleQuantityChange = (
    item,
    nextQuantity
  ) => {
    /*
      Course quantity hamesha 1 rahegi.
    */
    if (item?.itemType === "course") {
      return;
    }

    const cartItemId =
      getCartItemId(item);

    if (
      !cartItemId ||
      nextQuantity < 1 ||
      updateQuantityMutation.isPending
    ) {
      return;
    }

    updateQuantityMutation.mutate({
      cartItemId,
      quantity: nextQuantity,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (
    isLoading ||
    (isFetching &&
      !cartResponse)
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#a98745] border-t-transparent" />

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#685f56]">
            Loading Cart
          </p>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (isError) {
    const status =
      error?.response?.status;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-5">
        <div className="w-full max-w-lg rounded-[30px] border border-[#e8e2d7] bg-white p-8 text-center shadow-sm">
          <ShoppingBag
            size={38}
            className="mx-auto text-[#a98745]"
            strokeWidth={1.3}
          />

          <h1
            className={`font-special mt-5 text-[42px] font-medium italic text-[#211e1a]`}
          >
            Cart Could Not Load
          </h1>

          <p className="mt-3 text-[14px] leading-7 text-[#6c635a]">
            {getErrorMessage(
              error,
              "Unable to load your cart."
            )}
          </p>

          {status === 401 ? (
            <Link
              href="/login?redirect=/cart"
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#211e1a] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
            >
              Login to Continue
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 min-h-[48px] rounded-full bg-[#211e1a] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
            >
              Try Again
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-12 text-[#211e1a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#746b62] transition hover:text-[#a98745]"
        >
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>

        <div className="mt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a98745]">
            Shopping Cart
          </p>

          <h1
            className={`font-special mt-2 text-[48px] font-medium italic leading-none sm:text-[64px]`}
          >
            Your Cart
          </h1>

          <p className="mt-4 text-[14px] text-[#746b62]">
            {itemCount}{" "}
            {itemCount === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>

        {actionError && (
          <div className="mt-6 rounded-[16px] border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-red-700">
            {actionError}
          </div>
        )}

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cart Items */}

            <section className="space-y-4">
              {cartItems.map((item) => {
                const cartItemId =
                  getCartItemId(item);

                const title =
                  getItemTitle(item);

                const image =
                  getItemImage(item);

                const unitPrice =
                  getItemPrice(item);

                const quantity = Number(
                  item?.quantity || 1
                );

                const isCourse =
                  item?.itemType ===
                  "course";

                const isDeleting =
                  removeItemMutation.isPending &&
                  removeItemMutation.variables ===
                    cartItemId;

                const isUpdating =
                  updateQuantityMutation.isPending &&
                  updateQuantityMutation.variables
                    ?.cartItemId ===
                    cartItemId;

                return (
                  <article
                    key={cartItemId}
                    className="grid gap-5 rounded-[26px] border border-[#e6ddd3] bg-white p-4 shadow-[0_14px_38px_rgba(45,35,24,0.05)] sm:grid-cols-[130px_1fr] sm:p-5"
                  >
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[20px] bg-[#eee5da] text-[#a98745] sm:aspect-auto sm:h-[130px]">
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <BookOpen
                          size={34}
                          strokeWidth={1.3}
                        />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a98745]">
                            {isCourse
                              ? "Online Course"
                              : "Original Artwork"}
                          </p>

                          <h2
                            className={`font-special mt-1 text-[28px] font-medium italic leading-tight`}
                          >
                            {title}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(
                              item
                            )
                          }
                          disabled={isDeleting}
                          aria-label={`Remove ${title}`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-wait disabled:opacity-50"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                        {isCourse ? (
                          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#81786f]">
                            Quantity 1
                          </p>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item,
                                  quantity -
                                    1
                                )
                              }
                              disabled={
                                quantity <= 1 ||
                                isUpdating
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd3c8] bg-white disabled:opacity-40"
                            >
                              <Minus
                                size={14}
                              />
                            </button>

                            <span className="min-w-5 text-center text-[13px] font-semibold">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item,
                                  quantity +
                                    1
                                )
                              }
                              disabled={
                                isUpdating
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd3c8] bg-white disabled:opacity-40"
                            >
                              <Plus
                                size={14}
                              />
                            </button>
                          </div>
                        )}

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#92877d]">
                            Price
                          </p>

                          <p className="mt-1 text-[17px] font-semibold">
                            {formatMoney(
                              unitPrice *
                                quantity,
                              currency
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Cart Summary */}

            <aside className="h-fit rounded-[28px] border border-[#e6ddd3] bg-white p-6 shadow-[0_18px_48px_rgba(45,35,24,0.07)] lg:sticky lg:top-24">
              <h2
                className={`font-special text-[38px] font-medium italic`}
              >
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 border-y border-[#eee6dc] py-5">
                <SummaryRow
                  label="Items"
                  value={itemCount}
                />

                <SummaryRow
                  label="Subtotal"
                  value={formatMoney(
                    subtotal,
                    currency
                  )}
                />

                <SummaryRow
                  label="Discount"
                  value={formatMoney(
                    0,
                    currency
                  )}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#72685f]">
                  Total
                </span>

                <span className="text-[25px] font-bold">
                  {formatMoney(
                    subtotal,
                    currency
                  )}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#211e1a] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#a98745]"
              >
                Proceed to Checkout
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/courses"
                className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#ddd3c8] bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:border-[#211e1a]"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="mt-10 rounded-[30px] border border-[#e6ddd3] bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f2eb] text-[#a98745]">
        <ShoppingBag
          size={32}
          strokeWidth={1.3}
        />
      </div>

      <h2
        className={`font-special mt-6 text-[42px] font-medium italic`}
      >
        Your Cart Is Empty
      </h2>

      <p className="mx-auto mt-3 max-w-md text-[14px] leading-7 text-[#746b62]">
        Explore available art courses and
        add one to your cart.
      </p>

      <Link
        href="/courses"
        className="mt-7 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#211e1a] px-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#a98745]"
      >
        Explore Courses
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-[13px]">
      <span className="text-[#746b62]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}