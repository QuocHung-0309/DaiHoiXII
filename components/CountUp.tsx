// src/components/CountUp.tsx
"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function CountUp({ from = 0, to, duration = 1.2, className = "" }: {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
}) {
  const mv = useMotionValue(from);
  const rounded = useTransform(mv, latest => Math.floor(latest).toLocaleString("vi-VN"));

  useEffect(() => {
    const controls = animate(mv, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [to, duration, mv]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
