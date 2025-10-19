"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isAdmin = pathname?.startsWith("/admin");

  const publicLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/documents", label: "Văn kiện" },
    { href: "/gopy-van-kien", label: "Góp ý văn kiện" },
    { href: "/delegates", label: "Đại biểu" },
  ];

  const adminLinks = [
    { href: "/admin/seating", label: "Sơ đồ chỗ ngồi" },
    { href: "/admin/voting-stats", label: "Thống kê biểu quyết" },
  ];

  const links = isAdmin ? adminLinks : publicLinks;

  return (
    <nav className="bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center overflow-hidden ring-2 ring-white/40">
              {/* Nếu cần chữ thay cho ảnh, bỏ <img> và mở span */}
              {/* <span className="text-[#0EA5E9] font-bold text-lg">HSV</span> */}
              <img
                src="/BieuTrung.png"
                alt="Biểu trưng"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-lg">Đại hội HSV</div>
              <div className="text-xs text-white/85">
                ĐH Sư phạm Kỹ thuật TP.HCM
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href) ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Public: KHÔNG hiện nút Quản trị */}
            {/* Admin: vẫn có nút trở về trang công khai */}
            {isAdmin && (
              <Link
                href="/"
                className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-white text-[#0F172A] hover:bg-white/90 transition-colors"
              >
                Trang công khai
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href) ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Public: KHÔNG có nút Quản trị trong mobile */}
            {isAdmin && (
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-white text-[#0F172A]"
              >
                Trang công khai
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
