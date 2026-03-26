"use client";
import React, { useState } from "react";
import { User, Lock, Bell, Shield, Save, Camera } from "lucide-react";

type Tab = "profile" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Dữ liệu giả để hiển thị UI
  const mockUser = {
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    address: "123 Đường Ngọc Khánh, Ba Đình, Hà Nội"
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cài Đặt Tài Khoản</h1>
          <p className="text-gray-500 mt-2">Quản lý thông tin cá nhân và bảo mật của bạn</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === "profile"
                    ? "bg-emerald-100 text-emerald-800 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <User size={18} className={activeTab === "profile" ? "text-emerald-600" : "text-gray-400"} />
                Hồ sơ cá nhân
              </button>
              
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === "security"
                    ? "bg-emerald-100 text-emerald-800 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Shield size={18} className={activeTab === "security" ? "text-emerald-600" : "text-gray-400"} />
                Bảo mật & Mật khẩu
              </button>
            </nav>
          </div>

          {/* Nội dung chính */}
          <div className="flex-1 p-6 md:p-10">
            
            {/* TAB 1: HỒ SƠ CÁ NHÂN */}
            {activeTab === "profile" && (
              <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User size={24} className="text-emerald-500" />
                  Thông tin cơ bản
                </h2>
                
                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                      {mockUser.fullName.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 text-emerald-600 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Ảnh đại diện</h3>
                    <p className="text-sm text-gray-500 mt-1">Nên dùng ảnh vuông, định dạng JPG, PNG.</p>
                  </div>
                </div>

                {/* Form Thông tin */}
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Họ và Tên</label>
                      <input 
                        type="text" 
                        defaultValue={mockUser.fullName}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                      <input 
                        type="tel" 
                        defaultValue={mockUser.phone}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Địa chỉ Email</label>
                    <input 
                      type="email" 
                      defaultValue={mockUser.email}
                      disabled
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">Email không thể thay đổi sau khi đăng ký.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Địa chỉ thường trú</label>
                    <input 
                      type="text" 
                      defaultValue={mockUser.address}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-800"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2">
                      <Save size={18} />
                      Lưu Thay Đổi
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: BẢO MẬT */}
            {activeTab === "security" && (
              <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Lock size={24} className="text-emerald-500" />
                  Đổi mật khẩu
                </h2>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Mật khẩu hiện tại</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-800"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-800"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2">
                      <Save size={18} />
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}