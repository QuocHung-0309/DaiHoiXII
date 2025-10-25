"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Home } from "lucide-react";

// Dùng lại animation
const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];
const itemV = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export default function BieuQuyetSuccessPage() {
  return (
    <div className="min-h-screen bg-[rgb(248_250_252)] flex items-center justify-center p-4">
      <motion.div
        variants={itemV}
        initial="initial"
        animate="animate"
        className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200"
      >
        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Gửi biểu quyết thành công!
        </h1>
        <p className="mt-2 text-slate-600">
          Cảm ơn bạn đã hoàn thành việc biểu quyết. Ý kiến của bạn đã được ghi
          lại để tổng hợp.
        </p>
        <div className="mt-6">
          <Link
            href="/" // Link về trang chủ
            className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white shadow hover:bg-slate-800"
          >
            <Home className="h-4 w-4 mr-2" />
            Về Trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
