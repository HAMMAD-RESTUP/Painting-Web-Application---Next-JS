"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock3,
  CreditCard,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function CheckoutPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.price || 0) * (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const formattedSubtotal = subtotal.toFixed(2);

  useEffect(() => {
    setMounted(true);

    try {
      const storedCart = JSON.parse(localStorage.getItem("courseCart") || "[]");
      setCartItems(Array.isArray(storedCart) ? storedCart : []);
    } catch {
      setCartItems([]);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "cardName",
      "cardNumber",
      "expiry",
      "cvc",
    ];

    return requiredFields.every((field) => formData[field].trim() !== "");
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) return;

    if (!validateForm()) {
      alert("Please fill all checkout fields.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const existingOrders = JSON.parse(localStorage.getItem("courseOrders") || "[]");
      const existingPurchased = JSON.parse(
        localStorage.getItem("purchasedCourses") || "[]"
      );

      const newOrder = {
        id: `ORDER-${Date.now()}`,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        items: cartItems,
        total: subtotal,
        paymentStatus: "paid",
        orderStatus: "completed",
        createdAt: new Date().toISOString(),
      };

      const purchasedCourses = cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        duration: item.duration,
        lectures: item.lectures,
        href: item.href,
        learningUrl: `/course/learning/${item.id}`,
        purchasedAt: new Date().toISOString(),
      }));

      localStorage.setItem(
        "courseOrders",
        JSON.stringify([newOrder, ...existingOrders])
      );

      localStorage.setItem(
        "purchasedCourses",
        JSON.stringify([...existingPurchased, ...purchasedCourses])
      );

      localStorage.removeItem("courseCart");
      window.dispatchEvent(new Event("courseCartUpdated"));

      setSuccess(true);
      setIsProcessing(false);

      setTimeout(() => {
        router.push(`/course/learning/${cartItems[0].id}`);
      }, 1200);
    }, 1300);
  };

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] text-[#1e1e1c]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#a98745] border-t-transparent" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#685f56]">
            Loading Checkout
          </p>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 text-[#1e1e1c]">
        <div className="max-w-xl rounded-[34px] border border-[#e8e2d7] bg-white/80 p-10 text-center shadow-[0_22px_65px_rgba(45,35,24,0.08)] backdrop-blur-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f4ed] text-[#a98745]">
            <CheckCircle2 size={36} strokeWidth={1.6} />
          </div>

          <h1
            className={`${cormorant.className} mt-6 text-[48px] font-normal italic leading-none text-[#211e1a]`}
          >
            Payment Successful
          </h1>

          <p className="mx-auto mt-4 max-w-md text-[14px] leading-7 text-[#6c635a]">
            Your course has been unlocked. Redirecting you to your learning
            portal.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#1e1e1c]">

      {/* Checkout Content */}
      <section className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_390px] lg:px-8 lg:py-16">
        {/* Form */}
        <form
          onSubmit={handlePlaceOrder}
          className="rounded-[30px] border border-[#e8e2d7] bg-white/75 p-5 shadow-[0_18px_55px_rgba(45,35,24,0.06)] backdrop-blur-md sm:p-7"
        >
          <div className="mb-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a98745]">
              Billing Details
            </p>

            <h2
              className={`${cormorant.className} mt-2 text-[42px] font-normal italic leading-none text-[#211e1a]`}
            >
              Your Information
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              icon={<UserRound size={16} />}
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            <InputField
              icon={<Mail size={16} />}
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <InputField
              icon={<Phone size={16} />}
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+971 000 000"
            />

            <InputField
              icon={<CreditCard size={16} />}
              label="Name On Card"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="Card holder name"
            />

            <div className="sm:col-span-2">
              <InputField
                icon={<CreditCard size={16} />}
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="4242 4242 4242 4242"
              />
            </div>

            <InputField
              icon={<CreditCard size={16} />}
              label="Expiry Date"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="MM / YY"
            />

            <InputField
              icon={<LockKeyhole size={16} />}
              label="CVC"
              name="cvc"
              value={formData.cvc}
              onChange={handleChange}
              placeholder="123"
            />
          </div>

          <div className="mt-7 rounded-[24px] bg-[#f8f4ed] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-1 text-[#a98745]" />
              <div>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#211e1a]">
                  Demo Payment
                </h3>

                <p className="mt-2 text-[13px] leading-6 text-[#6c635a]">
                  This checkout is frontend demo only. Backend/payment gateway
                  integration can replace this logic later.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={cartItems.length === 0 || isProcessing}
            className={`mt-7 inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full px-6 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 ${
              cartItems.length === 0 || isProcessing
                ? "cursor-not-allowed bg-[#d9d4cf] text-white"
                : "bg-[#211e1a] text-white shadow-[0_16px_36px_rgba(33,30,26,0.18)] hover:-translate-y-1 hover:bg-[#a98745]"
            }`}
          >
            {isProcessing ? "Processing Payment..." : "Pay Now"}
            {!isProcessing && <ArrowRight size={15} />}
          </button>
        </form>

        {/* Summary */}
        <aside className="h-fit rounded-[30px] border border-[#e8e2d7] bg-white/80 p-6 shadow-[0_20px_60px_rgba(45,35,24,0.08)] backdrop-blur-md lg:sticky lg:top-24">
          <h2
            className={`${cormorant.className} text-[40px] font-normal italic leading-none text-[#211e1a]`}
          >
            Order Summary
          </h2>

          <p className="mt-3 text-[13px] leading-6 text-[#6c635a]">
            Review your selected courses before completing payment.
          </p>

          <div className="mt-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="rounded-[22px] bg-[#f8f4ed] p-5 text-center">
                <ShoppingBag
                  size={28}
                  className="mx-auto text-[#a98745]"
                  strokeWidth={1.5}
                />
                <p className="mt-3 text-[13px] leading-6 text-[#6c635a]">
                  Your cart is empty.
                </p>

                <Link
                  href="/courses"
                  className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a98745]"
                >
                  Explore Courses
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <CheckoutItem key={item.id} item={item} />
              ))
            )}
          </div>

          <div className="mt-6 space-y-4 border-y border-[#eee6dc] py-5">
            <SummaryRow label="Total Items" value={cartCount} />
            <SummaryRow label="Subtotal" value={`AED ${formattedSubtotal}`} />
            <SummaryRow label="Discount" value="AED 0.00" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6c635a]">
              Total
            </span>

            <span className="text-[30px] font-bold leading-none text-[#211e1a]">
              AED {formattedSubtotal}
            </span>
          </div>

          <div className="mt-6 space-y-3 rounded-[22px] bg-[#f8f4ed] p-4">
            <SummaryBenefit icon={<BadgeCheck size={15} />} text="Lifetime course access" />
            <SummaryBenefit icon={<BookOpen size={15} />} text="HD guided lectures" />
            <SummaryBenefit icon={<ShieldCheck size={15} />} text="Secure checkout" />
          </div>
        </aside>
      </section>
    </main>
  );
}

