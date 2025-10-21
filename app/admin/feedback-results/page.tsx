"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Download, Search, MessageSquare, Filter, Eye } from "lucide-react";

type Feedback = {
  id: string;
  docId: string;
  docTitle: string;
  fullname: string;
  studentId: string;
  unit: string;
  createdAt: string; // ISO
  content: string;
  fileUrl?: string;
  tag?: "tích cực" | "trung lập" | "đề nghị chỉnh sửa";
};

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => r.json());

function toCSV(rows: Feedback[]) {
  const head = [
    "id",
    "docId",
    "docTitle",
    "fullname",
    "studentId",
    "unit",
    "createdAt",
    "tag",
    "content",
  ];
  const body = rows.map((r) =>
    [
      r.id,
      r.docId,
      `"${r.docTitle}"`,
      `"${r.fullname}"`,
      r.studentId,
      `"${r.unit}"`,
      r.createdAt,
      r.tag ?? "",
      `"${r.content.replace(/"/g, '""')}"`,
    ].join(",")
  );
  return [head.join(","), ...body].join("\n");
}
function downloadCSV(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function AdminFeedbackResults() {
  const { data } = useSWR<{ items: Feedback[] }>(
    "/api/admin/feedbacks",
    fetcher,
    { refreshInterval: 8000 }
  );
  const list = data?.items ?? [];

  const [doc, setDoc] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");
  const [q, setQ] = useState("");

  const docsForFilter = useMemo(() => {
    const m = new Map<string, string>();
    list.forEach((x) => m.set(x.docId, x.docTitle));
    return Array.from(m, ([id, title]) => ({ id, title }));
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter(
      (f) =>
        (doc === "all" || f.docId === doc) &&
        (tag === "all" || f.tag === tag) &&
        (f.content.toLowerCase().includes(q.toLowerCase()) ||
          f.fullname.toLowerCase().includes(q.toLowerCase()) ||
          f.unit.toLowerCase().includes(q.toLowerCase()))
    );
  }, [list, doc, tag, q]);

  return (
    <motion.div
      className="min-h-screen bg-[rgb(248_250_252)] px-4 sm:px-6 lg:px-8 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kết quả góp ý văn kiện
          </h1>
          <p className="text-slate-600">
            Xem, lọc và xuất các góp ý từ đại biểu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadCSV("feedback_results.csv", toCSV(filtered))}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            <Download size={16} /> Xuất CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
          <Filter size={16} className="text-slate-500" />
          <select
            className="text-sm outline-none"
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
          >
            <option value="all">Tất cả văn kiện</option>
            {docsForFilter.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
          <MessageSquare size={16} className="text-slate-500" />
          <select
            className="text-sm outline-none"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="all">Tất cả nhãn</option>
            <option value="tích cực">Tích cực</option>
            <option value="trung lập">Trung lập</option>
            <option value="đề nghị chỉnh sửa">Đề nghị chỉnh sửa</option>
          </select>
        </div>

        <div className="relative">
          <input
            placeholder="Tìm tên / đơn vị / nội dung…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-72 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm text-slate-500">
                  {new Date(f.createdAt).toLocaleString("vi-VN")} • {f.unit}
                </div>
                <div className="mt-1 font-semibold text-slate-900">
                  {f.fullname} – {f.studentId}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Văn kiện: <span className="font-medium">{f.docTitle}</span>
                </div>
              </div>
              <span
                className={`h-7 px-3 inline-flex items-center rounded-full text-xs font-semibold ${
                  f.tag === "tích cực"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : f.tag === "đề nghị chỉnh sửa"
                    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                    : "bg-slate-50 text-slate-700 ring-1 ring-slate-200"
                }`}
              >
                {f.tag ?? "chưa gán nhãn"}
              </span>
            </div>

            <p className="mt-3 text-slate-800 whitespace-pre-line">
              {f.content}
            </p>

            {f.fileUrl && (
              <div className="mt-3">
                <a
                  href={f.fileUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-sm text-slate-700 hover:underline"
                >
                  <Eye size={14} /> Xem tệp đính kèm
                </a>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            {list.length
              ? "Chưa có góp ý phù hợp bộ lọc."
              : "Đang tải dữ liệu…"}
          </div>
        )}
      </div>
    </motion.div>
  );
}
