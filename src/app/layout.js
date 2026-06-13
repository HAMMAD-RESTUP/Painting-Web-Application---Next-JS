import { Cormorant_Garamond } from "next/font/google";
import ReactQueryProvider from "./providers/ReactQueryProvider";

import Navbar from "./Components/common/Navbar";
import Footer from "./Components/common/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "RakhshindasArt | Premium Art, Courses & Creative Store",
  description:
    "Explore premium art, creative courses, collaborations, and artistic products at RakhshindasArt.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f7f1e8] text-[#17120d]">
        <Navbar />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Footer />
      </body>
    </html>
  );
}