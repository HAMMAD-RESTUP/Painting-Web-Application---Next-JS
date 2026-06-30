import { SITE_NAME, SITE_URL, absoluteUrl, safeJsonLd } from "../../lib/site";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
).replace(/\/$/, "");

const extractCourse = (payload) => {
  const candidates = [
    payload?.data?.course,
    payload?.data?.data,
    payload?.data,
    payload?.course,
    payload,
  ];

  return (
    candidates.find(
      (value) =>
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        (value?._id || value?.id || value?.title),
    ) || null
  );
};

const getCourse = async (id) => {
  if (!id) return null;

  try {
    const response = await fetch(`${API_URL}/course/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    const course = extractCourse(await response.json());
    return course && typeof course === "object" ? course : null;
  } catch {
    return null;
  }
};

const imageOf = (course) => {
  const image =
    course?.thumbnail?.url ||
    course?.image?.url ||
    course?.coverImage?.url ||
    course?.imageUrl ||
    "/images/hero-1.jpg";

  return /^https?:\/\//i.test(image) ? image : absoluteUrl(image);
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = await getCourse(id);
  const title = course?.title || "Online Art Course";
  const description =
    course?.description ||
    "Learn creative skills online with a RakhshindasArt course available worldwide.";
  const canonical = `/courses/${encodeURIComponent(course?._id || id)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: [{ url: imageOf(course), alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageOf(course)],
    },
  };
}

export default async function CourseLayout({ children, params }) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) return children;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course?.title || "Online Art Course",
    description:
      course?.description || "Online creative course by RakhshindasArt.",
    image: imageOf(course),
    url: `${SITE_URL}/courses/${encodeURIComponent(course?._id || id)}`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: course?.currency || "AED",
      price: Number(course?.price || 0).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/course-checkout/${encodeURIComponent(course?._id || id)}`,
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
