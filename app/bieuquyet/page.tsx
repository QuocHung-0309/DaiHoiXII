"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  UserRound,
  IdCard,
  Mail,
  Building2,
  CheckSquare,
  Loader2,
} from "lucide-react";
// Bỏ dòng này đi vì đã dùng Function, không cần ép dynamic nữa
// export const dynamic = 'force-dynamic';

/* -------------------- ANIMATIONS -------------------- */
const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];
const pageV: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
};
const itemV: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

/* =======================================================
   PAGE COMPONENT
======================================================= */
export default function BieuQuyetPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- HÀM GỬI FORM (Gọi Netlify Function) ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const encodedData = new URLSearchParams(formData as any).toString();

    try {
      // Gọi Netlify Function đã tạo
      const response = await fetch("/.netlify/functions/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedData,
      });

      if (response.ok) {
        // Nếu Function trả về OK, chuyển hướng
        router.push("/bieu-quyet/success");
      } else {
        // Nếu Function trả về lỗi, hiển thị lỗi
        const errorText = await response.text();
        console.error("Function error response:", errorText);
        throw new Error(
          `Lỗi từ server: ${errorText || response.statusText || "Không rõ lỗi"}`
        );
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError((err as Error).message);
      setSubmitting(false); // Chỉ set submitting false khi có lỗi
    }
    // Không cần finally nữa vì router.push sẽ chuyển trang nếu thành công
  };

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
            Biểu quyết Văn kiện Đại hội
          </h1>
          <p className="mt-1 text-slate-600">
            Xin ý kiến Đại biểu về các nội dung dự thảo Văn kiện Đại hội XII.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.form
          name="bieu-quyet-van-kien-xii" // Giữ tên form để function biết
          // data-netlify="true" // <-- ĐÃ XÓA DÒNG NÀY
          onSubmit={handleSubmit} // Dùng hàm mới
          variants={itemV}
          className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6"
        >
          {/* Trường ẩn (Vẫn cần giữ để Function biết gửi form nào) */}
          <input
            type="hidden"
            name="form-name"
            value="bieu-quyet-van-kien-xii"
          />

          {/* Thông tin đại biểu */}
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Thông tin Đại biểu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Họ và tên"
              icon={<UserRound className="h-4 w-4" />}
              required
            >
              <input
                className="Input"
                name="fullname"
                placeholder="VD: Nguyễn Văn A"
                required
                disabled={submitting}
              />
            </Field>
            <Field label="MSSV" icon={<IdCard className="h-4 w-4" />} required>
              <input
                className="Input"
                name="studentId"
                placeholder="VD: 2212345"
                required
                disabled={submitting}
              />
            </Field>
            <Field label="Email" icon={<Mail className="h-4 w-4" />} required>
              <input
                className="Input"
                name="email"
                type="email"
                placeholder="you@hcmute.edu.vn"
                required
                disabled={submitting}
              />
            </Field>
            <Field
              label="Đơn vị/Khoa"
              icon={<Building2 className="h-4 w-4" />}
              required
            >
              <input
                className="Input"
                name="unit"
                placeholder="VD: Khoa CNTT"
                required
                disabled={submitting}
              />
            </Field>
          </div>

          <hr className="my-6 border-slate-200" />

          {/* Nội dung biểu quyết */}
          <h2 className="text-xl font-semibold text-slate-900 mb-1">
            Nội dung Biểu Quyết
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Vui lòng cho ý kiến về các nội dung dự thảo văn kiện.
          </p>
          <fieldset disabled={submitting}>
            <VoteTable />
          </fieldset>

          {/* --- SUBMIT VÀ THÔNG BÁO LỖI --- */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Gửi Biểu Quyết
                </>
              )}
            </button>
            {error && (
              <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                <strong>Lỗi:</strong> {error}
              </div>
            )}
          </div>

          {/* Style */}
          <style jsx global>{`
            .Label {
              @apply block text-sm font-medium text-slate-800 mb-1;
            }
            .Input {
              @apply box-border block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200;
            }
          `}</style>
        </motion.form>
      </main>
    </motion.div>
  );
}

