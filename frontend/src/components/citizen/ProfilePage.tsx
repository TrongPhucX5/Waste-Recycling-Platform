"use client";
import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera, Shield, LogOut } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    email: "user@example.com",
    phone: "0123456789",
    address: "123 Cầu Giấy, Hà Nội",
    district: "Đống Đa",
    joinDate: "01/01/2026",
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0AA468] text-white rounded-lg hover:bg-[#088F5A] transition-all font-semibold"
        >
          {isEditing ? (
            <>
              <X size={18} />
              Hủy
            </>
          ) : (
            <>
              <Edit2 size={18} />
              Chỉnh Sửa
            </>
          )}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#0AA468] to-[#067D54] rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
              <span className="text-4xl">👤</span>
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-white text-[#0AA468] p-2 rounded-full hover:shadow-lg transition-shadow">
                <Camera size={18} />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{formData.fullName}</h2>
            <p className="text-white/70 text-sm mt-1">Người Dân • Hà Nội</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <div>
                <p className="text-white/70">Tham gia</p>
                <p className="font-semibold">{formData.joinDate}</p>
              </div>
              <div>
                <p className="text-white/70">Báo cáo</p>
                <p className="font-semibold">12</p>
              </div>
              <div>
                <p className="text-white/70">Điểm</p>
                <p className="font-semibold">450</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Thông Tin Cá Nhân</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <User size={16} className="inline mr-1" />
              Họ và Tên
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468] disabled:bg-gray-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <Mail size={16} className="inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468] disabled:bg-gray-50"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <Phone size={16} className="inline mr-1" />
              Số Điện Thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468] disabled:bg-gray-50"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <MapPin size={16} className="inline mr-1" />
              Quận / Huyện
            </label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468] disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Địa Chỉ Chi Tiết
          </label>
          <textarea
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            disabled={!isEditing}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468] disabled:bg-gray-50 resize-none"
          />
        </div>

        {/* Save Button */}
        {isEditing && (
          <button className="w-full py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
            <Save size={18} />
            Lưu Thay Đổi
          </button>
        )}
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <Shield size={20} />
          Bảo Mật
        </h3>

        <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          🔑 Đổi Mật Khẩu
        </button>

        <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          🛡️ Xác Thực Hai Lớp (2FA)
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-lg text-red-900">Vùng Nguy Hiểm</h3>

        <button className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
          <LogOut size={18} />
          Đăng Xuất
        </button>

        <button className="w-full px-4 py-2.5 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors">
          🗑️ Xóa Tài Khoản
        </button>
      </div>
    </div>
  );
};