"use client";

import { useState } from "react";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      const savedQueries = JSON.parse(
        localStorage.getItem("contactQueries") || "[]"
      );

      const newQuery = {
        ...formData,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "contactQueries",
        JSON.stringify([...savedQueries, newQuery])
      );
    } catch {
      localStorage.setItem(
        "contactQueries",
        JSON.stringify([
          {
            ...formData,
            createdAt: new Date().toISOString(),
          },
        ])
      );
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    setSuccessMessage("Your message has been submitted successfully.");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#211e1a]">
      <section className="border-b border-[#e8e2d7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
    
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a98745]">
                Contact Rakhshinda Art
              </p>

              <h1
                className={`${cormorant.className} mt-4 max-w-4xl text-[58px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#191714] sm:text-[78px] lg:text-[96px]`}
              >
                Get In Touch
                <span className="block text-[#a98745]">With Us</span>
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#6c635a]">
                Have a question about courses, artwork, prints, collaborations,
                or general support? Send us your message and we will get back to
                you soon.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#e8dfd2] bg-white/70 p-5 shadow-[0_18px_55px_rgba(45,35,24,0.06)] backdrop-blur-md">
              <ContactInfo
                icon={<Mail size={17} />}
                label="Email"
                value="support@rakhshindaart.com"
              />

              <ContactInfo
                icon={<Phone size={17} />}
                label="Phone"
                value="+971 000 000 000"
              />

              <ContactInfo
                icon={<MessageCircle size={17} />}
                label="Support"
                value="Courses, Art & Queries"
                last
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {successMessage && (
          <div className="mb-7 flex items-center gap-3 rounded-[22px] border border-[#cfead3] bg-[#eef8ef] px-5 py-4 text-[13px] font-medium text-[#27733a]">
            <CheckCircle2 size={18} />
            {successMessage}
          </div>
        )}

        <div className="grid overflow-hidden rounded-[34px] border border-[#e8e2d7] bg-white/75 shadow-[0_18px_55px_rgba(45,35,24,0.06)] backdrop-blur-md lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-[#efe7dc] lg:min-h-[680px]">
            <img
              src="/images/contact-hero.png"
              alt="Rakhshinda Art Contact"
              className="h-full w-full object-cover"
            
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d8b26e]">
                Rakhshinda Art
              </p>

              <h2
                className={`${cormorant.className} mt-3 max-w-md text-[46px] font-normal italic leading-[0.95] tracking-[-0.045em] text-white sm:text-[58px]`}
              >
                We would love to hear from you.
              </h2>

              <p className="mt-4 max-w-md text-[14px] leading-7 text-white/75">
                Share your questions, ideas, artwork inquiries, or course support
                request with us.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a98745]">
                Contact Form
              </p>

              <h2
                className={`${cormorant.className} mt-2 text-[44px] font-normal italic leading-none text-[#211e1a]`}
              >
                Send A Message
              </h2>

              <p className="mt-4 max-w-xl text-[14px] leading-7 text-[#6c635a]">
                Fill out the form below and our team will contact you as soon as
                possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />

                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Message subject"
                  required
                />
              </div>

              <Textarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                required
              />

              <button
                type="submit"
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-[#211e1a] px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-1 hover:bg-[#a98745]"
              >
                Send Message
                <Send size={15} />
              </button>
            </form>

          </div>
        </div>
      </section>
    </main>
  );
}

function ContactInfo({ icon, label, value, last }) {
  return (
    <div
      className={`flex items-center gap-4 py-4 ${
        last ? "" : "border-b border-[#eee6dc]"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8f4ed] text-[#a98745]">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b837b]">
          {label}
        </p>

        <p className="mt-1 text-[14px] font-semibold text-[#211e1a]">
          {value}
        </p>
      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#211e1a]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        required={required}
        className="h-[52px] w-full rounded-[17px] border border-[#e2d8ce] bg-white/80 px-4 text-[14px] font-medium text-[#292724] outline-none transition placeholder:text-[#aaa19a] focus:border-[#a98745] focus:bg-white focus:ring-4 focus:ring-[#a98745]/15"
      />
    </div>
  );
}

function Textarea({ label, name, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#211e1a]">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="min-h-[150px] w-full resize-y rounded-[17px] border border-[#e2d8ce] bg-white/80 px-4 py-4 text-[14px] font-medium leading-7 text-[#292724] outline-none transition placeholder:text-[#aaa19a] focus:border-[#a98745] focus:bg-white focus:ring-4 focus:ring-[#a98745]/15"
      />
    </div>
  );
}