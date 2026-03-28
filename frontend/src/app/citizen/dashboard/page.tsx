"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, FileText, Trophy, TrendingUp, Clock, CheckCircle, Camera, MapPin, Users, Award, Target } from "lucide-react";

interface RecentReport {
  id: string;
  type: string;
  status: "pending" | "accepted" | "assigned" | "collected";
  date: string;
  points?: number;
}

interface Stats {
  currentPoints: number;
  completedReports: number;
  pendingReports: number;
  thisMonthReports: number;
}

export default function CitizenDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    currentPoints: 850,
    completedReports: 45,
    pendingReports: 3,
    thisMonthReports: 12
  });

  const [recentReports, setRecentReports] = useState<RecentReport[]>([
    { id: "1", type: "Rác tái chế", status: "pending", date: "2 giờ trước", points: 15 },
    { id: "2", type: "Rác hữu cơ", status: "collected", date: "Hôm qua", points: 10 },
    { id: "3", type: "Rác nguy hại", status: "assigned", date: "2 ngày trước", points: 20 },
    { id: "4", type: "Rác tái chế", status: "collected", date: "3 ngày trước", points: 15 },
    { id: "5", type: "Rác hữu cơ", status: "pending", date: "4 ngày trước", points: 10 }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        currentPoints: prev.currentPoints + Math.floor(Math.random() * 5)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "accepted": return "bg-blue-100 text-blue-700";
      case "assigned": return "bg-purple-100 text-purple-700";
      case "collected": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Đang chờ";
      case "accepted": return "Đã chấp nhận";
      case "assigned": return "Đã phân công";
      case "collected": return "Đã thu gom";
      default: return status;
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bảng Điều Khiển</h1>
              <p className="text-gray-600">Chào mừng trở lại! Hãy cùng bảo vệ môi trường</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs text-gray-500">Hiện tại</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.currentPoints)}</div>
            <div className="text-sm text-gray-600">Điểm thưởng</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Tổng cộng</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.completedReports}</div>
            <div className="text-sm text-gray-600">Đã hoàn thành</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-xs text-gray-500">Đang xử lý</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingReports}</div>
            <div className="text-sm text-gray-600">Báo cáo</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">Tháng này</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.thisMonthReports}</div>
            <div className="text-sm text-gray-600">Báo cáo mới</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/citizen/create-report"
              className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 transition-colors group"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Camera className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Tạo báo cáo</span>
            </Link>

            <Link
              href="/citizen/reports"
              className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Xem lịch sử</span>
            </Link>

            <Link
              href="/citizen/rewards"
              className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 transition-colors group"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Đổi thưởng</span>
            </Link>

            <Link
              href="/locations"
              className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">Tra cứu điểm</span>
            </Link>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Báo cáo gần đây</h2>
            <Link
              href="/citizen/reports"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.type}</p>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.points && (
                    <span className="text-sm font-semibold text-emerald-600">+{report.points} điểm</span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {getStatusLabel(report.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Thành tích của bạn</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-gray-900">Chiến thần xanh</span>
              </div>
              <p className="text-sm text-gray-600">Top 10 người dùng tích cực tháng này</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">Siêu phân loại</span>
              </div>
              <p className="text-sm text-gray-600">Phân loại đúng 95% báo cáo</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-gray-900">Thành viên vàng</span>
              </div>
              <p className="text-sm text-gray-600">Đạt 1000 điểm thưởng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link
        href="/citizen/create-report"
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center group z-40"
      >
        <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </Link>
    </div>
  );
}
