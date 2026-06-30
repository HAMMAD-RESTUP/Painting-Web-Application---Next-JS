"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import {
  CART_EVENT,
  CART_STORAGE_KEY,
  clearCart,
  getCartSummary,
  readCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../lib/localCart";

const formatMoney = (amount, currency = "AED") =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: String(currency || "AED").toUpperCase(),
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  const loadCart = useCallback(() => {
    setItems(readCart());
    setReady(true);
  }, []);

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => loadCart();
    const handleStorage = (event) => {
      if (!event.key || event.key === CART_STORAGE_KEY) loadCart();
    };

    window.addEventListener(CART_EVENT, handleCartUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(CART_EVENT, handleCartUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadCart]);

  const summary = useMemo(() => getCartSummary(items), [items]);

  const updateQuantity = (paintingId, quantity) => {
    try {
      setMessage("");
      setItems(updateCartItemQuantity(paintingId, quantity));
    } catch (error) {
      setMessage(error?.message || "Quantity could not be updated.");
    }
  };

  const removeItem = (paintingId) => {
    try {
      setMessage("");
      setItems(removeCartItem(paintingId));
    } catch (error) {
      setMessage(error?.message || "Artwork could not be removed.");
    }
  };

  const removeAll = () => {
    setItems(clearCart());
    setMessage("Your cart has been cleared.");
  };

  if (!ready) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#faf5f1]">
        <div className="text-center text-[#6f5543]">
          <LoaderCircle className="mx-auto animate-spin" />
          <p className="mt-3 text-sm">Loading your cart...</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[75vh] bg-[#faf5f1] px-5 py-20 sm:py-28">
        <section className="mx-auto max-w-2xl rounded-3xl border border-[#eadfd6] bg-[#fffdfb] px-6 py-14 text-center shadow-[0_24px_70px_rgba(76,64,56,.08)] sm:px-12">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f3e8df] text-[#9a7454]">
            <ShoppingBag size={31} strokeWidth={1.6} />
          </div>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[.24em] text-[#b07f59]">
            Your collection
          </p>
          <h1 className="mt-3 text-4xl font-medium text-[#4c4038] sm:text-5xl">
            Your cart is empty
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#83766c]">
            Discover original paintings and add the artwork you love. Your cart
            will remain saved on this device while you continue browsing.
          </p>
          {message && (
            <p className="mt-4 text-sm font-medium text-[#6f5543]">{message}</p>
          )}
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#6f5543] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#b07f59]"
          >
            Explore artwork <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf5f1] px-5 pb-24 pt-16 text-[#4c4038] sm:pt-20">
      <div className="mx-auto max-w-[1240px]">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[#83766c] transition hover:text-[#b07f59]"
        >
          <ArrowLeft size={15} /> Continue shopping
        </Link>

        <div className="mt-8 flex flex-col gap-4 border-b border-[#dfd1c6] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#b07f59]">
              Selected artwork
            </p>
            <h1 className="mt-3 text-4xl font-medium sm:text-5xl">Your cart</h1>
            <p className="mt-3 text-sm text-[#83766c]">
              {summary.itemCount} {summary.itemCount === 1 ? "item" : "items"}
              {" · "}saved on this device
            </p>
          </div>

          <button
            type="button"
            onClick={removeAll}
            className="inline-flex items-center gap-2 self-start text-xs font-semibold text-[#9b5b53] transition hover:text-[#753d37] sm:self-auto"
          >
            <Trash2 size={15} /> Clear cart
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-lg border border-[#dfcec0] bg-[#fffdfb] px-4 py-3 text-sm text-[#6f5543]">
            {message}
          </div>
        )}

        <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <section className="overflow-hidden rounded-2xl border border-[#eadfd6] bg-[#fffdfb] shadow-[0_18px_55px_rgba(76,64,56,.06)]">
            {items.map((item) => {
              const quantity = Math.max(1, Number(item.quantity || 1));
              const hasKnownStock =
                item.stock !== null && item.stock !== undefined;
              const stock = hasKnownStock
                ? Math.max(0, Number(item.stock || 0))
                : null;
              const atStockLimit =
                hasKnownStock && (stock <= 0 || quantity >= stock);
              const productHref = item.slug
                ? `/shop/${encodeURIComponent(item.slug)}`
                : `/shop/${item.paintingId}`;

              return (
                <article
                  key={item.paintingId}
                  className="grid gap-5 border-b border-[#eadfd6] p-5 last:border-0 sm:grid-cols-[150px_minmax(0,1fr)] sm:p-6"
                >
                  <Link
                    href={productHref}
                    className="aspect-[4/5] overflow-hidden rounded-xl bg-[#f3e8df]"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-[#a58267]">
                        <ShoppingBag size={28} />
                      </span>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-col justify-between gap-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#b07f59]">
                          {item.category || "Original artwork"}
                        </p>
                        <Link href={productHref}>
                          <h2 className="mt-2 text-2xl font-medium leading-tight transition hover:text-[#b07f59]">
                            {item.title}
                          </h2>
                        </Link>
                        <p className="mt-3 text-sm font-semibold text-[#6f5543]">
                          {formatMoney(item.unitPrice, item.currency)} each
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.paintingId)}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#83766c] transition hover:bg-[#fff0ed] hover:text-[#b85f54]"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#83766c]">
                          Quantity
                        </p>
                        <div className="flex h-11 overflow-hidden rounded-lg border border-[#dfcec0] bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.paintingId, quantity - 1)
                            }
                            className="grid w-11 place-items-center transition hover:bg-[#f8efe8]"
                            aria-label={`Decrease ${item.title} quantity`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="grid min-w-11 place-items-center border-x border-[#eadfd6] px-2 text-sm font-semibold">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.paintingId, quantity + 1)
                            }
                            disabled={atStockLimit}
                            className="grid w-11 place-items-center transition hover:bg-[#f8efe8] disabled:cursor-not-allowed disabled:opacity-35"
                            aria-label={`Increase ${item.title} quantity`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        {hasKnownStock && (
                          <p
                            className={`mt-2 text-[11px] ${
                              stock > 0 ? "text-[#83766c]" : "text-[#b85f54]"
                            }`}
                          >
                            {stock > 0 ? `${stock} available` : "Out of stock"}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#83766c]">
                          Item total
                        </p>
                        <p className="mt-2 text-lg font-semibold text-[#4c4038]">
                          {formatMoney(
                            Number(item.unitPrice || 0) * quantity,
                            item.currency,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="rounded-2xl border border-[#eadfd6] bg-[#fffdfb] p-6 shadow-[0_20px_60px_rgba(76,64,56,.08)] lg:sticky lg:top-28">
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b07f59]">
              Order summary
            </p>
            <h2 className="mt-3 text-3xl font-medium">Ready to collect</h2>

            <div className="mt-7 space-y-4 border-y border-[#eadfd6] py-5 text-sm">
              <div className="flex items-center justify-between gap-4 text-[#83766c]">
                <span>Items</span>
                <span>{summary.itemCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-[#83766c]">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-2 text-lg font-semibold">
                <span>Subtotal</span>
                <span>{formatMoney(summary.subtotal, summary.currency)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#6d2cff] px-5 text-xs font-semibold uppercase tracking-[.14em] text-white shadow-[0_16px_35px_rgba(109,44,255,.24)] transition hover:-translate-y-0.5 hover:bg-[#5620d4]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15 text-sm font-black">
                Z
              </span>
              Secure Ziina checkout
              <ArrowRight size={15} />
            </Link>

            <div className="mt-6 space-y-4 border-t border-[#eadfd6] pt-6">
              <TrustRow
                icon={<ShieldCheck size={17} />}
                title="Secure payment"
                text="Payment details are handled by Ziina."
              />
              <TrustRow
                icon={<PackageCheck size={17} />}
                title="Protective packing"
                text="Artwork is packed by the studio."
              />
              <TrustRow
                icon={<Truck size={17} />}
                title="Worldwide delivery"
                text="Shipping is confirmed during checkout."
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function TrustRow({ icon, title, text }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-[#b07f59]">{icon}</span>
      <span>
        <strong className="block text-xs text-[#4c4038]">{title}</strong>
        <span className="mt-1 block text-[11px] leading-5 text-[#83766c]">
          {text}
        </span>
      </span>
    </div>
  );
}
