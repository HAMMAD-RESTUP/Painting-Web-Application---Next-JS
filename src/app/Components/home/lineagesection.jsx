"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  LoaderCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { addCartItem } from "../../lib/localCart";

import {
  useFeaturedPaintings,
} from "../../hooks/usePaintings";

/*
|--------------------------------------------------------------------------
| Price formatter
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

export default function FeaturedArtworksSection() {
  const {
    data: artworks = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFeaturedPaintings(4);

  return (
    <section
      id="featured"
      className="relative w-full overflow-hidden bg-[#f7f3ee] text-[#1e1e1c]"
    >
      {/* Background shapes */}
      <div className="pointer-events-none absolute -left-44 top-20 h-[380px] w-[380px] rounded-full bg-[#e9dccb] blur-3xl" />

      <div className="pointer-events-none absolute -right-44 bottom-40 h-[440px] w-[440px] rounded-full bg-[#ead8c2] blur-3xl" />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-10 pt-16 text-center sm:pt-20 lg:pt-24">
        <motion.p
          initial={{
            opacity: 0,
            y: 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.65,
          }}
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b8964f] sm:text-[11px]"
        >
          Featured Art Paintings
        </motion.p>

        <motion.h2
          initial={{
            opacity: 0,
            y: 22,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.75,
            delay: 0.05,
          }}
          className={`font-special text-[48px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#171717] sm:text-[64px] md:text-[78px] lg:text-[92px]`}
        >
          Original Paintings
        </motion.h2>

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.75,
            delay: 0.1,
          }}
          className="mx-auto mt-6 max-w-2xl text-[14px] leading-7 text-[#625b52] sm:text-[16px]"
        >
          A curated selection of original
          paintings, Arabic calligraphy and
          Islamic illustrations created with
          detail, emotion and timeless beauty.
        </motion.p>
      </div>

      {/* Artworks */}
      <div className="relative z-10 pb-16">
        {isLoading && (
          <FeaturedPaintingsSkeleton />
        )}

        {!isLoading && isError && (
          <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-14 text-center">
            <p className="text-[15px] text-[#625b52]">
              {error?.response?.data
                ?.message ||
                error?.message ||
                "Unable to load featured paintings."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-5 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#1e1e1c] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:bg-[#b8964f] disabled:cursor-not-allowed disabled:opacity-60"
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
        )}

        {!isLoading &&
          !isError &&
          artworks.length === 0 && (
            <div className="mx-auto max-w-xl px-5 py-14 text-center">
              <h3
                className={`font-special text-[34px] font-normal italic text-[#1e1e1c]`}
              >
                Featured paintings coming
                soon
              </h3>

              <p className="mt-3 text-[14px] leading-7 text-[#625b52]">
                No featured paintings are
                available at the moment.
              </p>
            </div>
          )}

        {!isLoading &&
          !isError &&
          artworks.length > 0 && (
            <>
              {/* Mobile slider */}
              <div className="block md:hidden">
                <div className="artworks-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-6">
                  {artworks.map(
                    (art, index) => (
                      <ArtworkCard
                        key={art._id}
                        art={art}
                        index={index}
                        mobile
                      />
                    )
                  )}
                </div>
              </div>

              {/* Desktop grid */}
              <div className="hidden px-5 sm:px-6 md:block lg:px-8">
                <div
                  className={`mx-auto grid gap-x-6 gap-y-12 lg:gap-x-8 ${
                    artworks.length === 1
                      ? "max-w-[285px] grid-cols-1"
                      : artworks.length === 2
                        ? "max-w-[600px] grid-cols-2"
                        : artworks.length === 3
                          ? "max-w-[900px] grid-cols-3"
                          : "max-w-[1200px] grid-cols-4"
                  }`}
                >
                  {artworks.map(
                    (art, index) => (
                      <ArtworkCard
                        key={art._id}
                        art={art}
                        index={index}
                      />
                    )
                  )}
                </div>
              </div>
            </>
          )}

        <div className="mt-12 flex justify-center px-5">
          <Link
            href="/shop"
            className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full bg-white/60 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1e1e1c] shadow-[0_12px_35px_rgba(0,0,0,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-[#1e1e1c] hover:text-white"
          >
            View All Artwork

            <ArrowUpRight
              size={15}
              className="transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Bottom banners */}
      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <FeatureBanner
          href="/shop/prints"
          image="/images/limited-prints.png"
          label="Fine Art Prints"
          title="Limited Edition Prints"
          text="Premium archival-quality prints designed for calm homes, meaningful gifts and elegant wall spaces."
          button="Shop Prints"
        />

        <FeatureBanner
          href="/shop/calligraphy-kit"
          image="/images/calligraphy-bg.png"
          label="Creative Kit"
          title="Calligraphy Kit"
          text="A thoughtful starter kit with essential tools to begin your calligraphy practice with confidence."
          button="Shop Kit"
        />
      </div>

      <style jsx>{`
        .artworks-scroll {
          scrollbar-width: none;
        }

        .artworks-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Painting card
|--------------------------------------------------------------------------
*/

function ArtworkCard({
  art,
  index,
  mobile = false,
}) {
  const [added, setAdded] =
    useState(false);

  const [adding, setAdding] =
    useState(false);

  const [cartError, setCartError] =
    useState("");

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

  const categoryTitle =
    art?.category?.title ||
    "Original Painting";

  const imageUrl =
    art?.image?.url ||
    "/images/painting-placeholder.jpg";

  const paintingHref = art?.slug
    ? `/shop/${encodeURIComponent(
        art.slug
      )}`
    : `/shop/${art._id}`;

  const stock = Number(
    art?.stock || 0
  );

  const isSoldOut =
    stock <= 0;

  const handleAddToCart = () => {
    if (!art?._id || isSoldOut || adding) {
      return;
    }

    try {
      setAdding(true);
      setCartError("");

      addCartItem(
        {
          paintingId: art._id,
          slug: art?.slug,
          title: art?.title,
          image: imageUrl,
          unitPrice: art?.price,
          stock,
          currency: art?.currency || "AED",
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
      initial={{
        opacity: 0,
        y: 28,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={
        mobile
          ? "w-[270px] shrink-0 snap-center"
          : "w-full"
      }
    >
      {/* Product detail link */}
      <Link
        href={paintingHref}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-[22px] bg-transparent p-0 shadow-none transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_25px_70px_rgba(0,0,0,0.15)]">
          <div className="relative aspect-[0.82/1] overflow-hidden rounded-[16px] bg-[#e7dfd5]">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-[16px] border-[3px] border-transparent transition duration-500 group-hover:border-[#b49b45]" />

            <img
              src={imageUrl}
              alt={
                art?.title ||
                "Original painting"
              }
              loading="lazy"
              className="h-full w-full rounded-[16px] object-cover object-center transition duration-[1200ms] ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 rounded-[16px] bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1e1e1c] opacity-0 shadow-sm backdrop-blur-md transition duration-300 group-hover:opacity-100">
              {categoryTitle}
            </div>

            {isSoldOut && (
              <div className="absolute right-4 top-4 rounded-full bg-[#1e1e1c]/90 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
                Sold Out
              </div>
            )}

            <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-[#1e1e1c] group-hover:text-white">
              <ArrowUpRight size={17} />
            </div>
          </div>
        </div>

        <div className="px-1 pt-5 text-left">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a2844d]">
            {categoryTitle}
          </p>

          <h3
            className={`font-special text-[27px] font-normal italic leading-none tracking-[-0.035em] text-[#1e1e1c] sm:text-[31px]`}
          >
            {art?.title}
          </h3>
        </div>
      </Link>

      {/* Price and cart button */}
      <div className="px-1 pt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px] font-semibold text-[#756756]">
            {formatPrice(art?.price)}
          </p>

          {!isSoldOut && (
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8f7a55]">
              {stock} in stock
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={
            isSoldOut ||
            adding
          }
          className={`mt-4 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition duration-300 ${
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
              Added to Cart
            </>
          ) : isSoldOut ? (
            "Sold Out"
          ) : (
            <>
              <ShoppingBag size={15} />
              Add to Cart
            </>
          )}
        </button>

        {cartError && (
            <p className="mt-2 text-center text-[11px] leading-5 text-red-600">
              {cartError}
            </p>
          )}
      </div>
    </motion.article>
  );
}

/*
|--------------------------------------------------------------------------
| Loading skeleton
|--------------------------------------------------------------------------
*/

function FeaturedPaintingsSkeleton() {
  return (
    <div className="px-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse"
          >
            <div className="aspect-[0.82/1] rounded-[16px] bg-[#e6ded4]" />

            <div className="mt-5 h-3 w-28 rounded bg-[#e6ded4]" />

            <div className="mt-3 h-7 w-3/4 rounded bg-[#e6ded4]" />

            <div className="mt-3 h-4 w-24 rounded bg-[#e6ded4]" />

            <div className="mt-4 h-12 w-full rounded-full bg-[#e6ded4]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Bottom banner
|--------------------------------------------------------------------------
*/

function FeatureBanner({
  href,
  image,
  label,
  title,
  text,
  button,
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[390px] items-end overflow-hidden bg-[#ded6cc] sm:min-h-[460px] lg:min-h-[520px]"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-[1300ms] ease-out group-hover:scale-[1.06]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_78%,rgba(255,255,255,0.18),transparent_34%)]" />

      <div className="relative z-10 w-full px-6 pb-8 pt-16 text-white sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e6c5a5]">
          {label}
        </p>

        <h3
          className={`font-special max-w-[540px] text-[44px] font-normal italic leading-[0.9] tracking-[-0.055em] text-white sm:text-[58px] lg:text-[70px]`}
        >
          {title}
        </h3>

        <p className="mt-5 max-w-[510px] text-[14px] font-normal leading-7 text-white/90 sm:text-[15px]">
          {text}
        </p>

        <span className="mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1e1e1c] transition duration-300 group-hover:bg-[#1e1e1c] group-hover:text-white">
          {button}

          <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}