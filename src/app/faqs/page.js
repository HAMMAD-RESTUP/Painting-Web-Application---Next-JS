"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";

const faqData = [
  {
  id: 1,
  question: "I'm a complete beginner. Can I still take these courses?",
  answer: "Absolutely! All of our courses—whether Arabic Calligraphy or Islamic Geometry—are designed for complete beginners. Even if you've never picked up a pen or compass before, you'll be able to learn comfortably through clear, step-by-step lessons at your own pace.",
},
{
  id: 2,
  question: "What materials do I need for the courses, and where can I get them?",
  answer: "In the first lesson of each course, you'll find a detailed list of all required materials, including qalam, ink, specific paper types, and geometry tools. We also provide links to trusted local and international stores where you can easily purchase them.",
},
{
  id: 3,
  question: "Do the courses have a time limit or expiration date?",
  answer: "Not at all. Once you enroll, you receive lifetime access to the course. You can watch the lessons and practice as many times as you like, whenever it suits you. There’s no rush.",
},
{
  id: 4,
  question: "Will I get help if I make mistakes or don't understand something during practice?",
  answer: "Yes. We have an exclusive student community where you can upload photos of your practice work. Rakhshanda and her team review submissions and provide personalized feedback, corrections, and guidance to help you improve.",
}
];

function PenWritingText({ text, delay = 0 }) {
  const words = text.split(" ");
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: delay } },
  };
  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 15, stiffness: 100 } },
    hidden: { opacity: 0, y: 8 },
  };

  return (
    <motion.span variants={container} initial="hidden" animate="visible" className="inline-block">
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function FAQPage() {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f7f4ef] text-[#1e1e1c]">
      
      <div className="pointer-events-none absolute left-[-15%] top-[-5%] h-[600px] w-[600px] rounded-full bg-[#e8ddd0]/50 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-[#eee1d0]/60 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[940px] px-4 py-24 sm:px-6 sm:py-32">
        
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, tracking: "0.1em" }}
            animate={{ opacity: 1, tracking: "0.32em" }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a98745]"
          >
            Have Questions?
          </motion.p>

          <h1 className={`font-special text-[48px] font-normal italic leading-[1.1] tracking-[-0.03em] text-[#191714] sm:text-[68px] md:text-[80px]`}>
            <div className="block">
              <PenWritingText text="Curiosity & Clarity" delay={0.1} />
            </div>
            <span className="text-[#a98745] block mt-1 font-normal">Studio Notebook</span>
          </h1>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.2, duration: 0.8 }}
            className="h-px w-24 bg-[#b38d51]/40 mx-auto mt-8"
          />
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="overflow-hidden rounded-[20px] bg-[#efe7dc]/50 border border-[#eaddcb]/40 transition-all duration-300"
                style={{
                  boxShadow: isOpen ? "0 20px 40px rgba(45,35,24,0.05)" : "none"
                }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between p-6 text-left transition duration-300 hover:bg-[#efe7dc]/80 sm:p-7"
                >
                  <div className="flex items-start gap-4 pr-4">
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#a98745]">
                      0{index + 1}
                    </span>
                    <h3 className="text-[15px] font-medium leading-6 text-[#211e1a] sm:text-[17px]">
                      {faq.question}
                    </h3>
                  </div>
                  
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 border border-[#eaddcb]/60 text-[#1e1e1c] transition-transform duration-500 ${isOpen ? "rotate-180 bg-[#1e1e1c] text-white" : ""}`}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <div className="border-t border-[#eaddcb]/40 bg-white/40 p-6 pl-12 text-[14px] leading-7 text-[#685f56] sm:p-7 sm:pl-14 sm:text-[15px]">
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        >
                          {faq.answer}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 rounded-[28px] border border-dashed border-[#b38d51]/40 p-8 text-center bg-white/20 backdrop-blur-sm"
        >
          <MessageCircle size={22} className="mx-auto text-[#a98745] mb-3" />
          <h4 className={`font-special text-[26px] font-normal italic text-[#191714]`}>
            Contact Us example123@gmail.com?
          </h4>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#685f56]">
          If you have any question you can contact Us on aur email
          </p>
          <div className="mt-5">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#98743d] hover:text-[#1e1e1c] transition-colors duration-300"
            >
              Get In Touch 
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

      </div>
    </main>
  );
}