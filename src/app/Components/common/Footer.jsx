"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white text-[#1e1e1c] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      <div className="pointer-events-none absolute -left-40 top-10 h-[360px] w-[360px] rounded-full bg-[#f7f7f7] blur-3xl" />
      <div className="pointer-events-none absolute -right-44 bottom-20 h-[430px] w-[430px] rounded-full bg-[#f5f5f5] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1220px] px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Main Footer Grid */}
        <div className="grid gap-11 sm:grid-cols-2 lg:grid-cols-[0.8fr_0.85fr_0.85fr_0.9fr_1.35fr] lg:gap-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <Link href="/" className="inline-flex flex-col items-start">
              <div className="flex h-[135px] w-[135px] items-center justify-center">
                <img
                  src="/images/footer-logo.png"
                  alt="Rakhshinda Art"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
          </motion.div>

          {/* Footer Columns */}
          <FooterColumn
            title="Navigation"
            links={[
              ["Home", "/"],
              ["About Rakhshinda", "/about"],
              ["FAQs", "/faqs"],
              ["Contact", "/contact"],
            ]}
          />

          <FooterColumn
            title="Shop"
            links={[
              ["All Artwork", "/shop"],
              ["Original Paintings", "/shop/original-paintings"],
              ["Fine Art Prints", "/shop/prints"],
              ["Calligraphy Kit", "/shop/calligraphy-kit"],
              ["Courses", "/courses"],
            ]}
          />

          <FooterColumn
            title="Studio"
            links={[
              ["Collaborations", "/collaborations"],
              ["Christian Dior", "/collaborations"],
              ["Four Seasons", "/collaborations"],
              ["Al Jazeera", "/collaborations"],
              ["Feathers UAE", "/collaborations"],
            ]}
          />

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#b49b45]">
              Newsletter
            </p>

            <h3
              className={`${cormorant.className} max-w-[430px] text-[36px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#151515] sm:text-[44px] lg:text-[48px]`}
            >
              Subscribe for Latest Updates
            </h3>

            <form className="mt-7 flex h-[52px] max-w-[430px] overflow-hidden rounded-full border border-[#e2e2e2] bg-white shadow-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-full flex-1 bg-transparent px-5 text-[14px] text-[#111] outline-none placeholder:text-[#999]"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="group flex h-full w-[60px] items-center justify-center bg-[#1e1e1c] text-white transition duration-300 hover:bg-[#b49b45]"
              >
                <ArrowUpRight
                  size={18}
                  className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>
            </form>

            <p className="mt-5 max-w-[430px] text-[12px] leading-5 text-[#625c56]">
              By subscribing, you agree to our{" "}
              <Link
                href="/privacy-policy"
                className="border-b border-[#625c56] transition hover:border-[#b49b45] hover:text-[#b49b45]"
              >
                Privacy Policy
              </Link>{" "}
              and consent to receive occasional updates.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 border-t border-[#e2e2e2] pt-8">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              {/* Social Icons */}
              <SocialIcon label="Facebook">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.25c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Instagram">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm8.75 2.15a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="LinkedIn">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.84v2.05h.06c.54-1.02 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.21V23h-4v-7.84c0-1.87-.03-4.28-2.6-4.28-2.61 0-3.01 2.04-3.01 4.14V23H8V8Z" />
                </svg>
              </SocialIcon>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#625c56]">
              <p>© 2026 Rakhshinda Art.</p>
              <Link href="/privacy-policy" className="transition hover:text-[#b49b45]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition hover:text-[#b49b45]">
                Terms
              </Link>
              <Link href="/cookies" className="transition hover:text-[#b49b45]">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className={`${cormorant.className} mb-6 text-[36px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#151515] sm:text-[42px]`}>
        {title}
      </h3>

      <ul className="space-y-4">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="group inline-flex items-center gap-2 text-[14px] leading-6 text-[#4f4a45] transition hover:text-[#151515]"
            >
              <span className="h-px w-0 bg-[#b49b45] transition-all duration-300 group-hover:w-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function SocialIcon({ label, children }) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d9d9d9] bg-white text-[#1e1e1c] shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[#1e1e1c] hover:text-white"
    >
      {children}
    </Link>
  );
}