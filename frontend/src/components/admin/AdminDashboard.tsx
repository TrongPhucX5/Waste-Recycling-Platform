"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Truck,
  AlertCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { SystemActivity } from "./SystemActivity"; // ← ĐỔI ĐÂY
import { UserManagement } from "./UserManagement";
import { ReportsManagement } from "./ReportsManagement";
import { CollectionTasks } from "./CollectionTasks";
import { DisputesManagement } from "./DisputesManagement";

type Tab = "dashboard" | "users" | "reports" | "tasks" | "disputes" | "settings";

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    { id: "dashboard" as Tab, label: "Tổng Quan", icon: LayoutDashboard },
    { id: "reports" as Tab, label: "Quản Lý Báo Cáo", icon: FileText },
    { id: "tasks" as Tab, label: "Quản Lý Thu Gom", icon: Truck },
    { id: "disputes" as Tab, label: "Khiếu Nại", icon: AlertCircle },
    { id: "users" as Tab, label: "Quản Lý Người Dùng", icon: Users },
    { id: "settings" as Tab, label: "Cài Đặt", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <SystemActivity />; // ← ĐỔI ĐÂY
      case "reports":
        return <ReportsManagement />;
      case "tasks":
        return <CollectionTasks />;
      case "disputes":
        return <DisputesManagement />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <SettingsPage />;
      default:
        return <SystemActivity />;
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
              ♻️
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">WasteRec</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
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
                {user?.fullName?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || "Administrator"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
          </div>
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
    </div>
  );
};

// Settings Page Component
const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cài Đặt Hệ Thống</h1>
        <p className="text-gray-600 mt-2">Quản lý cấu hình và quy tắc hệ thống</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg text-gray-900">Cài Đặt Chung</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tên Hệ Thống
            </label>
            <input
              type="text"
              defaultValue="WasteRec Platform"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Hỗ Trợ
            </label>
            <input
              type="email"
              defaultValue="support@wasterec.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Điện Thoại Hỗ Trợ
            </label>
            <input
              type="tel"
              defaultValue="+84 123 456 789"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <button className="w-full py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all">
            Lưu Thay Đổi
          </button>
        </div>

        {/* Points Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg text-gray-900">Cấu Hình Điểm</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Điểm Báo Cáo Hợp Lệ
            </label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Điểm Phân Loại Đúng
            </label>
            <input
              type="number"
              defaultValue="20"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Điểm Xử Lý Nhanh (&lt;2h)
            </label>
            <input
              type="number"
              defaultValue="10"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <button className="w-full py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all">
            Cập Nhật Quy Tắc
          </button>
        </div>
      </div>
    </div>
  );
};