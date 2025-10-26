"use client";

import Link from "next/link";
import React, { useRef } from "react"; // Import React
import {
  ArrowLeft,
  FileText,
  Calendar,
  ExternalLink, // Icon cho link mở tab mới
  Clock,
  CheckCircle2,
  Paperclip,
  ListChecks,
} from "lucide-react";
// Import lại Button nếu cần cho link mở tab mới
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import {
  getDoc,
  type DocumentCompact, // Sử dụng type từ static-docs
  type DocStatus,
} from "@/lib/static-docs"; // Đảm bảo đường dẫn đúng
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// --- Cấu hình hiển thị trạng thái ---
const STATUS: Record<
  DocStatus,
  { label: string; Icon: React.ElementType; chipClass: string }
> = {
  voting: {
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

// --- Hàm định dạng ngày ---
function formatDate(raw?: string): string {
  if (!raw) return "Chưa xác định";
  // Xử lý chuỗi chỉ có giờ "12g00"
  if (typeof raw === "string" && /^\d{1,2}g\d{2}$/.test(raw)) {
    return raw; // Trả về chuỗi gốc
  }
  // Xử lý ngày tháng chuẩn
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw; // Trả về gốc nếu không parse được
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", raw, e);
    return raw; // Trả về gốc nếu lỗi
  }
}

// --- Cấu hình Animations ---
const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];
const pageVariants: Variants = {
  initial: { opacity: 0 },
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
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

// --- Component Trang Chi Tiết ---
export default function DocumentDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  // Lấy params an toàn với React.use()
  const resolvedParams = React.use(
    params instanceof Promise ? params : Promise.resolve(params)
  );
  // Lấy dữ liệu văn kiện từ static-docs
  const doc = getDoc(resolvedParams.id);

  // Xử lý trường hợp không tìm thấy văn kiện
  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/documents"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại danh sách văn kiện
          </Link>
          <motion.div
            variants={blockVariants}
            initial="initial"
            animate="animate"
            className="rounded-2xl border bg-white p-8 text-slate-700 shadow-sm"
          >
            Không tìm thấy văn kiện với ID "{resolvedParams.id}".
          </motion.div>
        </div>
      </div>
    );
  }

  // Ref và hook cho thanh progress đọc
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });

  // Lấy thông tin trạng thái và URL PDF
  const S = STATUS[doc.status];
  const pdfUrl = doc.attachments?.[0]?.url;

  return (
    <motion.div
      className="min-h-screen bg-slate-50" // Đổi màu nền nhẹ
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Thanh progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-400 z-50"
        style={{ scaleX: progress, transformOrigin: "0%" }}
      />

      {/* Aura nền */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50" // Giảm opacity
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, rgba(14,165,233,0.10) 0%, rgba(14,165,233,0) 50%), radial-gradient(40% 30% at 80% 0%, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0) 55%)",
        }}
      />

      {/* Nội dung chính */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Nút Quay lại */}
        <motion.div variants={blockVariants}>
          <Link
            href="/documents"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 transition-colors" // Size chữ nhỏ hơn
          >
            <ArrowLeft size={18} className="mr-1.5" /> {/* Size icon nhỏ hơn */}
            Quay lại danh sách văn kiện
          </Link>
        </motion.div>
        {/* Thẻ Header Card */}
        <motion.div
          variants={blockVariants}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8" // Thêm mb-8
        >
          {/* Tiêu đề, Mô tả */}
          <div className="flex flex-col sm:flex-row items-start gap-5 mb-5">
            <div className="p-3 sm:p-4 rounded-xl bg-sky-50 ring-1 ring-sky-100 self-start">
              {" "}
              {/* Thu gọn padding trên mobile */}
              <FileText
                className="text-sky-600 h-6 w-6 sm:h-8 sm:w-8"
                strokeWidth={2}
              />{" "}
              {/* Kích thước icon responsive */}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-3 break-words">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  {doc.description}
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm border-t border-b border-slate-100 py-4 my-6">
            {" "}
            {/* Border nhạt hơn */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Trạng thái:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${S.chipClass}`}
              >
                <S.Icon size={14} strokeWidth={2.5} /> {S.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Phân loại:</span>
              <Badge variant="secondary" className="rounded-full text-xs">
                {doc.category}
              </Badge>
            </div>
            {doc.deadline && (
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-slate-500" />
                <span className="text-slate-500">Hạn biểu quyết:</span>
                <span className="font-medium text-slate-800">
                  {formatDate(doc.deadline)}
                </span>
              </div>
            )}
          </div>

          {/* Tiêu đề Tài liệu đính kèm (không có nút tải) */}
          {doc.attachments && doc.attachments.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 text-base mb-3">
                <Paperclip size={16} /> Tài liệu đính kèm
              </h3>
              {/* Phần này trống vì không có nút tải */}
            </div>
          )}
        </motion.div>
        {/* Khối Hiển thị PDF */}
        {pdfUrl && (
          <motion.div variants={blockVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Nội dung Văn kiện
              </h2>
              {/* Link Mở Tab Mới */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 font-medium text-xs sm:text-sm"
              >
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} className="mr-1 sm:mr-1.5" />
                  Mở tab mới
                </a>
              </Button>
            </div>

            {/* PDF Viewer (Aspect Ratio) */}
            <div className="aspect-[7/10] bg-gray-100 rounded-lg shadow-sm border border-slate-300 overflow-hidden relative">
              <iframe
                src={`${pdfUrl}#view=FitH&toolbar=0`} // Thêm toolbar=0 để ẩn thanh công cụ mặc định (nếu muốn)
                title={`Nội dung ${doc.title}`}
                className="absolute inset-0 w-full h-full border-0"
                // allowFullScreen // Có thể bỏ nếu không cần
              />
            </div>
          </motion.div>
        )}
        {/* Container cho Nội dung Markdown và thanh scroll */}
        <div ref={scrollContainerRef} className="mt-8 space-y-8">
          {/* Khối Nội dung Markdown (Nếu có) */}
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

          {/* Thông báo nếu không có nội dung nào */}
          {!pdfUrl && !doc.content && (
            <motion.div
              variants={blockVariants}
              className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm text-center text-slate-500"
            >
              Chưa có nội dung chi tiết hoặc tài liệu đính kèm cho văn kiện này.
            </motion.div>
          )}
        </div>{" "}
        {/* Kết thúc container scroll */}
      </div>
    </motion.div>
  );
}
