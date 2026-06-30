import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#fffdfb] px-5 py-16">
      <div className="max-w-xl text-center">
        <p className="special-text text-[6rem] text-[#d8c6b8] sm:text-[8rem]">404</p>
        <h1 className="heading-text mt-5 text-4xl text-[#40342e] sm:text-5xl">This page has moved</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-[#766a62]">Explore the current collection, discover courses, or return to the studio home page.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="rounded-full bg-[#6f5543] px-6 py-3 text-sm font-semibold text-white">Explore artwork</Link>
          <Link href="/courses" className="rounded-full border border-[#d8c7ba] px-6 py-3 text-sm font-semibold text-[#5c4739]">Browse courses</Link>
        </div>
      </div>
    </section>
  );
}
