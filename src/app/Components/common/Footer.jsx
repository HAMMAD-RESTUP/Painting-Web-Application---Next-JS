"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Mail,
  MapPin,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/artist" },
  { label: "Courses", href: "/courses" },
  { label: "Contact", href: "/contact" },
];

const SHOP_LINKS = [
  { label: "All Artwork", href: "/shop" },
  { label: "Original Paintings", href: "/shop/original-paintings" },
  { label: "Fine Art Prints", href: "/shop/prints" },
  { label: "Calligraphy Kit", href: "/shop/calligraphy-kit" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

    if (!validEmail) {
      setStatus("Please enter a valid email address.");
      return;
    }

    try {
      const existing = JSON.parse(
        localStorage.getItem("rakhshindasart_newsletter") || "[]",
      );
      const subscribers = Array.isArray(existing) ? existing : [];

      if (!subscribers.includes(cleanEmail)) subscribers.push(cleanEmail);

      localStorage.setItem(
        "rakhshindasart_newsletter",
        JSON.stringify(subscribers),
      );

      setEmail("");
      setStatus("Thank you. You are on the studio update list.");
    } catch {
      setStatus("Subscription could not be saved on this device.");
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#eadfd6] bg-[#fffdfb] text-[#4c4038]">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#f3e8df] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-[#efe3da] opacity-70 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-14 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-10 border-b border-[#eadfd6] pb-12 lg:grid-cols-[1.3fr_.8fr_.9fr_1.35fr] lg:gap-12">
          <section>
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Rakhshinda Art home"
            >
              <img
                src="/images/logo.png"
                alt="Rakhshinda Art"
                className="max-h-[64px] max-w-[220px] object-contain"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#83766c]">
              Original artwork and online creative courses from a UAE-based
              artist, available to collectors and learners worldwide.
            </p>

          
          </section>

          <FooterColumn title="Explore" links={FOOTER_LINKS} />
          <FooterColumn title="Shop" links={SHOP_LINKS} />

          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b07f59]">
              Rakhshinda updates
            </p>
         <h2 className="heading-text mt-3 text-3xl font-medium leading-tight text-[#4c4038] sm:text-4xl">
  New artwork, courses and studio stories.
</h2>
            <p className="mt-3 text-sm leading-6 text-[#83766c]">
              Join the list for occasional updates. No unnecessary messages.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className="flex min-h-[52px] overflow-hidden rounded-lg border border-[#dfcec0] bg-white focus-within:border-[#b07f59] focus-within:ring-4 focus-within:ring-[#b07f59]/10">
                <span className="grid w-12 shrink-0 place-items-center text-[#9a7454]">
                  <Mail size={17} />
                </span>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setStatus("");
                  }}
                  placeholder="Your email address"
                  autoComplete="email"
                  className="min-w-0 flex-1 bg-transparent px-1 text-sm text-[#4c4038] outline-none placeholder:text-[#a89a8f]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to studio updates"
                  className="m-1 inline-flex w-12 shrink-0 items-center justify-center rounded-md bg-[#6f5543] text-white transition hover:bg-[#b07f59]"
                >
                  <ArrowRight size={17} />
                </button>
              </div>

              {status && (
                <p
                  role="status"
                  className={`mt-3 text-xs leading-5 ${
                    status.startsWith("Thank")
                      ? "text-emerald-700"
                      : "text-[#b85f54]"
                  }`}
                >
                  {status}
                </p>
              )}
            </form>

            <div className="mt-6 flex items-start gap-3 border-t border-[#eadfd6] pt-5 text-sm text-[#83766c]">
              <MapPin size={17} className="mt-0.5 shrink-0 text-[#b07f59]" />
              <p>UAE-based studio · Worldwide delivery and online learning</p>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs text-[#83766c] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RakhshindasArt. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/shop" className="transition hover:text-[#b07f59]">
              Original art
            </Link>
            <Link href="/courses" className="transition hover:text-[#b07f59]">
              Online courses
            </Link>
            <Link href="/contact" className="transition hover:text-[#b07f59]">
              Contact studio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <nav aria-label={`${title} footer links`}>
      <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b07f59]">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm text-[#6f6258] transition hover:text-[#b07f59]"
            >
              <span className="h-px w-0 bg-[#b07f59] transition-all group-hover:w-4" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterFeature({ icon, title, text }) {
  return (
    <div className="flex gap-3 rounded-lg border border-[#eadfd6] bg-[#faf5f1] p-4">
      <span className="mt-0.5 text-[#b07f59]">{icon}</span>
      <span>
        <strong className="block text-xs text-[#4c4038]">{title}</strong>
        <span className="mt-1 block text-[11px] text-[#83766c]">{text}</span>
      </span>
    </div>
  );
}
