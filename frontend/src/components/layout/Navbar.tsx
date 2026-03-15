"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    { label: "SẢN PHẨM", href: "/products" },
    { label: "TIN TỨC", href: "/news" },
    { label: "LIÊN HỆ", href: "/contact" },
  ],
  transparent = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav className={transparent ? "absolute top-0 w-full z-10" : "bg-white sticky top-0 z-50 border-b border-gray-100"}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
               {/* Cactus Logo */}
               <path 
                d="M20 30V10M14 16V20C14 22 15 23 17 23H20M26 16V20C26 22 25 23 23 23H20M15 34H25" 
                stroke={transparent ? "#fff" : "#00C853"}
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
               />
            </svg>
          </Link>

          {/* Desktop Nav Links - Centered */}
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-bold tracking-wider transition-colors ${
                  isActive(item.href)
                    ? (transparent ? "text-[#00C853]" : "text-[#00C853]")
                    : (transparent ? "text-white/90 hover:text-[#00C853]" : "text-gray-400 hover:text-[#00C853]")
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/login"
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                pathname === "/login"
                ? "text-[#00C853]"
                : (transparent ? "text-white/90 hover:text-[#00C853]" : "text-gray-400 hover:text-[#00C853]")
              }`}
            >
              ĐĂNG NHẬP
            </Link>
            <Link
              href="/register"
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                pathname === "/register"
                ? "text-[#00C853]"
                : (transparent ? "text-white/90 hover:text-[#00C853]" : "text-gray-400 hover:text-[#00C853]")
              }`}
            >
              ĐĂNG KÝ
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-md focus:outline-none ${transparent ? "text-white/90 hover:text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3 bg-white rounded-b-lg shadow-xl">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-4 py-3 rounded-md font-bold tracking-wider text-sm ${
                  isActive(item.href) ? "text-[#00C853] bg-emerald-50" : "text-gray-500 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-3 pt-3 flex gap-4 px-4">
              <Link 
                href="/login" 
                className={`text-sm font-bold tracking-wider uppercase ${pathname === "/login" ? "text-[#00C853]" : "text-gray-500"}`}
              >
                ĐĂNG NHẬP
              </Link>
              <Link 
                href="/register" 
                className={`text-sm font-bold tracking-wider uppercase ${pathname === "/register" ? "text-[#00C853]" : "text-gray-500"}`}
              >
                ĐĂNG KÝ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
