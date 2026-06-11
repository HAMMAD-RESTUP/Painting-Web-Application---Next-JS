"use client";

import { SlidersHorizontal } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Dome of the Rock",
    category: "Geometry, Arabic Calligraphy",
    price: "£5,000.00",
    image: "/images/product-1.png",
    soldOut: false,
  },
  {
    id: 2,
    title: "Hamd",
    category: "Arabic Calligraphy, Islamic Illumination",
    price: "£2,800.00",
    image: "/images/product-2.png",
    soldOut: true,
  },
  {
    id: 3,
    title: "Mahtab",
    category: "Geometry",
    price: "£5,000.00",
    image: "/images/product-3.png",
    soldOut: false,
  },
  {
    id: 4,
    title: "Noor",
    category: "Islamic Art, Geometry",
    price: "£3,200.00",
    image: "/images/product-4.png",
    soldOut: false,
  },
  {
    id: 5,
    title: "Ayatul Kursi",
    category: "Arabic Calligraphy",
    price: "£4,500.00",
    image: "/images/product-5.png",
    soldOut: true,
  },
  {
    id: 6,
    title: "Golden Pattern",
    category: "Islamic Illumination",
    price: "£3,900.00",
    image: "/images/product-6.png",
    soldOut: false,
  },
];

export default function Originalpaintingssection() {
  return (
    <section className="bg-white px-5 py-20 text-black md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-20 text-center">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-black md:text-6xl">
            All Original Paintings
          </h1>
        </div>

        {/* Top Row */}
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex bg-black px-3 py-1 text-sm font-medium text-white">
            Collection: ORIGINAL ARTWORKS
          </div>

          <button className="flex items-center gap-2 border border-black bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white">
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Image */}
              <div className="relative aspect-[4/4.8] overflow-hidden bg-neutral-100">
                {product.soldOut && (
                  <span className="absolute left-3 top-3 z-10 bg-black px-3 py-2 text-xs font-semibold text-white">
                    Sold Out
                  </span>
                )}

                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className="mt-3 flex items-start justify-between gap-5">
                <div>
                  <h3 className="text-base font-bold text-black md:text-lg">
                    {product.title}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-black/80 md:text-base">
                    {product.category}
                  </p>
                </div>

                <p className="shrink-0 text-lg font-bold text-black md:text-xl">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}