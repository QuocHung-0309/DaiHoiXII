"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { FileText, Clock, CheckCircle2, ListChecks, UserCheck } from "lucide-react"; // Thêm icon
import { listCompact, type DocStatus } from "@/lib/static-docs"; // Đảm bảo đường dẫn đúng

/* ================== BRAND ================== */
const BRAND = {
  primaryFrom: "#0EA5E9", // sky-500
  primaryTo: "#22D3EE",   // cyan-400
  dark: "#0F172A",      // slate-900
};

/* ================== Status config (BỔ SUNG) ================== */
// Cấu hình hiển thị cho từng trạng thái
const statusConfig: Record<
  DocStatus,
  { label: string; icon: React.ElementType; chip: string }
> = {
  voting: {
    label: "Đang BQ",
    icon: ListChecks, // Icon khác cho voting
    chip: "bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-200",
  },
  pending: {
    label: "Chờ BQ",
    icon: Clock,
    chip: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200",
  },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    chip: "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  },
};

/* ================== Animations ================== */
// (Giữ nguyên)
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
const headerVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};
const gridVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05 } },
};
const cardVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

/* ================== Utils ================== */
// (Giữ nguyên)
type StatusFilter = "all" | DocStatus; // Sửa type để dùng chung DocStatus
function formatDate(d?: string) {
  if (!d) return "Chưa có"; // Hiển thị rõ hơn nếu không có hạn
  try {
    const date = new Date(d);
    // Kiểm tra xem date có hợp lệ không
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", d); // Cảnh báo nếu định dạng sai
      return d; // Trả về chuỗi gốc nếu không parse được
    }
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
      console.error("Error formatting date:", d, e);
      return d; // Trả về chuỗi gốc nếu có lỗi
  }
}

