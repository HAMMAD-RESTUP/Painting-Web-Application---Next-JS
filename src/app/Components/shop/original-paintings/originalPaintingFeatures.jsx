"use client";

const featureCards = [
  {
    id: 1,
    title: "Limited Edition Prints",
    button: "Shop Prints",
    image: "/images/limited-edition-prints.jpg",
  },
  {
    id: 2,
    title: "Calligraphy Kit",
    button: "Shop Calligraphy Kit",
    image: "/images/calligraphy-kit.jpg",
  },
];

export default function OriginalPaintingFeatures() {
  return (
    <section className="bg-[#1d1d1a]">
      {/* Featured Product */}
      <div className="relative min-h-[820px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/featured-product-bg.jpg')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Bottom Shadow */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#1d1d1a] via-[#1d1d1a]/70 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[820px] flex-col items-center px-5 pt-12 text-center text-white">
          <p className="mb-4 text-sm font-bold uppercase tracking-wide">
            Featured Product
          </p>

          <h2 className="font-serif text-5xl font-normal leading-tight md:text-7xl">
            Dome of the Rock
          </h2>

          <button className="mt-8 bg-white px-8 py-4 text-sm font-medium text-black transition hover:bg-black hover:text-white">
            Shop Now
          </button>

          {/* Product Card */}
          <div className="mt-12 w-full max-w-[290px] bg-white/18 backdrop-blur-sm md:max-w-[330px]">
            <div className="bg-white p-3">
              <img
                src="/images/dome-of-rock-product.jpg"
                alt="Dome of the Rock"
                className="h-[330px] w-full object-cover md:h-[390px]"
              />
            </div>

            <div className="px-6 py-5 text-left text-white">
              <h3 className="text-base font-bold">Dome of the Rock</h3>

              <p className="mt-4 text-xl font-bold">£5000.00</p>


            </div>
          </div>
        </div>
      </div>

      {/* Two Feature Cards */}
      <div className="grid min-h-[360px] md:grid-cols-2">
        {featureCards.map((card) => (
          <div
            key={card.id}
            className="relative min-h-[360px] overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-105"
              style={{
                backgroundImage: `url('${card.image}')`,
              }}
            />

            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

            <div className="relative z-10 flex min-h-[360px] flex-col justify-end px-10 pb-12 text-white md:px-12">
              <h3 className="font-serif text-4xl font-normal md:text-5xl">
                {card.title}
              </h3>

              <button className="mt-8 w-fit border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black">
                {card.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Section */}
      <div className="bg-[#c99b05] px-5 py-24 md:px-10">
        <div className="mx-auto grid max-w-5xl items-center gap-10 bg-[#f5eddf] px-8 py-14 md:grid-cols-2 md:px-12">
          {/* Text */}
          <div>
            <h2 className="font-serif text-4xl font-normal leading-tight text-black md:text-6xl">
              Commission <br />
              Custom Artwork
            </h2>

            <p className="mt-8 max-w-md text-base leading-7 text-black md:text-lg">
              Maaida works directly with individual clients on bespoke paintings
              for their collection.
            </p>

            <button className="mt-8 bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-white hover:text-black">
              Commission Maaida
            </button>
          </div>

          {/* Artwork Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src="/images/commission-artwork.png"
              alt="Commission Custom Artwork"
              className="w-full max-w-[380px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}