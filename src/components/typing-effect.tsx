"use client";

import { motion } from "framer-motion";

export function TypingEffect({ text, className }: { text: string; className?: string }) {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: 0.3 },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      display: "inline-block",
    },
    hidden: {
      opacity: 0,
      display: "inline-block",
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
        className="inline-block w-1.5 h-4 bg-indigo-500 ml-1 align-baseline"
      />
    </motion.div>
  );
}
