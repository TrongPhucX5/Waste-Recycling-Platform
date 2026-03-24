"use client";
import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  ListTodo,
  Trophy,
  TrendingUp,
  Award,
  Zap,
  Bell,
  User,
  MessageSquare,
  Settings,
  HelpCircle,
  Map,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ReportForm } from "./ReportForm";
import { ReportList } from "./ReportList";
import { RewardsTab } from "./RewardsTab";
import { NotificationsPage } from "./NotificationsPage";
import { ProfilePage } from "./ProfilePage";
import { FeedbackPage } from "./FeedbackPage";
import { NearYouPage } from "./NearYouPage";

type Tab =
  | "dashboard"
  | "report"
  | "history"
  | "rewards"
  | "notifications"
  | "profile"
  | "feedback"
  | "nearby"
  | "settings"
  | "support";

interface DashboardStats {
  totalReports: number;
  completedReports: number;
  todayPoints: number;
  weeklyTrend: number;
  unlockedBadges: number;
  totalBadges: number;
  currentPoints: number;
  currentRank: number;
  totalUsers: number;
}

interface ActivityItem {
  id: string;
  action: string;
  location: string;
  time: string;
  points: string;
  icon: string;
}

interface WasteTypeData {
  label: string;
  count: number;
  color: string;
  percent: number;
}

