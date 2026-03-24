"use client";
import React, { useState } from "react";
import { AlertCircle, Upload, Send } from "lucide-react";

export const FeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState({
    reportId: "",
    type: "",
    description: "",
    priority: "medium",
    attachments: [] as string[],
  });

  const [submitted, setSubmitted] = useState(false);

  const complaintTypes = [
    { id: "not_collected", label: "Rác chưa được thu gom" },
    { id: "wrong_type", label: "Thu gom sai loại rác" },
    { id: "behavior", label: "Nhân viên bất lịch sự" },
    { id: "damage", label: "Thiệt hại tài sản" },
    { id: "other", label: "Khác" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Call API
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        reportId: "",
        type: "",
        description: "",
        priority: "medium",
        attachments: [],
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gửi Phản Hồi / Khiếu Nại
        </h1>
        <p className="text-gray-600">
          Giúp chúng tôi cải thiện dịch vụ bằng cách báo cáo các vấn đề
        </p>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-900">Gửi thành công!</p>
            <p className="text-sm text-green-700">
              Chúng tôi sẽ kiểm tra và xử lý khiếu nại của bạn trong 24 giờ
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Report Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Chọn Báo Cáo
          </label>
          <select
            value={formData.reportId}
            onChange={(e) =>
              setFormData({ ...formData, reportId: e.target.value })
            }
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
          >
            <option value="">-- Chọn báo cáo --</option>
            <option value="123">Báo cáo #123 - Cầu Gi���y</option>
            <option value="122">Báo cáo #122 - Trần Duy Hưng</option>
            <option value="121">Báo cáo #121 - Hàng Bài</option>
          </select>
        </div>

        {/* Complaint Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Loại Khiếu Nại
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {complaintTypes.map((type) => (
              <label
                key={type.id}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="type"
                  value={type.id}
                  checked={formData.type === type.id}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                  className="w-4 h-4 text-[#0AA468]"
                />
                <span className="text-sm text-gray-900 font-medium">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Mức Độ Ưu Tiên
          </label>
          <div className="flex gap-3">
            {[
              { value: "low", label: "Thấp", color: "text-blue-600" },
              { value: "medium", label: "Trung bình", color: "text-yellow-600" },
              { value: "high", label: "Cao", color: "text-red-600" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="priority"
                  value={option.value}
                  checked={formData.priority === option.value}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-4 h-4 text-[#0AA468]"
                />
                <span className={`text-sm font-medium ${option.color}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Mô Tả Chi Tiết
          </label>
          <textarea
            placeholder="Vui lòng mô tả chi tiết vấn đề của bạn..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={5}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468] resize-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Đính Kèm Chứng Cứ (Tùy Chọn)
          </label>
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors">
            <input type="file" multiple className="hidden" />
            <Upload size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">
              Chọn hoặc kéo ảnh/video vào đây
            </p>
            <p className="text-xs text-gray-600 mt-1">
              JPG, PNG, MP4 tối đa 10MB
            </p>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Send size={20} />
          Gửi Khiếu Nại
        </button>
      </form>
    </div>
  );
};