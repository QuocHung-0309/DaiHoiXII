// File: lib/static-docs.ts

// Định nghĩa kiểu trạng thái (Giữ nguyên từ code của bạn)
export type DocStatus = "voting" | "pending" | "completed";

export type Attachment = {
  name: string; // Tên hiển thị của file
  url: string; // Đường dẫn tới file trong thư mục public
  // size?: string; // (Tùy chọn) Kích thước file
};
// Định nghĩa kiểu dữ liệu cho một văn kiện
export type DocumentCompact = {
  id: string; // Mã định danh duy nhất (ví dụ: tên file rút gọn)
  title: string; // Tiêu đề hiển thị
  description?: string; // Mô tả ngắn (tùy chọn)
  category: string; // Loại văn kiện (ví dụ: Báo cáo, Đề án, ...)
  status: DocStatus; // Trạng thái hiện tại
  deadline?: string; // Hạn biểu quyết (ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ) - tùy chọn
  attachments?: Attachment[]; // ✨ THÊM: Mảng các file đính kèm
  content?: string; // ✨ THÊM: Nội dung Markdown (nếu có, ngoài PDF)
};

// --- DANH SÁCH VĂN KIỆN ---
// Thêm các file bạn đã tải lên vào đây
const documents: DocumentCompact[] = [
  {
    id: "1", // Lấy từ tên file
    title: "Văn kiện Đại hội XII", // Tên dễ hiểu hơn
    description:
      "Dự thảo tổng hợp các nội dung báo cáo chính trị, báo cáo kiểm điểm BCH khóa XI và phương hướng nhiệm kỳ XII.",
    category: "Dự thảo Báo cáo",
    status: "voting", // Đang cho biểu quyết
    deadline: "12g00", // Ví dụ hạn cuối
    attachments: [
      {
        name: "vkdh.pdf",
        url: "/vkdh.pdf",
      },
    ],
  },
  {
    id: "2",
    title: "Đề án Ban Chấp hành Hội Sinh viên Khóa XII",
    description: "Đề án về cơ cấu, tiêu chuẩn, số lượng Ban Chấp hành nhiệm kỳ 2025 - 2028.",
    category: "Đề án Nhân sự",
    status: "voting", // Đang cho biểu quyết
    deadline: "12g00",
    attachments: [
      {
        name: "da_bch.pdf",
        url: "/da_bch.pdf",
      },
    ],
  },
  {
    id: "3",
    title: "Danh sách trích ngang dự kiến Ban Chấp hành Khóa XII",
    description: "Thông tin chi tiết về các nhân sự dự kiến giới thiệu ứng cử vào Ban Chấp hành.",
    category: "Nhân sự Dự kiến",
    status: "voting", // Sắp tới mới biểu quyết (ví dụ)
    deadline: "12g00",
    attachments: [
      {
        name: "dstn_bch.pdf",
        url: "/dstn_bch.pdf",
      },
    ],
  },
  {
    id: "4",
    title: "Đề án Ban Kiểm tra Hội Sinh viên Khóa XII",
    description: "Đề án về cơ cấu, tiêu chuẩn, số lượng Ban Kiểm tra nhiệm kỳ 2025 - 2028.",
    category: "Đề án Nhân sự",
    status: "voting",
    deadline: "12g00",
    attachments: [
      {
        name: "da_bkt.pdf",
        url: "/da_bkt.pdf",
      },
    ],
  },
  {
    id: "5",
    title: "Danh sách trích ngang dự kiến Ban Kiểm tra Khóa XII",
    description: "Thông tin chi tiết về các nhân sự dự kiến giới thiệu ứng cử vào Ban Kiểm tra.",
    category: "Nhân sự Dự kiến",
    status: "voting",
    deadline: "12g00",
    attachments: [
      {
        name: "dstn_bkt.pdf",
        url: "/dstn_bkt.pdf",
      },
    ],
  },
  // --- Thêm các văn kiện khác nếu có ---
  // {
  //   id: "bao-cao-tong-ket-nhiem-ky-xi",
  //   title: "Báo cáo Tổng kết Nhiệm kỳ XI",
  //   description: "Báo cáo chi tiết kết quả công tác Hội và phong trào sinh viên nhiệm kỳ 2023-2025.",
  //   category: "Báo cáo",
  //   status: "completed", // Đã xong (ví dụ)
  // },
];

// Hàm để lấy danh sách (Giữ nguyên từ code của bạn)
export function listCompact(): Omit<DocumentCompact, 'content' | 'attachments'>[] {
  return documents.map(({ content, attachments, ...rest }) => rest);
}

export function getDoc(id: string): DocumentCompact | undefined {
  return documents.find(doc => doc.id === id);
}