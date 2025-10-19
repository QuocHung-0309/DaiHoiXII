"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Share2,
  Link as LinkIcon,
  ArrowRight,
} from "lucide-react";

// --- THÊM 2 DÒNG NÀY ---
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ========= Animations (Giữ nguyên) ========= */
const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];
const pageV: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: EASE,
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};
const blockV: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

/* ========= Demo data: ĐÃ CẬP NHẬT CONTENT SANG MARKDOWN ========= */
type NewsItem = {
  id: string;
  title: string;
  unit: string;
  date: string;
  excerpt: string;
  image: string; // Đây là ảnh bìa (cover image)
  content: string; // Nội dung bài viết, giờ là Markdown
};

const NEWS: NewsItem[] = [
  {
    id: "n1",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT THÀNH PHỐ HỒ CHÍ MINH KHOA CÔNG NGHỆ THÔNG TIN LẦN THỨ VIII, NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Công nghệ Thông tin",
    date: "2025-03-09",
    excerpt:
      "Đại hội Đại biểu HSV Khoa CNTT lần thứ VIII, nhiệm kỳ 2025–2028 diễn ra trang trọng, thành công.",
    image: "/cntt1.jpg", // Ảnh bìa
    // --- NỘI DUNG ĐÃ CHUYỂN SANG MARKDOWN ---
    content: `
🕊️ Vào ngày 09/03/2025 vừa qua, Đại hội Đại biểu Hội Sinh viên Việt Nam Trường Đại học Sư phạm Kỹ thuật thành phố Hồ Chí Minh khoa Công nghệ Thông tin lần thứ VIII, nhiệm kỳ 2025 - 2028 đã diễn ra thành công tốt đẹp!

![Một hình ảnh từ đại hội](/cntt2.jpg)

🕊️ Xin được chúc mừng 15 đồng chí đắc cử vào vị trí Ban chấp hành Hội sinh viên Việt Nam khoa Công nghệ Thông tin khoá VIII nhiệm kỳ 2025 - 2028. Chúc các đồng chí sẽ có một nhiệm kỳ thành công và thắng lợi. Chúc Hội sinh viên khoa mình ngày càng phát triển!

---

**🔵 Nhân sự BCH Liên chi hội khoa CNTT khoá VIII, nhiệm kỳ 2025 - 2028:**

1.  Đ/c Huỳnh Ngọc Tài - Liên chi hội trưởng LCH khoa
2.  Đ/c Nguyễn Đức Toàn - Liên chi hội phó LCH khoa
3.  Đ/c Võ An Thái - Liên chi hội phó LCH khoa
4.  Đ/c Đồng Gia Sang - UV Ban chấp hành LCH khoa
5.  Đ/c Đặng Trần Anh Quân - UV Ban chấp hành LCH khoa
6.  Đ/c Mai Thị Huỳnh Như - UV Ban chấp hành LCH khoa
7.  Đ/c Dương Nguyễn Ngọc Thương - UV Ban chấp hành LCH khoa
8.  Đ/c Nguyễn Hoàng Anh Kiệt - UV Ban chấp hành LCH khoa
9.  Đ/c Hồ Minh Trí - UV Ban chấp hành LCH khoa
10. Đ/c Trần Văn Nhựt Hưng - UV Ban chấp hành LCH khoa
11. Đ/c Đinh Phú Sỹ - UV Ban chấp hành LCH khoa
12. Đ/c Nguyễn Yến Linh - UV Ban chấp hành LCH khoa
13. Đ/c Kiều Anh Quỳnh - UV Ban chấp hành LCH khoa
14. Đ/c Phan Tuấn Thanh - UV Ban chấp hành LCH khoa
15. Đ/c Nguyễn Thành Tiến - UV Ban chấp hành LCH khoa

☀️☀️☀️Chúc các đồng chí trong BCH Liên chi hội Khoa Công nghệ Thông tin nhiệm kỳ mới hoàn thành thật tốt nhiệm vụ được giao, tạo nên dấu ấn rực rỡ và đưa Khoa Công nghệ Thông tin ngày càng phát triển.
`,
  },
  {
    id: "n2",
    title:
      "ĐẠI HỘI THÀNH VIÊN ĐỘI CÔNG TÁC XÃ HỘI LẦN THỨ XXII, NHIỆM KỲ 2025 - 2028",
    unit: "Đội Công tác xã hội",
    date: "2025-03-22",
    excerpt:
      "Đại hội Thành viên Đội CTXH lần thứ XXII đã bầu BCH mới, định hướng đẩy mạnh hoạt động cộng đồng.",
    image: "/ctxh1.jpg", // Ảnh bìa
    // --- NỘI DUNG ĐÃ CHUYỂN SANG MARKDOWN ---
    content: `
**22/03/2025** — Đại hội tiến hành trong không khí đoàn kết, thống nhất cao.

- Báo cáo tổng kết nhấn mạnh 1.200+ lượt tham gia chiến dịch thường niên.
- Định hướng nhiệm kỳ: mở rộng dự án môi trường, an sinh xã hội, đồng hành tân sinh viên.

Chúc mừng BCH nhiệm kỳ 2025–2028, chúc phong trào tiếp tục lan tỏa giá trị nhân văn đến cộng đồng!
`,
  },
  {
    id: "n3",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA NGOẠI NGỮ LẦN THỨ IX, NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Ngoại ngữ",
    date: "2025-04-13",
    excerpt:
      "Đại hội LCH Khoa Ngoại ngữ lần thứ IX đã diễn ra thành công tốt đẹp tại Phòng họp III – HCMUTE.",
    image: "/nn1.jpg",
    content: `
**13/04/2025 – Phòng họp III, HCMUTE** — Đại hội LCH Khoa Ngoại ngữ lần IX tổng kết nhiệm kỳ và đề ra phương hướng 2025–2028.

![Đại hội Khoa Ngoại ngữ](/nn1.jpg "LCH Khoa Ngoại ngữ khóa IX")

🌟 RECAP ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA NGOẠI NGỮ LẦN THỨ IX, NHIỆM KỲ 2025 - 2028  🌟 
🕊️ Vào ngày 13/04/2025, tại phòng họp III – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Ngoại ngữ lần thứ IX, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!
🕊️ Xin được chúc mừng 9 đồng chí đắc cử vào vị trí Ban Chấp hành LCH Khoa Ngoại ngữ khoá IX nhiệm kỳ 2025 - 2028. Chúc các đồng chí sẽ có một nhiệm kỳ thành công và thắng lợi. Chúc Liên Chi hội ngày càng phát triển

`,
  },
  {
    id: "n4",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA THỜI TRANG & DU LỊCH LẦN THỨ XII, NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Thời trang & Du lịch",
    date: "2025-09-12",
    excerpt:
      "Đại hội LCH Khoa Thời trang & Du lịch lần XII xác lập định hướng tập trung hoạt động cộng đồng và môi trường.",
    image: "/ttdl1.jpg",
    content: `
**12/09/2025** — Đại hội LCH Khoa Thời trang & Du lịch lần XII diễn ra thành công tốt đẹp.

![Khoa Thời trang & Du lịch](/ttdl1.jpg "LCH Khoa Thời trang & Du lịch khóa XII")

🌟 RECAP ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA THỜI TRANG VÀ DU LỊCH LẦN THỨ XII, NHIỆM KỲ 2025 - 2028 🌟
🕊️ Vào chiều ngày 13/04/2025, tại phòng A307 – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Thời trang và Du lịch lần thứ XII, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!
🕊️ Xin được chúc mừng 11 đồng chí đắc cử vào vị trí Ban Chấp hành LCH Khoa Thời trang và Du lịch khoá XII nhiệm kỳ 2025 - 2028. Chúc các đồng chí sẽ có một nhiệm kỳ thành công và thắng lợi. Chúc Liên Chi hội ngày càng phát triển.
`,
  },
  {
    id: "n5",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI SINH VIÊN KÝ TÚC XÁ",
    unit: "LCH SV Ký túc xá",
    date: "2025-09-12",
    excerpt:
      "Đại hội LCH Sinh viên KTX nhiệm kỳ 2025–2028 diễn ra thành công, chú trọng đời sống – an sinh sinh viên.",
    image: "/ktx1.jpg",
    content: `
**12/09/2025 – KTX HCMUTE** — Đại hội LCH SV Ký túc xá đặt mục tiêu nâng chất lượng đời sống, hoạt động văn hóa – thể thao nội trú.

![Đại hội LCH SV KTX](/ktx1.jpg "LCH SV Ký túc xá - Nhiệm kỳ 2025–2028")

🌟[RECAP ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM LIÊN CHI HỘI SINH VIÊN SINH VIÊN KÝ TÚC XÁ, LẦN THỨ IV NHIỆM KỲ 2025 - 2028]🌟 
🕊️ Vào tối ngày 24/04/2025, tại phòng họp III – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Liên Chi hội Sinh viên Ký túc xá lần thứ IV, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!
🕊️ Xin được chúc mừng 15 đồng chí đắc cử vào vị trí Ban Chấp hành Liên Chi hội Sinh viên Ký túc xá lần thứ IV, nhiệm kỳ 2025 – 2028. Chúc các đồng chí sẽ có một nhiệm kỳ thành công và thắng lợi. Chúc Liên Chi hội ngày càng phát triển
`,
  },
  {
    id: "n6",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA ĐÀO TẠO QUỐC TẾ LẦN THỨ III, NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Đào tạo Quốc tế",
    date: "2025-09-12",
    excerpt:
      "Đại hội Khoa Đào tạo Quốc tế nhấn mạnh hợp tác doanh nghiệp và dự án trải nghiệm thực tế.",
    image: "/dtqt1.jpg",
    content: `


![ĐTQT](/dtqt1.jpg "LCH Khoa Đào tạo Quốc tế khóa III")

RECAP ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA ĐÀO TẠO QUỐC TẾ LẦN THỨ III, NHIỆM KỲ 2025 - 2028
🕊️ Vào chiều ngày 13/04/2025, tại phòng họp II – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Đào tạo Quốc tế lần thứ III, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!
🕊️ Xin được chúc mừng 13 đồng chí đắc cử vào vị trí Ban Chấp hành LCH Khoa Đào tạo Quốc tế khoá III nhiệm kỳ 2025 - 2028. Chúc các đồng chí sẽ có một nhiệm kỳ thành công và thắng lợi. Chúc Liên Chi hội ngày càng phát triển.
`,
  },
  {
    id: "n7",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA CƠ KHÍ ĐỘNG LỰC LẦN THỨ XII, NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Cơ khí Động lực",
    date: "2025-04-13",
    excerpt:
      "Đại hội LCH Khoa Cơ khí Động lực lần XII bầu BCH mới; thảo luận sôi nổi mảng học thuật – nghiên cứu.",
    image: "/ckd1.jpg",
    content: `
**13/04/2025 – Phòng họp II, HCMUTE** — Đại hội LCH Khoa Cơ khí Động lực diễn ra thành công.

![Khoa CKĐL](/ckd1.jpg "LCH Khoa Cơ khí Động lực khóa XII")

🌟 RECAP ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM LIÊN CHI HỘI KHOA CƠ KHÍ ĐỘNG LỰC LẦN THỨ XII, NHIỆM KỲ 2025 - 2028
🕊️ Vào sáng ngày 13/04/2025, tại phòng họp II – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Cơ khí Động lực lần thứ XII, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!
🕊️ Xin được chúc mừng 15 đồng chí đắc cử vào vị trí Ban Chấp hành LCH Khoa  Cơ khí Động lực lần thứ XII nhiệm kỳ 2025 - 2028. Chúc các đồng chí sẽ có một nhiệm kỳ thành công và thắng lợi. Chúc Liên Chi hội ngày càng phát triển
`,
  },
  {
    id: "n8",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM KHOA CƠ KHÍ CHẾ TẠO MÁY TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT LẦN THỨ XII NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Cơ khí Chế tạo máy",
    date: "2025-04-13",
    excerpt:
      "Đại hội Khoa CKM lần XII xác định định hướng đổi mới sáng tạo, tăng hoạt động xưởng – CLB học thuật.",
    image: "/ckm1.jpg",
    content: `
**13/04/2025 – HCMUTE** — Đại hội Khoa Cơ khí Chế tạo máy đề xuất nhiều giải pháp thúc đẩy sáng tạo.

![Khoa CKCTM](/ckm1.jpg "LCH Khoa Cơ khí Chế tạo máy khóa XII")

🌟 RECAP ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM KHOA CƠ KHÍ CHẾ TẠO MÁY TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT LẦN THỨ XII NHIỆM KỲ 2025 - 2028 🌟 
🕊️ Vào ngày 09/04/2025, tại phòng họp II – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Cơ khí Chế tạo máy lần thứ XII, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!
🕊️ Xin được chúc mừng 15 đồng chí đắc cử vào vị trí Ban Chấp hành LCH Khoa Cơ khí Chế tạo máy khoá XII nhiệm kỳ 2025 - 2028. Chúc các đồng chí sẽ có một nhiệm kỳ thành công và thắng lợi. Chúc Liên Chi hội ngày càng phát triển!
`,
  },
  {
    id: "n9",
    title:
      "ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM KHOA KINH TẾ TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT LẦN THỨ VIII NHIỆM KỲ 2025 - 2028",
    unit: "Khoa Kinh tế",
    date: "2025-03-30",
    excerpt:
      "Đại hội Khoa Kinh tế lần VIII đề ra mục tiêu tăng trải nghiệm nghề nghiệp & kỹ năng số cho sinh viên.",
    image: "/kt1.jpg",
    content: `
**30/03/2025 – Phòng họp II, HCMUTE** — Đại hội LCH Khoa Kinh tế tổng kết hoạt động nhiệm kỳ và đề ra phương hướng mới.

![Khoa Kinh tế](/kt1.jpg "LCH Khoa Kinh tế khóa VIII")

🕊 TỪ ĐẠI HỘI ĐẾN ĐẠI HỘI | ĐIỂM THỨ 0️⃣4️⃣
🌟 RECAP ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM KHOA KINH TẾ TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT LẦN THỨ VIII NHIỆM KỲ 2025 - 2028🌟 
🕊️ Vào ngày 30/03/2025, tại phòng họp II – Trường Đại học Sư phạm Kỹ thuật TP.HCM, Đại hội Hội Sinh viên Việt Nam Khoa Kinh tế lần thứ VII, nhiệm kỳ 2025 – 2028 đã diễn ra thành công tốt đẹp!
🕊️ Xin được chúc mừng 15 đồng chí đắc cử vào vị trí Ban Chấp hành LCH Khoa Kinh tế khoá VIII nhiệm kỳ 2025 - 2028. Chúc các đồng chí sẽ có một nhiệm kỳ thành công và thắng lợi. Chúc Liên Chi hội ngày càng phát triển!
`,
  },
];
// bạn bổ sung thêm n3..n9 tương tự nếu cần

