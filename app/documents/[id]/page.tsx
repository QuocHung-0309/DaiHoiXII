"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Download,
  Clock,
  CheckCircle2,
  Paperclip, // ✨ SỬA: Thêm icon
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button"; // ✨ SỬA: import thêm buttonVariants
import { Badge } from "@/components/ui/badge";
import { VotingInterface } from "@/components/voting-interface";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import { useRef } from "react";
import { getDoc } from "@/lib/static-docs";
// ✨ SỬA: Import thư viện Markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ================= UI helpers ================= */
// ... (Không đổi)
const STATUS: Record<
  "voting" | "pending" | "completed",
  { label: string; Icon: any; chipClass: string }
> = {
  voting: {
    label: "Đang biểu quyết",
    Icon: Clock,
    chipClass: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  },
  pending: {
    label: "Chờ biểu quyết",
    Icon: Clock,
    chipClass: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  completed: {
    label: "Đã hoàn thành",
    Icon: CheckCircle2,
    chipClass: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
};

function formatDate(raw?: string) {
  if (!raw) return "";
  const d = new Date(raw.replace(" ", "T"));
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ================= Animations ================= */
// ... (Không đổi)
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

export default function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const doc = getDoc(params.id);

  // Không tìm thấy -> UI đơn giản trả về danh sách
  if (!doc) {
    // ... (Không đổi)
    return (
      <div className="min-h-screen bg-[rgb(248_250_252)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/documents"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại danh sách văn kiện
          </Link>
          <div className="rounded-2xl border bg-white p-8 text-slate-700 shadow-sm">
            Không tìm thấy văn kiện.
          </div>
        </div>
      </div>
    );
  }

  // Reading progress
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    // ✨ SỬA: Offset này tính khi đầu content chạm đầu màn hình,
    // và kết thúc khi cuối content chạm cuối màn hình.
    // Dùng "end end" thay vì "end start" để thanh progress đầy 100%.
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });

  const S = STATUS[doc.status as keyof typeof STATUS] ?? STATUS.voting;

  return (
    <motion.div
      className="min-h-screen bg-[rgb(248_250_252)]"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* ✨ SỬA: Thanh progress bar dính ở trên cùng */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-400 z-50"
        style={{ scaleX: progress, transformOrigin: "0%" }}
      />

      {/* Aura nền nhẹ */}
      {/* ... (Không đổi) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, rgba(14,165,233,0.10) 0%, rgba(14,165,233,0) 50%), radial-gradient(40% 30% at 80% 0%, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0) 55%)",
        }}
      />

      {/* ✨ SỬA: Thêm pb-24 (padding bottom) để có không gian cuộn cho content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Back */}
        <motion.div variants={blockVariants}>
          <Link
            href="/documents"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại danh sách văn kiện
          </Link>
        </motion.div>

        {/* ✨ SỬA: Sắp xếp lại thẻ Header Card */}
        <motion.div
          variants={blockVariants}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-start gap-5 mb-5">
            <div className="hidden sm:block p-4 rounded-xl bg-sky-50 ring-1 ring-sky-100 shrink-0">
              <FileText className="text-sky-600" size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3 break-words">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="text-lg text-slate-600 leading-relaxed">
                  {doc.description}
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm border-t border-b border-slate-200 py-4 my-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Trạng thái:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${S.chipClass}`}
              >
                <S.Icon size={14} />
                {S.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Phân loại:</span>
              <Badge variant="secondary" className="rounded-full">
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

          {/* Attachments (Đưa vào trong thẻ header) */}
          {!!doc.attachments?.length && (
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-3">
                <Paperclip size={16} />
                Tài liệu đính kèm
              </h3>
              <div className="flex flex-wrap gap-2">
                {doc.attachments.map((file: any, i: number) => (
                  // Giả sử file có 'url' để tải về
                  // Dùng `asChild` của Button (shadcn) để bọc Link
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2 bg-white hover:bg-slate-50"
                  >
                    <a
                      href={file.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download size={16} />
                      {file.name}
                      {file.size ? (
                        <span className="text-slate-500">({file.size})</span>
                      ) : null}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ✨ SỬA: Dùng space-y-8 để tạo khoảng cách đồng đều giữa các khối */}
        <div className="mt-8 space-y-8">
          {/* Voting block */}
          {doc.status === "voting" && (
            <motion.div variants={blockVariants}>
              <VotingInterface documentId={doc.id} documentTitle={doc.title} />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            ref={contentRef}
            variants={blockVariants}
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm"
          >
            {/* ✨ SỬA: Dùng ReactMarkdown. 
              Class "prose" (của tailwindcss-typography) sẽ tự động
              thêm style cho các thẻ h1, h2, p, ul, table...
              giúp nội dung văn kiện trông đẹp như tài liệu.
            */}
            <article className="prose prose-slate max-w-none">
              {doc.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {doc.content}
                </ReactMarkdown>
              ) : (
                <p>Chưa có nội dung hiển thị.</p>
              )}
            </article>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
