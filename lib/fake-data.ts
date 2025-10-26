// --- DỮ LIỆU GIẢ ---

// Định nghĩa kiểu dữ liệu cho kết quả (chỉ Đồng ý/Không đồng ý)
type FakeVoteResults = {
  [key: string]: { DongY: number; KhongDongY: number };
};

// Định nghĩa kiểu cho câu hỏi
type FakeQuestion = {
  name: string; // Key dùng trong data
  label: string; // Text hiển thị
};

// Danh sách câu hỏi (Lấy từ component VoteTable)
// QUAN TRỌNG: 'name' phải khớp với key trong fakeResults
const fakeQuestions: FakeQuestion[] = [
  // --- PHẦN 1 ---
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
  // --- PHẦN 2 ---
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
  { name: "P2-III-3-6-KiemTraGS", label: "III.3.6 Kiểm tra, giám sát (mới)" }, // Check lại tên key nếu cần
  { name: "P2-III-3-7-ChiDao", label: "III.3.7 Chỉ đạo, phối hợp (mới)" }, // Check lại tên key nếu cần
  { name: "P2-III-4-DeAn", label: "III.4 Đề án trọng điểm" },
  // --- PHẦN 3 ---
  { name: "P3-I-NhanSuBCH", label: "I Nhân sự BCH" },
  { name: "P3-II-1-BCHDat", label: "II.1 BCH Đạt được" },
  { name: "P3-II-2-BCHHanChe", label: "II.2 BCH Hạn chế" },
  { name: "P3-III-1-BTKDat", label: "III.1 BTK Đạt được" },
  { name: "P3-III-2-BTKHanChe", label: "III.2 BTK Hạn chế" },
];

// Kết quả biểu quyết giả (chỉ Đồng ý/Không đồng ý)
const fakeResults: FakeVoteResults = {};
let totalFakeVotes = 0; // Biến tạm để tính tổng số phiếu giả

fakeQuestions.forEach(q => {
  // Tạo số liệu ngẫu nhiên (ví dụ: 70-98% đồng ý)
  const dongY = Math.floor(Math.random() * 29) + 70; // 70 -> 98
  const khongDongY = 100 - dongY;
  fakeResults[q.name] = { DongY: dongY, KhongDongY: khongDongY };
  if (totalFakeVotes === 0) totalFakeVotes = dongY + khongDongY; // Gán tổng phiếu dựa trên câu đầu tiên
});

// Tổng số phiếu giả (ví dụ là 100)
const fakeTotalSubmissions = totalFakeVotes || 100;