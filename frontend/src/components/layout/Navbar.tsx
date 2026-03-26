"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { NotificationCenter, UserProfileMenu } from "@/components/shared";

interface NavMenuItem {
  label: string;
  href: string;
}

interface NavbarProps {
  menuItems?: NavMenuItem[];
  transparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  menuItems = [
    { label: "GIỚI THIỆU", href: "/" },
    { label: "SẢN PHẨM", href: "#products" },
    { label: "TIN TỨC", href: "#news" },
    { label: "LIÊN HỆ", href: "#contact" },
  ],
  transparent = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  // Vẫn giữ useAuth nhưng tạm thời không dùng để chặn UI
  const { isAuthenticated, user } = useAuth();

  // Danh sách các trang cho phép hiển thị Navbar này
  const publicPaths = ["/", "/login", "/register", "/reset-password"];
  
  // Kiểm tra xem pathname hiện tại có nằm trong danh sách không
  const shouldShowNavbar = publicPaths.includes(pathname) || pathname?.startsWith("/reset-password");

  // Nếu không thuộc các trang trên thì ẩn hoàn toàn Navbar này
  if (!shouldShowNavbar) {
    return null; 
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className={`z-50 ${
        transparent
          ? "absolute top-0 w-full"
          : "bg-white sticky top-0 border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                transparent
                  ? "bg-white/20 group-hover:bg-white/30"
                  : "bg-[#0AA468] group-hover:bg-[#088F5A]"
              }`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 30V10M14 16V20C14 22 15 23 17 23H20M26 16V20C26 22 25 23 23 23H20M15 34H25"
                  stroke={transparent ? "#fff" : "white"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className={`font-bold text-lg hidden sm:inline transition-colors ${
                transparent
                  ? "text-white group-hover:text-[#0AA468]"
                  : "text-gray-900 group-hover:text-[#0AA468]"
              }`}
            >
              WasteRec
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  isActive(item.href)
                    ? "text-[#0AA468]"
                    : transparent
                    ? "text-white/80 hover:text-[#0AA468]"
                    : "text-gray-600 hover:text-[#0AA468]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth/Profile Section - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* LUÔN HIỂN THỊ ĐỂ TEST GIAO DIỆN FRONTEND */}
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <NotificationCenter />
              <UserProfileMenu />
            </div>

            {/* CODE CŨ ĐÃ ĐƯỢC ẨN ĐI - SẼ MỞ LẠI KHI GHÉP BACKEND
            <>
              <Link
                href="/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  pathname === "/login"
                    ? "text-[#0AA468]"
                    : transparent
                    ? "text-white/80 hover:text-white"
                    : "text-gray-600 hover:text-[#0AA468]"
                }`}
              >
                <LogIn size={16} />
                <span>Đăng Nhập</span>
              </Link>
              <Link
                href="/register"
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  pathname === "/register"
                    ? "bg-[#0AA468] text-white"
                    : transparent
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-[#0AA468] text-white hover:bg-[#088F5A]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <UserPlus size={16} />
                  <span>Đăng Ký</span>
                </span>
              </Link>
            </>
            */}
          </div>

          {/* Mobile Menu Toggle & Icons */}
          <div className="md:hidden flex items-center gap-2">
            {/* LUÔN HIỂN THỊ Ở MOBILE ĐỂ TEST UI */}
            <div className="flex items-center gap-1">
              <NotificationCenter />
              <UserProfileMenu />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                transparent
                  ? "text-white hover:bg-white/10"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${transparent ? "border-white/10" : "border-gray-100"}`}>
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive(item.href)
                    ? "text-[#0AA468]"
                    : transparent
                    ? "text-white/80 hover:text-[#0AA468]"
                    : "text-gray-600 hover:text-[#0AA468]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* CODE NÚT ĐĂNG NHẬP MOBILE TẠM ẨN
            <div className="mt-2 border-t border-gray-100 pt-2">
              <Link href="/login" ... >Đăng Nhập</Link>
              <Link href="/register" ... >Đăng Ký</Link>
            </div>
            */}
          </div>
        )}
      </div>
    </nav>
  );
};