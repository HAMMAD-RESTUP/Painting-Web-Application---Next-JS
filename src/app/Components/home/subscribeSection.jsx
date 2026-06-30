"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Mail, Check } from "lucide-react";

export default function SubscribeSection() {
  const cardRef = useRef(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  const onCardMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section
      id="subscribe"
      className="relative overflow-hidden bg-gradient-to-r from-[#fdf8f1] to-[#f7f3ed] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-36 top-8 h-[300px] w-[300px] rounded-full bg-[#e9ded0]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 bottom-0 h-[320px] w-[320px] rounded-full bg-[#eee2d4]/70 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <motion.div
          ref={cardRef}
          onMouseMove={onCardMove}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-white/95 px-6 py-12 text-center shadow-[0_18px_55px_rgba(0,0,0,0.07)] backdrop-blur-md sm:px-10 sm:py-16 lg:px-16 lg:py-20"
          style={{
            background: `radial-gradient(420px circle at ${glow.x}% ${glow.y}%, rgba(216,176,124,0.12), transparent 55%), rgba(255,255,255,0.95)`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-[#d8b07c]/10" />

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d8b07c]/20 text-[#8a6d3f]"
                >
                  <Check size={28} strokeWidth={2} />
                </motion.div>
                <h2
                  className={`font-special text-[38px] font-normal italic text-[#1b1814] sm:text-[52px]`}
                >
                  You&apos;re on the list
                </h2>
                <p className="mt-3 text-[15px] text-[#6a6259]">
                  Thank you — studio updates are on their way.
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }}>
                <h2
                  className={`font-special mx-auto max-w-[800px] text-[45px] font-normal italic leading-[0.9] tracking-[-0.055em] text-[#1b1814] sm:text-[62px] lg:text-[76px]`}
                >
                  Subscribe for thoughtful
                  <span className="block">updates from Rakhshinda.</span>
                </h2>

                <p className="mx-auto mt-5 max-w-[610px] text-[14px] leading-7 text-[#6a6259] sm:text-[16px]">
                  Be the first to discover new artwork, upcoming workshops, and
                  creative stories from the studio.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mx-auto mt-8 flex w-full max-w-[680px] flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
                >
                  <label className="relative block min-w-0 flex-1">
                    <span className="sr-only">Email address</span>
                    <Mail
                      size={16}
                      strokeWidth={1.6}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a3998e]"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="h-[56px] w-full rounded-full border border-[#d9d5cc]/20 bg-[#faf7f1] pl-12 pr-4 text-[14px] text-[#29251f] outline-none transition duration-300 placeholder:text-[#a0978d] focus:border-[#ad8b50] focus:bg-white focus:shadow-[0_0_0_4px_rgba(216,176,124,0.15)] sm:text-[15px]"
                    />
                  </label>

                  <button
                    type="submit"
                    data-cursor-label="Join"
                    className="group flex h-[56px] shrink-0 items-center justify-center gap-3 rounded-full bg-[#1e1e1c] px-8 text-[10px] font-semibold uppercase tracking-[0.19em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#3a342d] hover:shadow-[0_12px_35px_rgba(30,30,28,0.25)] sm:px-10 sm:text-[11px]"
                  >
                    Subscribe
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.8}
                      className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </button>
                </form>

                <p className="mx-auto mt-4 max-w-[620px] text-[11px] leading-5 text-[#8b837a] sm:text-[12px]">
                  No spam, only occasional studio updates. You can unsubscribe at
                  any time.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