interface PointsTrendData {
  day: string;
  points: number;
}

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 12,
    completedReports: 8,
    todayPoints: 60,
    weeklyTrend: 5,
    unlockedBadges: 3,
    totalBadges: 10,
    currentPoints: 450,
    currentRank: 45,
    totalUsers: 1000,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError("Không thể lấy vị trí của bạn");
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/citizen/dashboard', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();
        // setStats(data.stats);
        // setActivities(data.activities);

        // Mock data
        setStats({
          totalReports: 12,
          completedReports: 8,
          todayPoints: 60,
          weeklyTrend: 5,
          unlockedBadges: 3,
          totalBadges: 10,
          currentPoints: 450,
          currentRank: 45,
          totalUsers: 1000,
        });

        setActivities([
          {
            id: "1",
            action: "Báo cáo rác được thu gom",
            location: "123 Cầu Giấy",
            time: "2 giờ trước",
            points: "+50",
            icon: "✅",
          },
          {
            id: "2",
            action: "Báo cáo rác mới được ghi nhận",
            location: "456 Trần Duy Hưng",
            time: "5 giờ trước",
            points: "+30",
            icon: "📝",
          },
          {
            id: "3",
            action: "Đạt huy hiệu 'Nhà Báo Cáo'",
            location: "Hệ thống",
            time: "1 ngày trước",
            points: "+100",
            icon: "🏅",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Main tabs (top nav)
  const mainTabs = [
    { id: "dashboard" as Tab, label: "Tổng Quan", icon: TrendingUp },
    { id: "report" as Tab, label: "Báo Cáo Rác", icon: PlusCircle },
    { id: "history" as Tab, label: "Nhật Ký", icon: ListTodo },
    { id: "rewards" as Tab, label: "Điểm & Xếp Hạng", icon: Trophy },
  ];

  // Secondary tabs (bottom nav)
  const secondaryTabs = [
    { id: "notifications" as Tab, label: "Thông Báo", icon: Bell },
    { id: "nearby" as Tab, label: "Gần Khu Vực", icon: Map },
    { id: "profile" as Tab, label: "Hồ Sơ", icon: User },
    { id: "feedback" as Tab, label: "Khiếu Nại", icon: MessageSquare },
    { id: "settings" as Tab, label: "Cài Đặt", icon: Settings },
    { id: "support" as Tab, label: "Hỗ Trợ", icon: HelpCircle },
  ];

  const allTabs = [...mainTabs, ...secondaryTabs];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#0AA468] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#0AA468] to-[#067D54] rounded-2xl shadow-xl overflow-hidden text-white p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* User Welcome */}
          <div className="sm:col-span-2">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Xin chào, {user?.fullName || "Người Dùng"} 👋
            </h1>
            <p className="text-white/80 text-lg">
              Cùng nhau bảo vệ môi trường qua các báo cáo rác thải
            </p>
            {userLocation && (
              <p className="text-white/70 text-sm mt-2">
                📍 Vị trí: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </p>
            )}
          </div>

          {/* Stats Card */}
          <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <p className="text-white/70 text-sm mb-1">Điểm của bạn</p>
              <p className="text-4xl font-bold">{stats.currentPoints}</p>
              <p className="text-white/70 text-xs mt-2">
                Hạng: {stats.currentRank}/{stats.totalUsers} 🏅
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <PlusCircle size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Báo Cáo</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalReports}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {stats.completedReports} đã hoàn thành
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Điểm Hôm Nay</p>
              <p className="text-2xl font-bold text-gray-900">+{stats.todayPoints}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Từ 2 báo cáo</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Xu Hướng</p>
              <p className="text-2xl font-bold text-gray-900">
                ↑ {stats.weeklyTrend}%
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Tuần này so với tuần trước</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Award size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Thành Tích</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.unlockedBadges}/{stats.totalBadges}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Huy hiệu mở khóa</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
        {/* Main Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10">
          <nav className="flex overflow-x-auto px-4 sm:px-6" aria-label="Main Tabs">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-shrink-0 whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all
                    ${
                      isActive
                        ? "border-[#0AA468] text-[#0AA468] bg-green-50/50"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-100/50 px-4 sm:px-6 overflow-x-auto">
          <nav className="flex gap-1 py-2">
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-shrink-0 whitespace-nowrap px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all
                    ${
                      isActive
                        ? "bg-[#0AA468] text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 min-h-[600px]">
          {activeTab === "dashboard" && (
            <DashboardOverview stats={stats} activities={activities} />
          )}
          {activeTab === "report" && (
            <ReportForm
              onSubmit={() => setActiveTab("history")}
              userLocation={userLocation}
            />
          )}
          {activeTab === "history" && <ReportList />}
          {activeTab === "rewards" && <RewardsTab />}
          {activeTab === "notifications" && <NotificationsPage />}
          {activeTab === "profile" && <ProfilePage />}
          {activeTab === "feedback" && <FeedbackPage />}
          {activeTab === "nearby" && (
            <NearYouPage userLocation={userLocation} />
          )}
          {activeTab === "settings" && <SettingsPage />}
          {activeTab === "support" && <SupportPage />}
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
interface DashboardOverviewProps {
  stats: DashboardStats;
  activities: ActivityItem[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  activities,
}) => {
  const wasteTypeData: WasteTypeData[] = [
    { label: "Hữu cơ", count: 6, color: "bg-green-500", percent: 50 },
    { label: "Tái chế", count: 4, color: "bg-blue-500", percent: 33 },
    { label: "Nguy hiểm", count: 2, color: "bg-red-500", percent: 17 },
  ];

  const pointsTrendData: PointsTrendData[] = [
    { day: "Tuần 1", points: 80 },
    { day: "Tuần 2", points: 120 },
    { day: "Tuần 3", points: 150 },
    { day: "Tuần 4", points: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Type Distribution */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Loại Rác Báo Cáo
          </h3>
          <div className="space-y-3">
            {wasteTypeData.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.count} báo cáo
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points Trend */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Điểm Trong Tháng
          </h3>
          <div className="space-y-2">
            {pointsTrendData.map((item) => (
              <div key={item.day}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.day}
                  </span>
                  <span className="text-sm font-bold text-purple-600">
                    {item.points} pts
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{
                      width: `${(item.points / 150) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-lg text-gray-900 mb-4">
          Hoạt Động Gần Đây
        </h3>
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-green-600">{activity.points}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Không có hoạt động nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Settings Page Component
const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Cài Đặt</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Thông Báo</p>
            <p className="text-sm text-gray-600">Nhận thông báo về báo cáo</p>
          </div>
          <input type="checkbox" defaultChecked className="w-6 h-6" />
        </div>

        <hr />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Email Hàng Tuần</p>
            <p className="text-sm text-gray-600">Nhận báo cáo hàng tuần</p>
          </div>
          <input type="checkbox" defaultChecked className="w-6 h-6" />
        </div>

        <hr />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Chế Độ Tối</p>
            <p className="text-sm text-gray-600">Sử dụng giao diện tối</p>
          </div>
          <input type="checkbox" className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Support Page Component
const SupportPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Hỗ Trợ & FAQ</h1>

      <div className="space-y-3">
        {[
          {
            q: "Làm sao để báo cáo rác?",
            a: "Nhấp vào tab 'Báo Cáo Rác', chụp ảnh, chọn vị trí và gửi",
          },
          {
            q: "Tôi nhận được bao nhiêu điểm?",
            a: "Báo cáo hợp lệ: 30 pts, Phân loại đúng: 20 pts, Xử lý nhanh: 10 pts",
          },
          {
            q: "Làm sao để liên hệ hỗ trợ?",
            a: "Vui lòng gửi email tới support@wasterec.com",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <p className="font-bold text-gray-900 mb-2">❓ {item.q}</p>
            <p className="text-gray-600">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};