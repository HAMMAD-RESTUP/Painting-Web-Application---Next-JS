"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, LoaderCircle, PackageSearch, RefreshCw } from "lucide-react";
import { api, getApiErrorMessage } from "../../lib/api";

const STEPS = ["confirmed", "processing", "shipped", "delivered"];
const extractOrder = (payload) => payload?.data?.order || payload?.order || payload?.data || payload || null;

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = Array.isArray(params?.orderNumber) ? params.orderNumber[0] : params?.orderNumber;
  const token = searchParams.get("token") || "";

  const query = useQuery({
    queryKey: ["order-tracking", orderNumber, token],
    enabled: Boolean(orderNumber && token),
    retry: false,
    queryFn: async () => {
      const response = await api.get(`/order/track/${encodeURIComponent(orderNumber)}`, { params: { token } });
      return response.data;
    },
  });

  const order = extractOrder(query.data);
  const status = String(order?.orderStatus || order?.status || "pending").toLowerCase();
  const activeIndex = STEPS.indexOf(status);

  return (
    <section className="min-h-[72vh] bg-[#fffdfb] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/shop" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#6f5543]"><ArrowLeft size={16} /> Back to shop</Link>
        <div className="rounded-[2rem] border border-[#eadfd6] bg-white p-7 shadow-[0_24px_70px_rgba(61,43,32,0.07)] sm:p-10">
          <div className="text-center">
            <PackageSearch className="mx-auto text-[#9a7458]" size={42} />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7458]">Secure order tracking</p>
            <h1 className="heading-text mt-2 text-4xl text-[#40342e]">Order #{orderNumber}</h1>
          </div>

          {!token ? (
            <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-amber-900">This tracking link is incomplete. Open the secure link included in your order email.</p>
          ) : query.isLoading ? (
            <div className="flex min-h-52 items-center justify-center"><LoaderCircle className="animate-spin text-[#7a5c48]" size={30} /></div>
          ) : query.isError ? (
            <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
              <p className="font-semibold text-rose-800">{getApiErrorMessage(query.error)}</p>
              <button onClick={() => query.refetch()} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-rose-800"><RefreshCw size={15} /> Try again</button>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-3 sm:grid-cols-4">
                {STEPS.map((step, index) => {
                  const complete = activeIndex >= index;
                  return (
                    <div key={step} className={`rounded-2xl border p-4 text-center ${complete ? "border-emerald-200 bg-emerald-50" : "border-[#eadfd6] bg-[#faf7f4]"}`}>
                      <CheckCircle2 className={`mx-auto ${complete ? "text-emerald-600" : "text-[#c7b8ad]"}`} size={22} />
                      <p className="mt-2 text-sm font-semibold capitalize text-[#52443b]">{step}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 rounded-2xl bg-[#faf5f1] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7458]">Current status</p>
                <p className="heading-text mt-2 text-3xl capitalize text-[#40342e]">{status}</p>
                <p className="mt-3 text-sm leading-6 text-[#756960]">Updates are also sent to the email address used at checkout.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
