import { SITE_URL } from "./lib/site";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
).replace(/\/$/, "");

const extractList = (payload, key) => {
  const candidates = [
    payload?.data?.[key],
    payload?.[key],
    payload?.data,
    payload,
  ];

  return candidates.find(Array.isArray) || [];
};

const getPublicCatalogRoutes = async () => {
  try {
    const [paintingsResponse, coursesResponse] = await Promise.all([
      fetch(`${API_URL}/painting/get-all?page=1&limit=1000`, {
        next: { revalidate: 3600 },
      }),
      fetch(`${API_URL}/course/get-all`, {
        next: { revalidate: 3600 },
      }),
    ]);

    const paintingsPayload = paintingsResponse.ok
      ? await paintingsResponse.json()
      : null;
    const coursesPayload = coursesResponse.ok
      ? await coursesResponse.json()
      : null;

    const paintings = extractList(paintingsPayload, "paintings");
    const courses = extractList(coursesPayload, "courses");

    return [
      ...paintings
        .filter((painting) => painting?._id || painting?.slug)
        .map((painting) => ({
          url: `${SITE_URL}/shop/${encodeURIComponent(
            painting?.slug || painting?._id,
          )}`,
          lastModified: painting?.updatedAt
            ? new Date(painting.updatedAt)
            : undefined,
          changeFrequency: "weekly",
          priority: 0.8,
        })),
      ...courses
        .filter((course) => course?._id || course?.id)
        .map((course) => ({
          url: `${SITE_URL}/courses/${encodeURIComponent(
            course?._id || course?.id,
          )}`,
          lastModified: course?.updatedAt
            ? new Date(course.updatedAt)
            : undefined,
          changeFrequency: "weekly",
          priority: 0.75,
        })),
    ];
  } catch {
    return [];
  }
};

export default async function sitemap() {
  const staticRoutes = [
    ["", 1, "daily"],
    ["/shop", 0.95, "daily"],
    ["/shop/original-paintings", 0.9, "daily"],
    ["/shop/prints", 0.82, "weekly"],
    ["/shop/calligraphy-kit", 0.8, "weekly"],
    ["/courses", 0.9, "weekly"],
    ["/artist", 0.75, "monthly"],
    ["/contact", 0.65, "monthly"],
    ["/collaborations", 0.65, "monthly"],
    ["/faqs", 0.6, "monthly"],
  ].map(([path, priority, changeFrequency]) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));

  return [...staticRoutes, ...(await getPublicCatalogRoutes())];
}
