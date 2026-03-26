'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

export const UserProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // DỮ LIỆU GIẢ (MOCK DATA) ĐỂ HIỂN THỊ UI FRONTEND
  // Bạn có thể sửa các thông tin này để xem UI thay đổi thế nào
  const mockUser = {
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "citizen"
  };

  const dashboardLinks = {
    citizen: '/citizen/dashboard',
    collector: '/collector/dashboard',
    enterprise: '/enterprise/dashboard',
    admin: '/admin/dashboard',
  };

  const dashboardLink = dashboardLinks[mockUser.role as keyof typeof dashboardLinks] || '/';

  // Hàm xử lý đăng xuất giả lập (Chỉ chuyển hướng)
  const handleLogout = () => {
    setIsOpen(false);
    router.push('/login'); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Icon Profile */}
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-sm">
          <User size={18} />
        </div>
        
        {/* Tên người dùng */}
        <span className="hidden sm:inline text-sm font-medium text-gray-700">
          {mockUser.fullName}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 py-1 border border-gray-100">
          {/* Profile Section */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {mockUser.fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {mockUser.email}
            </p>
            <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
              Công dân
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href={dashboardLink}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="text-gray-400" />
              Thông tin tài khoản
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="text-gray-400" />
              Cài đặt
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600 font-medium transition-colors"
            >
              <LogOut size={16} className="text-red-500" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};