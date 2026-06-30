"use client";

import { motion } from "framer-motion";

export default function ImageReveal({
  children,
  delay = 0,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 35 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}