"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowUpRight,
  Check,
  LoaderCircle,
  RefreshCw,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { api } from "../../../lib/api";
import { addCartItem } from "../../../lib/localCart";

/*
|--------------------------------------------------------------------------
| Existing Font — Unchanged
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Price Formatter
|--------------------------------------------------------------------------
*/

const formatPrice = (price) => {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return "AED 0.00";
  }

  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/*
|--------------------------------------------------------------------------
| Error Message
|--------------------------------------------------------------------------
*/

const getErrorMessage = (
  error,
  fallback
) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

/*
|--------------------------------------------------------------------------
| Extract Categories
|--------------------------------------------------------------------------
*/

const extractCategories = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (
    Array.isArray(
      payload?.data?.categories
    )
  ) {
    return payload.data.categories;
  }

  if (
    Array.isArray(payload?.categories)
  ) {
    return payload.categories;
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| Extract Paintings
|--------------------------------------------------------------------------
*/

const extractPaintings = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (
    Array.isArray(
      payload?.data?.paintings
    )
  ) {
    return payload.data.paintings;
  }

  if (
    Array.isArray(payload?.paintings)
  ) {
    return payload.paintings;
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| Category Helpers
|--------------------------------------------------------------------------
*/

const getCategoryId = (category) => {
  return (
    category?._id ||
    category?.id ||
    category?.title ||
    ""
  );
};

const getCategoryTitle = (category) => {
  return (
    category?.title ||
    category?.name ||
    "Original Painting"
  );
};

/*
|--------------------------------------------------------------------------
| Painting Image
|--------------------------------------------------------------------------
*/

const getPaintingImage = (painting) => {
  return (
    painting?.image?.url ||
    painting?.thumbnail?.url ||
    painting?.coverImage?.url ||
    painting?.imageUrl ||
    "/images/painting-placeholder.jpg"
  );
};

/*
|--------------------------------------------------------------------------
| Painting Details Route
|--------------------------------------------------------------------------
*/

const getPaintingHref = (painting) => {
  if (painting?.slug) {
    return `/shop/${encodeURIComponent(
      painting.slug
    )}`;
  }

  return `/shop/${painting?._id}`;
};

/*
|--------------------------------------------------------------------------
| Fetch Painting Categories
|--------------------------------------------------------------------------
*/

const fetchPaintingCategories =
  async () => {
    const response = await api.get(
      "/category/get-active",
      {
        params: {
          type: "painting",
        },
      }
    );

    return extractCategories(
      response.data
    );
  };

/*
|--------------------------------------------------------------------------
| Fetch All Paintings
|--------------------------------------------------------------------------
*/

const fetchPaintings = async () => {
  const response = await api.get(
    "/painting/get-all",
    {
      params: {
        page: 1,
        limit: 100,
      },
    }
  );

  return extractPaintings(
    response.data
  );
};

/*
|--------------------------------------------------------------------------
| Shop Page
|--------------------------------------------------------------------------
*/

export default function ShopAllArtworks() {
  const [
    activeCategory,
    setActiveCategory,
  ] = useState("all");

  const [search, setSearch] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Categories Query
  |--------------------------------------------------------------------------
  */

  const {
    data: categories = [],
    isLoading:
      categoriesLoading,
  } = useQuery({
    queryKey: [
      "categories",
      "painting",
      "active",
    ],

    queryFn:
      fetchPaintingCategories,

    staleTime:
      10 * 60 * 1000,
  });

  /*
  |--------------------------------------------------------------------------
  | Paintings Query
  |--------------------------------------------------------------------------
  */

  const {
    data: products = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "paintings",
      "shop",
    ],

    queryFn: fetchPaintings,

    staleTime:
      60 * 1000,
  });

  /*
  |--------------------------------------------------------------------------
  | Category Buttons
  |--------------------------------------------------------------------------
  */

  const categoryButtons =
    useMemo(() => {
      return [
        {
          id: "all",
          title: "All",
        },

        ...categories.map(
          (category) => ({
            id:
              getCategoryId(
                category
              ),

            title:
              getCategoryTitle(
                category
              ),
          })
        ),
      ];
    }, [categories]);

  /*
  |--------------------------------------------------------------------------
  | Filter Products
  |--------------------------------------------------------------------------
  */

  const filteredProducts =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const productCategoryId =
            getCategoryId(
              product?.category
            );

          const productCategoryTitle =
            getCategoryTitle(
              product?.category
            );

          const matchesCategory =
            activeCategory ===
              "all" ||
            activeCategory ===
              productCategoryId ||
            activeCategory ===
              productCategoryTitle;

          const searchableContent = [
            product?.title,
            product?.description,
            product?.shortDescription,
            productCategoryTitle,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            searchableContent.includes(
              normalizedSearch
            );

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      products,
      activeCategory,
      search,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Clear Invalid Selected Category
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      activeCategory === "all" ||
      categoriesLoading
    ) {
      return;
    }

    const categoryExists =
      categoryButtons.some(
        (category) =>
          category.id ===
          activeCategory
      );

    if (!categoryExists) {
      setActiveCategory("all");
    }
  }, [
    activeCategory,
    categoriesLoading,
    categoryButtons,
  ]);

  const clearFilters = () => {
    setActiveCategory("all");
    setSearch("");
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    Boolean(search.trim());

  return (
    <main className="min-h-screen bg-[#f7f3ee]">
      <section className="relative min-h-screen overflow-hidden bg-[#f7f3ee] px-4 pb-20 pt-16 text-[#1e1e1c] sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        {/* Same Original Background Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-44 top-16 h-[360px] w-[360px] rounded-full bg-[#eadcca] blur-3xl" />

          <div className="absolute -right-44 bottom-20 h-[420px] w-[420px] rounded-full bg-[#ead8c2] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px]">
        
          {/* Filters Container */}
          <div className="mx-auto mt-10 max-w-[1120px] sm:mt-12">
            <div className="rounded-[26px] border border-[#e8ddd2] bg-white/55 p-4 shadow-[0_16px_45px_rgba(45,35,24,0.045)] backdrop-blur-md sm:p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2.5 lg:justify-start">
                  {categoriesLoading ? (
                    Array.from({
                      length: 4,
                    }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="h-[42px] w-28 animate-pulse rounded-full bg-[#ece3da]"
                        />
                      )
                    )
                  ) : (
                    categoryButtons.map(
                      (category) => {
                        const isActive =
                          activeCategory ===
                          category.id;

                        return (
                          <button
                            key={
                              category.id
                            }
                            type="button"
                            onClick={() =>
                              setActiveCategory(
                                category.id
                              )
                            }
                            className={`min-h-[42px] rounded-full px-5 text-[9px] font-semibold uppercase tracking-[0.16em] transition duration-300 sm:text-[10px] ${
                              isActive
                                ? "bg-[#1e1e1c] text-white shadow-[0_12px_28px_rgba(0,0,0,0.13)]"
                                : "border border-[#e5d9ce] bg-white/75 text-[#514840] hover:-translate-y-0.5 hover:border-[#c9aa83] hover:bg-white"
                            }`}
                          >
                            {
                              category.title
                            }
                          </button>
                        );
                      }
                    )
                  )}
                </div>

                {/* Search */}
                <label className="relative mx-auto block w-full max-w-[360px] lg:mx-0">
                  <span className="sr-only">
                    Search artwork
                  </span>

                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9c9185]"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(
                      event
                    ) =>
                      setSearch(
                        event.target
                          .value
                      )
                    }
                    placeholder="Search artwork..."
                    className="h-[48px] w-full rounded-full border border-[#e5d9ce] bg-white/80 pl-11 pr-11 text-[13px] text-[#1e1e1c] outline-none transition duration-300 placeholder:text-[#9c9185] focus:border-[#b8964f]/60 focus:bg-white focus:ring-4 focus:ring-[#b8964f]/10"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      aria-label="Clear search"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9c9185] transition hover:text-[#1e1e1c]"
                    >
                      <X size={15} />
                    </button>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Results Header */}
          {!isLoading &&
            !isError && (
              <div className="mt-9 flex flex-col items-center justify-between gap-3 border-b border-[#dfd3c7] pb-5 sm:flex-row">
                <div>
                  <p
                    className={`font-special text-center text-[29px] font-normal italic leading-none text-[#2f2924] sm:text-left`}
                  >
                    {activeCategory ===
                    "all"
                      ? "All Artwork"
                      : categoryButtons.find(
                            (
                              category
                            ) =>
                              category.id ===
                              activeCategory
                          )?.title ||
                        "Artwork"}
                  </p>

                  <p className="mt-2 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b8b7e] sm:text-left">
                    {
                      filteredProducts.length
                    }{" "}
                    {filteredProducts.length ===
                    1
                      ? "artwork"
                      : "artworks"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {isFetching && (
                    <div className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9b8b7e]">
                      <LoaderCircle
                        size={13}
                        className="animate-spin"
                      />

                      Updating
                    </div>
                  )}

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8f7357] transition hover:text-[#1e1e1c]"
                    >
                      <X size={13} />

                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}

          {/* Loading State */}
          {isLoading && (
            <ShopProductsSkeleton />
          )}

          {/* Error State */}
          {!isLoading &&
            isError && (
              <ShopError
                error={error}
                isFetching={
                  isFetching
                }
                onRetry={() =>
                  refetch()
                }
              />
            )}

          {/* Product Grid */}
          {!isLoading &&
            !isError &&
            filteredProducts.length >
              0 && (
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(
                  (
                    product,
                    index
                  ) => (
                    <ProductCard
                      key={
                        product?._id ||
                        product?.slug
                      }
                      product={
                        product
                      }
                      index={index}
                    />
                  )
                )}
              </div>
            )}

          {/* Empty State */}
          {!isLoading &&
            !isError &&
            filteredProducts.length ===
              0 && (
              <EmptyShop
                hasActiveFilters={
                  hasActiveFilters
                }
                onClear={
                  clearFilters
                }
              />
            )}
        </div>
      </section>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Product Card
