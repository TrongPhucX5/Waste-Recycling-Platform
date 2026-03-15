"use client";
import React, { useState } from "react";
import { Camera, MapPin, Upload, Leaf, Trash2, Package } from "lucide-react";

interface ReportFormProps {
  onSubmit: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Fake API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tạo Báo Cáo Thu Gom</h2>
        <p className="text-gray-500 mt-1">Cung cấp thông tin và hình ảnh để người thu gom đến nhận rác tái chế.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Upload Image Section */}
        <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 text-center bg-emerald-50/30 hover:bg-emerald-50/80 transition-colors relative group">
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleFileChange}
            required
          />
          {preview ? (
            <div className="relative w-full max-w-sm mx-auto h-48 rounded-lg overflow-hidden shadow-sm">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="flex flex-col items-center pointer-events-none">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Chụp hoặc Tải Ảnh Lên</h3>
              <p className="text-sm text-emerald-600/70 mt-1">Hỗ trợ JPG, PNG • Max 5MB</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location & GPS */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" />
              Vị Trí Nhận Rác
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ví dụ: 123 Đường Ngọc Khánh, Ba Đình..." 
                className="flex-1 rounded-lg border-gray-200 border p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
              <button type="button" className="bg-emerald-100 text-emerald-700 px-4 rounded-lg font-medium hover:bg-emerald-200 transition-colors flex items-center gap-2">
                <MapPin size={18} /> GPS Ngay
              </button>
            </div>
          </div>

          {/* Waste Type selection */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <label className="text-sm font-semibold text-gray-700">Phân Loại Rác Tại Nguồn</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "nhua", icon: Package, label: "Nhựa", color: "text-blue-500", bg: "bg-blue-50" },
                { id: "giay", icon: Leaf, label: "Giấy/Carton", color: "text-amber-500", bg: "bg-amber-50" },
                { id: "kimloai", icon: Trash2, label: "Kim Loại", color: "text-gray-500", bg: "bg-gray-100" },
                { id: "honhop", icon: Trash2, label: "Hỗn Hợp", color: "text-emerald-500", bg: "bg-emerald-50" },
              ].map((type) => (
                <label key={type.id} className="relative cursor-pointer">
                  <input type="radio" name="wasteType" value={type.id} className="peer sr-only" required />
                  <div className={`p-4 rounded-xl border-2 border-gray-100 text-center hover:border-emerald-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50/50 transition-all ${type.bg}`}>
                    <type.icon className={`mx-auto mb-2 ${type.color}`} size={24} />
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity & Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Khối Lượng Ước Tính</label>
            <select className="w-full rounded-lg border-gray-200 border p-3 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="small">Nhỏ (&lt; 5kg)</option>
              <option value="medium">Vừa (5 - 15kg)</option>
              <option value="large">Lớn (&gt; 15kg)</option>
            </select>
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Mô Tả Thêm (Ghi chú cho người thu gom)</label>
            <textarea 
              rows={3} 
              className="w-full rounded-lg border-gray-200 border p-3 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              placeholder="Ví dụ: Gọi tôi 10 phút trước khi đến..."
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md shadow-emerald-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang Gửi...
              </span>
            ) : (
              <>
                <Upload size={20} />
                Tạo Báo Cáo Mới
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
