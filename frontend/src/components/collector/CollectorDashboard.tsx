"use client";
import React, { useState, useEffect } from "react";
import {
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  LogOut,
  Menu,
  X,
  Home,
  History,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { CollectorStats } from "./CollectorStats";
import { TaskList } from "./TaskList";
import { HistoryTab } from "./HistoryTab";
import { TaskDetailModal } from "./TaskDetailModal";

type Tab = "dashboard" | "tasks" | "history" | "settings";

interface CollectionTask {
  id: string;
  taskNumber: string;
  reportNumber: string;
  location: string;
  address: string;
  wasteType: string;
  estimatedWeight: number;
  status: "pending" | "assigned" | "on_the_way" | "collected";
  createdAt: string;
  latitude: number;
  longitude: number;
  citizenName: string;
  contactPhone: string;
}

interface CollectorStatsData {
  totalAssigned: number;
  totalOnTheWay: number;
  totalCollected: number;
  totalWeightKg: number;
  earnedToday: number;
}

export const CollectorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<CollectorStatsData>({
    totalAssigned: 8,
    totalOnTheWay: 3,
    totalCollected: 24,
    totalWeightKg: 1240,
    earnedToday: 450,
  });
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<CollectionTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "dashboard" as Tab, label: "Tổng Quan", icon: Home },
    { id: "tasks" as Tab, label: "Công Việc", icon: Truck },
    { id: "history" as Tab, label: "Lịch Sử", icon: History },
    { id: "settings" as Tab, label: "Cài Đặt", icon: Settings },
  ];

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    setTasks([
      {
        id: "1",
        taskNumber: "#T-001",
        reportNumber: "#R-1001",
        location: "123 Cầu Giấy, Hà Nội",
        address: "123 Cầu Giấy, Hà Nội",
        wasteType: "Hữu cơ",
        estimatedWeight: 45,
        status: "assigned",
        createdAt: "2026-03-23 09:00",
        latitude: 21.0285,
        longitude: 105.8542,
        citizenName: "Nguyễn Văn A",
        contactPhone: "0901234567",
      },
      {
        id: "2",
        taskNumber: "#T-002",
        reportNumber: "#R-1002",
        location: "456 Trần Duy Hưng, Hà Nội",
        address: "456 Trần Duy Hưng, Hà Nội",
        wasteType: "Tái chế",
        estimatedWeight: 30,
        status: "on_the_way",
        createdAt: "2026-03-23 10:30",
        latitude: 21.0333,
        longitude: 105.8656,
        citizenName: "Trần Thị B",
        contactPhone: "0902345678",
      },
      {
        id: "3",
        taskNumber: "#T-003",
        reportNumber: "#R-1003",
        location: "789 Hàng Bài, Hà Nội",
        address: "789 Hàng Bài, Hà Nội",
        wasteType: "Hữu cơ",
        estimatedWeight: 50,
        status: "assigned",
        createdAt: "2026-03-23 11:15",
        latitude: 21.0297,
        longitude: 105.8521,
        citizenName: "Lê Văn C",
        contactPhone: "0903456789",
      },
    ]);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleOpenModal = (task: CollectionTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedTask: CollectionTask) => {
    setTasks(
      tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    handleCloseModal();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <CollectorStats stats={stats} />;
      case "tasks":
        return (
          <TaskList
            tasks={tasks.filter((t) => t.status !== "collected")}
            onSelectTask={handleOpenModal}
          />
        );
      case "history":
        return (
          <HistoryTab
            tasks={tasks.filter((t) => t.status === "collected")}
          />
        );
      case "settings":
        return <SettingsPage />;
      default:
        return <CollectorStats stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 hidden md:flex`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0AA468] to-[#067D54] rounded-lg flex items-center justify-center text-white font-bold">
              🚚
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">WasteRec</h1>
                <p className="text-xs text-gray-500">Collector</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-green-50 text-[#0AA468]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
                title={!sidebarOpen ? tab.label : ""}
              >
                <Icon size={20} className={isActive ? "text-[#0AA468]" : "text-gray-400"} />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0AA468] to-[#067D54] flex items-center justify-center text-white font-bold text-sm">
                {user?.fullName?.charAt(0).toUpperCase() || "C"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || "Collector"}
                </p>
                <p className="text-xs text-gray-500 truncate">Người Thu Gom</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              text-red-600 hover:bg-red-50
            `}
            title={!sidebarOpen ? "Đăng Xuất" : ""}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Đăng Xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={isModalOpen}
          task={selectedTask}
          onClose={handleCloseModal}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
};

// Settings Page Component
const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cài Đặt</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và tùy chọn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg text-gray-900">Thông Tin Cá Nhân</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tên Đầy Đủ
            </label>
            <input
              type="text"
              defaultValue="Trần Văn D"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Số Điện Thoại
            </label>
            <input
              type="tel"
              defaultValue="0901234567"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Địa Chỉ
            </label>
            <input
              type="text"
              defaultValue="Hà Nội"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <button className="w-full py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all">
            Lưu Thay Đổi
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg text-gray-900">Thông Báo</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Task Mới</p>
              <p className="text-sm text-gray-600">Nhận thông báo task mới</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <hr />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Message</p>
              <p className="text-sm text-gray-600">Tin nhắn từ quản lý</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <hr />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">Email thống kê hàng tuần</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};