"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Search, MessageSquare, Filter, Eye } from "lucide-react";

/* ================== MOCK DATA ================== */
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
const FB: Feedback[] = [
  {
    id: "fb1",
    docId: "1",
    docTitle: "Báo cáo tổng kết 2022–2024",
    fullname: "Nguyễn Văn A",
    studentId: "2212345",
    unit: "Khoa CNTT",
    createdAt: "2025-03-09T10:30:00Z",
    content:
      "Đề xuất bổ sung phần minh hoạ số liệu năm 2023 bằng biểu đồ để trực quan hơn. Phần hoạt động CLB nên có thêm chỉ số đầu ra.",
    tag: "đề nghị chỉnh sửa",
  },
  {
    id: "fb2",
    docId: "2",
    docTitle: "Phương hướng 2024–2026",
    fullname: "Trần Thị B",
    studentId: "2212555",
    unit: "Khoa Kinh tế",
    createdAt: "2025-03-10T08:15:00Z",
    content:
      "Đồng tình với định hướng chuyển đổi số; có thể thêm mục tiêu định lượng 2025.",
    tag: "tích cực",
  },
  {
    id: "fb3",
    docId: "3",
    docTitle: "Điều lệ (sửa đổi)",
    fullname: "Lê Văn C",
    studentId: "2212888",
    unit: "Khoa Cơ khí",
    createdAt: "2025-03-11T13:00:00Z",
    content: "Khoản 3 Điều 7 cần làm rõ phạm vi áp dụng với CLB liên khoa.",
    tag: "đề nghị chỉnh sửa",
  },
];

const DOCS = [
  { id: "1", title: "Báo cáo tổng kết 2022–2024" },
  { id: "2", title: "Phương hướng 2024–2026" },
  { id: "3", title: "Điều lệ (sửa đổi)" },
];

/* ================== HELPERS ================== */
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

/* ================== PAGE ================== */
export default function AdminFeedbackResults() {
  const [doc, setDoc] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return FB.filter(
      (f) =>
        (doc === "all" || f.docId === doc) &&
        (tag === "all" || f.tag === tag) &&
        (f.content.toLowerCase().includes(q.toLowerCase()) ||
          f.fullname.toLowerCase().includes(q.toLowerCase()) ||
          f.unit.toLowerCase().includes(q.toLowerCase()))
    );
  }, [doc, tag, q]);

  return (
    <motion.div
      className="min-h-screen bg-[rgb(248_250_252)] px-4 sm:px-6 lg:px-8 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
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

      {/* FILTERS */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
          <Filter size={16} className="text-slate-500" />
          <select
            className="text-sm outline-none"
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
          >
            <option value="all">Tất cả văn kiện</option>
            {DOCS.map((d) => (
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

      {/* LIST */}
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

            <div className="mt-3 flex items-center gap-2">
              {f.fileUrl && (
                <a
                  href={f.fileUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-sm text-slate-700 hover:underline"
                >
                  <Eye size={14} /> Xem tệp đính kèm
                </a>
              )}
              {/* nút gán nhãn nhanh (demo) */}
              <div className="ml-auto flex items-center gap-2">
                {(["tích cực", "trung lập", "đề nghị chỉnh sửa"] as const).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() =>
                        alert(`(demo) gán nhãn "${t}" cho ${f.id}`)
                      }
                      className="rounded-full border px-2.5 py-1 text-xs hover:bg-slate-50"
                    >
                      {t}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Chưa có góp ý phù hợp bộ lọc.
          </div>
        )}
      </div>
    </motion.div>
  );
}
