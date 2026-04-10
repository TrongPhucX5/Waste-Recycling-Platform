"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { enterpriseApi, EnterpriseProfile } from "@/lib/api/enterpriseApi";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Building2,
  Mail,
  MapPin,
  Truck,
  RotateCcw,
} from "lucide-react";

export const EnterpriseStatusCheck: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<EnterpriseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "enterprise") {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("Fetching enterprise profile for user:", user);
        const data = await enterpriseApi.getProfile();
        console.log("Profile fetched successfully:", data);
        setProfile(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Lỗi tải thông tin:", errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0AA468] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    const handleRetry = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await enterpriseApi.getProfile();
        setProfile(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center text-red-600 max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p className="font-semibold text-lg mb-2">Không tìm thấy thông tin doanh nghiệp</p>
          {error && (
            <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg mb-4">
              Chi tiết lỗi: {error}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-[#0AA468] text-white rounded-lg hover:bg-[#0AA468]/90 transition"
            >
              Thử Lại
            </button>
            <button 
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Status: Pending (Chờ Duyệt) ─────────────────────────────
  if (profile.status === "Pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Icon header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-12 flex flex-col items-center">
            <div className="relative">
              <Clock size={64} className="text-white animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 animate-ping"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mt-4">Chờ Xác Nhận</h1>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-900 font-medium">
                Cảm ơn bạn đã đăng ký! Tài khoản doanh nghiệp của bạn đang chờ xác nhận từ admin.
              </p>
              <p className="text-blue-700 text-sm mt-2">
                Thường mất từ 24-48 giờ để hoàn tất việc xác minh.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Thông Tin Đã Gửi:
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={18} className="text-gray-600" />
                    <p className="text-sm text-gray-600">Công Ty</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {profile.companyName}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={18} className="text-gray-600" />
                    <p className="text-sm text-gray-600">Khu Vực Phục Vụ</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {profile.serviceArea || "Chưa cập nhật"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={18} className="text-gray-600" />
                    <p className="text-sm text-gray-600">Công Suất (kg/ngày)</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {profile.capacityKgPerDay || "Chưa cập nhật"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={18} className="text-gray-600" />
                    <p className="text-sm text-gray-600">Ngày Đăng Ký</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Bạn có câu hỏi?</strong> Liên hệ admin tại{" "}
                <a
                  href="mailto:support@cwcrp.com"
                  className="text-[#0AA468] hover:underline"
                >
                  support@cwcrp.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Status: Rejected (Bị Từ Chối) ───────────────────────────
  if (profile.status === "Rejected") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Icon header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-12 flex flex-col items-center">
            <AlertCircle size={64} className="text-white" />
            <h1 className="text-2xl font-bold text-white mt-4">Đơn Đã Bị Từ Chối</h1>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-900 font-medium">
                Đơn đăng ký của bạn không được phê duyệt. Vui lòng xem lý do bên dưới.
              </p>
            </div>

            {/* Rejection reason */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Lý Do Từ Chối:
              </h2>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-900 font-medium">
                  {profile.rejectionReason || "Không có thông tin chi tiết"}
                </p>
              </div>
            </div>

            {/* Company info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Thông Tin Công Ty:
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Công Ty</p>
                  <p className="font-semibold text-gray-900">
                    {profile.companyName}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => router.push("/enterprise/profile-setup")}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-colors"
              >
                <RotateCcw size={18} />
                Gửi Lại Đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Status: Verified (Đã Duyệt) ────────────────────────────
  if (profile.status === "Verified") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Success banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
            <CheckCircle size={32} />
            <div>
              <h1 className="text-xl font-bold">Tài Khoản Đã Được Xác Nhận</h1>
              <p className="text-green-100 text-sm">Bạn có thể bắt đầu sử dụng hệ thống ngay bây giờ</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        {children}
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-yellow-600" />
        <p className="text-gray-600">Trạng thái không xác định: {profile.status}</p>
      </div>
    </div>
  );
};
