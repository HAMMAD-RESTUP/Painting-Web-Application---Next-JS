"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import { ArrowUpRight, Search } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const categories = [
  "All",
  "Original Paintings",
  "Fine Art Prints",
  "Calligraphy",
  "Calligraphy Kit",
];

const products = [
  {
    title: "Kun Fayakun",
    price: "£1,200.00",
    category: "Calligraphy",
    tag: "Original",
    image: "/images/kun-fayakun.png",
    href: "/shop/kun-fayakun",
  },
  {
    title: "Nafas",
    price: "£1,350.00",
    category: "Original Paintings",
    tag: "Original",
    image: "/images/nafas.png",
    href: "/shop/nafas",
  },
  {
    title: "Alif Laam Meem",
    price: "£550.00",
    category: "Calligraphy",
    tag: "Islamic Art",
    image: "/images/alif-laam-meem.png",
    href: "/shop/alif-laam-meem",
  },
  {
    title: "Layl",
    price: "£1,350.00",
    category: "Original Paintings",
    tag: "Canvas",
    image: "/images/layl.png",
    href: "/shop/layl",
  },
  {
    title: "Sacred Light of Al-Quds",
    price: "£5,000.00",
    category: "Original Paintings",
    tag: "Featured",
    image: "/images/dome-of-the-rock.png",
    href: "/shop/dome-of-the-rock",
  },
  {
    title: "Salat Ala Nabi",
    price: "£1,350.00",
    category: "Calligraphy",
    tag: "Original",
    image: "/images/salat-ala-nabi.png",
    href: "/shop/salat-ala-nabi",
  },
  {
    title: "Soft Floral Print",
    price: "£120.00",
    category: "Fine Art Prints",
    tag: "Print",
    image: "/images/prints.jpg",
    href: "/shop/soft-floral-print",
  },
  {
    title: "Golden Memory Print",
    price: "£150.00",
    category: "Fine Art Prints",
    tag: "Limited Print",
    image: "/images/shop-category3.png",
    href: "/shop/golden-memory-print",
  },
  {
    title: "Arabic Calligraphy Kit",
    price: "£65.00",
    category: "Calligraphy Kit",
    tag: "Creative Kit",
    image: "/images/shop-category2.png",
    href: "/shop/calligraphy-kit",
  },
  {
    title: "Beginner Calligraphy Set",
    price: "£45.00",
    category: "Calligraphy Kit",
    tag: "Starter Kit",
    image: "/images/calligraphy-bg.png",
    href: "/shop/beginner-calligraphy-set",
  },
  {
    title: "Pattern Memory",
    price: "£420.00",
    category: "Original Paintings",
    tag: "Geometry",
    image: "/images/islamic-geometry.jpg",
    href: "/shop/pattern-memory",
  },
  {
    title: "Quiet Bloom",
    price: "£380.00",
    category: "Original Paintings",
    tag: "Floral",
    image: "/images/hero-1.jpg",
    href: "/shop/quiet-bloom",
  },
];

export default function ShopAllArtworks() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.tag.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <section className="relative overflow-hidden bg-[#f7f3ee] px-4 py-16 text-[#1e1e1c] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -left-44 top-16 h-[360px] w-[360px] rounded-full bg-[#eadcca] blur-3xl" />
      <div className="pointer-events-none absolute -right-44 bottom-20 h-[420px] w-[420px] rounded-full bg-[#ead8c2] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b8964f] sm:text-[11px]">
            Shop All
          </p>

          <h2
            className={`${cormorant.className} text-[48px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#171717] sm:text-[66px] md:text-[80px] lg:text-[94px]`}
          >
            Explore Every
            <span className="block">Artwork & Collection</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[14px] leading-7 text-[#625b52] sm:text-[16px]">
            Browse original paintings, Islamic calligraphy, premium prints and
            creative kits from Rakhshanda&apos;s studio.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mx-auto mt-10 flex max-w-[1050px] flex-col gap-5 sm:mt-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition duration-300 ${
                    isActive
                      ? "bg-[#1e1e1c] text-white shadow-[0_14px_32px_rgba(0,0,0,0.12)]"
                      : "bg-white/70 text-[#1e1e1c] hover:-translate-y-0.5 hover:bg-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <label className="relative mx-auto block w-full max-w-[360px] lg:mx-0">
            <span className="sr-only">Search products</span>

            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9c9185]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search artwork..."
              className="h-[48px] w-full rounded-full border border-black/5 bg-white/75 pl-11 pr-5 text-[13px] text-[#1e1e1c] outline-none shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition duration-300 placeholder:text-[#9c9185] focus:bg-white focus:ring-2 focus:ring-[#b8964f]/25"
            />
          </label>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={`${product.title}-${product.category}`}
                product={product}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-xl rounded-[28px] bg-white/70 px-6 py-12 text-center shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
            <h3
              className={`${cormorant.className} text-[42px] font-normal italic leading-[0.9] tracking-[-0.04em] text-[#1e1e1c]`}
            >
              No artwork found
            </h3>

            <p className="mt-4 text-[14px] leading-7 text-[#625b52]">
              Try another category or search term to explore more pieces.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{
        duration: 0.65,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="min-w-0"
    >
      <Link href={product.href} className="group block h-full">
        <div className="relative rounded-[24px] bg-[#efe5da] p-[9px] shadow-[0_18px_50px_rgba(45,35,24,0.09)] transition duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_30px_80px_rgba(45,35,24,0.15)]">
          <div className="relative overflow-hidden rounded-[18px] bg-white/75 p-[7px]">
            <div className="relative aspect-[0.82/1] overflow-hidden rounded-[13px] bg-[#eadfce]">
              <img
                src={product.image}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center transition duration-[1200ms] ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#1e1e1c] opacity-0 shadow-sm backdrop-blur-md transition duration-300 group-hover:opacity-100">
                {product.tag}
              </div>

              <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1e1e1c] opacity-0 shadow-sm backdrop-blur-md transition duration-300 group-hover:opacity-100 group-hover:bg-[#1e1e1c] group-hover:text-white">
                <ArrowUpRight size={17} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-1 pt-5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a2844d]">
            {product.category}
          </p>

          <h3
            className={`${cormorant.className} text-[30px] font-normal italic leading-none tracking-[-0.04em] text-[#1e1e1c] transition duration-300 group-hover:text-[#8f6f39] sm:text-[34px]`}
          >
            {product.title}
          </h3>

          <p className="mt-3 text-[14px] font-semibold text-[#756756]">
            {product.price}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}