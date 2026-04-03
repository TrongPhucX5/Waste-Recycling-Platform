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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0AA468", "#F59E0B", "#3B82F6", "#8B5CF6"];

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
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
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
        setupDataFromAPI(apiData);
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

  const setupDataFromAPI = (apiData: DashboardStats) => {
    // 1. Map dữ liệu LineChart
    if (apiData.monthlyTraffic && apiData.monthlyTraffic.length > 0) {
      const chartData = apiData.monthlyTraffic.map((item) => ({
        name: item.month,
        reports: item.count,
      }));
      setTrafficData(chartData);
    }

    // 2. Map dữ liệu PieChart (C# đã trả về chuẩn name và value)
    if (apiData.userDistribution && apiData.userDistribution.length > 0) {
      setPieData(apiData.userDistribution);
    }

    // 3. Map dữ liệu Logs
    if (apiData.recentLogs && apiData.recentLogs.length > 0) {
      setLogs(apiData.recentLogs);
    }
  };

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
      value: data.pendingComplaints.toLocaleString(), // Dùng tạm, nếu C# có pending xử lý riêng thì map lại
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              📊 Lưu Lượng Báo Cáo
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Xu hướng báo cáo rác theo tháng
            </p>
          </div>

          <div className="h-80 w-full">
            {trafficData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      backgroundColor: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    name="Báo cáo"
                    stroke="#0AA468"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#0AA468" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Không có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">👥 Phân Bố Tài Khoản</h2>
            <p className="text-sm text-gray-600 mt-1">Phân bố người dùng</p>
          </div>

          <div className="h-64 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Không có dữ liệu</div>
            )}
          </div>

          {/* Legend */}
          {pieData.length > 0 && (
            <div className="mt-6 space-y-3">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {entry.name}: <strong className="text-gray-900">{entry.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">🕐 Log Hoạt Động Gần Đây</h2>
          <p className="text-sm text-gray-600 mt-1">Các thao tác trong hệ thống</p>
        </div>

        <div className="space-y-2">
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm ${
                    log.type === "report"
                      ? "bg-green-100 text-green-600"
                      : log.type === "warning"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {log.type === "report"
                    ? "📝"
                    : log.type === "warning"
                    ? "⚠️"
                    : "ℹ️"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{log.user}</p>
                  <p className="text-xs text-gray-600">{log.action}</p>
                </div>

                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full shrink-0 font-medium">
                  {log.time}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">Chưa có hoạt động</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};