"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { CalendarDays } from "lucide-react";

const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];
const sectionVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const gridVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};
const cardVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

type NewsItem = {
  id: string;
  title: string;
  unit: string; // Đơn vị tổ chức (Khoa/Viện/LC HSV…)
  date: string; // ISO hoặc yyyy-mm-dd
  excerpt: string;
  href: string;
  image: string; // đường dẫn ảnh /public
};

// ==== Demo data (bạn thay bằng API sau cũng giữ UI này) ====
const NEWS: NewsItem[] = [
  {
    id: "n1",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT THÀNH PHỐ HỒ CHÍ MINH KHOA CÔNG NGHỆ THÔNG TIN LẦN THỨ VIII, NHIỆM KỲ 2025 - 2028 ",
    unit: "Khoa Công nghệ Thông tin",
    date: "2025-03-09",
    excerpt:
      "Vào ngày 09/03/2025 vừa qua, Đại hội Đại biểu Hội Sinh viên Việt Nam Trường Đại học Sư phạm Kỹ thuật thành phố Hồ Chí Minh khoa Công nghệ Thông tin lần thứ VIII, nhiệm kỳ 2025 - 2028.",
    href: "/news/n1",
    image: "/cntt1.jpg",
  },
  {
    id: "n2",
    title:
      "ĐẠI HỘI THÀNH VIÊN ĐỘI CÔNG TÁC XÃ HỘI LẦN THỨ XXII, NHIỆM KỲ 2025 - 2028",
    unit: "Đội Công tác xã hội",
    date: "2025-03-22",
    excerpt:
      "Vào ngày 22/03/2025 vừa qua, Đại hội Thành viên Đội Công tác Xã hội lần thứ XXII, nhiệm kỳ 2025 - 2028 đã diễn ra thành công tốt đẹp!",
    href: "/news/n2",
    image: "/ctxh1.jpg",
  },
  {
    id: "n3",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA NGOẠI NGỮ LẦN THỨ IX, NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Ngoại ngữ",
    date: "2025-04-13",
    excerpt:
      "Vào ngày 13/04/2025, tại phòng họp III – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Ngoại ngữ lần thứ IX, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!",
    href: "/news/n3",
    image: "/nn1.jpg",
  },
  {
    id: "n4",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA THỜI TRANG & DU LỊCH LẦN THỨ XII, NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Thời trang & du lịch",
    date: "2025-09-12",
    excerpt:
      "Đại hội Hội Sinh viên Việt Nam Khoa Thời trang & du lịch lần thứ XII, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!",
    href: "/news/n4",
    image: "/ttdl1.jpg",
  },
  {
    id: "n5",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI SINH VIÊN KÝ TÚC XÁ",
    unit: "LCH SV KTX",
    date: "2025-09-12",
    excerpt:
      "Đại hội LCH SINH VIÊN KÝ TÚC XÁ, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!",
    href: "/news/n4",
    image: "/ktx1.jpg",
  },
  {
    id: "n6",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA THỜI TRANG & DU LỊCH LẦN THỨ XII, NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Thời trang & du lịch",
    date: "2025-09-12",
    excerpt:
      "Đại hội Hội Sinh viên Việt Nam Khoa Thời trang & du lịch lần thứ XII, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!",
    href: "/news/n6",
    image: "/ttdl1.jpg",
  },
  {
    id: "n7",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA CƠ KHÍ ĐỘNG LỰC LẦN THỨ XII, NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Cơ khí động lực",
    date: "2025-09-12",
    excerpt:
      " Vào sáng ngày 13/04/2025, tại phòng họp II – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Cơ khí Động lực lần thứ XII, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!",
    href: "/news/n7",
    image: "/ckd1.jpg",
  },
  {
    id: "n8",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM KHOA CƠ KHÍ CHẾ TẠO MÁY TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT LẦN THỨ XII NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Cơ khí Chế tạo máy",
    date: "2025-04-13",
    excerpt:
      " Vào sáng ngày 13/04/2025, tại phòng họp II – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Cơ khí Chế tạo máy lần thứ XII, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!",
    href: "/news/n8",
    image: "/ckm1.jpg",
  },
  {
    id: "n9",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM KHOA KINH TẾ TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT LẦN THỨ VIII NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Kinh tế",
    date: "2025-03-30",
    excerpt:
      " Vào ngày 30/03/2025, tại phòng họp II – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Kinh tế lần thứ VII, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!",
    href: "/news/n9",
    image: "/kt1.jpg",
  },
];

function formatDate(d: string) {
  const date = new Date(d);
  return isNaN(date.getTime())
    ? d
    : date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
}

export default function HomeNews() {
  return (
    <motion.section
      className="py-14"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tin tức Đại hội cơ sở
            </h2>
            <p className="text-slate-600 mt-1">
              Cập nhật hoạt động và kết quả Đại hội tại các Khoa/Viện.
            </p>
          </div>
          <Link
            href="/news"
            className="hidden sm:inline-flex items-center rounded-xl px-4 py-2 font-semibold
                       bg-sky-600 text-white hover:bg-sky-700 transition shadow"
          >
            Xem tất cả
          </Link>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={gridVariants}
          initial="initial"
          animate="animate"
        >
          {NEWS.map((n) => (
            <motion.article key={n.id} variants={cardVariants}>
              <Link
                href={n.href}
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition"
              >
                {/* Cover */}
                <div className="relative h-48">
                  <Image
                    src={n.image}
                    alt={n.title}
                    fill
                    priority={false}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  {/* overlay gradient + unit chip */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  <span
                    className="absolute left-3 top-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                                   text-white bg-black/35 backdrop-blur ring-1 ring-white/30"
                  >
                    {n.unit}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="text-base/6 sm:text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {n.excerpt}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={16} />
                      {formatDate(n.date)}
                    </span>
                    <span className="text-sky-600 font-semibold group-hover:underline">
                      Đọc tiếp →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* Mobile “Xem tất cả” */}
        <div className="sm:hidden mt-6">
          <Link
            href="/news"
            className="inline-flex items-center rounded-xl px-4 py-2 font-semibold
                       bg-sky-600 text-white hover:bg-sky-700 transition shadow"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
