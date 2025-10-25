"use client";

import { useState, useEffect } from "react";
import { BarChart, Users, Loader2 } from "lucide-react";
import VoteChart from "./VoteChart"; // Component biểu đồ
import ExportButton from "./ExportButton"; // Component nút export

// --- DANH SÁCH CÂU HỎI ---
// (Giữ nguyên)
const questions = [
  { section: "PHẦN THỨ NHẤT", group: "I. Nhận định chung" },
  { stt: "1", label: "Thuận lợi", name: "P1-I-1-ThuanLoi" },
  { stt: "2", label: "Khó khăn", name: "P1-I-2-KhoKhan" },
  { group: "II. KẾT QUẢ THỰC HIỆN..." },
  { subGroup: "1. Phong trào “Sinh viên 5 tốt”" },
  {
    stt: "1.1",
    label: "Công tác tuyên truyền, triển khai...",
    name: "P1-II-1-1-TuyenTruyenSV5T",
  },
  {
    stt: "1.2.1",
    label: "Sinh viên vun đắp lý tưởng...",
    name: "P1-II-1-2-1-LyTuong",
    indent: 1,
  },
  {
    stt: "1.2.2",
    label: "Sinh viên học tập, sáng tạo...",
    name: "P1-II-1-2-2-HocTap",
    indent: 1,
  },
  {
    stt: "1.2.3.1",
    label: "Các hoạt động tình nguyện trọng điểm",
    name: "P1-II-1-2-3-1-TNTrongDiem",
    indent: 2,
  },
  {
    stt: "1.2.3.2",
    label: "Các hoạt động tình nguyện tại chỗ...",
    name: "P1-II-1-2-3-2-TNTaiCho",
    indent: 2,
  },
  {
    stt: "1.2.3.3",
    label: "Các hoạt động tình nguyện thường xuyên...",
    name: "P1-II-1-2-3-3-TNThuongXuyen",
    indent: 2,
  },
  {
    stt: "1.2.3.4",
    label: "Các hoạt động tình nguyện gắn với biển đảo",
    name: "P1-II-1-2-3-4-TNBienDao",
    indent: 2,
  },
  {
    stt: "1.2.4",
    label: "Sinh viên rèn luyện thể chất",
    name: "P1-II-1-2-4-TheChat",
    indent: 1,
  },
  {
    stt: "1.2.5",
    label: "Sinh viên chủ động hội nhập quốc tế",
    name: "P1-II-1-2-5-HoiNhap",
    indent: 1,
  },
  {
    stt: "1.3",
    label: "Công tác bình chọn, tuyên dương SV5T...",
    name: "P1-II-1-3-BinhChon",
  },
  {
    stt: "2",
    label: "Chương trình “Tư vấn, đồng hành, hỗ trợ SV”",
    name: "P1-II-2-TuVan",
  },
  { subGroup: "3. Chương trình Xây dựng Hội..." },
  {
    stt: "3.1",
    label: "Công tác tuyên truyền về Hội",
    name: "P1-II-3-1-TuyenTruyenHoi",
  },
  { stt: "3.2", label: "Công tác Hội viên", name: "P1-II-3-2-HoiVien" },
  { stt: "3.3", label: "Công tác tổ chức cơ sở Hội", name: "P1-II-3-3-ToChuc" },
  { stt: "3.4", label: "Công tác cán bộ Hội", name: "P1-II-3-4-CanBo" },
  {
    stt: "3.5",
    label: "Công tác kiểm tra, giám sát",
    name: "P1-II-3-5-KiemTra",
  },
  { stt: "3.6", label: "Công tác chỉ đạo, phối hợp", name: "P1-II-3-6-ChiDao" },
  { group: "III. ĐÁNH GIÁ THỰC HIỆN HỆ THỐNG CHỈ TIÊU" },
  {
    stt: "III",
    label: "Đánh giá hệ thống chỉ tiêu",
    name: "P1-III-DanhGiaChiTieu",
  },

  { section: "PHẦN THỨ HAI" },
  { group: "I. THỜI CƠ, THÁCH THỨC" },
  { stt: "1", label: "Thời cơ", name: "P2-I-1-ThoiCo" },
  { stt: "2", label: "Thách thức", name: "P2-I-2-ThachThuc" },
  { group: "II. MỤC TIÊU, KHẨU HIỆU, CHỈ TIÊU" },
  { stt: "1", label: "Mục tiêu", name: "P2-II-1-MucTieu" },
  { stt: "2", label: "Khẩu hiệu hành động", name: "P2-II-2-KhauHieu" },
  { stt: "3", label: "Hệ thống chỉ tiêu", name: "P2-II-3-ChiTieu" },
  { group: "III. NHIỆM VỤ GIẢI PHÁP" },
  { subGroup: "1. Phong trào “Sinh viên 5 tốt”" },
  {
    stt: "1.1",
    label: "Công tác tuyên truyền...",
    name: "P2-III-1-1-TuyenTruyen",
  },
  {
    stt: "1.2.1",
    label: "Sinh viên vun đắp lý tưởng...",
    name: "P2-III-1-2-1-LyTuong",
    indent: 1,
  },
  {
    stt: "1.2.2",
    label: "Sinh viên học tập, NCKH...",
    name: "P2-III-1-2-2-HocTap",
    indent: 1,
  },
  {
    stt: "1.2.3",
    label: "Sinh viên tình nguyện...",
    name: "P2-III-1-2-3-TinhNguyen",
    indent: 1,
  },
  {
    stt: "1.2.4",
    label: "Sinh viên rèn luyện thể chất",
    name: "P2-III-1-2-4-TheChat",
    indent: 1,
  },
  {
    stt: "1.2.5",
    label: "Sinh viên chủ động hội nhập",
    name: "P2-III-1-2-5-HoiNhap",
    indent: 1,
  },
  {
    stt: "2",
    label: "Chương trình “Tư vấn, đồng hành, hỗ trợ SV”",
    name: "P2-III-2-TuVan",
  },
  { subGroup: "3. Chương trình “Xây dựng Hội...”" },
  { stt: "3.1", label: "Công tác cán bộ Hội", name: "P2-III-3-1-CanBo" },
  {
    stt: "3.2",
    label: "Công tác tổ chức cơ sở Hội",
    name: "P2-III-3-2-ToChuc",
  },
  { stt: "3.3", label: "Công tác Hội viên", name: "P2-III-3-3-HoiVien" },
  {
    stt: "3.4",
    label: "Công tác kiểm tra, thi đua...",
    name: "P2-III-3-4-KiemTra",
  },
  {
    stt: "3.5",
    label: "Công tác phối hợp, tham mưu...",
    name: "P2-III-3-5-PhoiHop",
  },
  {
    stt: "3.6",
    label: "Công tác kiểm tra, giám sát",
    name: "P2-III-3-6-KiemTraGS",
  },
  {
    stt: "3.7",
    label: "Công tác chỉ đạo, phối hợp",
    name: "P2-III-3-7-ChiDao",
  },
  { stt: "4", label: "Chương trình, đề án trọng điểm", name: "P2-III-4-DeAn" },

  { section: "PHẦN THỨ BA" },
  {
    stt: "I",
    label: "TÌNH HÌNH NHÂN SỰ BAN CHẤP HÀNH",
    name: "P3-I-NhanSuBCH",
  },
  { group: "II. KIỂM ĐIỂM KẾT QUẢ HĐ CỦA BAN CHẤP HÀNH" },
  { stt: "1", label: "Mặt đạt được", name: "P3-II-1-BCHDat" },
  { stt: "2", label: "Mặt hạn chế", name: "P3-II-2-BCHHanChe" },
  { group: "III. KIỂM ĐIỂM KẾT QUẢ HĐ CỦA BAN THƯ KÝ" },
  { stt: "1", label: "Mặt đạt được", name: "P3-III-1-BTKDat" },
  { stt: "2", label: "Mặt hạn chế", name: "P3-III-2-BTKHanChe" },
];

