"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Tag,
  Download,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VotingInterface } from "@/components/voting-interface";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import { useRef } from "react";

/* ================= Mock data giữ nguyên ================= */
const documents: Record<string, any> = {
  "1": {
    id: "1",
    title: "Báo cáo tổng kết nhiệm kỳ 2022-2024",
    category: "Báo cáo",
    status: "voting",
    deadline: "2024-03-20 17:00",
    description:
      "Báo cáo tổng kết hoạt động của Hội sinh viên trong nhiệm kỳ 2022-2024",
    content: `
# PHẦN I: TỔNG QUAN HOẠT ĐỘNG NHIỆM KỲ 2022-2024
...
    `,
    attachments: [
      { name: "Bao_cao_chi_tiet.pdf", size: "2.5 MB" },
      { name: "Phu_luc_so_lieu.xlsx", size: "1.2 MB" },
    ],
  },
  "2": {
    id: "2",
    title: "Phương hướng hoạt động nhiệm kỳ 2024-2026",
    category: "Nghị quyết",
    status: "voting",
    deadline: "2024-03-20 17:00",
    description: "Phương hướng và kế hoạch hoạt động cho nhiệm kỳ mới",
    content: `
# PHƯƠNG HƯỚNG HOẠT ĐỘNG NHIỆM KỲ 2024-2026
...
    `,
    attachments: [{ name: "Phuong_huong_chi_tiet.pdf", size: "1.8 MB" }],
  },
};

function getDocument(id: string) {
  return documents[id] || documents["1"];
}

/* ================= UI helpers ================= */
const STATUS: Record<
  "voting" | "pending" | "completed",
  {
    label: string;
    Icon: any;
    chipClass: string;
  }
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

function formatDate(raw: string) {
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
  const doc = getDocument(params.id);

  // Reading progress bar: dựa theo container nội dung
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end start"], // bắt đầu khi chạm top, kết thúc khi cuộn hết content
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
      {/* Aura nền nhẹ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, rgba(14,165,233,0.10) 0%, rgba(14,165,233,0) 50%), radial-gradient(40% 30% at 80% 0%, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0) 55%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Header card */}
        <motion.div
          variants={blockVariants}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start gap-4 mb-5">
            <div className="p-4 rounded-xl bg-sky-50 ring-1 ring-sky-100">
              <FileText className="text-sky-600" size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${S.chipClass}`}
                >
                  <S.Icon size={14} />
                  {S.label}
                </span>
                <Badge variant="secondary" className="rounded-full">
                  {doc.category}
                </Badge>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2 break-words">
                {doc.title}
              </h1>
              <p className="text-slate-600">{doc.description}</p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-slate-500" />
                  <span className="text-slate-500">Loại:</span>
                  <span className="font-medium text-slate-800">
                    {doc.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-500" />
                  <span className="text-slate-500">Hạn biểu quyết:</span>
                  <span className="font-medium text-slate-800">
                    {formatDate(doc.deadline)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {doc.attachments?.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-semibold text-slate-900 mb-3">
                Tài liệu đính kèm
              </h3>
              <div className="flex flex-wrap gap-2">
                {doc.attachments.map((file: any, i: number) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-white hover:bg-slate-50"
                  >
                    <Download size={16} />
                    {file.name}
                    <span className="text-slate-500">({file.size})</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Voting block */}
        {doc.status === "voting" && (
          <motion.div variants={blockVariants} className="mt-6">
            <VotingInterface documentId={doc.id} documentTitle={doc.title} />
          </motion.div>
        )}

        {/* Reading progress bar */}
        <div className="relative mt-8">
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400"
              style={{ scaleX: progress, transformOrigin: "0% 50%" }}
            />
          </div>
        </div>

        {/* Content */}
        <motion.div
          ref={contentRef}
          variants={blockVariants}
          className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          {/* Nếu sau này bạn render markdown thực sự, chuyển sang react-markdown.
             Tạm thời hiển thị như text có xuống dòng. */}
          <article className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
              {doc.content}
            </div>
          </article>
        </motion.div>
      </div>
    </motion.div>
  );
}
