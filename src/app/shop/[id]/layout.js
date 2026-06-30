import { SITE_NAME, SITE_URL, absoluteUrl, safeJsonLd } from "../../lib/site";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
).replace(/\/$/, "");

const extractPainting = (payload) => {
  const candidates = [
    payload?.data?.painting,
    payload?.data?.data,
    payload?.data,
    payload?.painting,
    payload,
  ];

  return (
    candidates.find(
      (value) =>
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        (value?._id || value?.id || value?.slug || value?.title || value?.name),
    ) || null
  );
};

const getPainting = async (identifier) => {
  if (!identifier) return null;

  const encoded = encodeURIComponent(identifier);
  const endpoints = [
    `${API_URL}/painting/get-one/${encoded}`,
    `${API_URL}/painting/slug/${encoded}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { next: { revalidate: 300 } });
      if (!response.ok) continue;
      const painting = extractPainting(await response.json());
      if (painting && typeof painting === "object") return painting;
    } catch {
      // Try the next public painting endpoint.
    }
  }

  return null;
};

const imageOf = (painting) => {
  const image =
    painting?.image?.url ||
    painting?.thumbnail?.url ||
    painting?.images?.[0]?.url ||
    painting?.images?.[0] ||
    painting?.imageUrl ||
    "/images/hero-1.jpg";

  return /^https?:\/\//i.test(image) ? image : absoluteUrl(image);
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const painting = await getPainting(id);
  const title = painting?.title || painting?.name || "Original Artwork";
  const description =
    painting?.description ||
    "View an original artwork by RakhshindasArt with secure checkout and worldwide delivery.";
  const canonicalId = painting?.slug || painting?._id || id;
  const canonical = `/shop/${encodeURIComponent(canonicalId)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: [{ url: imageOf(painting), alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageOf(painting)],
    },
  };
}

export default async function PaintingLayout({ children, params }) {
  const { id } = await params;
  const painting = await getPainting(id);

  if (!painting) return children;

  const available =
    painting?.isAvailable !== false && Number(painting?.stock ?? 1) > 0;
  const canonicalId = painting?.slug || painting?._id || id;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: painting?.title || painting?.name || "Original Artwork",
    description:
      painting?.description || "Original artwork by RakhshindasArt.",
    image: [imageOf(painting)],
    sku: String(painting?._id || id),
    brand: { "@type": "Brand", name: SITE_NAME },
    url: `${SITE_URL}/shop/${encodeURIComponent(canonicalId)}`,
    offers: {
      "@type": "Offer",
      priceCurrency: painting?.currency || "AED",
      price: Number(painting?.price || 0).toFixed(2),
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${SITE_URL}/shop/${encodeURIComponent(canonicalId)}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      {children}
    </>
  );
}