/* =======================================================
   CÁC COMPONENT CON (VoteTable, VoteRow, Field...)
======================================================= */
function VoteTable() {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="">
        {/* --- HEADER CỦA BẢNG (Chỉ hiện trên Desktop) --- */}
        <div className="hidden lg:grid grid-cols-12 gap-4 bg-slate-50 border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
          <div className="col-span-1 text-sm font-semibold text-slate-600">
            STT
          </div>
          <div className="col-span-8 text-sm font-semibold text-slate-600">
            Nội dung
          </div>
          <div className="col-span-1 text-center text-sm font-semibold text-green-700">
            Đồng ý
          </div>
          <div className="col-span-1 text-center text-sm font-semibold text-red-700">
            Không đồng ý
          </div>
          <div className="col-span-1 text-center text-sm font-semibold text-yellow-700">
            Khác
          </div>
        </div>

        {/* --- BODY CỦA BẢNG (TẤT CẢ CÁC MỤC) --- */}
        <div className="divide-y divide-slate-200">
          {/* --- PHẦN THỨ NHẤT --- */}
          <VoteSectionHeader title="PHẦN THỨ NHẤT: KẾT QUẢ THỰC HIỆN NGHỊ QUYẾT ĐẠI HỘI XI, NHIỆM KỲ 2023 - 2025" />
          <VoteGroupHeader title="I. Nhận định chung" />
          <VoteRow stt="1" label="Thuận lợi" name="P1-I-1-ThuanLoi" />
          <VoteRow stt="2" label="Khó khăn" name="P1-I-2-KhoKhan" />
          <VoteGroupHeader title="II. KẾT QUẢ THỰC HIỆN PHONG TRÀO SV5T, CHƯƠNG TRÌNH TƯ VẤN, ĐỒNG HÀNH, HỖ TRỢ SINH VIÊN, CHƯƠNG TRÌNH XÂY DỰNG HỘI SVVN VỮNG MẠNH" />
          <VoteSubGroupHeader title="1. Phong trào “Sinh viên 5 tốt”" />
          <VoteRow
            stt="1.1"
            label="Công tác tuyên truyền, triển khai thực hiện phong trào “Sinh viên 5 tốt”"
            name="P1-II-1-1-TuyenTruyenSV5T"
          />
          <VoteRow
            stt="1.2.1"
            label="Sinh viên vun đắp lý tưởng, rèn luyện đạo đức, tác phong"
            name="P1-II-1-2-1-LyTuong"
            indent={1}
          />
          <VoteRow
            stt="1.2.2"
            label="Sinh viên học tập, sáng tạo, nghiên cứu khoa học"
            name="P1-II-1-2-2-HocTap"
            indent={1}
          />
          <VoteRow
            stt="1.2.3.1"
            label="Các hoạt động tình nguyện trọng điểm"
            name="P1-II-1-2-3-1-TNTrongDiem"
            indent={2}
          />
          <VoteRow
            stt="1.2.3.2"
            label="Các hoạt động tình nguyện tại chỗ, tình nguyện trực tuyến"
            name="P1-II-1-2-3-2-TNTaiCho"
            indent={2}
          />
          <VoteRow
            stt="1.2.3.3"
            label="Các hoạt động tình nguyện thường xuyên, tình nguyện theo dự án, tình nguyện gắn với chuyên môn"
            name="P1-II-1-2-3-3-TNThuongXuyen"
            indent={2}
          />
          <VoteRow
            stt="1.2.3.4"
            label="Các hoạt động tình nguyện gắn với biển đảo"
            name="P1-II-1-2-3-4-TNBienDao"
            indent={2}
          />
          <VoteRow
            stt="1.2.4"
            label="Sinh viên rèn luyện thể chất"
            name="P1-II-1-2-4-TheChat"
            indent={1}
          />
          <VoteRow
            stt="1.2.5"
            label="Sinh viên chủ động hội nhập quốc tế"
            name="P1-II-1-2-5-HoiNhap"
            indent={1}
          />
          <VoteRow
            stt="1.3"
            label="Công tác bình chọn, tuyên dương và phát huy các gương Sinh viên 5 tốt sau tuyên dương"
            name="P1-II-1-3-BinhChon"
          />
          <VoteRow
            stt="2"
            label="Chương trình “Tư vấn, đồng hành, hỗ trợ sinh viên”"
            name="P1-II-2-TuVan"
          />
          <VoteSubGroupHeader title="3. Chương trình Xây dựng Hội Sinh viên Việt Nam vững mạnh" />
          <VoteRow
            stt="3.1"
            label="Công tác tuyên truyền về Hội Sinh viên"
            name="P1-II-3-1-TuyenTruyenHoi"
          />
          <VoteRow
            stt="3.2"
            label="Công tác Hội viên"
            name="P1-II-3-2-HoiVien"
          />
          <VoteRow
            stt="3.3"
            label="Công tác tổ chức cơ sở Hội"
            name="P1-II-3-3-ToChuc"
          />
          <VoteRow
            stt="3.4"
            label="Công tác cán bộ Hội Sinh viên Việt Nam"
            name="P1-II-3-4-CanBo"
          />
          <VoteRow
            stt="3.5"
            label="Công tác kiểm tra, giám sát"
            name="P1-II-3-5-KiemTra"
          />
          <VoteRow
            stt="3.6"
            label="Công tác chỉ đạo, phối hợp"
            name="P1-II-3-6-ChiDao"
          />
          <VoteGroupHeader title="III. ĐÁNH GIÁ THỰC HIỆN HỆ THỐNG CHỈ TIÊU" />
          <VoteRow
            stt="III"
            label="Đánh giá hệ thống chỉ tiêu"
            name="P1-III-DanhGiaChiTieu"
          />

          {/* --- PHẦN THỨ HAI --- */}
          <VoteSectionHeader title="PHẦN THỨ HAI: MỤC TIÊU, PHƯƠNG HƯỚNG CÔNG TÁC HỘI VÀ PHONG TRÀO SINH VIÊN, NHIỆM KỲ 2025 - 2028" />
          <VoteGroupHeader title="I. THỜI CƠ, THÁCH THỨC GIAI ĐOẠN 2025 - 2028" />
          <VoteRow stt="1" label="Thời cơ" name="P2-I-1-ThoiCo" />
          <VoteRow stt="2" label="Thách thức" name="P2-I-2-ThachThuc" />

          <VoteGroupHeader title="II. MỤC TIÊU, KHẨU HIỆU HÀNH ĐỘNG VÀ HỆ THỐNG CHỈ TIÊU" />
          <VoteRow stt="1" label="Mục tiêu" name="P2-II-1-MucTieu" />
          <VoteRow
            stt="2"
            label="Khẩu hiệu hành động"
            name="P2-II-2-KhauHieu"
          />
          <VoteRow stt="3" label="Hệ thống chỉ tiêu" name="P2-II-3-ChiTieu" />

          <VoteGroupHeader title="III. NHIỆM VỤ GIẢI PHÁP" />
          <VoteSubGroupHeader title="1. Phong trào “Sinh viên 5 tốt”" />
          <VoteRow
            stt="1.1"
            label="Công tác tuyên truyền, triển khai thực hiện phong trào “Sinh viên 5 tốt”"
            name="P2-III-1-1-TuyenTruyen"
          />
          <VoteRow
            stt="1.2.1"
            label="Sinh viên vun đắp lý tưởng, rèn luyện đạo đức, tác phong"
            name="P2-III-1-2-1-LyTuong"
            indent={1}
          />
          <VoteRow
            stt="1.2.2"
            label="Sinh viên học tập, nghiên cứu khoa học, đổi mới sáng tạo"
            name="P2-III-1-2-2-HocTap"
            indent={1}
          />
          <VoteRow
            stt="1.2.3"
            label="Sinh viên tình nguyện vì cuộc sống cộng đồng"
            name="P2-III-1-2-3-TinhNguyen"
            indent={1}
          />
          <VoteRow
            stt="1.2.4"
            label="Sinh viên rèn luyện thể chất"
            name="P2-III-1-2-4-TheChat"
            indent={1}
          />
          <VoteRow
            stt="1.2.5"
            label="Sinh viên chủ động hội nhập quốc tế"
            name="P2-III-1-2-5-HoiNhap"
            indent={1}
          />
          <VoteRow
            stt="2"
            label="Chương trình “Tư vấn, đồng hành, hỗ trợ sinh viên”"
            name="P2-III-2-TuVan"
          />
          <VoteSubGroupHeader title="3. Chương trình “Xây dựng Hội Sinh viên Việt Nam vững mạnh”" />
          <VoteRow
            stt="3.1"
            label="Công tác cán bộ Hội"
            name="P2-III-3-1-CanBo"
          />
          <VoteRow
            stt="3.2"
            label="Công tác tổ chức cơ sở Hội"
            name="P2-III-3-2-ToChuc"
          />
          <VoteRow
            stt="3.3"
            label="Công tác Hội viên"
            name="P2-III-3-3-HoiVien"
          />
          <VoteRow
            stt="3.4"
            label="Công tác kiểm tra, thi đua khen thưởng"
            name="P2-III-3-4-KiemTra"
          />
          <VoteRow
            stt="3.5"
            label="Công tác phối hợp, tham mưu, chỉ đạo"
            name="P2-III-3-5-PhoiHop"
          />
          <VoteRow
            stt="3.6"
            label="Công tác kiểm tra, giám sát"
            name="P2-III-3-6-KiemTraGS"
          />
          <VoteRow
            stt="3.7"
            label="Công tác chỉ đạo, phối hợp"
            name="P2-III-3-7-ChiDao"
          />
          <VoteRow
            stt="4"
            label="Chương trình, đề án trọng điểm"
            name="P2-III-4-DeAn"
          />

          {/* --- PHẦN THỨ BA --- */}
          <VoteSectionHeader title="PHẦN THỨ BA: BÁO CÁO KIỂM ĐIỂM BAN CHẤP HÀNH HỘI SINH VIÊN VIỆT NAM TRƯỜNG KHÓA XIII, NHIỆM KỲ 2023 - 2025" />
          <VoteRow
            stt="I"
            label="TÌNH HÌNH NHÂN SỰ BAN CHẤP HÀNH"
            name="P3-I-NhanSuBCH"
          />
          <VoteGroupHeader title="II. KIỂM ĐIỂM KẾT QUẢ HOẠT ĐỘNG CỦA BAN CHẤP HÀNH" />
          <VoteRow stt="1" label="Mặt đạt được" name="P3-II-1-BCHDat" />
          <VoteRow stt="2" label="Mặt hạn chế" name="P3-II-2-BCHHanChe" />
          <VoteGroupHeader title="III. KIỂM ĐIỂM KẾT QUẢ HOẠT ĐỘNG CỦA BAN THƯ KÝ" />
          <VoteRow stt="1" label="Mặt đạt được" name="P3-III-1-BTKDat" />
          <VoteRow stt="2" label="Mặt hạn chế" name="P3-III-2-BTKHanChe" />
        </div>
      </div>
    </div>
  );
}
// --- Component Hàng Tiêu đề Phần (Responsive) ---
function VoteSectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-blue-50 border-y border-blue-200 px-4 py-3">
      <div className="text-sm font-bold uppercase text-blue-800">{title}</div>
    </div>
  );
}

