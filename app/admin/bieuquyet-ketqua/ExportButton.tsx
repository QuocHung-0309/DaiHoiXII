"use client";

import { Download } from "lucide-react";
import * as XLSX from "xlsx"; // Thư viện Excel

// --- Định nghĩa các Type ---
// (Copy các type này từ page.tsx qua)
type Question = {
  stt?: string;
  label?: string;
  name?: string;
  section?: string;
  group?: string;
  subGroup?: string;
};
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

// --- Định nghĩa Props mà component này sẽ nhận ---
type Props = {
  questions: Question[]; // Mảng danh sách câu hỏi
  data: ProcessedData | null; // Toàn bộ dữ liệu đã xử lý
  isLoading: boolean; // Trạng thái đang tải
};

// --- Component Nút Export (Con) ---
export default function ExportButton({ questions, data, isLoading }: Props) {
  // Hàm logic để xuất file
  const handleExport = () => {
    if (!data) return; // Nếu chưa có data thì không làm gì
    const { results, submissions } = data;

    // ---- Sheet 1: Bảng Tổng Hợp Kết Quả ----
    const summaryData: any[] = [
      ["STT", "Nội dung", "Đồng ý", "Không đồng ý", "Khác", "Tổng cộng"],
    ];

    questions.forEach((q) => {
      if (q.section) summaryData.push([q.section]);
      else if (q.group) summaryData.push([q.group]);
      else if (q.subGroup) summaryData.push([q.subGroup]);
      else if (q.name && results[q.name]) {
        const voteData = results[q.name];
        const total = voteData.DongY + voteData.KhongDongY + voteData.Khac;
        summaryData.push([
          q.stt,
          q.label,
          voteData.DongY,
          voteData.KhongDongY,
          voteData.Khac,
          total,
        ]);
      }
    });

    const ws_summary = XLSX.utils.aoa_to_sheet(summaryData);
    ws_summary["!cols"] = [
      { wch: 10 },
      { wch: 80 },
      { wch: 10 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
    ];

    // ---- Sheet 2: Dữ liệu thô (Chi tiết từng phiếu) ----
    const rawData = submissions.map((sub) => {
      return {
        id: sub.id,
        thoi_gian: new Date(sub.created_at).toLocaleString("vi-VN"),
        ...sub.data,
      };
    });
    const ws_raw = XLSX.utils.json_to_sheet(rawData);
    ws_raw["!cols"] = [{ wch: 20 }, { wch: 20 }];

    // ---- Tạo Workbook và Tải file ----
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws_summary, "Tổng hợp Kết quả");
    XLSX.utils.book_append_sheet(wb, ws_raw, "Chi tiết Phiếu (Dữ liệu thô)");
    XLSX.writeFile(wb, "KetQuaBieuQuyet_DaiHoiXII.xlsx");
  };

  // JSX của nút
  return (
    <button
      onClick={handleExport}
      disabled={isLoading || !data} // Vô hiệu hoá khi đang tải hoặc chưa có data
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="h-4 w-4" />
      Xuất Excel
    </button>
  );
}