function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b7d70]">
        {label}
      </span>

      <span className="flex min-h-[54px] items-center gap-3 rounded-[18px] border border-[#e5ddd5] bg-[#fdfbf8] px-4 transition focus-within:border-[#a98745] focus-within:bg-white">
        <span className="text-[#a98745]">{icon}</span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-[14px] text-[#211e1a] outline-none placeholder:text-[#aaa097]"
        />
      </span>
    </label>
  );
}

function CheckoutItem({ item }) {
  const quantity = item.quantity || 1;
  const total = Number(item.price || 0) * quantity;

  return (
    <div className="grid grid-cols-[74px_1fr] gap-4 rounded-[22px] border border-[#eee6dc] bg-white p-3">
      <div className="overflow-hidden rounded-[16px] bg-[#efe7dc]">
        <img
          src={item.image}
          alt={item.title}
          className="h-[76px] w-full object-cover"
        />
      </div>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a98745]">
          {item.category || "Course"}
        </p>

        <h3 className="mt-1 text-[13px] font-semibold leading-5 text-[#211e1a]">
          {item.title}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#7a7067]">Qty {quantity}</span>
          <span className="text-[13px] font-semibold text-[#211e1a]">
            AED {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-[22px] bg-[#f8f4ed] px-4 py-5 text-center">
      <p className="text-[24px] font-bold leading-none text-[#211e1a]">
        {value}
      </p>

      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7a7067]">
        {label}
      </p>
    </div>
  );
}

function SummaryBenefit({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-[12px] font-medium text-[#5f554b]">
      <span className="text-[#a98745]">{icon}</span>
      {text}
    </div>
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