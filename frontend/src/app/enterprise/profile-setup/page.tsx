"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { enterpriseProfileApi } from "@/lib/api/enterpriseProfileApi";
import { AlertCircle, CheckCircle, Building2, MapPin, Truck, Phone } from "lucide-react";

interface ProfileForm {
  companyName: string;
  address: string;
  phoneNumber: string;
  serviceArea: string;
  capacityKgPerDay: string;
}

export default function EnterpriseProfileSetup() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileForm>({
    companyName: user?.fullName || "",
    address: "",
    phoneNumber: "",
    serviceArea: "",
    capacityKgPerDay: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated or not enterprise
  React.useEffect(() => {
    if (!user || user.role !== "enterprise") {
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName.trim()) {
      setError("Tên công ty là bắt buộc");
      return;
    }

    if (!formData.address.trim()) {
      setError("Địa chỉ là bắt buộc");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setError("Số điện thoại là bắt buộc");
      return;
    }

    if (!formData.serviceArea.trim()) {
      setError("Khu vực phục vụ là bắt buộc");
      return;
    }

    if (!formData.capacityKgPerDay.trim()) {
      setError("Công suất xử lý là bắt buộc");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await enterpriseProfileApi.updateProfile({
        companyName: formData.companyName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        serviceArea: formData.serviceArea,
        capacityKgPerDay: parseInt(formData.capacityKgPerDay),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/enterprise/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu thông tin doanh nghiệp");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "enterprise") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0AA468]/5 to-[#088F5A]/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 size={32} className="text-[#0AA468]" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Hoàn Tất Thông Tin Doanh Nghiệp
            </h1>
          </div>
          <p className="text-gray-600">
            Vui lòng điền đầy đủ thông tin để admin xác nhận tài khoản
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Messages */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-4">
              <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
              <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-green-700">
                Thông tin đã được lưu! Đang chuyển hướng...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên công ty */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 size={16} />
                  Tên Công Ty <span className="text-red-500">*</span>
                </div>
              </label>
              <Input
                type="text"
                placeholder="Nhập tên công ty"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  Địa Chỉ <span className="text-red-500">*</span>
                </div>
              </label>
              <Input
                type="text"
                placeholder="Nhập địa chỉ công ty"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  Số Điện Thoại <span className="text-red-500">*</span>
                </div>
              </label>
              <Input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Khu vực phục vụ */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  Khu Vực Phục Vụ <span className="text-red-500">*</span>
                </div>
              </label>
              <Input
                type="text"
                placeholder="VD: Quận 1, Quận 2, Quận 3 (HCM)"
                value={formData.serviceArea}
                onChange={(e) => handleChange("serviceArea", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Công suất xử lý */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Truck size={16} />
                  Công Suất Xử Lý Hàng Ngày (kg) <span className="text-red-500">*</span>
                </div>
              </label>
              <Input
                type="number"
                placeholder="VD: 1000"
                value={formData.capacityKgPerDay}
                onChange={(e) => handleChange("capacityKgPerDay", e.target.value)}
                className="w-full"
                min="1"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => router.push("/login")}
                disabled={loading}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#0AA468] hover:bg-[#088F5A]"
                disabled={loading || success}
              >
                {loading ? "Đang lưu..." : "Hoàn Tất"}
              </Button>
            </div>
          </form>

          {/* Info box */}
          <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Lưu ý:</strong> Sau khi hoàn tất, tài khoản của bạn sẽ chuyển sang trạng thái 
              <strong> Chờ Duyệt</strong>. Admin sẽ xác nhận thông tin trong vòng 24-48 giờ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
