"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  BarChart3,
  Users,
  Download,
  ShieldAlert,
  Check,
  X,
} from "lucide-react";

// --- FAKE DATA (Copied from previous example) ---
type FakeVoteResults = { [key: string]: { DongY: number; KhongDongY: number } };
type FakeQuestion = { name: string; label: string };
const fakeQuestions: FakeQuestion[] = [
  { name: "P1-I-1-ThuanLoi", label: "I.1 Thuận lợi" },
  { name: "P1-I-2-KhoKhan", label: "I.2 Khó khăn" },
  { name: "P1-II-1-1-TuyenTruyenSV5T", label: "II.1.1 Tuyên truyền SV5T" },
  { name: "P1-II-1-2-1-LyTuong", label: "II.1.2.1 Lý tưởng, đạo đức" },
  { name: "P1-II-1-2-2-HocTap", label: "II.1.2.2 Học tập, NCKH" },
  { name: "P1-II-1-2-3-1-TNTrongDiem", label: "II.1.2.3.1 TN Trọng điểm" },
  { name: "P1-II-1-2-3-2-TNTaiCho", label: "II.1.2.3.2 TN Tại chỗ" },
  { name: "P1-II-1-2-3-3-TNThuongXuyen", label: "II.1.2.3.3 TN Thường xuyên" },
  { name: "P1-II-1-2-3-4-TNBienDao", label: "II.1.2.3.4 TN Biển đảo" },
  { name: "P1-II-1-2-4-TheChat", label: "II.1.2.4 Thể chất" },
  { name: "P1-II-1-2-5-HoiNhap", label: "II.1.2.5 Hội nhập" },
  { name: "P1-II-1-3-BinhChon", label: "II.1.3 Bình chọn SV5T" },
  { name: "P1-II-2-TuVan", label: "II.2 Tư vấn, hỗ trợ" },
  { name: "P1-II-3-1-TuyenTruyenHoi", label: "II.3.1 Tuyên truyền Hội" },
  { name: "P1-II-3-2-HoiVien", label: "II.3.2 Hội viên" },
  { name: "P1-II-3-3-ToChuc", label: "II.3.3 Tổ chức cơ sở Hội" },
  { name: "P1-II-3-4-CanBo", label: "II.3.4 Cán bộ Hội" },
  { name: "P1-II-3-5-KiemTra", label: "II.3.5 Kiểm tra, giám sát" },
  { name: "P1-II-3-6-ChiDao", label: "II.3.6 Chỉ đạo, phối hợp" },
  { name: "P1-III-DanhGiaChiTieu", label: "III Đánh giá chỉ tiêu" },
  { name: "P2-I-1-ThoiCo", label: "I.1 Thời cơ" },
  { name: "P2-I-2-ThachThuc", label: "I.2 Thách thức" },
  { name: "P2-II-1-MucTieu", label: "II.1 Mục tiêu" },
  { name: "P2-II-2-KhauHieu", label: "II.2 Khẩu hiệu hành động" },
  { name: "P2-II-3-ChiTieu", label: "II.3 Hệ thống chỉ tiêu" },
  { name: "P2-III-1-1-TuyenTruyen", label: "III.1.1 Tuyên truyền SV5T" },
  { name: "P2-III-1-2-1-LyTuong", label: "III.1.2.1 Lý tưởng, đạo đức" },
  { name: "P2-III-1-2-2-HocTap", label: "III.1.2.2 Học tập, NCKH" },
  { name: "P2-III-1-2-3-TinhNguyen", label: "III.1.2.3 Tình nguyện" },
  { name: "P2-III-1-2-4-TheChat", label: "III.1.2.4 Thể chất" },
  { name: "P2-III-1-2-5-HoiNhap", label: "III.1.2.5 Hội nhập" },
  { name: "P2-III-2-TuVan", label: "III.2 Tư vấn, hỗ trợ" },
  { name: "P2-III-3-1-CanBo", label: "III.3.1 Cán bộ Hội" },
  { name: "P2-III-3-2-ToChuc", label: "III.3.2 Tổ chức cơ sở Hội" },
  { name: "P2-III-3-3-HoiVien", label: "III.3.3 Hội viên" },
  { name: "P2-III-3-4-KiemTra", label: "III.3.4 Kiểm tra, thi đua" },
  { name: "P2-III-3-5-PhoiHop", label: "III.3.5 Phối hợp, tham mưu" },
  { name: "P2-III-3-6-KiemTraGS", label: "III.3.6 Kiểm tra, giám sát (mới)" },
  { name: "P2-III-3-7-ChiDao", label: "III.3.7 Chỉ đạo, phối hợp (mới)" },
  { name: "P2-III-4-DeAn", label: "III.4 Đề án trọng điểm" },
  { name: "P3-I-NhanSuBCH", label: "I Nhân sự BCH" },
  { name: "P3-II-1-BCHDat", label: "II.1 BCH Đạt được" },
  { name: "P3-II-2-BCHHanChe", label: "II.2 BCH Hạn chế" },
  { name: "P3-III-1-BTKDat", label: "III.1 BTK Đạt được" },
  { name: "P3-III-2-BTKHanChe", label: "III.2 BTK Hạn chế" },
];
const fakeTotalSubmissions = 145;
const fakeResults: FakeVoteResults = {};
fakeQuestions.forEach((q) => {
  const khongDongY = Math.floor(Math.random() * 2) + 1;
  const dongY = fakeTotalSubmissions - khongDongY;
  fakeResults[q.name] = { DongY: dongY, KhongDongY: khongDongY };
});
// --- END FAKE DATA ---

