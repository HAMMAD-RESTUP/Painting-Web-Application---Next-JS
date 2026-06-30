"use client";

export default function OriginalPaintingsintro() {
  return (
    <section className="bg-[#1d1d1a]">
      <div className="relative min-h-[620px] w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/original-painting hero.png')",
          }}
        />

        {/* Full dark overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Strong bottom shadow */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#1d1d1a] via-[#1d1d1a]/80 to-transparent" />

        {/* Extra deep bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#1d1d1a] via-[#1d1d1a]/95 to-transparent" />

        {/* Soft top shade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[620px] items-end justify-center px-6 pb-20 text-center md:px-10 md:pb-24">
          <div className="max-w-4xl">
            <h1 className="font-serif text-4xl font-normal leading-tight text-white md:text-6xl">
              Original Paintings by <br className="hidden md:block" />
              Rakhshanda
            </h1>

            <p className="mt-6 text-sm font-normal text-white md:text-xl">
              Countless hours in the studio breathed life into these paintings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}