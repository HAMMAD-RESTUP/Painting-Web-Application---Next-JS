import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import {
  ArrowRight,
  Brush,
  CalendarDays,
  Globe2,
  MapPin,
  Palette,
  Sparkles,
  Star,
} from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Artist | Rakhshinda Arshad | Rakhshinda Art",
  description:
    "Meet Rakhshinda Arshad, a UAE-based artist creating expressive paintings, Arabic calligraphy, Islamic geometry, and meaningful contemporary artworks.",
  keywords: [
    "Rakhshinda Art",
    "Rakhshinda Arshad",
    "Pakistan artist",
    "Arabic calligraphy artist",
    "Islamic geometry artist",
    "painting artist",
    "contemporary art",
    "fine art",
    "custom artwork",
    "art courses",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Artist | Rakhshinda Arshad",
    description:
      "Explore the artist profile of Rakhshinda Arshad, her creative journey, exhibitions, paintings, calligraphy, and art learning work.",
    url: "/about",
    siteName: "Rakhshinda Art",
    images: [
      {
        url: "/images/artist-rakhshinda.jpg",
        width: 1200,
        height: 1600,
        alt: "Rakhshinda Arshad Artist Portrait",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artist | Rakhshinda Arshad",
    description:
      "Discover Rakhshinda Arshad’s art journey, exhibitions, paintings, calligraphy, and creative courses.",
    images: ["/images/artist-rakhshinda.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ArtistPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rakhshinda Arshad",
    jobTitle: "Artist",
    nationality: "Pakistani",
    url: "/about",
    image: "/images/artist-rakhshinda.jpg",
    worksFor: {
      "@type": "Organization",
      name: "Rakhshinda Art",
    },
    knowsAbout: [
      "Painting",
      "Arabic Calligraphy",
      "Islamic Geometry",
      "Fine Art",
      "Art Courses",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(26px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeLeft {
          from {
            opacity: 0;
            transform: translateX(-28px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(28px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes softFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-up {
          animation: fadeUp 850ms ease both;
        }

        .animate-fade-left {
          animation: fadeLeft 900ms ease both;
        }

        .animate-fade-right {
          animation: fadeRight 900ms ease both;
        }

        .animate-delay-1 {
          animation-delay: 120ms;
        }

        .animate-delay-2 {
          animation-delay: 240ms;
        }

        .animate-delay-3 {
          animation-delay: 360ms;
        }

        .soft-float {
          animation: softFloat 4.2s ease-in-out infinite;
        }
      `}</style>

      <main className="min-h-screen bg-[#f7f4ef] text-[#211e1a]">
        <section className="relative overflow-hidden border-b border-[#e8e2d7] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="pointer-events-none absolute -left-32 top-12 h-[360px] w-[360px] rounded-full bg-[#eadcc9]/80 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-[#efe2d0]/80 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="animate-fade-left">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#e3d8c9] bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a98745]">
               
                Meet The Artist
              </p>

              <h1
                className={`${cormorant.className} mt-6 max-w-4xl text-[62px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#191714] sm:text-[84px] lg:text-[108px]`}
              >
                Rakhshinda
                <span className="block text-[#a98745]">Arshad</span>
              </h1>

              <p className="mt-6 max-w-2xl text-[15px] leading-8 text-[#6c635a]">
                Rakhshinda Arshad is a UAE-based artist creating meaningful
                visual stories through painting, Arabic calligraphy, Islamic
                geometry, and contemporary art. Her work blends emotional
                expression, cultural beauty, and refined artistic detail.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-[#211e1a] px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-1 hover:bg-[#a98745]"
                >
                  Contact Artist
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/courses"
                  className="inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full border border-[#d8cbbd] bg-white/70 px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#211e1a] transition hover:-translate-y-1 hover:border-[#a98745] hover:text-[#a98745]"
                >
                  View Courses
                  <Palette size={15} />
                </Link>
              </div>
            </div>

            <div className="animate-fade-right animate-delay-1">
              <div className="relative mx-auto max-w-[520px]">
                <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full bg-[#d8b26e]/30 blur-2xl" />
                <div className="absolute -bottom-5 -right-5 h-40 w-40 rounded-full bg-[#eadcc9] blur-2xl" />

                <div className="relative overflow-hidden rounded-[36px] border border-[#e7ddcf] bg-white/75 p-3 shadow-[0_28px_80px_rgba(45,35,24,0.12)]">
                  <div className="relative h-[620px] overflow-hidden rounded-[28px] bg-[#efe7dc]">
                    <img
                      src="/images/artist-rakhshinda.png"
                      alt="Rakhshinda Arshad Artist"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 rounded-[24px] border border-white/20 bg-white/18 p-5 text-white backdrop-blur-md">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f0d7a3]">
                        Artist Profile
                      </p>

                      <h2
                        className={`${cormorant.className} mt-2 text-[38px] font-normal italic leading-none`}
                      >
                        Art with light, culture & emotion.
                      </h2>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Brush size={22} />} title="Painting" text="Original artworks with expressive detail." />
            <StatCard icon={<Palette size={22} />} title="Calligraphy" text="Arabic calligraphy with refined visual flow." />
            <StatCard icon={<Star size={22} />} title="Geometry" text="Islamic geometric patterns and structure." />
            <StatCard icon={<Globe2 size={22} />} title="Exhibitions" text="Creative participation and art presentation." />
          </div>
        </section>

        <section className="border-y border-[#e8e2d7] bg-white/45 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="animate-fade-up">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a98745]">
                Artist Story
              </p>

              <h2
                className={`${cormorant.className} mt-4 text-[54px] font-normal italic leading-[0.92] tracking-[-0.04em] text-[#191714] sm:text-[72px]`}
              >
                A creative journey shaped by culture and expression.
              </h2>
            </div>

            <div className="animate-fade-up animate-delay-1 space-y-5 text-[15px] leading-8 text-[#6c635a]">
              <p>
                Rakhshinda Art represents a thoughtful approach to visual
                creativity. The work is built around balance, emotion, and
                identity, using color, composition, and hand-crafted detail to
                create pieces that feel both personal and timeless.
              </p>

              <p>
                Her artistic direction includes original paintings, Arabic
                calligraphy, Islamic geometry, art education, and creative
                collaborations. Each project is designed with care, whether it is
                a wall artwork, a custom commission, or a learning experience for
                students.
              </p>

              <p>
                Through her website, viewers can explore artworks, learn through
                courses, and connect for custom art inquiries, collaborations,
                and creative projects.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="overflow-hidden rounded-[34px] border border-[#e8e2d7] bg-white/75 p-3 shadow-[0_18px_55px_rgba(45,35,24,0.06)]">
              <div className="relative h-[500px] overflow-hidden rounded-[26px] bg-[#efe7dc]">
                <img
                  src="/images/exhibition-artworks.png"
                  alt="Rakhshinda Art Studio"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a98745]">
                Featured Participation
              </p>

              <h2
                className={`${cormorant.className} mt-4 text-[54px] font-normal italic leading-[0.92] tracking-[-0.04em] text-[#191714] sm:text-[72px]`}
              >
                Exhibitions, creative projects and public art presence.
              </h2>

              <div className="mt-7 space-y-4">
                <TimelineItem
                  icon={<CalendarDays size={17} />}
                  title="Participating Artist"
                  text="Featured as a participating artist representing Pakistan in a creative art event."
                />

                <TimelineItem
                  icon={<MapPin size={17} />}
                  title="Creative Presentation"
                  text="Artwork and artist presence connected with visual storytelling, culture, and contemporary expression."
                />

                <TimelineItem
                  icon={<Sparkles size={17} />}
                  title="Future Direction"
                  text="Expanding through courses, custom artworks, exhibitions, and meaningful art collaborations."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[36px] border border-[#e8e2d7] bg-[#211e1a] p-8 text-white shadow-[0_28px_80px_rgba(45,35,24,0.16)] sm:p-10 lg:p-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d8b26e]">
                  Work With The Artist
                </p>

                <h2
                  className={`${cormorant.className} mt-4 max-w-3xl text-[50px] font-normal italic leading-[0.95] tracking-[-0.04em] sm:text-[70px]`}
                >
                  Interested in Artwork, or collaborations?
                </h2>

                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/70">
                  Send a message for custom artwork, painting inquiries, course
                  support, or collaboration opportunities.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-white px-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#211e1a] transition hover:-translate-y-1 hover:bg-[#d8b26e]"
              >
                Get In Touch
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function StatCard({ icon, title, text }) {
  return (
    <div className="animate-fade-up rounded-[28px] border border-[#e8e2d7] bg-white/75 p-6 shadow-[0_18px_55px_rgba(45,35,24,0.06)] backdrop-blur-md transition hover:-translate-y-2">
      <div className="flex h-13 w-13 items-center justify-center rounded-[18px] bg-[#211e1a] p-4 text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#211e1a]">
        {title}
      </h3>

      <p className="mt-3 text-[13px] leading-6 text-[#6c635a]">{text}</p>
    </div>
  );
}

function TimelineItem({ icon, title, text }) {
  return (
    <div className="rounded-[24px] border border-[#e8e2d7] bg-white/75 p-5 shadow-[0_12px_35px_rgba(45,35,24,0.04)]">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8f4ed] text-[#a98745]">
          {icon}
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#211e1a]">
            {title}
          </h3>

          <p className="mt-2 text-[13px] leading-6 text-[#6c635a]">{text}</p>
        </div>
      </div>
    </div>
  );
}