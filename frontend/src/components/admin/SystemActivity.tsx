"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu khớp chính xác với C# DTO
interface DashboardStats {
  totalUsers: number;
  totalReports: number;
  pendingComplaints: number;
  totalWasteWeight: number;
  completedReports: number;
  activeCollectors: number;
  acceptedReports: number;
  monthlyTraffic: { month: string; count: number }[];
  userDistribution: { name: string; value: number }[];
  recentLogs: { user: string; action: string; time: string; type: string }[];
}

interface StatItemConfig {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

// Dữ liệu mặc định (trống) trong lúc chờ gọi API
const DEFAULT_DATA: DashboardStats = {
  totalUsers: 0,
  totalReports: 0,
  pendingComplaints: 0,
  totalWasteWeight: 0,
  completedReports: 0,
  activeCollectors: 0,
  acceptedReports: 0,
  monthlyTraffic: [],
  userDistribution: [],
  recentLogs: [],
};

export const SystemActivity: React.FC = () => {
  const [data, setData] = useState<DashboardStats>(DEFAULT_DATA);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/admin/users/stats");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        // Check format trả về của bạn (thường bọc trong "data": { ... })
        const apiData = json.data ? json.data : json; 

        setData(apiData);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra API.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Primary Stats
  const primaryStats: StatItemConfig[] = [
    {
      title: "Tổng người dùng",
      value: data.totalUsers.toLocaleString(),
      icon: <Users size={24} className="text-white" />,
      color: "bg-blue-500",
    },
    {
      title: "Tổng báo cáo",
      value: data.totalReports.toLocaleString(),
      icon: <FileText size={24} className="text-white" />,
      color: "bg-green-500",
    },
    {
      title: "Báo cáo chờ xử lý",
      value: data.pendingComplaints.toLocaleString(),
      icon: <Clock size={24} className="text-white" />,
      color: "bg-yellow-500",
    },
    {
      title: "Rác tái chế (kg)",
      value: Math.round(data.totalWasteWeight).toLocaleString(),
      icon: <BarChart3 size={24} className="text-white" />,
      color: "bg-amber-500",
    },
  ];

  // Secondary Stats
  const secondaryStats: StatItemConfig[] = [
    {
      title: "Báo cáo hoàn thành",
      value: data.completedReports.toLocaleString(),
      icon: <CheckCircle size={24} className="text-white" />,
      color: "bg-emerald-500",
    },
    {
      title: "Báo cáo chấp nhận",
      value: data.acceptedReports.toLocaleString(),
      icon: <Zap size={24} className="text-white" />,
      color: "bg-purple-500",
    },
    {
      title: "Thu gom hoạt động",
      value: data.activeCollectors.toLocaleString(),
      icon: <TrendingUp size={24} className="text-white" />,
      color: "bg-indigo-500",
    },
    {
      title: "Khiếu nại đang xử lý",
      value: data.pendingComplaints.toLocaleString(), 
      icon: <AlertTriangle size={24} className="text-white" />,
      color: "bg-red-500",
    },
  ];

  const StatCard = ({ icon, title, value, color }: StatItemConfig) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2 font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Giám Sát Hệ Thống</h1>
          <p className="text-gray-600 mt-2">
            Tổng quan hoạt động toàn bộ nền tảng CWCRP
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 font-medium">
            Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
          </p>
          {loading && <p className="text-xs text-blue-600 mt-1">Đang tải dữ liệu...</p>}
          {error && <p className="text-xs text-red-600 mt-1">⚠️ {error}</p>}
        </div>
      </div>

      {/* Primary Stats (Hàng 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Secondary Stats (Hàng 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>
    </div>
  );
};