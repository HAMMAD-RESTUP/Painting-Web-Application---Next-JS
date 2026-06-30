export default function manifest() {
  return {
    name: "RakhshindasArt",
    short_name: "Rakhshinda Art",
    description:
      "Original artwork and online creative courses from a UAE-based artist.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffdfb",
    theme_color: "#6f5543",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