// --- Component Hàng Tiêu đề Nhóm (Responsive) ---
function VoteGroupHeader({ title }: { title: string }) {
  return (
    <div className="bg-slate-50/50 px-4 py-3">
      <div className="text-sm font-semibold text-slate-800">{title}</div>
    </div>
  );
}

// --- Component Hàng Tiêu đề Nhóm Con (Responsive) ---
function VoteSubGroupHeader({ title }: { title: string }) {
  return (
    <div className="px-4 py-3">
      <div className="text-sm font-semibold text-slate-700 pl-4">{title}</div>
    </div>
  );
}

// --- Component Hàng Biểu Quyết (Responsive) ---
function VoteRow({
  stt,
  label,
  name,
  indent = 0,
}: {
  stt: string;
  label: string;
  name: string;
  indent?: number;
}) {
  const idBase = `id-${name}`;
  const indentClass = [
    "lg:pl-4", // indent 0
    "lg:pl-8", // indent 1
    "lg:pl-12", // indent 2
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-4 px-4 py-3 hover:bg-slate-50/70 transition-colors duration-150">
      <div className="hidden lg:block col-span-1 text-sm text-slate-500 font-medium pt-0.5">
        {stt}
      </div>
      <div className={`col-span-1 lg:col-span-8 ${indentClass[indent]}`}>
        <label
          htmlFor={`${idBase}-dongy`}
          className="text-sm text-slate-800 cursor-pointer"
        >
          <span className="font-medium text-slate-500 lg:hidden mr-2">
            {stt}.
          </span>
          {label}
        </label>
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="flex lg:grid lg:grid-cols-3 justify-around lg:justify-center gap-x-4 mt-2 lg:mt-0 lg:pl-0">
          <div className="text-center">
            <label
              htmlFor={`${idBase}-dongy`}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <span className="text-sm text-green-700 lg:hidden">Đồng ý</span>
              <input
                type="radio"
                name={name}
                value="DongY"
                id={`${idBase}-dongy`}
                required
                className="h-4 w-4 text-green-600 focus:ring-green-500"
              />
            </label>
          </div>
          <div className="text-center">
            <label
              htmlFor={`${idBase}-khong`}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <span className="text-sm text-red-700 lg:hidden">
                Không đồng ý
              </span>
              <input
                type="radio"
                name={name}
                value="KhongDongY"
                id={`${idBase}-khong`}
                className="h-4 w-4 text-red-600 focus:ring-red-500"
              />
            </label>
          </div>
          <div className="text-center">
            <label
              htmlFor={`${idBase}-khac`}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <span className="text-sm text-yellow-700 lg:hidden">Khác</span>
              <input
                type="radio"
                name={name}
                value="Khac"
                id={`${idBase}-khac`}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

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
