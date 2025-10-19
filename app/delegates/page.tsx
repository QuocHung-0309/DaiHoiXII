"use client";

import { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Users, MapPin, User, Mail, Phone, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ====== Brand palette (đổi nhanh ở đây) ====== */
const BRAND = {
  primaryFrom: "#0EA5E9", // sky-500
  primaryTo: "#22D3EE", // cyan-400
  dark: "#0F172A", // slate-900
};

/* ====== Dữ liệu mẫu ====== */
const delegations = [
  // ... giữ nguyên dữ liệu bạn gửi ...
  {
    id: "1",
    name: "Khoa Cơ khí",
    code: "ME",
    leader: "Nguyễn Văn An",
    totalDelegates: 25,
    color: "bg-primary",
    delegates: [
      {
        id: "1",
        name: "Nguyễn Văn An",
        role: "Trưởng đoàn",
        email: "an.nv@hcmute.edu.vn",
        phone: "0901234567",
      },
      {
        id: "2",
        name: "Trần Thị Bình",
        role: "Phó đoàn",
        email: "binh.tt@hcmute.edu.vn",
        phone: "0901234568",
      },
      {
        id: "3",
        name: "Lê Văn Cường",
        role: "Đại biểu",
        email: "cuong.lv@hcmute.edu.vn",
        phone: "0901234569",
      },
      {
        id: "4",
        name: "Phạm Thị Dung",
        role: "Đại biểu",
        email: "dung.pt@hcmute.edu.vn",
        phone: "0901234570",
      },
      {
        id: "5",
        name: "Hoàng Văn Em",
        role: "Đại biểu",
        email: "em.hv@hcmute.edu.vn",
        phone: "0901234571",
      },
    ],
  },
  {
    id: "2",
    name: "Khoa Điện - Điện tử",
    code: "EE",
    leader: "Võ Thị Giang",
    totalDelegates: 22,
    color: "bg-accent",
    delegates: [
      {
        id: "6",
        name: "Võ Thị Giang",
        role: "Trưởng đoàn",
        email: "giang.vt@hcmute.edu.vn",
        phone: "0901234572",
      },
      {
        id: "7",
        name: "Đặng Văn Hùng",
        role: "Phó đoàn",
        email: "hung.dv@hcmute.edu.vn",
        phone: "0901234573",
      },
      {
        id: "8",
        name: "Bùi Thị Lan",
        role: "Đại biểu",
        email: "lan.bt@hcmute.edu.vn",
        phone: "0901234574",
      },
      {
        id: "9",
        name: "Ngô Văn Minh",
        role: "Đại biểu",
        email: "minh.nv@hcmute.edu.vn",
        phone: "0901234575",
      },
    ],
  },
  {
    id: "3",
    name: "Khoa Công nghệ Thông tin",
    code: "IT",
    leader: "Trương Văn Nam",
    totalDelegates: 28,
    color: "bg-secondary",
    delegates: [
      {
        id: "10",
        name: "Trương Văn Nam",
        role: "Trưởng đoàn",
        email: "nam.tv@hcmute.edu.vn",
        phone: "0901234576",
      },
      {
        id: "11",
        name: "Lý Thị Oanh",
        role: "Phó đoàn",
        email: "oanh.lt@hcmute.edu.vn",
        phone: "0901234577",
      },
      {
        id: "12",
        name: "Phan Văn Phúc",
        role: "Đại biểu",
        email: "phuc.pv@hcmute.edu.vn",
        phone: "0901234578",
      },
      {
        id: "13",
        name: "Đinh Thị Quỳnh",
        role: "Đại biểu",
        email: "quynh.dt@hcmute.edu.vn",
        phone: "0901234579",
      },
      {
        id: "14",
        name: "Mai Văn Sơn",
        role: "Đại biểu",
        email: "son.mv@hcmute.edu.vn",
        phone: "0901234580",
      },
    ],
  },
  {
    id: "4",
    name: "Khoa Xây dựng",
    code: "CE",
    leader: "Cao Văn Tài",
    totalDelegates: 20,
    color: "bg-success",
    delegates: [
      {
        id: "15",
        name: "Cao Văn Tài",
        role: "Trưởng đoàn",
        email: "tai.cv@hcmute.edu.vn",
        phone: "0901234581",
      },
      {
        id: "16",
        name: "Hồ Thị Uyên",
        role: "Phó đoàn",
        email: "uyen.ht@hcmute.edu.vn",
        phone: "0901234582",
      },
      {
        id: "17",
        name: "Vũ Văn Vinh",
        role: "Đại biểu",
        email: "vinh.vv@hcmute.edu.vn",
        phone: "0901234583",
      },
    ],
  },
  {
    id: "5",
    name: "Khoa Hóa học",
    code: "CH",
    leader: "Đỗ Thị Xuân",
    totalDelegates: 18,
    color: "bg-primary",
    delegates: [
      {
        id: "18",
        name: "Đỗ Thị Xuân",
        role: "Trưởng đoàn",
        email: "xuan.dt@hcmute.edu.vn",
        phone: "0901234584",
      },
      {
        id: "19",
        name: "Lâm Văn Yên",
        role: "Phó đoàn",
        email: "yen.lv@hcmute.edu.vn",
        phone: "0901234585",
      },
      {
        id: "20",
        name: "Tô Thị Ánh",
        role: "Đại biểu",
        email: "anh.tt@hcmute.edu.vn",
        phone: "0901234586",
      },
    ],
  },
  {
    id: "6",
    name: "Khoa Kinh tế",
    code: "EC",
    leader: "Huỳnh Văn Bảo",
    totalDelegates: 15,
    color: "bg-accent",
    delegates: [
      {
        id: "21",
        name: "Huỳnh Văn Bảo",
        role: "Trưởng đoàn",
        email: "bao.hv@hcmute.edu.vn",
        phone: "0901234587",
      },
      {
        id: "22",
        name: "Kiều Thị Chi",
        role: "Phó đoàn",
        email: "chi.kt@hcmute.edu.vn",
        phone: "0901234588",
      },
    ],
  },
  {
    id: "7",
    name: "Khoa Ngoại ngữ",
    code: "FL",
    leader: "Dương Văn Đức",
    totalDelegates: 12,
    color: "bg-secondary",
    delegates: [
      {
        id: "23",
        name: "Dương Văn Đức",
        role: "Trưởng đoàn",
        email: "duc.dv@hcmute.edu.vn",
        phone: "0901234589",
      },
      {
        id: "24",
        name: "Lưu Thị Hoa",
        role: "Phó đoàn",
        email: "hoa.lt@hcmute.edu.vn",
        phone: "0901234590",
      },
    ],
  },
  {
    id: "8",
    name: "Khoa Môi trường",
    code: "EN",
    leader: "Phan Văn Khoa",
    totalDelegates: 10,
    color: "bg-success",
    delegates: [
      {
        id: "25",
        name: "Phan Văn Khoa",
        role: "Trưởng đoàn",
        email: "khoa.pv@hcmute.edu.vn",
        phone: "0901234591",
      },
      {
        id: "26",
        name: "Trịnh Thị Linh",
        role: "Phó đoàn",
        email: "linh.tt@hcmute.edu.vn",
        phone: "0901234592",
      },
    ],
  },
];

/* ====== Animations ====== */
const EASE: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];
const pageVariants: Variants = {
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
const blockVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};
const gridVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05 } },
};

