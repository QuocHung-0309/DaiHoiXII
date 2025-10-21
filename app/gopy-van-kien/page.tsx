"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { motion, type Variants } from "framer-motion";
import {
  FileText,
  UserRound,
  IdCard,
  Mail,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

/* -------------------- fetcher -------------------- */
const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => r.json());

/* -------------------- animations -------------------- */
const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];
const pageV: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
};
const itemV: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

/* -------------------- types -------------------- */
type Doc = { id: string; title: string };

type FormDataT = {
  fullname: string;
  studentId: string;
  email: string;
  unit: string;
  docId: string; // gửi lên backend qua field documentId
  content: string;
  agree: boolean;
  file?: File | null;
};

/* =======================================================
   PAGE
======================================================= */
export default function FeedbackPage() {
  // 1) Lấy danh sách văn kiện thật
  const { data: docsResp } = useSWR<{ items: Doc[] }>(
    "/api/documents/compact",
    fetcher,
    { refreshInterval: 15_000 }
  );
  const DOCS: Doc[] = docsResp?.items ?? [];

  // 2) Prefill + state
  const [data, setData] = useState<FormDataT>({
    fullname: "",
    studentId: "",
    email: "",
    unit: "",
    docId: "", // set sau khi DOCS có dữ liệu
    content: "",
    agree: false,
    file: null,
  });

  // set docId mặc định khi DOCS đã load
  useEffect(() => {
    if (!data.docId && DOCS.length > 0) {
      setData((s) => ({ ...s, docId: DOCS[0].id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DOCS.length]);

  // prefill profile từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("feedback.profile");
    if (!saved) return;
    try {
      const p = JSON.parse(saved);
      setData((s) => ({
        ...s,
        fullname: p.fullname ?? s.fullname,
        studentId: p.studentId ?? s.studentId,
        email: p.email ?? s.email,
        unit: p.unit ?? s.unit,
      }));
    } catch {
      /* ignore */
    }
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"ok" | "err" | null>(null);

  const onChange = <K extends keyof FormDataT>(k: K, v: FormDataT[K]) =>
    setData((s) => ({ ...s, [k]: v }));

  const currentDoc = useMemo(
    () => DOCS.find((d) => d.id === data.docId)?.title ?? "",
    [DOCS, data.docId]
  );
  const contentLen = data.content.trim().length;

  function validate(): string | null {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!data.fullname.trim()) return "Vui lòng nhập Họ và tên.";
    if (!data.studentId.trim()) return "Vui lòng nhập MSSV.";
    if (!emailOk) return "Email không hợp lệ.";
    if (!data.unit.trim()) return "Vui lòng nhập Đơn vị/Khoa.";
    if (!data.docId) return "Vui lòng chọn văn kiện.";
    if (contentLen < 30) return "Nội dung góp ý quá ngắn (≥ 30 ký tự).";
    if (!data.agree)
      return "Vui lòng đồng ý cho phép sử dụng thông tin góp ý để tổng hợp.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus("err");
      alert(err);
      return;
    }

    try {
      setSubmitting(true);
      setStatus(null);

      // Lưu profile để tự điền lần sau
      localStorage.setItem(
        "feedback.profile",
        JSON.stringify({
          fullname: data.fullname,
          studentId: data.studentId,
          email: data.email,
          unit: data.unit,
        })
      );

      // Gửi JSON — backend nhận field documentId
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: data.fullname,
          studentId: data.studentId,
          email: data.email,
          unit: data.unit,
          documentCode: String(data.docId), // ✅ đổi về documentId
          content: data.content,
          consent: data.agree,
        }),
      });
      if (!res.ok) throw new Error(await res.text());

      setStatus("ok");
      setData((s) => ({ ...s, content: "", agree: false, file: null }));
    } catch (e) {
      console.error(e);
      setStatus("err");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      variants={pageV}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-[rgb(248_250_252)]"
    >
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Góp ý văn kiện
          </h1>
          <p className="mt-1 text-slate-600">
            Đóng góp ý kiến cho các văn kiện, dự thảo – cùng hoàn thiện nội dung
            Đại hội.
          </p>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Aside */}
          <motion.aside
            variants={itemV}
            className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="relative h-[280px] overflow-hidden rounded-t-2xl">
              <Image
                src="/gopy-banner.jpg"
                alt="Góp ý văn kiện"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <p className="absolute bottom-3 left-4 right-4 text-white text-sm">
                Quét QR hoặc điền form bên phải để gửi góp ý.
              </p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Info className="h-4 w-4" /> Lưu ý
              </div>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                <li>• Chọn đúng văn kiện cần góp ý.</li>
                <li>• Trình bày rõ ràng vấn đề & đề xuất giải pháp.</li>
                <li>• File đính kèm (nếu có) dạng PDF/Ảnh ≤ 10MB.</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Thông tin chỉ dùng cho mục đích tổng hợp, không công bố chi tiết
                danh tính.
              </p>
            </div>
          </motion.aside>

          {/* Form */}
          <motion.form
            onSubmit={onSubmit}
            variants={itemV}
            className="lg:col-span-3 rounded-2xl bg-white border border-slate-200 shadow-sm p-6"
          >
            {/* status */}
            {status === "ok" && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5" />
                <div>
                  <b>Đã gửi góp ý thành công.</b> Cảm ơn bạn đã đồng hành cùng
                  Đại hội!
                </div>
              </div>
            )}
            {status === "err" && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
                <AlertCircle className="mt-0.5 h-5 w-5" />
                <div>Gửi chưa thành công. Vui lòng kiểm tra lại thông tin.</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Họ và tên"
                icon={<UserRound className="h-4 w-4" />}
                required
              >
                <input
                  className="Input"
                  placeholder="VD: Nguyễn Văn A"
                  value={data.fullname}
                  onChange={(e) => onChange("fullname", e.target.value)}
                />
              </Field>
              <Field
                label="MSSV"
                icon={<IdCard className="h-4 w-4" />}
                required
              >
                <input
                  className="Input"
                  placeholder="VD: 2212345"
                  value={data.studentId}
                  onChange={(e) => onChange("studentId", e.target.value)}
                />
              </Field>
              <Field label="Email" icon={<Mail className="h-4 w-4" />} required>
                <input
                  className="Input"
                  type="email"
                  placeholder="you@hcmute.edu.vn"
                  value={data.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </Field>
              <Field
                label="Đơn vị/Khoa"
                icon={<Building2 className="h-4 w-4" />}
                required
              >
                <input
                  className="Input"
                  placeholder="VD: Khoa CNTT"
                  value={data.unit}
                  onChange={(e) => onChange("unit", e.target.value)}
                />
              </Field>

              <Field
                label="Văn kiện cần góp ý"
                icon={<FileText className="h-4 w-4" />}
                colSpan
              >
                <select
                  className="Input"
                  value={data.docId}
                  onChange={(e) => onChange("docId", e.target.value)}
                  disabled={!DOCS.length}
                >
                  {DOCS.length === 0 ? (
                    <option>Đang tải danh sách…</option>
                  ) : (
                    DOCS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))
                  )}
                </select>
              </Field>
            </div>

            {/* CONTENT */}
            <div className="mt-4">
              <label className="Label">
                Góp ý cho: <b>{currentDoc || "…"}</b>
              </label>
              <div className="relative">
                <textarea
                  className="Input min-h-[180px] resize-y pr-16"
                  placeholder="Nêu vấn đề + đề xuất chỉnh sửa/giải pháp (≥ 30 ký tự)…"
                  value={data.content}
                  onChange={(e) => onChange("content", e.target.value)}
                  maxLength={2500}
                />
                <span className="absolute bottom-2 right-3 rounded-md px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600">
                  {contentLen}/2500
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-slate-600 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((contentLen / 2500) * 100)
                    )}%`,
                  }}
                />
              </div>
              <div
                className={`mt-1 text-xs ${
                  contentLen < 30 ? "text-slate-700" : "text-slate-500"
                }`}
              >
                {contentLen < 30
                  ? "Mô tả rõ góp ý tối thiểu ~30 ký tự."
                  : "Cảm ơn góp ý của bạn! (Nhấn ⌘/Ctrl + Enter để gửi nhanh)"}
              </div>
            </div>

            {/* Consent */}
            <div className="mt-4 rounded-xl border border-slate-200 p-3">
              <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.agree}
                  onChange={(e) => onChange("agree", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-300"
                />
                <span>
                  Tôi đồng ý cho phép Đại hội sử dụng thông tin góp ý để tổng
                  hợp & hoàn thiện văn kiện.
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={submitting || !DOCS.length}
                className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Đang gửi…" : "Gửi góp ý"}
              </button>
            </div>

            {/* styles */}
            <style jsx global>{`
              .Label {
                @apply block text-sm font-medium text-slate-800 mb-1;
              }
              .Input {
                @apply box-border block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200;
              }
            `}</style>
          </motion.form>
        </div>

        {/* “Góp ý đã gửi” của tôi — map documentId -> title bằng DOCS */}
        {data.studentId || data.email ? (
          <MyFeedbackList
            studentId={data.studentId}
            email={data.email}
            docs={DOCS}
          />
        ) : null}
      </main>
    </motion.div>
  );
}

/* =======================================================
   Field helper
======================================================= */
function Field({
  label,
  icon,
  children,
  required,
  colSpan,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? "sm:col-span-2" : ""}>
      <label className="Label">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <div className={icon ? "pl-9" : ""}>{children}</div>
      </div>
    </div>
  );
}

/* =======================================================
   “Góp ý của tôi” – GET /api/feedback?studentId=&email=
   Backend trả { items: [{ id, content, createdAt, documentId }] }
   FE map documentId -> title qua props.docs
======================================================= */
function MyFeedbackList({
  studentId,
  email,
  docs,
}: {
  studentId: string;
  email: string;
  docs: Doc[];
}) {
  const qs = new URLSearchParams({ studentId, email }).toString();
  const { data } = useSWR<{
    items: Array<{
      id: string;
      content: string;
      createdAt: string;
      documentId: string;
    }>;
  }>(`/api/feedback?${qs}`, fetcher, { refreshInterval: 10_000 });

  const items = data?.items ?? [];

  const idToTitle = useMemo(() => {
    const m = new Map<string, string>();
    docs.forEach((d) => m.set(d.id, d.title));
    return m;
  }, [docs]);

  if (!items.length) return null;

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-slate-900 font-semibold mb-3">Góp ý bạn đã gửi</div>
      <ul className="space-y-3">
        {items.map((it) => {
          const title =
            idToTitle.get(it.documentId) ?? `Văn kiện #${it.documentId}`;
          return (
            <li key={it.id} className="rounded-xl border border-slate-200 p-3">
              <div className="text-sm text-slate-500">
                {new Date(it.createdAt).toLocaleString("vi-VN")} • {title}
              </div>
              <div className="mt-1 text-slate-800 whitespace-pre-line">
                {it.content}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
