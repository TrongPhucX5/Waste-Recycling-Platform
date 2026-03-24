"use client";
import React from "react";
import { Truck, Clock, CheckCircle, BarChart3, Zap } from "lucide-react";

interface CollectorStatsData {
  totalAssigned: number;
  totalOnTheWay: number;
  totalCollected: number;
  totalWeightKg: number;
  earnedToday: number;
}

interface Props {
  stats: CollectorStatsData;
}

export const CollectorStats: React.FC<Props> = ({ stats }) => {
  const statCards = [
    {
      title: "Công Việc Được Giao",
      value: stats.totalAssigned.toString(),
      icon: Truck,
      color: "bg-blue-500",
    },
    {
      title: "Đang Trên Đường",
      value: stats.totalOnTheWay.toString(),
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Đã Thu Gom",
      value: stats.totalCollected.toString(),
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Tổng Trọng Lượng (kg)",
      value: stats.totalWeightKg.toLocaleString(),
      icon: BarChart3,
      color: "bg-purple-500",
    },
    {
      title: "Kiếm Được Hôm Nay",
      value: `₫${stats.earnedToday.toLocaleString()}`,
      icon: Zap,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng Quan</h1>
        <p className="text-gray-600 mt-2">
          Xem tổng quan công việc và thống kê hôm nay
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2 font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            📊 Hiệu Suất Trong Tuần
          </h2>
          <div className="space-y-4">
            {[
              { day: "Thứ 2", completed: 4 },
              { day: "Thứ 3", completed: 5 },
              { day: "Thứ 4", completed: 3 },
              { day: "Thứ 5", completed: 6 },
              { day: "Thứ 6", completed: 4 },
              { day: "Thứ 7", completed: 2 },
            ].map((item) => (
              <div key={item.day} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-20">
                  {item.day}
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(item.completed / 6) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {item.completed}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            🎯 Thống Kê Nhanh
          </h2>
          <div className="space-y-4">
            {[
              { label: "Trung bình điểm/ngày", value: "85.3" },
              { label: "Hiệu suất hoàn thành", value: "94.5%" },
              { label: "Thời gian trung bình", value: "12 phút" },
              { label: "Xếp hạng", value: "Top 15%" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};