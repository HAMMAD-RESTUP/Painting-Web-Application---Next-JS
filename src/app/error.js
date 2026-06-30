"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#fffdfb] px-5 py-16">
      <div className="max-w-xl rounded-[2rem] border border-[#eadfd6] bg-white p-9 text-center shadow-[0_24px_70px_rgba(61,43,32,0.07)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7458]">Something went wrong</p>
        <h1 className="heading-text mt-3 text-4xl text-[#40342e]">We could not load this page</h1>
        <p className="mt-4 leading-7 text-[#766a62]">Please try again. Your cart and account information have not been changed.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="rounded-full bg-[#6f5543] px-6 py-3 text-sm font-semibold text-white">Try again</button>
          <Link href="/" className="rounded-full border border-[#d8c7ba] px-6 py-3 text-sm font-semibold text-[#5c4739]">Return home</Link>
        </div>
      </div>
    </section>
  );
}
