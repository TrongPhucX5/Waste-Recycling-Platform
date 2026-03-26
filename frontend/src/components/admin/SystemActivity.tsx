"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  BarChart3,
  Activity,
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

const COLORS = ["#0AA468", "#F59E0B", "#3B82F6"];

// 🟢 MOCK DATA
const MOCK_DATA = {
  totalUsers: 3456,
  totalReports: 1247,
  pendingComplaints: 45,
  totalWasteWeight: 52840,
  completedReports: 892,
  activeCollectors: 234,
  acceptedReports: 643,
  monthlyTraffic: [
    { month: "T1", count: 120, userCount: 340 },
    { month: "T2", count: 145, userCount: 380 },
    { month: "T3", count: 130, userCount: 360 },
    { month: "T4", count: 165, userCount: 420 },
    { month: "T5", count: 180, userCount: 450 },
    { month: "T6", count: 150, userCount: 400 },
    { month: "T7", count: 200, userCount: 480 },
  ],
  userDistribution: [
    { role: "citizen", count: 2100 },
    { role: "collector", count: 890 },
    { role: "enterprise", count: 466 },
  ],
  recentLogs: [
    {
      user: "Nguyễn Văn A",
      action: "Tạo báo cáo mới #R-1247",
      time: "2 phút",
      type: "report",
    },
    {
      user: "Trần Thị B",
      action: "Cập nhật trạng thái task #T-892",
      time: "5 phút",
      type: "report",
    },
    {
      user: "Lê Văn C",
      action: "Khiếu nại báo cáo #R-1240",
      time: "15 phút",
      type: "warning",
    },
    {
      user: "Admin",
      action: "Phê duyệt doanh nghiệp mới",
      time: "1 giờ",
      type: "info",
    },
  ],
};

interface DashboardStats {
  totalUsers: number;
  totalReports: number;
  pendingComplaints: number;
  totalWasteWeight: number;
  completedReports?: number;
  activeCollectors?: number;
  acceptedReports?: number;
  monthlyTraffic?: { month: string; count: number; userCount?: number }[];
  userDistribution?: { role: string; count: number }[];
  recentLogs?: { user: string; action: string; time: string; type: string }[];
}

interface StatItemConfig {
  title: string;
  value: string;
  icon: React.ReactNode; // ✅ FIX: Change to React.ReactNode
  color: string;
}

export const SystemActivity: React.FC = () => {
  const [data, setData] = useState<DashboardStats>(MOCK_DATA);
  const [error, setError] = useState<string | null>(null);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Setup mock data immediately
    setupMockData();

    // Then try to fetch real data
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/admin/users/stats");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        if (json.data) {
          setData(json.data);
          setupDataFromAPI(json.data);
          setError(null);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("API không khả dụng - dùng dữ liệu demo");
      }
    };

    fetchStats();
  }, []);

  const setupMockData = () => {
    const chartData = MOCK_DATA.monthlyTraffic!.map((item) => ({
      name: item.month,
      reports: item.count,
      users: item.userCount || 0,
    }));
    setTrafficData(chartData);

    const pieChartData = MOCK_DATA.userDistribution!.map((item) => ({
      name:
        item.role === "citizen"
          ? "Người dân"
          : item.role === "collector"
          ? "Người thu gom"
          : "Doanh nghiệp",
      value: item.count,
    }));
    setPieData(pieChartData);

    setLogs(MOCK_DATA.recentLogs!);
  };

  const setupDataFromAPI = (apiData: any) => {
    if (apiData.monthlyTraffic && apiData.monthlyTraffic.length > 0) {
      const chartData = apiData.monthlyTraffic.map((item: any) => ({
        name: item.month,
        reports: item.count,
        users: item.userCount || 0,
      }));
      setTrafficData(chartData);
    }

    if (apiData.userDistribution && apiData.userDistribution.length > 0) {
      const pieChartData = apiData.userDistribution.map((item: any) => ({
        name:
          item.role === "citizen"
            ? "Người dân"
            : item.role === "collector"
            ? "Người thu gom"
            : "Doanh nghiệp",
        value: item.count,
      }));
      setPieData(pieChartData);
    }

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
      value: data.completedReports?.toLocaleString() || "0",
      icon: <CheckCircle size={24} className="text-white" />,
      color: "bg-emerald-500",
    },
    {
      title: "Báo cáo chấp nhận",
      value: data.acceptedReports?.toLocaleString() || "0",
      icon: <Zap size={24} className="text-white" />,
      color: "bg-purple-500",
    },
    {
      title: "Thu gom hoạt động",
      value: data.activeCollectors?.toLocaleString() || "0",
      icon: <TrendingUp size={24} className="text-white" />,
      color: "bg-indigo-500",
    },
    {
      title: "Khiếu nại đang xử lý",
      value: data.pendingComplaints?.toLocaleString() || "0",
      icon: <AlertTriangle size={24} className="text-white" />,
      color: "bg-red-500",
    },
  ];

  const StatCard = ({
    icon,
    title,
    value,
    color,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
  }) => (
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
            Tổng quan hoạt động toàn bộ nền tảng WasteRec
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 font-medium">
            Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
          </p>
          {error && (
            <p className="text-xs text-amber-600 mt-1">ℹ️ {error}</p>
          )}
        </div>
      </div>

      {/* Primary Stats (Hàng 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryStats.map((stat, idx) => (
          <StatCard
            key={idx}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {/* Secondary Stats (Hàng 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat, idx) => (
          <StatCard
            key={idx}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              📊 Lưu Lượng Báo Cáo & Truy Cập
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Xu hướng báo cáo rác và người dùng (7 tháng)
            </p>
          </div>

          <div className="h-80 w-full">
            {trafficData.length > 0 && (
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
                    dataKey="users"
                    name="Người dùng"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#3B82F6" }}
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
            {pieData.length > 0 && (
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