"use client";
import React from "react";
import { Award, Leaf, TrendingUp, Calendar, ChevronRight } from "lucide-react";

const mockLeaderboard = [
  { rank: 1, name: "Nguyễn Văn A", points: 2450, badge: "Thủ Lĩnh Xanh" },
  { rank: 2, name: "Trần Thị B", points: 1980, badge: "Hiệp Sĩ Môi Trường" },
  { rank: 3, name: "Lê Hoàng C", points: 1850, badge: "Chiến Binh Xanh" },
  { rank: 4, name: "Phạm D", points: 1720, badge: "" },
  { rank: 5, name: "Bạn (Nguyễn Dân)", points: 1240, badge: "", isMe: true },
];

const mockHistory = [
  { id: 1, date: "01/03/2026", reason: "Phân loại Nhựa đúng quy định", points: "+50" },
  { id: 2, date: "25/02/2026", reason: "Báo cáo thu gom lớn (>15kg)", points: "+100" },
  { id: 3, date: "20/02/2026", reason: "Duy trì hoạt động 4 tuần liên tiếp", points: "+200" },
];

export const RewardsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Cột 1: Thông tin cá nhân & Lịch sử */}
      <div className="col-span-1 lg:col-span-2 space-y-8">
        {/* Điểm số Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-8 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
          <Leaf className="absolute -bottom-6 -right-6 w-48 h-48 text-white opacity-10" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-emerald-50 font-medium tracking-wide uppercase text-sm mb-1">Tổng Điểm Tích Lũy</p>
              <div className="flex items-end gap-3">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">1,240</h1>
                <span className="text-xl font-medium text-emerald-100 pb-1.5 flex items-center gap-1"><Award size={24} /> GreenPoints</span>
              </div>
            </div>
            <button className="bg-white text-emerald-700 hover:bg-emerald-50 focus:ring-4 focus:ring-emerald-200 font-bold py-3 px-6 rounded-xl transition-all shadow-sm">
              Đổi Quà Ngay
            </button>
          </div>
          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Hạng Hiện Tại</p>
              <p className="font-semibold text-lg">Cư Dân Xanh</p>
            </div>
            <div>
              <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Tổng Rác Đã Thu</p>
              <p className="font-semibold text-lg">45 kg</p>
            </div>
          </div>
        </div>

        {/* Lịch sử điểm nhanh */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Lịch Sử Nhận Điểm Gần Đây
          </h3>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 uppercase-x">
            {mockHistory.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-emerald-100 text-emerald-600 p-2 rounded-full">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{item.reason}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                </div>
                <div className="text-emerald-600 font-bold text-lg bg-emerald-50 px-3 py-1 rounded-lg">
                  {item.points}
                </div>
              </div>
            ))}
            <button className="w-full text-center py-3 text-sm text-emerald-600 font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1">
              Xem Toàn Bộ Lịch Sử <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Cột 2: Bảng xếp hạng */}
      <div className="col-span-1 border border-gray-100 bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award size={20} className="text-amber-500" />
            Top Khu Vực
          </h3>
          <select className="text-sm bg-gray-50 border-none rounded-lg text-gray-600 outline-none p-2 pr-8 focus:ring-0">
            <option>Ba Đình</option>
            <option>Đống Đa</option>
            <option>Cầu Giấy</option>
          </select>
        </div>

        <div className="space-y-4">
          {mockLeaderboard.map((user) => (
            <div 
              key={user.rank} 
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${user.isMe ? "bg-amber-50 ring-1 ring-amber-200" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex justify-center items-center font-bold text-sm shadow-sm
                  ${user.rank === 1 ? "bg-amber-400 text-white" : 
                    user.rank === 2 ? "bg-slate-300 text-slate-800" : 
                    user.rank === 3 ? "bg-orange-300 text-orange-900" : 
                    "bg-gray-100 text-gray-600"}
                `}>
                  {user.rank}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    {user.name}
                    {user.isMe && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Bạn</span>}
                  </h4>
                  {user.badge && <p className="text-xs text-amber-600 font-medium">{user.badge}</p>}
                </div>
              </div>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-sm">{user.points} pt</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
