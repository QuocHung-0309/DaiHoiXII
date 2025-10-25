"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  FileText,
  Users,
  Vote,
  Calendar,
  MapPin,
  Megaphone,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { IdGateModal } from "@/components/id-gate-modal";

import JourneyTimeline from "@/components/JourneyTimeline";
import CountUp from "@/components/CountUp";
import HomeNews from "@/components/HomeNews";
import { IdGateClient } from "@/components/IdGateClient";

/* ===== Animation easings & variants (TS-safe) ===== */
const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: EASE,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const sectionVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

export default function HomePage() {
  <IdGateClient />;
  // Fallback màu tươi (nếu theme đã có CSS variables thì var(--*) sẽ ghi đè)
  const cssVars: CSSProperties = {
    // @ts-ignore custom props
    ["--primary"]: "#00A7E1",
    ["--secondary"]: "#FF7A00",
    ["--accent"]: "#FFD36C",
    ["--sidebar-primary"]: "#004AAD",
    ["--secondary-foreground"]: "#111827",
  };

  const features = [
    {
      icon: FileText,
      title: "Văn kiện Đại hội",
      description: "Xem và nghiên cứu các văn kiện quan trọng của Đại hội",
      href: "/documents",
      gradient:
        "bg-gradient-to-br from-[var(--sidebar-primary)] via-[var(--primary)] to-[#2BB3FF]",
    },
    {
      icon: Vote,
      title: "Biểu quyết",
      description: "Tham gia biểu quyết các văn kiện và nghị quyết",
      href: "/bieuquyet",
      gradient:
        "bg-gradient-to-br from-[var(--secondary)] via-[#FF9A1A] to-[var(--accent)]",
    },
  ];

  async function copyCode() {
    try {
      await navigator.clipboard.writeText("HSV-HCMUTE-XII");
      const el = document.getElementById("copyChip");
      if (el) {
        el.classList.add("ring-2", "ring-emerald-400");
        setTimeout(
          () => el.classList.remove("ring-2", "ring-emerald-400"),
          900
        );
      }
    } catch {}
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-[rgb(248_250_252)]"
      style={cssVars}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <IdGateClient />
      {/* ====== HERO ====== */}
      <motion.section
        className="relative overflow-hidden pt-16 pb-20 text-white"
        variants={sectionVariants}
      >
        {/* nền gradient chính */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9] via-[var(--primary)] to-[#22D3EE]" />
        {/* flare cam nhẹ */}
        <div
          className="absolute -top-24 left-1/2 h-[130%] w-[160%] -translate-x-1/2
          bg-[conic-gradient(from_10deg_at_70%_20%,rgba(255,138,0,0.45),rgba(255,194,74,0.28),transparent_35%)]
          blur-3xl"
          aria-hidden="true"
        />
        {/* watermark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, rotate: -2 }}
          animate={{ opacity: 0.08, scale: 1, rotate: -6 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="pointer-events-none select-none absolute -right-20 bottom-[-80px]"
        >
          <Image
            src="/BieuTrung.png"
            alt="Biểu trưng Đại hội"
            width={760}
            height={760}
            priority
          />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* badge */}
          <motion.span
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase bg-white/15 px-3 py-1 rounded-full backdrop-blur"
            variants={itemVariants}
          >
            <Megaphone size={18} /> Chào mừng
          </motion.span>

          {/* title block đẹp hơn */}
          <motion.h1
            className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold leading-tight drop-shadow-lg"
            variants={itemVariants}
          >
            <span className="block">
              ĐẠI HỘI ĐẠI BIỂU HỘI SINH VIÊN VIỆT NAM
            </span>
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg,#FFF,#E3F6FF)" }}
            >
              TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM
            </span>
          </motion.h1>

          <motion.p
            className="mt-2 text-lg/relaxed opacity-95"
            variants={itemVariants}
          >
            Lần thứ XII, Nhiệm kỳ 2025 – 2028
          </motion.p>

          {/* CTA + mã đại biểu */}
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            variants={itemVariants}
          >
            <Link
              href="/documents"
              className="inline-flex items-center rounded-xl px-5 py-3 font-semibold
                bg-white/95 text-[color:var(--sidebar-primary)] hover:bg-white transition shadow-lg"
            >
              Xem văn kiện
            </Link>
            <Link
              href="/documents"
              className="inline-flex items-center rounded-xl px-5 py-3 font-semibold
                bg-[var(--secondary)] text-[color:var(--secondary-foreground)]
                hover:brightness-110 transition shadow-lg"
            >
              Biểu quyết ngay
            </Link>

            {/* <button
              id="copyChip"
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 ml-1 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur transition"
              title="Sao chép mã"
            >
              <Copy size={16} />
              <span className="text-sm">
                Mã đại biểu: <b>HSV-HCMUTE-XII</b>
              </span>
            </button> */}
          </motion.div>

          {/* quick meta cards (glass) */}
          <motion.div
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl"
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {[
              {
                icon: <Calendar size={18} />,
                title: "Thời gian",
                desc: "26/10/2025",
              },
              {
                icon: <MapPin size={18} />,
                title: "Địa điểm",
                desc: "Hội trường lớn khu A, HCMUTE",
              },
              {
                icon: <Megaphone size={18} />,
                title: "Chủ đề",
                desc: "Vững chuyên môn – Giỏi kỹ năng – Tiên phong sáng tạo - Tự tin hội nhập",
              },
            ].map((b, i) => (
              <motion.div
                key={i}
                className="bg-white/12 rounded-2xl p-4 backdrop-blur border border-white/20 shadow-[0_6px_18px_rgba(2,132,199,0.2)]"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                    {b.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{b.title}</div>
                    <div className="text-[13px] opacity-90">{b.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      {/* ====== INFO ====== */}
      <motion.section className="relative -mt-10" variants={sectionVariants}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-6 sm:p-8"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Thông tin Đại hội
                </h2>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Đại hội Đại biểu Hội Sinh viên Việt Nam Trường Đại học Sư phạm
                  Kỹ thuật TP.HCM lần thứ XII, nhiệm kỳ 2025 - 2028 là sự kiện
                  chính trị quan trọng của hội viên, sinh viên Trường. Đại hội
                  có nhiệm vụ đánh giá kết quả công tác Hội và phong trào sinh
                  viên nhiệm kỳ 2023 - 2025, đề ra mục tiêu, phương hướng, nhiệm
                  vụ và giải pháp cho công tác Hội và phong trào sinh viên nhiệm
                  kỳ 2025 - 2028. Đồng thời, Đại hội sẽ hiệp thương bầu Ban Chấp
                  hành, Ban Kiểm tra Hội Sinh viên Trường khóa XII, nhiệm kỳ
                  2025 - 2028. Với tinh thần "Vững chuyên môn – Giỏi kỹ năng –
                  Tiên phong sáng tạo - Tự tin hội nhập", Đại hội XII kỳ vọng sẽ
                  tạo ra những bước đột phá mới trong công tác Hội và phong trào
                  sinh viên HCMUTE.
                </p>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    className="rounded-xl p-4 border bg-gradient-to-br from-[#F0FBFF] via-white to-[#FFF7EA]"
                    variants={itemVariants}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Mục tiêu
                    </h3>
                    <p className="text-sm text-gray-600">
                      Nâng cao tính minh bạch, nhanh chóng và thuận tiện trong
                      quy trình điều hành Đại hội.
                    </p>
                  </motion.div>
                  <motion.div
                    className="rounded-xl p-4 border bg-gradient-to-br from-[#FFF7EA] via-white to-[#F0FBFF]"
                    variants={itemVariants}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Phạm vi
                    </h3>
                    <p className="text-sm text-gray-600">
                      Áp dụng trong khuôn khổ Đại hội cấp Khoa/Trường, với biểu
                      quyết theo từng văn kiện.
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.div variants={itemVariants}>
                  <Link
                    href="/documents"
                    className="block rounded-xl p-4 border bg-gradient-to-r from-[var(--primary)] to-[#2BB3FF] text-white hover:shadow-lg transition"
                  >
                    <div className="font-bold">Vào mục Văn kiện →</div>
                    <div className="text-sm/relaxed opacity-90">
                      Xem chi tiết văn kiện và thực hiện biểu quyết
                    </div>
                  </Link>
                </motion.div>
              
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      {/* ====== TIMELINE ====== */}
      <HomeNews />
      {/* ====== FEATURES ====== */}

      {/* ====== QUICK STATS ====== */}
      <motion.section
        className="bg-white/70 backdrop-blur py-12 border-t"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {[
              {
                color: "text-[color:var(--primary)]",
                bg: "from-[#E6F7FF] via-white to-[#FDF6E9]",
                val: 150,
                label: "Đại biểu",
              },
              {
                color: "text-[color:var(--secondary)]",
                bg: "from-[#FFF1E6] via-white to-[#FFF9E6]",
                val: 1,
                label: "Văn kiện",
              },
              {
                color: "text-[color:var(--sidebar-primary)]",
                bg: "from-[#EEF2FF] via-white to-[#E6FFF8]",
                val: 27,
                label: "Đoàn",
              },
              {
                color: "text-[#14B8A6]",
                bg: "from-[#FFF7EA] via-white to-[#E6F7FF]",
                val: 1,
                label: "Ngày",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                className={`rounded-xl p-6 bg-gradient-to-br ${s.bg} shadow-sm`}
                variants={itemVariants}
              >
                <div className={`text-4xl font-extrabold ${s.color} mb-2`}>
                  <CountUp to={s.val} />
                </div>
                <div className="text-gray-600">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      <div className="sr-only" aria-live="polite">
        <CheckCircle2 />
      </div>
    </motion.div>
  );
}
