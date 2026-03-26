"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, History, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";

// Dữ liệu lịch sử giả định
const mockHistory = [
  { id: 1, date: "01/03/2026, 14:30", type: "earn", reason: "Phân loại Nhựa đúng quy định", points: 50, status: "Thành công" },
  { id: 2, date: "28/02/2026, 09:15", type: "spend", reason: "Đổi Voucher Highlands Coffee 50K", points: 500, status: "Thành công" },
  { id: 3, date: "25/02/2026, 16:45", type: "earn", reason: "Báo cáo thu gom lớn (>15kg)", points: 100, status: "Thành công" },
  { id: 4, date: "20/02/2026, 10:00", type: "earn", reason: "Duy trì hoạt động 4 tuần liên tiếp", points: 200, status: "Thành công" },
  { id: 5, date: "15/02/2026, 08:30", type: "spend", reason: "Quyên góp Quỹ Trồng Rừng", points: 300, status: "Thành công" },
  { id: 6, date: "10/02/2026, 11:20", type: "earn", reason: "Mời bạn bè tham gia WasteRec", points: 150, status: "Thành công" },
];

export default function PointsHistoryPage() {
  const [filter, setFilter] = useState("all");

  const filteredHistory = filter === "all" 
    ? mockHistory 
    : mockHistory.filter(h => h.type === filter);

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/citizen" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200 shadow-sm">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <History className="text-emerald-500" /> Lịch Sử Điểm Thưởng
              </h1>
              <p className="text-sm text-gray-500 mt-1">Theo dõi các giao dịch nhận và đổi điểm của bạn</p>
            </div>
          </div>
          
          {/* Nút Lọc (Filter) */}
          <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm w-fit">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === "all" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilter("earn")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${filter === "earn" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:text-emerald-600"}`}
            >
              <TrendingUp size={16} /> Nhận vào
            </button>
            <button 
              onClick={() => setFilter("spend")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${filter === "spend" ? "bg-orange-50 text-orange-700" : "text-gray-500 hover:text-orange-600"}`}
            >
              <TrendingDown size={16} /> Tiêu dùng
            </button>
          </div>
        </div>

        {/* Bảng Danh Sách */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Giao Dịch</th>
                  <th className="p-4 font-semibold">Thời Gian</th>
                  <th className="p-4 font-semibold">Trạng Thái</th>
                  <th className="p-4 font-semibold text-right">Số Điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.type === "earn" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"}`}>
                          {item.type === "earn" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                        <span className="font-semibold text-gray-800">{item.reason}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" /> {item.date}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        {item.status}
                      </span>
                    </td>
                    <td className={`p-4 font-bold text-right ${item.type === "earn" ? "text-emerald-600" : "text-orange-600"}`}>
                      {item.type === "earn" ? "+" : "-"}{item.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Trạng thái trống nếu filter không có dữ liệu */}
            {filteredHistory.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Không tìm thấy giao dịch nào.
              </div>
            )}
          </div>
          
          {/* Phân trang (Mock) */}
          <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">
              Tải thêm giao dịch cũ hơn...
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}