// --- Định nghĩa các Type ---
type VoteResults = {
  [key: string]: { DongY: number; KhongDongY: number; Khac: number };
};
type Submission = {
  id: string;
  form_name: string;
  created_at: string;
  data: { [key: string]: string };
};
type ProcessedData = {
  submissions: Submission[];
  delegates: any[];
  results: VoteResults;
  totalSubmissions: number;
};

// --- Component Trang Admin (Client) ---
export default function KetQuaBieuQuyetPage() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- HÀM 1: Fetch dữ liệu (ĐÃ SỬA LỖI PAGINATION) ---
  useEffect(() => {
    async function fetchSubmissions() {
      const token = process.env.NEXT_PUBLIC_NETLIFY_ACCESS_TOKEN;
      const siteId = process.env.NEXT_PUBLIC_NETLIFY_SITE_ID;
      const formName = "bieu-quyet-van-kien-xii";

      if (!token || !siteId) {
        setError(
          "Lỗi: Không tìm thấy NETLIFY_ACCESS_TOKEN hoặc NETLIFY_SITE_ID. Bạn đã sửa file .env.local (thêm NEXT_PUBLIC_) và khởi động lại server chưa?"
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // *** BẮT ĐẦU THAY ĐỔI ***
        let allSubmissions: Submission[] = [];
        // Bắt đầu với trang 1, mỗi trang 100 phiếu
        let url:
          | string
          | null = `https://api.netlify.com/api/v1/sites/${siteId}/submissions?per_page=100`;

        // Tiếp tục lặp trong khi vẫn còn 'url' (trang tiếp theo)
        while (url) {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          });

          if (!res.ok) {
            throw new Error(
              `Failed to fetch submissions page: ${res.statusText}`
            );
          }

          const pageSubmissions: Submission[] = await res.json();
          allSubmissions = allSubmissions.concat(pageSubmissions);

          // Xử lý header 'Link' để lấy trang tiếp theo
          // Header này có dạng: <url_trang_truoc>; rel="prev", <url_trang_tiep_theo>; rel="next"
          const linkHeader = res.headers.get("Link");
          const nextLinkMatch = linkHeader?.match(/<([^>]+)>;\s*rel="next"/);

          // Nếu tìm thấy 'rel="next"', lấy URL đó. Nếu không, đặt là 'null' để dừng vòng lặp.
          url = nextLinkMatch ? nextLinkMatch[1] : null;
        }
        // *** KẾT THÚC THAY ĐỔI ***

        // --- Từ đây, code xử lý như cũ, nhưng với 'allSubmissions' (đã đầy đủ 150+ phiếu) ---
        const submissions = allSubmissions.filter(
          (s) => s.form_name === formName
        );

        const delegates: any[] = [];
        const results: VoteResults = {};

        for (const q of questions) {
          if (q.name) {
            results[q.name] = { DongY: 0, KhongDongY: 0, Khac: 0 };
          }
        }

        for (const sub of submissions) {
          delegates.push({
            id: sub.id,
            fullname: sub.data.fullname,
            studentId: sub.data.studentId,
            unit: sub.data.unit,
            email: sub.data.email,
            submittedAt: new Date(sub.created_at).toLocaleString("vi-VN"),
          });

          for (const q of questions) {
            if (q.name) {
              const vote = sub.data[q.name];
              if (vote === "DongY") results[q.name].DongY++;
              else if (vote === "KhongDongY") results[q.name].KhongDongY++;
              else if (vote === "Khac") results[q.name].Khac++;
            }
          }
        }

        setData({
          submissions,
          delegates,
          results,
          totalSubmissions: submissions.length,
        });
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []); // Chạy 1 lần khi component mount

  // --- HÀM 2: Render giao diện (JSX) ---
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Kết quả Biểu quyết Văn kiện
              </h1>
              <p className="mt-1 text-slate-600">
                Tổng hợp dữ liệu từ form biểu quyết Đại hội XII.
              </p>
            </div>

            <ExportButton
              questions={questions}
              data={data}
              isLoading={loading}
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- Xử lý trạng thái Loading và Error --- */}
        {loading && (
          <div className="flex flex-col items-center justify-center bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-lg font-semibold text-slate-700">
              Đang tải dữ liệu từ Netlify...
            </p>
            <p className="text-sm text-slate-500">
              Đang lấy tất cả các phiếu, có thể mất vài giây.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-200">
            <h3 className="text-xl font-bold text-red-800">
              Lỗi nghiêm trọng!
            </h3>
            <p className="mt-2 text-red-700">
              Không thể tải dữ liệu. Vui lòng kiểm tra lại:
            </p>
            <code className="block bg-red-100 text-red-900 p-3 rounded-lg mt-3 text-sm break-words">
              {error}
            </code>
          </div>
        )}

        {/* --- Chỉ render khi có dữ liệu (data) --- */}
        {data && (
          <>
            {/* Hàng Tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">
                      {data.totalSubmissions}
                    </div>
                    <div className="text-sm font-medium text-slate-600">
                      Tổng số phiếu
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">
                      {data.delegates.length}
                    </div>
                    <div className="text-sm font-medium text-slate-600">
                      Đại biểu đã biểu quyết
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2 Cột chính (Toàn bộ code phần này giữ nguyên) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cột trái: Kết quả chi tiết */}
              <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Kết quả Chi tiết
                </h2>
                <div className="space-y-4">
                  {questions.map((q, index) => {
                    if (q.section)
                      return (
                        <div
                          key={`sec-${index}`}
                          className="bg-blue-50 border-y border-blue-200 px-4 py-3 -mx-4 sm:-mx-6"
                        >
                          <h3 className="text-sm font-bold uppercase text-blue-800">
                            {q.section}
                          </h3>
                        </div>
                      );
                    if (q.group)
                      return (
                        <div
                          key={`grp-${index}`}
                          className="bg-slate-50/50 px-4 py-3"
                        >
                          <h4 className="text-sm font-semibold text-slate-800">
                            {q.group}
                          </h4>
                        </div>
                      );
                    if (q.subGroup)
                      return (
                        <div key={`subgrp-${index}`} className="px-4 py-2">
                          <h5 className="text-sm font-semibold text-slate-700 pl-4">
                            {q.subGroup}
                          </h5>
                        </div>
                      );

                    if (q.name && data.results[q.name]) {
                      const voteData = data.results[q.name];
                      const total =
                        voteData.DongY + voteData.KhongDongY + voteData.Khac;
                      const chartData = [
                        {
                          name: "Đồng ý",
                          value: voteData.DongY,
                          fill: "#22c55e",
                        },
                        {
                          name: "Không",
                          value: voteData.KhongDongY,
                          fill: "#ef4444",
                        },
                        { name: "Khác", value: voteData.Khac, fill: "#f59e0b" },
                      ];

                      return (
                        <div
                          key={q.name}
                          className="py-4 border-b border-slate-100 last:border-b-0"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-slate-700 flex-1">
                              <span className="font-medium text-slate-500 mr-2">
                                {q.stt}.
                              </span>
                              {q.label}
                            </span>
                            <span className="text-sm font-bold text-slate-800 ml-4 whitespace-nowrap">
                              {total} phiếu
                            </span>
                          </div>
                          <VoteChart data={chartData} />
                          <div className="flex justify-around items-center text-xs text-center mt-3 pt-3 border-t border-slate-100">
                            <div className="text-green-700 px-2">
                              <span className="font-bold text-lg leading-tight block">
                                {voteData.DongY}
                              </span>
                              <span className="font-medium">Đồng ý</span>
                            </div>
                            <div className="text-red-700 px-2">
                              <span className="font-bold text-lg leading-tight block">
                                {voteData.KhongDongY}
                              </span>
                              <span className="font-medium">Không đồng ý</span>
                            </div>
                            <div className="text-yellow-700 px-2">
                              <span className="font-bold text-lg leading-tight block">
                                {voteData.Khac}
                              </span>
                              <span className="font-medium">Khác</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Cột phải: Danh sách Đại biểu */}
              <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 self-start sticky top-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Danh sách Đại biểu đã BQ
                </h2>
                <div className="max-h-[80vh] overflow-y-auto pr-2">
                  <ul className="divide-y divide-slate-100">
                    {data.delegates.map((d) => (
                      <li key={d.id} className="py-3">
                        <div className="font-semibold text-slate-800">
                          {d.fullname}
                        </div>
                        <div className="text-sm text-slate-600">
                          {d.studentId} - {d.unit}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {d.submittedAt}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