/* ====== Helpers ====== */
const initials = (full: string) =>
  full
    .trim()
    .split(" ")
    .slice(-2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

export default function DelegatesPage() {
  const [q, setQ] = useState("");

  const totalDelegates = useMemo(
    () => delegations.reduce((sum, d) => sum + d.totalDelegates, 0),
    []
  );

  const avg = Math.round(totalDelegates / delegations.length);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return delegations;
    return delegations
      .map((d) => ({
        ...d,
        delegates: d.delegates.filter(
          (m) =>
            m.name.toLowerCase().includes(keyword) ||
            m.email.toLowerCase().includes(keyword) ||
            m.role.toLowerCase().includes(keyword)
        ),
      }))
      .filter(
        (d) =>
          d.name.toLowerCase().includes(keyword) ||
          d.code.toLowerCase().includes(keyword) ||
          d.leader.toLowerCase().includes(keyword) ||
          d.delegates.length > 0
      );
  }, [q]);

  return (
    <motion.div
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      style={{
        background:
          "linear-gradient(180deg, rgba(241,245,249,0.9) 0%, rgba(241,245,249,0.9) 60%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div className="relative">
        {/* Aura nền */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(60% 40% at 20% 0%, ${BRAND.primaryFrom}20 0%, transparent 60%),
                         radial-gradient(40% 30% at 80% 0%, ${BRAND.primaryTo}14 0%, transparent 60%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div variants={blockVariants} className="mb-6 sm:mb-8">
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: BRAND.dark }}
            >
              Đoàn đại biểu
            </h1>
            <p className="mt-2 text-slate-600">
              Thông tin về các đoàn và đại biểu tham dự Đại hội
            </p>
          </motion.div>

          {/* Search */}
          <motion.div variants={blockVariants} className="mb-8">
            <div className="relative max-w-lg">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo đoàn, mã đoàn, trưởng đoàn, hoặc tên đại biểu…"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-sky-400/40"
              />
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={gridVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={blockVariants}>
              <Card className="p-6 shadow-sm border-slate-200">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl ring-1 ring-sky-100"
                    style={{
                      background: "linear-gradient(135deg, #E0F2FE, #FFFFFF)",
                    }}
                  >
                    <Users style={{ color: BRAND.primaryFrom }} size={24} />
                  </div>
                  <div>
                    <div
                      className="text-3xl font-extrabold"
                      style={{ color: BRAND.dark }}
                    >
                      {totalDelegates}
                    </div>
                    <div className="text-sm text-slate-600">
                      Tổng số đại biểu
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={blockVariants}>
              <Card className="p-6 shadow-sm border-slate-200">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl ring-1 ring-cyan-100"
                    style={{
                      background: "linear-gradient(135deg, #ECFEFF, #FFFFFF)",
                    }}
                  >
                    <MapPin style={{ color: BRAND.primaryTo }} size={24} />
                  </div>
                  <div>
                    <div
                      className="text-3xl font-extrabold"
                      style={{ color: BRAND.dark }}
                    >
                      {delegations.length}
                    </div>
                    <div className="text-sm text-slate-600">Số đoàn</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={blockVariants}>
              <Card className="p-6 shadow-sm border-slate-200">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl ring-1 ring-emerald-100"
                    style={{
                      background: "linear-gradient(135deg, #ECFDF5, #FFFFFF)",
                    }}
                  >
                    <User className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <div
                      className="text-3xl font-extrabold"
                      style={{ color: BRAND.dark }}
                    >
                      {avg}
                    </div>
                    <div className="text-sm text-slate-600">
                      Trung bình/đoàn
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Delegations */}
          <div className="space-y-6">
            {filtered.map((delegation) => (
              <motion.div
                key={delegation.id}
                variants={blockVariants}
                initial="initial"
                animate="animate"
              >
                <Card className="p-6 shadow-sm border-slate-200">
                  {/* Header đoàn */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                      {/* chip mã đoàn gradient */}
                      <div
                        className="text-white px-4 py-2 rounded-lg font-bold text-lg shadow"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND.primaryFrom}, ${BRAND.primaryTo})`,
                          boxShadow: "0 8px 18px rgba(2,132,199,0.15)",
                        }}
                      >
                        {delegation.code}
                      </div>
                      <div>
                        <h2
                          className="text-xl font-extrabold"
                          style={{ color: BRAND.dark }}
                        >
                          {delegation.name}
                        </h2>
                        <p className="text-sm text-slate-600">
                          Trưởng đoàn:{" "}
                          <span className="font-medium text-slate-800">
                            {delegation.leader}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-base px-4 py-2 rounded-full"
                    >
                      {delegation.totalDelegates} đại biểu
                    </Badge>
                  </div>

                  {/* Danh sách đại biểu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {delegation.delegates.map((delegate) => (
                      <div
                        key={delegate.id}
                        className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        <Avatar className="h-12 w-12 ring-2 ring-white shadow">
                          <AvatarFallback
                            className="text-white font-bold"
                            style={{
                              background: `linear-gradient(135deg, ${BRAND.primaryFrom}, ${BRAND.primaryTo})`,
                            }}
                          >
                            {initials(delegate.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 truncate">
                            {delegate.name}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs mb-2 rounded-full"
                          >
                            {delegate.role}
                          </Badge>

                          <div className="space-y-1.5 text-xs text-slate-600">
                            <a
                              href={`mailto:${delegate.email}`}
                              className="flex items-center gap-1.5 truncate hover:text-sky-600"
                            >
                              <Mail size={12} />
                              <span className="truncate">{delegate.email}</span>
                            </a>
                            <a
                              href={`tel:${delegate.phone}`}
                              className="flex items-center gap-1.5 hover:text-sky-600"
                            >
                              <Phone size={12} />
                              <span>{delegate.phone}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
