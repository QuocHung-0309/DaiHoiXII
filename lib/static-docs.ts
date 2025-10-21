// Tất cả meta của văn kiện để dùng chung cho Góp ý + Biểu quyết + Hiển thị
export type DocStatus = "voting" | "pending" | "completed";

export type DocMeta = {
  id: string;               // "1" | "2" ...
  title: string;
  category: string;         // "Báo cáo" | "Nghị quyết" ...
  status: DocStatus;
  deadline?: string;        // ISO hoặc "YYYY-MM-DD"
  description?: string;
  // Dùng cho trang chi tiết:
  content?: string;         // markdown / plain text
  attachments?: { name: string; size?: string; url?: string }[];
};

export const STATIC_DOCS: DocMeta[] = [
  {
    id: "1",
    title: "Báo cáo tổng kết nhiệm kỳ 2022–2024",
    category: "Báo cáo",
    status: "voting",
    deadline: "2024-03-20",
    description: "Báo cáo tổng kết hoạt động của Hội sinh viên trong nhiệm kỳ 2022–2024",
    content: `# PHẦN I: TỔNG QUAN ...`,
    attachments: [{ name: "Bao_cao_chi_tiet.pdf", size: "2.5 MB" }],
  },
  {
    id: "2",
    title: "Phương hướng hoạt động nhiệm kỳ 2024–2026",
    category: "Nghị quyết",
    status: "voting",
    deadline: "2024-03-20",
    description: "Phương hướng và kế hoạch hoạt động cho nhiệm kỳ mới",
    content: `# PHƯƠNG HƯỚNG ...`,
    attachments: [{ name: "Phuong_huong_chi_tiet.pdf", size: "1.8 MB" }],
  },
  // ...các văn kiện khác
];

// Helpers tiện dùng
export const DOC_MAP = new Map(STATIC_DOCS.map(d => [d.id, d]));
export const getDoc = (id: string) => DOC_MAP.get(id);
export const listCompact = () =>
  STATIC_DOCS.map(d => ({
    id: d.id, title: d.title, category: d.category,
    status: d.status, deadline: d.deadline, description: d.description,
  }));
