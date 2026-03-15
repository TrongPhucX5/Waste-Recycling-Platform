"use client";
import React, { useState } from "react";
import { Clock, CheckCircle2, Truck, AlertCircle, MessageSquare, MapPin } from "lucide-react";

type ReportStatus = "Pending" | "Accepted" | "Assigned" | "Collected";

interface Report {
  id: string;
  date: string;
  type: string;
  weight: string;
  address: string;
  status: ReportStatus;
}

const mockReports: Report[] = [
  { id: "RC-1042", date: "15/03/2026 - 14:30", type: "Nhựa & Giấy", weight: "5kg", address: "123 Ngọc Khánh, Ba Đình", status: "Pending" },
  { id: "RC-1038", date: "12/03/2026 - 09:15", type: "Kim Loại", weight: "12kg", address: "123 Ngọc Khánh, Ba Đình", status: "Accepted" },
  { id: "RC-1025", date: "08/03/2026 - 16:45", type: "Hỗn Hợp", weight: "8kg", address: "123 Ngọc Khánh, Ba Đình", status: "Assigned" },
  { id: "RC-0991", date: "01/03/2026 - 10:00", type: "Nhựa", weight: "3kg", address: "123 Ngọc Khánh, Ba Đình", status: "Collected" },
];

const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
  switch (status) {
    case "Pending":
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><Clock size={14} /> Chờ Duyệt</span>;
    case "Accepted":
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"><CheckCircle2 size={14} /> Đã Nhận</span>;
    case "Assigned":
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"><Truck size={14} /> Đang Đến Trạm</span>;
    case "Collected":
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle2 size={14} /> Hoàn Thành</span>;
    default:
      return null;
  }
};

export const ReportList: React.FC = () => {
  const [feedbackOpen, setFeedbackOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Nhật Ký Thu Gom</h2>
          <p className="text-gray-500 mt-1">Theo dõi trạng thái các yêu cầu thu gom rác của bạn.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockReports.map((report) => (
          <div key={report.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between md:justify-start gap-4">
                  <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{report.id}</span>
                  <StatusBadge status={report.status} />
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-500 text-xs mb-1">Thời gian tạo</span>
                    <span className="font-medium text-gray-800">{report.date}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs mb-1">Phân loại</span>
                    <span className="font-medium text-gray-800">{report.type}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs mb-1">Khối lượng</span>
                    <span className="font-medium text-gray-800">{report.weight}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="truncate">{report.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 md:border-l md:pl-6">
                <button
                  onClick={() => setFeedbackOpen(feedbackOpen === report.id ? null : report.id)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                  title="Gửi Khiếu Nại / Phản Hồi"
                >
                  <AlertCircle size={18} /> Khiếu Nại
                </button>
              </div>
            </div>

            {/* Feedback Form Expandable */}
            {feedbackOpen === report.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <MessageSquare size={16} className="text-red-500" /> Gửi Phản Hồi cho {report.id}
                </h4>
                <textarea 
                  className="w-full text-sm rounded-lg border-gray-200 border p-3 focus:ring-2 focus:ring-red-500 outline-none resize-none bg-white"
                  rows={2}
                  placeholder="Ví dụ: Người thu gom đến trễ hơn cam kết, thái độ không tốt..."
                ></textarea>
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => setFeedbackOpen(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-500/30">Gửi Phản Hồi</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
