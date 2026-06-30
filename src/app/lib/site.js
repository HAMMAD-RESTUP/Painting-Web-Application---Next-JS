const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SITE_URL = (
  configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`
).replace(/\/$/, "");

export const SITE_NAME = "RakhshindasArt";
export const SITE_TITLE = "RakhshindasArt | Original Art & Online Art Courses";
export const SITE_DESCRIPTION =
  "Discover original paintings, collectible artwork and online art courses by a UAE-based artist, with secure checkout and worldwide access.";

export const absoluteUrl = (path = "/") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};

export const safeJsonLd = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c");
