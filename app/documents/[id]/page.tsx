"use client";

import Link from "next/link";
import React, { useRef } from "react";
import {
  ArrowLeft,
  FileText,
  Calendar,
  // Download, // Bỏ
  Clock,
  CheckCircle2,
  Paperclip,
  ListChecks,
} from "lucide-react";
// Bỏ Button nếu không dùng
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import {
  getDoc,
  type DocumentCompact,
  type DocStatus,
  // type Attachment, // Bỏ
} from "@/lib/static-docs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ================= UI helpers ================= */
const STATUS: Record<
  DocStatus,
  { label: string; Icon: React.ElementType; chipClass: string }
> = {
  /* ... */ voting: {
    label: "Đang biểu quyết",
    Icon: ListChecks,
    chipClass: "bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-200",
  },
  pending: {
    label: "Chờ biểu quyết",
    Icon: Clock,
    chipClass: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200",
  },
  completed: {
    label: "Hoàn thành",
    Icon: CheckCircle2,
    chipClass:
      "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  },
};

function formatDate(raw?: string) {
  /* ... */ if (!raw) return "Chưa xác định";
  if (typeof raw === "string" && /^\d{1,2}g\d{2}$/.test(raw)) {
    return raw;
  }
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", raw, e);
    return raw;
  }
}

/* ================= Animations ================= */
const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];
const pageVariants: Variants = {
  /* ... */ initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: EASE,
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};
const blockVariants: Variants = {
  /* ... */ initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

/* ================= Page Component ================= */
export default function DocumentDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(
    params instanceof Promise ? params : Promise.resolve(params)
  );
  const doc = getDoc(resolvedParams.id);

  if (!doc) {
    /* ... */ return (
      <div className="min-h-screen bg-[rgb(248__250_ _252)]">
        {" "}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {" "}
          <Link
            href="/documents"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            {" "}
            <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách văn kiện{" "}
          </Link>{" "}
          <motion.div
            variants={blockVariants}
            initial="initial"
            animate="animate"
            className="rounded-2xl border bg-white p-8 text-slate-700 shadow-sm"
          >
            {" "}
            Không tìm thấy văn kiện với ID "{resolvedParams.id}".{" "}
          </motion.div>{" "}
        </div>{" "}
      </div>
    );
  }

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });

  const S = STATUS[doc.status];
  const pdfUrl = doc.attachments?.[0]?.url;

  return (
    <motion.div
      className="min-h-screen bg-[rgb(248_ _250_ _252)]"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-400 z-50"
        style={{ scaleX: progress, transformOrigin: "0%" }}
      />

      {/* Background Aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          /* ... */ background:
            "radial-gradient(60% 40% at 20% 0%, rgba(14,165,233,0.10) 0%, rgba(14,165,233,0) 50%), radial-gradient(40% 30% at 80% 0%, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0) 55%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Back Button */}
        <motion.div variants={blockVariants}>
          <Link
            href="/documents"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách văn kiện
          </Link>
        </motion.div>
        {/* Header Card */}
        <motion.div
          variants={blockVariants}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          {/* Title, Desc, Meta */}
          <div className="flex items-start gap-5 mb-5">
            {" "}
            <div className="hidden sm:block p-4 rounded-xl bg-sky-50 ring-1 ring-sky-100 shrink-0">
              {" "}
              <FileText
                className="text-sky-600"
                size={32}
                strokeWidth={2}
              />{" "}
            </div>{" "}
            <div className="flex-1 min-w-0">
              {" "}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-3 break-words">
                {" "}
                {doc.title}{" "}
              </h1>{" "}
              {doc.description && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  {" "}
                  {doc.description}{" "}
                </p>
              )}{" "}
            </div>{" "}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm border-t border-b border-slate-200 py-4 my-6">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="text-slate-500">Trạng thái:</span>{" "}
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${S.chipClass}`}
              >
                {" "}
                <S.Icon size={14} strokeWidth={2.5} /> {S.label}{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="text-slate-500">Phân loại:</span>{" "}
              <Badge variant="secondary" className="rounded-full text-xs">
                {" "}
                {doc.category}{" "}
              </Badge>{" "}
            </div>{" "}
            {doc.deadline && (
              <div className="flex items-center gap-2">
                {" "}
                <Calendar size={15} className="text-slate-500" />{" "}
                <span className="text-slate-500">Hạn biểu quyết:</span>{" "}
                <span className="font-medium text-slate-800">
                  {" "}
                  {formatDate(doc.deadline)}{" "}
                </span>{" "}
              </div>
            )}{" "}
          </div>

          {/* Attachments Title (No Download Button) */}
          {doc.attachments && doc.attachments.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 text-base">
                <Paperclip size={16} /> Tài liệu đính kèm
              </h3>
              {/* No download button here */}
            </div>
          )}
        </motion.div>
        {/* ✨ SỬA: PDF Viewer - Dùng Aspect Ratio */}
        {pdfUrl && (
          <motion.div variants={blockVariants} className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Nội dung Văn kiện
            </h2>
            {/* Sử dụng aspect-ratio (ví dụ: A4 ~ 210/297 ~ 7/10) */}
            {/* Thêm class `relative` cho div cha nếu iframe dùng `absolute` */}
            <div className="aspect-[7/10] bg-gray-100 rounded-lg shadow-sm border border-slate-300 overflow-hidden">
              {/* Hoặc dùng aspect-video nếu muốn tỷ lệ video */}
              {/* <div className="aspect-video bg-gray-100 rounded-lg shadow-sm border border-slate-300 overflow-hidden"> */}
              <iframe
                src={`${pdfUrl}#view=FitH`} // Vừa chiều ngang
                title={`Nội dung ${doc.title}`}
                // className="w-full h-full" // Mặc định của aspect-ratio
                // Bỏ style height cố định
                className="absolute inset-0 w-full h-full border-0" // Dùng absolute để fill div cha
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
        {/* --- KẾT THÚC KHỐI PDF --- */}
        {/* Container for rest (Markdown...) - Attach ref here */}
        <div ref={scrollContainerRef} className="mt-8 space-y-8">
          {/* Markdown Content Block */}
          {doc.content && (
            <motion.div
              variants={blockVariants}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b pb-3">
                Nội dung bổ sung
              </h2>
              <article className="prose prose-slate max-w-none prose-h2:mt-6 prose-h2:text-lg prose-a:text-sky-600 hover:prose-a:text-sky-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {doc.content}
                </ReactMarkdown>
              </article>
            </motion.div>
          )}

          {/* No Content Message */}
          {!pdfUrl && !doc.content && (
            <motion.div
              variants={blockVariants}
              className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm text-center text-slate-500"
            >
              Chưa có nội dung chi tiết hoặc tài liệu đính kèm cho văn kiện này.
            </motion.div>
          )}
        </div>{" "}
        {/* End scroll container */}
      </div>
    </motion.div>
  );
}