/* ========= Functions (Giữ nguyên) ========= */
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

function getPost(id: string) {
  return NEWS.find((n) => n.id === id) || NEWS[0];
}

function getRelated(id: string, take = 3) {
  const current = NEWS.findIndex((n) => n.id === id);
  if (current === -1) return NEWS.slice(0, take);
  return NEWS.filter((_, i) => i !== current).slice(0, take);
}

/* ========= Component (Giữ nguyên logic) ========= */
export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const post = getPost(params.id);
  const related = useMemo(() => getRelated(post.id), [post.id]);

  // Reading progress (Giữ nguyên)
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });

  // Share function (Giữ nguyên)
  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Đã sao chép liên kết bài viết!");
      }
    } catch {
      /* noop */
    }
  };

  return (
    <motion.div
      className="min-h-screen"
      variants={pageV}
      initial="initial"
      animate="animate"
      style={{
        background:
          "linear-gradient(180deg, rgba(241,245,249,0.9) 0%, rgba(241,245,249,0.9) 60%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb / Back (Giữ nguyên) */}
        <motion.div variants={blockV} className="mb-3">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại Tin tức
          </Link>
        </motion.div>

        {/* Cover + Title (Giữ nguyên) */}
        <motion.header variants={blockV} className="mb-6">
          <div className="relative h-[220px] sm:h-[320px] w-full overflow-hidden rounded-2xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
              <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm">
                <span className="inline-flex items-center rounded-full px-3 py-1 bg-white/15 backdrop-blur ring-1 ring-white/30">
                  {post.unit}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-white/10 backdrop-blur ring-1 ring-white/20">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(post.date)}
                </span>
              </div>
              <h1 className="mt-3 text-white text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow">
                {post.title}
              </h1>
            </div>
          </div>
        </motion.header>

        {/* Reading progress (Giữ nguyên) */}
        <div className="mb-4">
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400"
              style={{ scaleX: progress, transformOrigin: "0% 50%" }}
            />
          </div>
        </div>

        {/* --- KHỐI CONTENT ĐÃ CẬP NHẬT --- */}
        {/* Thay thế <div> bằng ReactMarkdown */}
        <motion.main
          ref={contentRef}
          variants={blockV}
          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm"
        >
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => (
                  <span className="relative block w-full aspect-video my-6 overflow-hidden rounded-lg border border-slate-200 shadow-md">
                    <Image
                      src={props.src || ""}
                      alt={props.alt || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                    {/* Bạn có thể thêm caption nếu muốn, lấy từ alt */}
                    {props.alt && (
                      <span className="block text-center text-sm text-slate-600 mt-2 italic">
                        {props.alt}
                      </span>
                    )}
                  </span>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          {/* Share buttons (Giữ nguyên) */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={share}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-sky-600 text-white hover:bg-sky-700 transition shadow"
              title="Chia sẻ bài viết"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ
            </button>
            <button
              onClick={async () => {
                const url =
                  typeof window !== "undefined" ? window.location.href : "";
                await navigator.clipboard.writeText(url);
                alert("Đã sao chép liên kết!");
              }}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              title="Sao chép liên kết"
            >
              <LinkIcon className="h-4 w-4" />
              Sao chép liên kết
            </button>
          </div>
        </motion.main>

        <motion.section variants={blockV} className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            Bài viết liên quan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/news/${r.id}`}
                className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative h-32">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-slate-500 mb-1">
                    {r.unit} • {formatDate(r.date)}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
                    {r.title}
                  </h3>
                  <div className="mt-2 inline-flex items-center text-sky-600 text-sm font-medium">
                    Đọc tiếp <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
