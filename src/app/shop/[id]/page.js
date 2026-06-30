"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { usePaintingById } from "../../hooks/usePaintings";
import { getApiErrorMessage } from "../../lib/api";
import { addCartItem } from "../../lib/localCart";

const money = (value) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    currencyDisplay: "code",
  }).format(Number(value || 0));

const imageOf = (painting) =>
  painting?.image?.url ||
  painting?.thumbnail?.url ||
  painting?.images?.[0]?.url ||
  painting?.images?.[0] ||
  painting?.imageUrl ||
  "";

const categoryOf = (painting) =>
  painting?.category?.title ||
  painting?.category?.name ||
  painting?.categoryName ||
  "Original Artwork";

export default function PaintingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { data, isLoading, isError, error } = usePaintingById(id);
  const painting = useMemo(
    () => data?.painting || data?.data || data || null,
    [data],
  );

  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [adding, setAdding] = useState(false);

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f4ef]">
        <LoaderCircle className="animate-spin text-[#9a704f]" />
      </main>
    );
  }

  if (isError || !painting) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f4ef] px-6">
        <div className="max-w-lg border border-red-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold">Artwork unavailable</h1>
          <p className="mt-3 text-sm text-[#71675f]">
            {getApiErrorMessage(error)}
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex bg-[#211e1a] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white"
          >
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const image = imageOf(painting);
  const stock = Number(painting?.stock ?? painting?.quantity ?? 1);
  const available = painting?.isAvailable !== false && stock > 0;

  const cartPainting = {
    paintingId: painting?._id || id,
    slug: painting?.slug,
    title: painting?.title || painting?.name,
    image,
    unitPrice: painting?.price,
    stock,
    currency: painting?.currency || "AED",
    category: categoryOf(painting),
  };

  const handleAddToCart = (goToCheckout = false) => {
    if (!available || adding) return;

    try {
      setAdding(true);
      setNotice("");
      addCartItem(cartPainting, quantity, { openCart: !goToCheckout });
      setNotice("Added to your cart.");

      if (goToCheckout) router.push("/checkout");
    } catch (cartError) {
      setNotice(cartError?.message || "Artwork could not be added to cart.");
    } finally {
      setAdding(false);
    }
  };

  const noticeSuccess = notice === "Added to your cart.";

  return (
    <main className="commerce-shell min-h-screen px-5 pb-24 pt-28 text-[#211e1a]">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[#776d62] hover:text-[#9a704f]"
        >
          <ArrowLeft size={15} /> Back to shop
        </Link>

        <div className="mt-7 grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
          <section className="product-media-frame border border-[#e4d9cd] bg-white p-3 shadow-[0_24px_60px_rgba(65,48,36,.08)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#eee5dc]">
              {image ? (
                <img
                  src={image}
                  alt={painting?.title || "Original artwork"}
                  className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
                />
              ) : (
                <div className="grid h-full place-items-center text-[#9a704f]">
                  Artwork preview
                </div>
              )}
              <span className="absolute left-4 top-4 bg-white/92 px-3 py-2 text-[10px] font-semibold uppercase tracking-[.16em] backdrop-blur">
                {available ? "Available" : "Sold out"}
              </span>
            </div>
          </section>

          <section className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#a98745]">
              {categoryOf(painting)}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl">
              {painting?.title || painting?.name}
            </h1>
            <p className="mt-5 text-2xl font-semibold">
              {money(painting?.price)}
            </p>
            <div className="mt-7 border-y border-[#ddd2c7] py-6 text-sm leading-7 text-[#6d645b]">
              {painting?.description ||
                "A carefully created original artwork, prepared for secure worldwide delivery."}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Trust
                icon={<ShieldCheck size={18} />}
                title="Secure payment"
                text="Ziina checkout"
              />
              <Trust
                icon={<PackageCheck size={18} />}
                title="Protected packing"
                text="Studio handled"
              />
              <Trust
                icon={<Truck size={18} />}
                title="Worldwide delivery"
                text="Tracked shipping"
              />
            </div>

            <div className="mt-8 flex items-stretch gap-3">
              <div className="flex overflow-hidden rounded-md border border-[#d9cec3] bg-white">
                <button
                  type="button"
                  className="grid w-11 place-items-center transition hover:bg-[#f8efe8]"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="grid min-w-11 place-items-center border-x border-[#e7ddd3] text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="grid w-11 place-items-center transition hover:bg-[#f8efe8] disabled:opacity-40"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(Math.max(stock, 1), current + 1),
                    )
                  }
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                disabled={!available || adding}
                onClick={() => handleAddToCart(false)}
                className="flex min-h-14 flex-1 items-center justify-center gap-3 rounded-md bg-[#211e1a] px-6 text-xs font-semibold uppercase tracking-[.16em] text-white transition hover:bg-[#9a704f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {adding ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <ShoppingBag size={17} />
                )}
                {available ? "Add to cart" : "Sold out"}
              </button>
            </div>

            <button
              type="button"
              disabled={!available || adding}
              onClick={() => handleAddToCart(true)}
              className="ziina-button mt-3 flex min-h-14 w-full items-center justify-center gap-3 rounded-md px-6 text-xs font-semibold uppercase tracking-[.16em] text-white transition disabled:opacity-50"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15 text-sm font-black">
                Z
              </span>
              Buy now with Ziina
            </button>

            {notice && (
              <div
                role="status"
                className={`mt-4 border p-4 text-sm ${
                  noticeSuccess
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {notice}
              </div>
            )}

            <div className="mt-8 border border-[#e4d9cd] bg-white">
              {[
                "Authenticity and artist provenance included",
                "Secure packaging for artwork protection",
                "Order updates by email and account dashboard",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3 border-b border-[#eee6de] px-5 py-4 text-sm last:border-0"
                >
                  <Check size={16} className="text-[#9a704f]" />
                  {text}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Trust({ icon, title, text }) {
  return (
    <div className="border border-[#e4d9cd] bg-white p-4">
      <div className="text-[#9a704f]">{icon}</div>
      <p className="mt-3 text-xs font-semibold">{title}</p>
      <p className="mt-1 text-[11px] text-[#82776d]">{text}</p>
    </div>
  );
}