|--------------------------------------------------------------------------
*/

function ProductCard({
  product,
  index,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const [added, setAdded] =
    useState(false);

  const categoryTitle =
    getCategoryTitle(
      product?.category
    );

  const imageUrl =
    getPaintingImage(product);

  const paintingHref =
    getPaintingHref(product);

  const paintingTitle =
    product?.title ||
    "Original Painting";

  const stockValue = Number(
    product?.stock ?? 0
  );

  const stock =
    Number.isFinite(stockValue)
      ? stockValue
      : 0;

  const isSoldOut =
    stock <= 0;

  const [adding, setAdding] =
    useState(false);

  const [cartError, setCartError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Reset Added State
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!added) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setAdded(false);
    }, 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, [added]);

  const handleAddToCart = () => {
    if (!product?._id || isSoldOut || adding) {
      return;
    }

    try {
      setAdding(true);
      setCartError("");

      addCartItem(
        {
          paintingId: product._id,
          slug: product?.slug,
          title: paintingTitle,
          image: imageUrl,
          unitPrice: product?.price,
          stock,
          currency: product?.currency || "AED",
          category: categoryTitle,
        },
        1,
        { openCart: true }
      );

      setAdded(true);
    } catch (error) {
      setCartError(
        error?.message ||
          "Unable to add painting to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 28,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.18,
      }}
      transition={{
        duration: 0.65,

        delay:
          shouldReduceMotion
            ? 0
            : index * 0.04,

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="min-w-0"
    >
      <div className="group/card h-full">
        {/* Product Details Link */}
        <Link
          href={paintingHref}
          aria-label={`View ${paintingTitle} details`}
          data-cursor-label="View"
          className="block"
        >
          {/* Original Style Image Frame */}
          <div className="relative rounded-[24px] bg-[#efe5da] p-[9px] shadow-[0_18px_50px_rgba(45,35,24,0.09)] transition duration-500 group-hover/card:-translate-y-2 group-hover/card:shadow-[0_30px_80px_rgba(45,35,24,0.15)]">
            <div className="relative overflow-hidden rounded-[18px] bg-white/75 p-[7px]">
              <div className="relative aspect-[0.82/1] overflow-hidden rounded-[13px] bg-[#eadfce]">
                <img
                  src={imageUrl}
                  alt={paintingTitle}
                  loading={
                    index < 4
                      ? "eager"
                      : "lazy"
                  }
                  decoding="async"
                  className="h-full w-full object-cover object-center transition duration-[1200ms] ease-out group-hover/card:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 transition duration-500 group-hover/card:opacity-100" />

                {/* Category Badge */}
                <div className="absolute left-4 top-4 max-w-[70%] truncate rounded-full bg-white/92 px-3.5 py-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#1e1e1c] opacity-0 shadow-sm backdrop-blur-md transition duration-300 group-hover/card:opacity-100">
                  {product?.featured
                    ? "Featured"
                    : categoryTitle}
                </div>

                {/* Sold Out Badge */}
                {isSoldOut && (
                  <div className="absolute right-4 top-4 rounded-full bg-[#1e1e1c]/90 px-3.5 py-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-md">
                    Sold Out
                  </div>
                )}

                {/* View Details */}
                <div className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between opacity-0 transition duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                  <span className="rounded-full bg-white/92 px-4 py-2.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#1e1e1c] shadow-sm backdrop-blur-md">
                    View Artwork
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#1e1e1c] shadow-sm backdrop-blur-md transition duration-300 group-hover/card:bg-[#1e1e1c] group-hover/card:text-white">
                    <ArrowUpRight
                      size={17}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="px-1 pt-5">
            <div className="flex items-start justify-between gap-3">
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a2844d]">
                {categoryTitle}
              </p>

              {!isSoldOut && (
                <p className="shrink-0 text-[8px] font-semibold uppercase tracking-[0.13em] text-[#8f7a55]">
                  {stock} in stock
                </p>
              )}
            </div>

            <h2
              className={`font-special mt-2 line-clamp-2 min-h-[60px] text-[30px] font-normal italic leading-[0.95] tracking-[-0.04em] text-[#1e1e1c] transition duration-300 group-hover/card:text-[#8f6f39] sm:text-[34px]`}
            >
              {paintingTitle}
            </h2>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e5d9ce] pt-4">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#a3978b]">
                  Price
                </p>

                <p className="mt-1 text-[15px] font-semibold text-[#756756]">
                  {formatPrice(
                    product?.price
                  )}
                </p>
              </div>

              <ArrowUpRight
                size={18}
                className="text-[#9e856d] transition duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-[#1e1e1c]"
              />
            </div>
          </div>
        </Link>

        {/* Add To Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={
            isSoldOut ||
            adding
          }
          aria-label={
            isSoldOut
              ? `${paintingTitle} is sold out`
              : `Add ${paintingTitle} to cart`
          }
          className={`mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] transition duration-300 sm:text-[10px] ${
            added
              ? "bg-[#b8964f] text-white"
              : isSoldOut
                ? "cursor-not-allowed bg-[#d9d2ca] text-[#8c847b]"
                : "bg-[#1e1e1c] text-white hover:-translate-y-0.5 hover:bg-[#b8964f] hover:shadow-[0_12px_30px_rgba(184,150,79,0.28)]"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {adding ? (
            <>
              <LoaderCircle
                size={15}
                className="animate-spin"
              />

              Adding
            </>
          ) : added ? (
            <>
              <Check size={15} />

              Added To Cart
            </>
          ) : isSoldOut ? (
            "Sold Out"
          ) : (
            <>
              <ShoppingBag
                size={15}
              />

              Add To Cart
            </>
          )}
        </button>

        {cartError && (
          <p className="mt-2 px-2 text-center text-[11px] leading-5 text-red-600">
            {cartError}
          </p>
        )}
      </div>
    </motion.article>
  );
}

/*
|--------------------------------------------------------------------------
| Loading Skeleton
|--------------------------------------------------------------------------
*/

function ShopProductsSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse"
        >
          <div className="rounded-[24px] bg-[#efe5da] p-[9px]">
            <div className="rounded-[18px] bg-white/70 p-[7px]">
              <div className="aspect-[0.82/1] rounded-[13px] bg-[#dfd5ca]" />
            </div>
          </div>

          <div className="px-1 pt-5">
            <div className="h-3 w-28 rounded bg-[#dfd5ca]" />

            <div className="mt-3 h-8 w-3/4 rounded bg-[#dfd5ca]" />

            <div className="mt-2 h-8 w-1/2 rounded bg-[#dfd5ca]" />

            <div className="mt-5 h-px w-full bg-[#dfd5ca]" />

            <div className="mt-4 h-5 w-28 rounded bg-[#dfd5ca]" />

            <div className="mt-4 h-12 w-full rounded-full bg-[#dfd5ca]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Error State
|--------------------------------------------------------------------------
*/

function ShopError({
  error,
  isFetching,
  onRetry,
}) {
  return (
    <div className="mx-auto mt-12 flex max-w-xl flex-col items-center rounded-[28px] border border-[#e5d9ce] bg-white/65 px-6 py-12 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)] backdrop-blur-md">
      <RefreshCw
        size={28}
        className="text-[#b8964f]"
      />

      <h2
        className={`font-special mt-5 text-[42px] font-normal italic leading-none text-[#1e1e1c]`}
      >
        Unable to load artwork
      </h2>

      <p className="mt-4 text-[14px] leading-7 text-[#625b52]">
        {getErrorMessage(
          error,
          "Unable to load paintings."
        )}
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={isFetching}
        className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1e1e1c] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#b8964f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          size={14}
          className={
            isFetching
              ? "animate-spin"
              : ""
          }
        />

        {isFetching
          ? "Loading"
          : "Try Again"}
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyShop({
  hasActiveFilters,
  onClear,
}) {
  return (
    <div className="mx-auto mt-12 max-w-xl rounded-[28px] border border-[#e5d9ce] bg-white/65 px-6 py-12 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)] backdrop-blur-md">
      <h2
        className={`font-special text-[42px] font-normal italic leading-[0.9] tracking-[-0.04em] text-[#1e1e1c]`}
      >
        No artwork found
      </h2>

      <p className="mt-4 text-[14px] leading-7 text-[#625b52]">
        {hasActiveFilters
          ? "Try another category or search term to explore more pieces."
          : "New artwork will appear here as soon as it is added to the studio."}
      </p>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#1e1e1c] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#b8964f]"
        >
          <X size={14} />

          Clear Filters
        </button>
      )}
    </div>
  );
}