/* ================== Animations ================== */
const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];
const pageV: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
};
const itemV: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

/* ================== ✨ IMPROVED FAKE RESULTS TABLE COMPONENT ✨ ================== */
function FakeResultsTable({
  results,
  questions,
  totalVotes,
}: {
  results: FakeVoteResults;
  questions: FakeQuestion[];
  totalVotes: number;
}) {
  let totalDongY = 0;
  let totalKhongDongY = 0;
  questions.forEach((q) => {
    totalDongY += results[q.name]?.DongY ?? 0;
    totalKhongDongY += results[q.name]?.KhongDongY ?? 0;
  });
  const grandTotalVotes = totalDongY + totalKhongDongY;
  const averageDongY = questions.length > 0 ? totalDongY / questions.length : 0;
  const averageKhongDongY =
    questions.length > 0 ? totalKhongDongY / questions.length : 0;
  const averageTotal = averageDongY + averageKhongDongY;

  return (
    // Add border collapse and layout fixed for better column control
    <div className="overflow-x-auto border-t border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 border-collapse table-fixed">
        <thead className="bg-slate-50 sticky top-[calc(64px+1px)] z-[1]">
          {" "}
          {/* Adjust top offset if header height changes */}
          <tr>
            {/* Wider content column */}
            <th
              scope="col"
              className="w-[50%] px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Nội dung Biểu quyết
            </th>
            {/* Equal width for the rest */}
            <th
              scope="col"
              className="w-[15%] px-3 py-3 text-center text-xs font-semibold text-green-600 uppercase tracking-wider"
            >
              <div className="flex items-center justify-center gap-1.5">
                <Check size={14} /> Đồng ý (SL)
              </div>
            </th>
            <th
              scope="col"
              className="w-[15%] px-3 py-3 text-center text-xs font-semibold text-red-600 uppercase tracking-wider"
            >
              <div className="flex items-center justify-center gap-1.5">
                <X size={14} /> K.Đồng ý (SL)
              </div>
            </th>
            <th
              scope="col"
              className="w-[20%] px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Tỷ lệ Đồng ý (%)
            </th>
          </tr>
        </thead>
        {/* Use slate-100 for alternating row background */}
        <tbody className="bg-white divide-y divide-slate-200">
          {questions.map((q, index) => {
            const result = results[q.name];
            const dongYCount = result?.DongY ?? 0;
            const khongDongYCount = result?.KhongDongY ?? 0;
            const currentTotal = dongYCount + khongDongYCount;
            const percentDongY =
              currentTotal > 0
                ? ((dongYCount / currentTotal) * 100).toFixed(1)
                : "0.0";

            return (
              <tr
                key={q.name}
                className={`${
                  index % 2 !== 0 ? "bg-slate-50" : "bg-white"
                } hover:bg-sky-50/50 transition-colors duration-150`}
              >
                {/* Add padding, allow word break */}
                <td
                  title={q.label}
                  className="px-4 py-3 text-sm font-medium text-slate-800 break-words align-top"
                >
                  {q.label}
                </td>
                <td className="px-3 py-3 text-sm text-green-700 text-center font-bold align-top">
                  {dongYCount}
                </td>
                <td className="px-3 py-3 text-sm text-red-700 text-center font-bold align-top">
                  {khongDongYCount}
                </td>
                {/* Make percentage stand out */}
                <td className="px-3 py-3 text-sm text-sky-700 text-center font-semibold align-top">
                  {percentDongY}%
                </td>
              </tr>
            );
          })}
        </tbody>
        {/* Footer with clearer labels and styles */}
        <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-sm">
          <tr>
            <td className="px-4 py-3 text-left text-slate-800 uppercase">
              Tổng cộng / Trung bình
            </td>
            <td className="px-3 py-3 text-center text-green-700">
              {totalDongY}
            </td>
            <td className="px-3 py-3 text-center text-red-700">
              {totalKhongDongY}
            </td>
            <td className="px-3 py-3 text-center text-sky-800">
              {averageTotal > 0
                ? ((averageDongY / averageTotal) * 100).toFixed(1)
                : "0.0"}
              %
              <span className="block text-xs font-normal text-slate-500">
                {" "}
                (Trung bình)
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
// --- END TABLE COMPONENT ---

/* ================== PAGE COMPONENT (Using Fake Data) ================== */
export default function AdminBieuQuyetKetQuaPage() {
  const [resultsData] = useState<FakeVoteResults>(fakeResults);
  const [questionsData] = useState<FakeQuestion[]>(fakeQuestions);
  const [totalSubmissionsData] = useState<number>(fakeTotalSubmissions);

  return (
    <motion.div
      variants={pageV}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-slate-100"
    >
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Kết quả Biểu quyết
          </h1>
          <p className="mt-1 text-slate-600">
            Thống kê ý kiến Đại biểu về Văn kiện Đại hội XII.
          </p>
          <div className="mt-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-1 inline-flex items-center gap-1">
            <ShieldAlert size={14} />
            {totalSubmissionsData}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={itemV}
          className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
        >
          {/* Sticky Table Header */}
          <div className="px-4 sm:px-5 py-4 border-b border-slate-200 bg-white sticky top-[85px] z-10">
            {" "}
            {/* Hoặc top-[5.5rem] */}
            <h2 className="text-lg font-semibold text-slate-900">
              Kết quả Biểu quyết Chi tiết{" "}
            </h2>
          </div>{" "}
          {/* Render the improved table */}
          <FakeResultsTable
            results={resultsData}
            questions={questionsData}
            totalVotes={totalSubmissionsData}
          />
        </motion.div>
      </main>
    </motion.div>
  );
}
