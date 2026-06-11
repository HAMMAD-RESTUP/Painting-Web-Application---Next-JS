"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price || 0) * (item.quantity || 1),
      0
    );
  }, [cartItems]);

  const loadCart = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("courseCart") || "[]");
      setCartItems(Array.isArray(storedCart) ? storedCart : []);
    } catch {
      setCartItems([]);
    }
  };

  const saveCart = (items) => {
    localStorage.setItem("courseCart", JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new Event("courseCartUpdated"));
  };

  useEffect(() => {
    setMounted(true);
    loadCart();

    window.addEventListener("courseCartUpdated", loadCart);
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("courseCartUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  const increaseQuantity = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );

    saveCart(updatedItems);
  };

  const decreaseQuantity = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
        : item
    );

    saveCart(updatedItems);
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const handleCheckout = () => {
    /*
      Backend integration ke baad yahan auth check lagana.
      Filhal frontend demo ke liye login page par bhej raha hai.
      Login ke baad checkout/payment page bana sakte ho.
    */

    localStorage.setItem("checkoutIntent", "course");
    router.push("/login?redirect=/checkout");
  };

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] text-[#1e1e1c]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#a98745] border-t-transparent" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#685f56]">
            Loading Cart
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#1e1e1c]">
   
      {/* Cart Content */}
      <section className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-16">
        {/* Left */}
        <div>
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="rounded-[28px] border border-[#e8e2d7] bg-white/70 p-4 shadow-[0_18px_50px_rgba(45,35,24,0.06)] backdrop-blur-md sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#211e1a]">
                  Cart Courses
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a7657] transition hover:text-[#211e1a]"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Summary */}
        <aside className="h-fit rounded-[28px] border border-[#e8e2d7] bg-white/75 p-6 shadow-[0_18px_55px_rgba(45,35,24,0.08)] backdrop-blur-md">
          <h2
            className={`${cormorant.className} text-[38px] font-normal italic leading-none text-[#211e1a]`}
          >
            Order Summary
          </h2>

          <div className="mt-6 space-y-4 border-b border-[#eee6dc] pb-5">
            <SummaryRow label="Total Courses" value={cartCount} />
            <SummaryRow label="Subtotal" value={`AED ${subtotal}`} />
            <SummaryRow label="Discount" value="AED 0" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6c635a]">
              Total
            </span>

            <span className="text-[28px] font-bold leading-none text-[#211e1a]">
              AED {subtotal}
            </span>
          </div>

          <button
            type="button"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
            className={`mt-7 inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full px-6 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 ${
              cartItems.length === 0
                ? "cursor-not-allowed bg-[#d9d4cf] text-white"
                : "bg-[#211e1a] text-white shadow-[0_16px_36px_rgba(33,30,26,0.18)] hover:-translate-y-1 hover:bg-[#a98745]"
            }`}
          >
            Proceed to Checkout
            <ArrowRight size={15} />
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] tracking-[0.04em] text-[#8b837b]">
            <LockKeyhole size={14} />
            Secure checkout
          </div>

          <div className="mt-6 rounded-[20px] bg-[#f8f4ed] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a98745]">
              Learning Access
            </p>

            <p className="mt-2 text-[13px] leading-6 text-[#6c635a]">
              After checkout, your purchased course will be unlocked inside your
              learning portal.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const itemTotal = Number(item.price || 0) * (item.quantity || 1);

  return (
    <article className="grid gap-4 rounded-[24px] border border-[#eee6dc] bg-white p-4 shadow-[0_12px_34px_rgba(45,35,24,0.04)] sm:grid-cols-[150px_1fr]">
      <Link
        href={item.href || "#"}
        className="block overflow-hidden rounded-[20px] bg-[#efe7dc]"
      >
        <img
          src={item.image}
          alt={item.title}
          className="h-[150px] w-full object-cover transition duration-500 hover:scale-105 sm:h-full"
        />
      </Link>

      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a98745]">
              {item.category || "Course"}
            </p>

            <h3
              className={`${cormorant.className} mt-2 text-[34px] font-normal italic leading-[0.95] tracking-[-0.04em] text-[#211e1a]`}
            >
              {item.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8f4ed] text-[#8b7d70] transition hover:bg-[#211e1a] hover:text-white"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.duration && (
            <InfoBadge icon={<Clock3 size={12} />} text={item.duration} />
          )}

          {item.lectures && (
            <InfoBadge icon={<BookOpen size={12} />} text={item.lectures} />
          )}
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b7d70]">
              Quantity
            </p>

            <div className="mt-2 inline-flex items-center gap-3 rounded-full border border-[#e5ddd5] bg-[#f8f4ed] px-3 py-2">
              <button
                type="button"
                onClick={() => onDecrease(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#211e1a] transition hover:bg-[#211e1a] hover:text-white"
              >
                <Minus size={14} />
              </button>

              <span className="min-w-6 text-center text-[13px] font-semibold text-[#211e1a]">
                {item.quantity || 1}
              </span>

              <button
                type="button"
                onClick={() => onIncrease(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#211e1a] transition hover:bg-[#211e1a] hover:text-white"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b7d70]">
              Course Price
            </p>

            <p className="mt-1 text-[24px] font-bold leading-none text-[#211e1a]">
              AED {itemTotal}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyCart() {
  return (
    <div className="rounded-[30px] border border-[#e8e2d7] bg-white/70 px-6 py-16 text-center shadow-[0_18px_50px_rgba(45,35,24,0.06)] backdrop-blur-md">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f4ed] text-[#a98745]">
        <ShoppingBag size={32} strokeWidth={1.5} />
      </div>

      <h2
        className={`${cormorant.className} mt-6 text-[44px] font-normal italic leading-none text-[#211e1a]`}
      >
        Your cart is empty
      </h2>

      <p className="mx-auto mt-4 max-w-md text-[14px] leading-7 text-[#6c635a]">
        You have not added any courses yet. Explore guided art courses and add
        your favorite course to continue.
      </p>

      <Link
        href="/courses"
        className="mt-7 inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-[#211e1a] px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#a98745]"
      >
        Explore Courses
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function InfoBadge({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f4ed] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#5f554b]">
      <span className="text-[#aa8747]">{icon}</span>
      {text}
    </span>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[13px]">
      <span className="font-medium text-[#6c635a]">{label}</span>
      <span className="font-semibold text-[#211e1a]">{value}</span>
    </div>
  );
}