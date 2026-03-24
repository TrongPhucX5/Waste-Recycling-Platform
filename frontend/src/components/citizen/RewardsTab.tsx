"use client";
import React, { useState } from "react";
import { Gift, TrendingUp, Award, Lock, Zap, Trophy } from "lucide-react";

export const RewardsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="bg-gradient-to-br from-[#0AA468] to-[#067D54] rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-white/70 mb-2">Điểm Hiện Tại</p>
            <p className="text-5xl font-bold">450</p>
          </div>
          <div>
            <p className="text-white/70 mb-2">Tháng Này</p>
            <p className="text-4xl font-bold">+200</p>
            <p className="text-white/70 text-sm">↑ từ tháng trước</p>
          </div>
          <div>
            <p className="text-white/70 mb-2">Hạng</p>
            <p className="text-4xl font-bold">45 / 1000</p>
            <p className="text-white/70 text-sm">🏅 Hạng 4%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "overview", label: "Tổng Quan", icon: TrendingUp },
          { id: "rewards", label: "Phần Thưởng", icon: Gift },
          { id: "leaderboard", label: "Xếp Hạng", icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#0AA468] text-[#0AA468]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon size={20} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* How to Earn Points */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              📊 Cách Kiếm Điểm
            </h3>
            <div className="space-y-3">
              {[
                { label: "Báo cáo hợp lệ", points: 30 },
                { label: "Phân loại đúng", points: 20 },
                { label: "Xử lý nhanh (<2h)", points: 10 },
                { label: "Ảnh chất lượng cao", points: 5 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100"
                >
                  <span className="text-gray-900 font-medium">{item.label}</span>
                  <span className="font-bold text-blue-600">+{item.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Points History */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              📈 Lịch Sử Điểm
            </h3>
            <div className="space-y-2">
              {[
                { label: "Báo cáo #123 hoàn thành", points: "+60", date: "Hôm nay" },
                { label: "Báo cáo #122 hoàn thành", points: "+50", date: "Hôm nay" },
                { label: "Khiếu nại bị từ chối", points: "-10", date: "2 ngày trước" },
                { label: "Báo cáo #121 hoàn thành", points: "+45", date: "3 ngày trước" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-gray-900 font-medium">{item.label}</p>
                    <p className="text-xs text-gray-600">{item.date}</p>
                  </div>
                  <p
                    className={`font-bold ${
                      item.points.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.points}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === "rewards" && (
        <div className="space-y-4">
          {[
            {
              id: 1,
              name: "Voucher 50.000đ",
              cost: 100,
              icon: "🎟️",
              description: "Sử dụng tại các cửa hàng đối tác",
              locked: false,
            },
            {
              id: 2,
              name: "Voucher 150.000đ",
              cost: 250,
              icon: "🎫",
              description: "Sử dụng tại các cửa hàng đối tác",
              locked: false,
            },
            {
              id: 3,
              name: "Tài Khoản VIP 1 Tháng",
              cost: 500,
              icon: "👑",
              description: "Đặc quyền VIP toàn bộ hệ thống",
              locked: true,
            },
            {
              id: 4,
              name: "Cây Xanh Trồng Thực Tế",
              cost: 1000,
              icon: "🌱",
              description: "Dự án trồng cây tại Việt Nam",
              locked: true,
            },
          ].map((reward) => (
            <div
              key={reward.id}
              className={`border-2 rounded-xl p-6 transition-all ${
                reward.locked
                  ? "border-gray-200 bg-gray-50 opacity-60"
                  : "border-[#0AA468] bg-green-50 hover:shadow-lg"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{reward.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900">
                    {reward.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {reward.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="font-bold text-[#0AA468] text-lg">
                      {reward.cost} pts
                    </span>
                    {reward.locked ? (
                      <button disabled className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-semibold flex items-center gap-2 cursor-not-allowed">
                        <Lock size={16} />
                        Chưa đủ
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-[#0AA468] text-white rounded-lg font-semibold hover:bg-[#088F5A] transition-all">
                        Đổi Ngay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {["Toàn Quốc", "Hà Nội", "TP HCM", "Đà Nẵng"].map((city) => (
              <button
                key={city}
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-[#0AA468] hover:text-white transition-all"
              >
                {city}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {[
              { rank: 1, name: "Nguyễn Văn B", points: 2850, medal: "🥇" },
              { rank: 2, name: "Trần Thị C", points: 2100, medal: "🥈" },
              { rank: 3, name: "Lê Văn D", points: 1950, medal: "🥉" },
              { rank: 4, name: "Hoàng Văn E", points: 1800, medal: "" },
              { rank: 45, name: "Bạn", points: 450, medal: "👤", highlight: true },
            ].map((user) => (
              <div
                key={user.rank}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  user.highlight
                    ? "bg-green-50 border-[#0AA468] border-2"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="text-2xl font-bold w-8 text-center">
                  {user.medal || `#${user.rank}`}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{user.name}</p>
                </div>
                <p className="font-bold text-[#0AA468]">{user.points} pts</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};