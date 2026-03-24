"use client";
import React from "react";
import {
  TrendingUp,
  Package,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Zap,
  Factory,
  Truck,
} from "lucide-react";

interface Stats {
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  totalWasteKg: number;
}

interface CapacityData {
  maxCapacityKg: number;
  currentUsageKg: number;
  wasteTypes: string[];
  serviceArea: string;
  operatingHours: string;
}

interface CollectionRequest {
  id: string;
  requestNumber: string;
  wasteType: string;
  quantity: number;
  location: string;
  status: "pending" | "approved" | "assigned" | "completed" | "rejected";
  createdAt: string;
  deadline: string;
}

interface Props {
  stats: Stats;
  capacity: CapacityData;
  requests: CollectionRequest[];
}

export const EnterpriseOverview: React.FC<Props> = ({
  stats,
  capacity,
  requests,
}) => {
  const usagePercent = (capacity.currentUsageKg / capacity.maxCapacityKg) * 100;

  const statCards = [
    {
      title: "Tổng Yêu Cầu",
      value: stats.totalRequests.toString(),
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Hoàn Thành",
      value: stats.completedRequests.toString(),
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Chờ Xử Lý",
      value: stats.pendingRequests.toString(),
      icon: AlertCircle,
      color: "bg-yellow-500",
    },
    {
      title: "Tổng Rác (kg)",
      value: stats.totalWasteKg.toLocaleString(),
      icon: BarChart3,
      color: "bg-purple-500",
    },
  ];

  const recentRequests = requests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng Quan Doanh Nghiệp</h1>
        <p className="text-gray-600 mt-2">
          Giám sát hoạt động thu gom và xử lý rác
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
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

      {/* Capacity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Usage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">📦 Sử Dụng Năng Lực</h2>
            <Factory size={20} className="text-gray-400" />
          </div>

          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {capacity.currentUsageKg.toLocaleString()} / {capacity.maxCapacityKg.toLocaleString()} kg
                </span>
                <span className="text-sm font-bold text-gray-900">{usagePercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-amber-500 transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>

            {/* Capacity Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-700">
                <strong>Khu Vực Phục Vụ:</strong> {capacity.serviceArea}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Giờ Hoạt Động:</strong> {capacity.operatingHours}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Loại Rác:</strong> {capacity.wasteTypes.join(", ")}
              </p>
            </div>

            {usagePercent > 80 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-700">
                  ⚠️ Năng lực gần hết. Vui lòng tăng cấu hình hoặc đóng yêu cầu mới.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">🎯 Thống Kê Nhanh</h2>
          <div className="space-y-4">
            {[
              {
                label: "Tỷ Lệ Hoàn Thành",
                value: ((stats.completedRequests / stats.totalRequests) * 100).toFixed(1) + "%",
                icon: "📊",
              },
              {
                label: "Trung Bình / Yêu Cầu",
                value: (stats.totalWasteKg / stats.totalRequests).toFixed(1) + " kg",
                icon: "⚖️",
              },
              {
                label: "Yêu Cầu Đang Chờ",
                value: stats.pendingRequests.toString(),
                icon: "⏳",
              },
              {
                label: "Năng Lực Còn Lại",
                value: (capacity.maxCapacityKg - capacity.currentUsageKg).toLocaleString() + " kg",
                icon: "📈",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Yêu Cầu Gần Đây</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Yêu Cầu
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Loại Rác
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Số Lượng
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Trạng Thái
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Ngày Tạo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {req.requestNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.wasteType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.quantity} kg</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "approved"
                          ? "bg-blue-100 text-blue-700"
                          : req.status === "assigned"
                          ? "bg-purple-100 text-purple-700"
                          : req.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};