"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { FileText, Clock, CheckCircle2 } from "lucide-react";
import { listCompact, type DocStatus } from "@/lib/static-docs"; // <— dùng listCompact
import { IdGateClient } from "@/components/IdGateClient";

/* ================== BRAND ================== */
const BRAND = {
  primaryFrom: "#0EA5E9",
  primaryTo: "#22D3EE",
  dark: "#0F172A",
};

/* ================== Status config ================== */
const statusConfig = {
  voting: {
    label: "Đang biểu quyết",
    icon: Clock,
    chip: "text-sky-700 bg-sky-50 ring-1 ring-sky-200",
  },
  pending: {
    label: "Chờ biểu quyết",
    icon: Clock,
    chip: "text-amber-700 bg-amber-50 ring-1 ring-amber-200",
  },
  completed: {
    label: "Đã hoàn thành",
    icon: CheckCircle2,
    chip: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200",
  },
} as const;

/* ================== Animations ================== */
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
type StatusFilter = "all" | "voting" | "pending" | "completed";
function formatDate(d?: string) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DocumentsPage() {
  const docs = listCompact();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const counts = useMemo(
    () => ({
      all: docs.length,
      voting: docs.filter((d) => d.status === "voting").length,
      pending: docs.filter((d) => d.status === "pending").length,
      completed: docs.filter((d) => d.status === "completed").length,
    }),
    [docs]
  );

  const filtered = useMemo(() => {
    const list =
      filter === "all" ? [...docs] : docs.filter((d) => d.status === filter);
    const order: Record<string, number> = {
      voting: 0,
      pending: 1,
      completed: 2,
    };
    return list.sort(
      (a, b) =>
        order[a.status] - order[b.status] ||
        new Date(a.deadline ?? "").getTime() -
          new Date(b.deadline ?? "").getTime()
    );
  }, [docs, filter]);

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
        background:
          "linear-gradient(180deg, rgba(241,245,249,0.9) 0%, rgba(241,245,249,0.9) 60%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div className="relative">
        {/* Aura nền */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(60% 40% at 20% 0%, ${BRAND.primaryFrom}20 0%, transparent 60%),
                         radial-gradient(40% 30% at 80% 0%, ${BRAND.primaryTo}14 0%, transparent 60%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div className="mb-6 sm:mb-8" variants={headerVariants}>
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: BRAND.dark }}
            >
              Văn kiện Đại hội
            </h1>
            <p className="mt-2 text-slate-600">
              Xem và biểu quyết các văn kiện của Đại hội
            </p>
          </motion.div>

          {/* Filter Pills */}
          <motion.div className="mb-8" variants={headerVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5">
              {filters.map((f) => {
                const active = f.key === filter;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    aria-pressed={active}
                    className="group relative px-4 py-1.5 rounded-full text-sm font-semibold focus:outline-none transition"
                    style={{ color: active ? "white" : "#334155" }}
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
                      className={`relative z-[1] ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <motion.div
              className="rounded-2xl border bg-white p-10 text-center text-slate-600 shadow-sm"
              variants={headerVariants}
            >
              Không có văn kiện phù hợp.
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={gridVariants}
              initial="initial"
              animate="animate"
            >
              {filtered.map((doc) => {
                const conf =
                  statusConfig[doc.status as keyof typeof statusConfig];
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
                    <Link
                      href={`/documents/${doc.id}`}
                      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className="p-3 rounded-xl ring-1 ring-sky-100"
                          style={{
                            background:
                              "linear-gradient(135deg, #E0F2FE, #FFFFFF)",
                          }}
                        >
                          <FileText
                            style={{ color: BRAND.primaryFrom }}
                            size={22}
                          />
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${conf.chip}`}
                        >
                          <StatusIcon size={14} />
                          {conf.label}
                        </span>
                      </div>

                      <h3
                        className="text-lg font-extrabold mb-2 line-clamp-2"
                        style={{ color: BRAND.dark }}
                      >
                        {doc.title}
                      </h3>

                      {doc.description && (
                        <p className="text-sm text-slate-600 mb-5 line-clamp-2">
                          {doc.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span
                          className="font-semibold"
                          style={{ color: BRAND.primaryFrom }}
                        >
                          {doc.category}
                        </span>
                        <span className="text-slate-500">
                          Hạn: {formatDate(doc.deadline)}
                        </span>
                      </div>

                      <span
                        className="mt-4 block h-[3px] w-0 group-hover:w-full rounded-full transition-all"
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
