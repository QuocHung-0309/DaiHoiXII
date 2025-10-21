"use client";

import { useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr"; // <--- SỬA 1
import { motion } from "framer-motion";
import {
  BarChart2,
  PieChart as PieIcon,
  FileText,
  Filter,
  Download,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ================== Types ================== */
type VoteRow = {
  id: string;
  title: string;
  status: string;
  total: number;
  agree: number;
  disagree: number;
  abstain: number;
};

type ApiResp = {
  updatedAt: string;
  items: VoteRow[];
};

/* ================== Utils ================== */
const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then(async (r) => {
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  });

const COLORS = ["#0ea5e9", "#f97316", "#94a3b8"]; // agree / disagree / abstain

function toCSV(rows: VoteRow[]) {
  const head = [
    "id",
    "title",
    "status",
    "total",
    "agree",
    "disagree",
    "abstain",
    "agree_rate",
  ];
  const body = rows.map((r) =>
    [
      r.id,
      `"${r.title.replaceAll('"', '""')}"`,
      r.status,
      r.total,
      r.agree,
      r.disagree,
      r.abstain,
      (r.total ? r.agree / r.total : 0).toFixed(3),
    ].join(",")
  );
  return [head.join(","), ...body].join("\n");
}

function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================== Page ================== */
export default function AdminVotingResultsPage() {
  const [q, setQ] = useState("");
  const [view, setView] = useState<"bar" | "pie">("bar");
  const { mutate } = useSWRConfig();

  const { data, error, isLoading } = useSWR<ApiResp>(
    "/api/live/vote-summary",
    fetcher,
    { refreshInterval: 2000 } // “realtime” nhẹ
  );

  const rows: VoteRow[] = data?.items ?? [];

  const filtered = useMemo(
    () => rows.filter((d) => d.title.toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );

  const barData = useMemo(
    () =>
      filtered.map((d) => ({
        name: d.title,
        "Tán thành": d.agree,
        "Không tán thành": d.disagree,
        "Phiếu trắng": d.abstain,
      })),
    [filtered]
  );

  const summary = useMemo(() => {
    const T = filtered.reduce((s, x) => s + x.total, 0);
    const A = filtered.reduce((s, x) => s + x.agree, 0);
    const D = filtered.reduce((s, x) => s + x.disagree, 0);
    const N = filtered.reduce((s, x) => s + x.abstain, 0);
    return { T, A, D, N, rate: T ? A / T : 0 };
  }, [filtered]);
  const [clearing, setClearing] = useState(false);
  async function handleClear() {
    if (
      !confirm("Xoá toàn bộ phiếu & góp ý test? Hành động không thể hoàn tác.")
    ) {
      return;
    }
    try {
      setClearing(true);
      const res = await fetch("/api/admin/clear-test", { method: "POST" });
      const j = await res.json();
      if (!res.ok) {
        alert(j?.error || "Xoá thất bại.");
        return;
      }
      alert(`Đã xoá ${j.deleted.votes} phiếu và ${j.deleted.feedback} góp ý.`);
      // refresh bảng/biểu đồ
      mutate("/api/live/vote-summary");
      // (tuỳ) nếu bạn có màn feedback admin live, gọi mutate route tương ứng
    } catch (e) {
      console.error(e);
      alert("Có lỗi xảy ra.");
    } finally {
      setClearing(false);
    }
  } // <--- SỬA 2: Thêm dấu } ở đây

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
            Kết quả biểu quyết
          </h1>
          <p className="text-slate-600">
            Tổng quan và phân tích theo từng văn kiện.
          </p>
          {data?.updatedAt && (
            <div className="mt-1 text-xs text-slate-500">
              Cập nhật: {new Date(data.updatedAt).toLocaleString("vi-VN")}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView((v) => (v === "bar" ? "pie" : "bar"))}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            {view === "bar" ? <PieIcon size={16} /> : <BarChart2 size={16} />}
            Đổi biểu đồ
          </button>
          <button
            onClick={() => downloadCSV("voting_results.csv", toCSV(filtered))}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50"
            disabled={!filtered.length}
            title={!filtered.length ? "Chưa có dữ liệu để xuất" : "Xuất CSV"}
          >
            <Download size={16} /> Xuất CSV
          </button>
        </div>
      </div>
      <button
        onClick={handleClear}
        disabled={clearing}
        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 text-white px-3 py-2 text-sm hover:bg-rose-700 disabled:opacity-70"
        title="Xoá toàn bộ dữ liệu test (phiếu + góp ý)"
      >
        <Trash2 size={16} />
        {clearing ? "Đang xoá…" : "Xoá dữ liệu test"}
      </button>
      {/* TOOLS */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <input
            placeholder="Tìm theo tên văn kiện…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-72 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          <Filter
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
        </div>
        <button
          onClick={() => setQ("")}
          className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          <RefreshCw size={16} /> Reset
        </button>
      </div>

      {/* ERROR / EMPTY STATES */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
          Không lấy được dữ liệu: {String(error.message || error)}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          color="text-slate-900"
          label="Tổng phiếu"
          value={summary.T}
        />
        <SummaryCard color="text-sky-600" label="Tán thành" value={summary.A} />
        <SummaryCard
          color="text-amber-600"
          label="Không tán thành"
          value={summary.D}
        />
        <SummaryCard
          color="text-slate-500"
          label="Phiếu trắng"
          value={summary.N}
        />
      </div>

      {/* CHART */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-slate-700">
          <FileText size={16} /> Biểu đồ {view === "bar" ? "cột" : "tròn"}
        </div>
        <div className="h-[360px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              Đang tải…
            </div>
          ) : !filtered.length ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              Chưa có dữ liệu hiển thị.
            </div>
          ) : view === "bar" ? (
            <ResponsiveContainer>
              <BarChart
                data={barData}
                margin={{ top: 8, right: 16, left: -16, bottom: 8 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Tán thành"
                  stackId="a"
                  fill={COLORS[0]}
                  radius={[6, 6, 0, 0]}
                />
                <Bar dataKey="Không tán thành" stackId="a" fill={COLORS[1]} />
                <Bar dataKey="Phiếu trắng" stackId="a" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: "Tán thành", value: summary.A },
                    { name: "Không tán thành", value: summary.D },
                    { name: "Phiếu trắng", value: summary.N },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {[0, 1, 2].map((i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Văn kiện</th>
              <th className="px-2 py-3 text-right">Tổng</th>
              <th className="px-2 py-3 text-right text-sky-700">Tán thành</th>
              <th className="px-2 py-3 text-right text-amber-700">
                Không tán thành
              </th>
              <th className="px-2 py-3 text-right text-slate-600">Trắng</th>
              <th className="px-4 py-3 text-right">Tỉ lệ tán thành</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  {isLoading ? "Đang tải…" : "Không có mục nào phù hợp."}
                </td>
              </tr>
            ) : (
              filtered.map((d) => {
                const rate = d.total ? d.agree / d.total : 0;
                return (
                  <tr key={d.id} className="border-t">
                    <td className="px-4 py-3">{d.title}</td>
                    <td className="px-2 py-3 text-right">{d.total}</td>
                    <td className="px-2 py-3 text-right">{d.agree}</td>
                    <td className="px-2 py-3 text-right">{d.disagree}</td>
                    <td className="px-2 py-3 text-right">{d.abstain}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-semibold">
                          {(rate * 100).toFixed(1)}%
                        </span>
                        <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500"
                            style={{ width: `${rate * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ================== Small card ================== */
function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-extrabold ${color}`}>{value}</div>
    </div>
  );
}
