"use client";
import React, { useState } from "react";
import { Bell, Check, X, Filter } from "lucide-react";

export const NotificationsPage: React.FC = () => {
  const [filterType, setFilterType] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "report",
      title: "Báo cáo #123 được thu gom",
      description: "Rác thải tại Cầu Giấy đã được thu gom thành công",
      icon: "✅",
      time: "2 giờ trước",
      read: false,
      points: "+60",
    },
    {
      id: 2,
      type: "reward",
      title: "Nhận phần thưởng",
      description: "Bạn có thể nhận voucher 50k với 100 điểm",
      icon: "🎁",
      time: "5 giờ trước",
      read: false,
    },
    {
      id: 3,
      type: "system",
      title: "Cập nhật hệ thống",
      description: "Chúng tôi vừa thêm tính năng AI phân loại rác",
      icon: "🔔",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 4,
      type: "report",
      title: "Báo cáo #122 đang xử lý",
      description: "Người thu gom Nguyễn Văn B đang trên đường",
      icon: "🚚",
      time: "3 ngày trước",
      read: true,
    },
  ];

  const filterOptions = [
    { id: "all", label: "Tất cả" },
    { id: "report", label: "Báo Cáo" },
    { id: "reward", label: "Phần Thưởng" },
    { id: "system", label: "Hệ Thống" },
  ];

  const filteredNotifications =
    filterType === "all"
      ? notifications
      : notifications.filter((n) => n.type === filterType);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thông Báo</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>
        <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Check size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setFilterType(option.id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              filterType === option.id
                ? "bg-[#0AA468] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                notif.read
                  ? "bg-white border-gray-200"
                  : "bg-blue-50 border-blue-200 border-2"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{notif.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{notif.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notif.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                </div>
                {notif.points && (
                  <div className="text-right shrink-0">
                    <p className="font-bold text-green-600">{notif.points}</p>
                  </div>
                )}
                {!notif.read && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 shrink-0" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">Không có thông báo</p>
          </div>
        )}
      </div>
    </div>
  );
};