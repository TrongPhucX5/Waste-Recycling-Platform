"use client";
import React, { useState } from "react";
import { Save, AlertCircle, CheckCircle } from "lucide-react";

interface CapacityData {
  maxCapacityKg: number;
  currentUsageKg: number;
  wasteTypes: string[];
  serviceArea: string;
  operatingHours: string;
}

interface Props {
  capacity: CapacityData;
  onUpdate: (capacity: CapacityData) => void;
}

const WASTE_TYPES = ["Plastic", "Paper", "Metal", "Glass", "Organic"];

export const CapacitySettings: React.FC<Props> = ({ capacity, onUpdate }) => {
  const [formData, setFormData] = useState<CapacityData>(capacity);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onUpdate(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleWasteType = (type: string) => {
    setFormData({
      ...formData,
      wasteTypes: formData.wasteTypes.includes(type)
        ? formData.wasteTypes.filter((t) => t !== type)
        : [...formData.wasteTypes, type],
    });
  };

  const usagePercent = (formData.currentUsageKg / formData.maxCapacityKg) * 100;
  const remainingCapacity = formData.maxCapacityKg - formData.currentUsageKg;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cấu Hình Năng Lực</h1>
        <p className="text-gray-600 mt-2">Quản lý năng lực xử lý rác của doanh nghiệp</p>
      </div>

      {/* Current Usage */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">📊 Sử Dụng Năng Lực Hiện Tại</h2>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {formData.currentUsageKg.toLocaleString()} / {formData.maxCapacityKg.toLocaleString()} kg
              </span>
              <span className="text-sm font-bold text-gray-900">{usagePercent.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  usagePercent > 80
                    ? "bg-red-500"
                    : usagePercent > 50
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">Đã Sử Dụng</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {formData.currentUsageKg.toLocaleString()} kg
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-700 font-medium">Còn Lại</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {remainingCapacity.toLocaleString()} kg
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-700 font-medium">Tối Đa</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {formData.maxCapacityKg.toLocaleString()} kg
              </p>
            </div>
          </div>

          {usagePercent > 80 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900">Cảnh Báo Năng Lực</p>
                <p className="text-sm text-amber-800 mt-1">
                  Năng lực đang gần hết. Vui lòng tăng cấu hình hoặc đóng yêu cầu mới.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-900">⚙️ Cấu Hình</h2>

        {/* Max Capacity */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Công Suất Tối Đa (kg)
          </label>
          <input
            type="number"
            value={formData.maxCapacityKg}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxCapacityKg: Number(e.target.value),
              })
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
          />
          <p className="text-xs text-gray-600 mt-1">
            Tổng khối lượng rác có thể xử lý
          </p>
        </div>

        {/* Service Area */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Khu Vực Phục Vụ
          </label>
          <input
            type="text"
            value={formData.serviceArea}
            onChange={(e) =>
              setFormData({
                ...formData,
                serviceArea: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            placeholder="Ví dụ: HCMC Districts 1-7"
          />
        </div>

        {/* Operating Hours */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Giờ Hoạt Động
          </label>
          <input
            type="text"
            value={formData.operatingHours}
            onChange={(e) =>
              setFormData({
                ...formData,
                operatingHours: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            placeholder="Ví dụ: 06:00 - 22:00"
          />
        </div>

        {/* Waste Types */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Loại Rác Có Thể Xử Lý
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {WASTE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleWasteType(type)}
                className={`py-2.5 px-4 rounded-lg font-medium transition-all border-2 ${
                  formData.wasteTypes.includes(type)
                    ? "border-[#0AA468] bg-green-50 text-[#0AA468]"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {formData.wasteTypes.includes(type) && (
                  <span className="mr-2">✓</span>
                )}
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Lưu Cấu Hình
        </button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-900">Lưu Thành Công</p>
            <p className="text-sm text-green-800 mt-1">
              Cấu hình năng lực đã được cập nhật.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};