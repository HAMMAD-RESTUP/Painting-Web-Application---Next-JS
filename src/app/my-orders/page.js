"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, LoaderCircle, Package, RefreshCw, ShoppingBag } from "lucide-react";
import { api, getApiErrorMessage } from "../lib/api";

const STATUS_STYLES = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  confirmed: "border-sky-200 bg-sky-50 text-sky-800",
  processing: "border-violet-200 bg-violet-50 text-violet-800",
  shipped: "border-indigo-200 bg-indigo-50 text-indigo-800",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
};

const extractOrders = (payload) => {
  const candidates = [
    payload?.data?.orders,
    payload?.orders,
    payload?.data,
    payload,
  ];

  return candidates.find(Array.isArray) || [];
};

const formatMoney = (value, currency = "AED") =>
  `${currency} ${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
};

export default function MyOrdersPage() {
  const query = useQuery({
    queryKey: ["painting-orders", "mine"],
    queryFn: async () => {
      const response = await api.get("/order/my-orders");
      return response.data;
    },
    retry: false,
    staleTime: 30_000,
  });

  const orders = useMemo(() => extractOrders(query.data), [query.data]);
  const unauthorized = query.error?.response?.status === 401;

  return (
    <section className="min-h-[72vh] bg-[#fffdfb] px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7458]">
              Your account
            </p>
            <h1 className="heading-text text-4xl text-[#3f332d] sm:text-5xl">
              My Painting Orders
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#766a62] sm:text-base">
              Review your purchases and follow each painting from confirmation to delivery.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9c9bd] bg-white px-5 py-3 text-sm font-semibold text-[#5f493b] transition hover:-translate-y-0.5 hover:border-[#8b6a53] hover:shadow-sm"
          >
            Continue shopping <ArrowRight size={16} />
          </Link>
        </div>

        {query.isLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-[2rem] border border-[#eadfd6] bg-white">
            <LoaderCircle className="animate-spin text-[#7a5c48]" size={30} />
          </div>
        ) : unauthorized ? (
          <div className="rounded-[2rem] border border-[#eadfd6] bg-white p-8 text-center sm:p-12">
            <ShoppingBag className="mx-auto mb-5 text-[#9a7458]" size={38} />
            <h2 className="heading-text text-3xl text-[#40342e]">Sign in to view your orders</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#7b6f67]">
              Orders purchased while signed in will appear here. Guest purchases remain available through the secure tracking link sent by email.
            </p>
            <Link href="/login?redirect=/my-orders" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#6f5543] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#594334]">
              Sign in <ArrowRight size={16} />
            </Link>
          </div>
        ) : query.isError ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="font-semibold text-rose-800">{getApiErrorMessage(query.error)}</p>
            <button onClick={() => query.refetch()} className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-5 py-2.5 text-sm font-semibold text-rose-800">
              <RefreshCw size={15} /> Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[2rem] border border-[#eadfd6] bg-white p-10 text-center sm:p-14">
            <Package className="mx-auto mb-5 text-[#aa8062]" size={42} />
            <h2 className="heading-text text-3xl text-[#40342e]">No painting orders yet</h2>
            <p className="mx-auto mt-3 max-w-lg text-[#7b6f67]">When you purchase a painting while signed in, its delivery progress will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => {
              const orderId = order?._id || order?.id;
              const orderNumber = order?.orderNumber || order?.reference || String(orderId || "").slice(-8).toUpperCase();
              const status = String(order?.orderStatus || order?.status || "pending").toLowerCase();
              const items = Array.isArray(order?.items) ? order.items : [];
              const total = order?.totalAmount ?? order?.grandTotal ?? order?.total ?? 0;
              const currency = order?.currency || "AED";

              return (
                <article key={orderId || orderNumber} className="rounded-[1.75rem] border border-[#eadfd6] bg-white p-5 shadow-[0_18px_50px_rgba(67,48,37,0.05)] sm:p-7">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="heading-text text-2xl text-[#40342e]">Order #{orderNumber}</h2>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
                          {status}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#7b6f67]">
                        <span className="inline-flex items-center gap-2"><CalendarDays size={15} /> {formatDate(order?.createdAt)}</span>
                        <span>{items.length || order?.itemCount || 0} item(s)</span>
                        <span className="font-semibold text-[#5c4739]">{formatMoney(total, currency)}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#faf5f1] px-5 py-4 text-sm text-[#6f625a] lg:min-w-56">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#9a7458]">Payment</p>
                      <p className="mt-1 font-semibold capitalize text-[#4c3d34]">{order?.paymentStatus || "pending"}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