export default function DocumentsPage() {
  const docs = listCompact(); // Lấy danh sách từ file static-docs
  const [filter, setFilter] = useState<StatusFilter>("all");

  // Tính số lượng cho mỗi filter (Giữ nguyên)
  const counts = useMemo(
    () => ({
      all: docs.length,
      voting: docs.filter((d) => d.status === "voting").length,
      pending: docs.filter((d) => d.status === "pending").length,
      completed: docs.filter((d) => d.status === "completed").length,
    }),
    [docs]
  );

  // Lọc và sắp xếp danh sách (Giữ nguyên)
  const filtered = useMemo(() => {
    const list =
      filter === "all" ? [...docs] : docs.filter((d) => d.status === filter);
    // Sắp xếp: voting -> pending -> completed, sau đó theo deadline (nếu có)
    const order: Record<DocStatus, number> = {
      voting: 0,
      pending: 1,
      completed: 2,
    };
    return list.sort((a, b) => {
       const statusDiff = order[a.status] - order[b.status];
       if (statusDiff !== 0) return statusDiff;
       // Nếu cùng status, sắp xếp theo deadline (cũ trước, mới sau, không có deadline cuối cùng)
       const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
       const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
       return dateA - dateB;
    });
  }, [docs, filter]);

  // Danh sách các nút filter (Giữ nguyên)
  const filters: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: counts.all },
    { key: "voting", label: "Đang biểu quyết", count: counts.voting },
    { key: "pending", label: "Chờ biểu quyết", count: counts.pending },
    { key: "completed", label: "Đã hoàn thành", count: counts.completed },
  ];

  return (
    <motion.div
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      style={{
        // Gradient nền (Giữ nguyên)
        background:
          "linear-gradient(180deg, rgba(241,245,249,0.9) 0%, rgba(241,245,249,0.9) 60%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div className="relative">
        {/* Aura nền (Giữ nguyên) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(60% 40% at 20% 0%, ${BRAND.primaryFrom}20 0%, transparent 60%),
                         radial-gradient(40% 30% at 80% 0%, ${BRAND.primaryTo}14 0%, transparent 60%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header (Giữ nguyên) */}
          <motion.div className="mb-6 sm:mb-8" variants={headerVariants}>
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: BRAND.dark }}
            >
              Văn kiện Đại hội
            </h1>
            <p className="mt-2 text-slate-600">
              Xem và biểu quyết các văn kiện của Đại hội XII
            </p>
          </motion.div>

          {/* Filter Pills (Giữ nguyên) */}
          <motion.div className="mb-8" variants={headerVariants}>
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5">
              {filters.map((f) => {
                const active = f.key === filter;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    aria-pressed={active}
                    className="group relative px-4 py-1.5 rounded-full text-sm font-semibold focus:outline-none transition"
                    style={{ color: active ? "white" : "#334155" /* slate-700 */ }}
                  >
                    {active && (
                      <motion.span
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND.primaryFrom}, ${BRAND.primaryTo})`,
                          boxShadow: "0 6px 16px rgba(2,132,199,0.25)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                      />
                    )}
                    <span className="relative z-[1]">{f.label}</span>
                    <span
                      className={`relative z-[1] ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Grid hiển thị danh sách văn kiện */}
          {filtered.length === 0 ? (
            // Thông báo khi không có văn kiện phù hợp filter (Giữ nguyên)
            <motion.div
              className="rounded-2xl border bg-white p-10 text-center text-slate-600 shadow-sm"
              variants={headerVariants}
            >
              Không có văn kiện nào ở trạng thái "{filters.find(f => f.key === filter)?.label}".
            </motion.div>
          ) : (
            // Lưới hiển thị các thẻ văn kiện (Giữ nguyên)
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={gridVariants}
              initial="initial"
              animate="animate"
            >
              {filtered.map((doc) => {
                // Lấy cấu hình hiển thị dựa trên status
                const conf = statusConfig[doc.status];
                const StatusIcon = conf.icon;
                return (
                  <motion.div
                    key={doc.id}
                    variants={cardVariants}
                    whileHover={{
                      y: -4,
                      boxShadow: "0px 14px 34px rgba(2,132,199,0.14)",
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    {/* Link đến trang chi tiết */}
                    <Link
                      href={`/documents/${doc.id}`} // Đường dẫn đến trang chi tiết
                      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-sky-300 transition-colors duration-200 h-full flex flex-col" // Thêm h-full và flex
                    >
                      {/* Phần Header của Card */}
                      <div className="flex items-start justify-between mb-4">
                        {/* Icon Văn kiện */}
                        <div
                          className="p-3 rounded-xl ring-1 ring-sky-100"
                          style={{
                            background:
                              "linear-gradient(135deg, #E0F2FE, #FFFFFF)", // light sky gradient
                          }}
                        >
                          <FileText
                            style={{ color: BRAND.primaryFrom }}
                            size={22}
                            strokeWidth={2.5}
                          />
                        </div>
                        {/* Trạng thái (Pill) */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${conf.chip}`}
                        >
                          <StatusIcon size={14} strokeWidth={2.5} />
                          {conf.label}
                        </span>
                      </div>

                      {/* Phần Nội dung chính */}
                      <div className="flex-grow"> {/* Đẩy footer xuống dưới */}
                        <h3
                          className="text-lg font-bold mb-1.5 line-clamp-2" // Đổi font weight
                          style={{ color: BRAND.dark }}
                        >
                          {doc.title}
                        </h3>

                        {doc.description && (
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2"> {/* Tăng line clamp */}
                            {doc.description}
                          </p>
                        )}
                      </div>


                      {/* Phần Footer của Card */}
                      <div className="mt-auto pt-4 border-t border-slate-100"> {/* Thêm border top */}
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className="font-semibold text-sky-600" // Đổi màu category
                          >
                            {doc.category}
                          </span>
                          <span className="text-slate-500 text-xs font-medium"> {/* Style lại hạn */}
                            Hạn BQ: {formatDate(doc.deadline)}
                          </span>
                        </div>
                      </div>

                       {/* Hiệu ứng gạch chân khi hover (Giữ nguyên) */}
                      <span
                        className="mt-4 block h-[3px] w-0 group-hover:w-full rounded-full transition-all duration-300"
                        style={{
                          background: `linear-gradient(90deg, ${BRAND.primaryFrom}, ${BRAND.primaryTo})`,
                        }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}