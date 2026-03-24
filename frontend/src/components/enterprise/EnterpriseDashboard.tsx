"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Factory,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { EnterpriseOverview } from "./EnterpriseOverview";
import { RequestManagement } from "./RequestManagement";
import { EnterpriseTaskManagement } from "./EnterpriseTaskManagement";
import { CapacitySettings } from "./CapacitySettings";
import { RewardConfiguration } from "./RewardConfiguration";

type Tab = "overview" | "requests" | "tasks" | "capacity" | "rewards" | "settings";

interface CollectionRequest {
  id: string;
  requestNumber: string;
  wasteType: string;
  quantity: number;
  location: string;
  status: "pending" | "approved" | "assigned" | "completed" | "rejected";
  createdAt: string;
  deadline: string;
  notes: string;
  citizenName: string;
  contactPhone: string;
  assignedCollector?: string;
}

interface CapacityData {
  maxCapacityKg: number;
  currentUsageKg: number;
  wasteTypes: string[];
  serviceArea: string;
  operatingHours: string;
}

interface RewardRule {
  id: string;
  wasteType: string;
  pointsPerKg: number;
  pricePerKg: number;
}

export const EnterpriseDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock Data
  const [requests, setRequests] = useState<CollectionRequest[]>([
    {
      id: "1",
      requestNumber: "#REQ-001",
      wasteType: "Plastic",
      quantity: 150,
      location: "District 1, HCMC",
      status: "pending",
      createdAt: "2026-03-23 08:30",
      deadline: "2026-03-25 18:00",
      notes: "Urgent collection needed",
      citizenName: "Nguyễn Văn A",
      contactPhone: "0901234567",
    },
    {
      id: "2",
      requestNumber: "#REQ-002",
      wasteType: "Paper",
      quantity: 200,
      location: "District 2, HCMC",
      status: "approved",
      createdAt: "2026-03-22 10:00",
      deadline: "2026-03-26 18:00",
      notes: "Standard collection",
      citizenName: "Trần Thị B",
      contactPhone: "0902345678",
      assignedCollector: "Collector 1",
    },
    {
      id: "3",
      requestNumber: "#REQ-003",
      wasteType: "Metal",
      quantity: 100,
      location: "District 3, HCMC",
      status: "assigned",
      createdAt: "2026-03-21 14:30",
      deadline: "2026-03-24 18:00",
      notes: "Metal waste only",
      citizenName: "Lê Văn C",
      contactPhone: "0903456789",
      assignedCollector: "Collector 2",
    },
  ]);

  const [capacity, setCapacity] = useState<CapacityData>({
    maxCapacityKg: 5000,
    currentUsageKg: 2450,
    wasteTypes: ["Plastic", "Paper", "Metal", "Glass"],
    serviceArea: "HCMC Districts 1-7",
    operatingHours: "06:00 - 22:00",
  });

  const [rewardRules, setRewardRules] = useState<RewardRule[]>([
    { id: "1", wasteType: "Plastic", pointsPerKg: 10, pricePerKg: 5000 },
    { id: "2", wasteType: "Paper", pointsPerKg: 8, pricePerKg: 4000 },
    { id: "3", wasteType: "Metal", pointsPerKg: 15, pricePerKg: 8000 },
    { id: "4", wasteType: "Glass", pointsPerKg: 5, pricePerKg: 2500 },
  ]);

  const [stats, setStats] = useState({
    totalRequests: 150,
    completedRequests: 98,
    pendingRequests: 12,
    totalWasteKg: 24500,
  });

  const tabs = [
    { id: "overview" as Tab, label: "Tổng Quan", icon: Home },
    { id: "requests" as Tab, label: "Yêu Cầu Thu Gom", icon: ClipboardList },
    { id: "tasks" as Tab, label: "Giao Task", icon: Truck },
    { id: "capacity" as Tab, label: "Năng Lực", icon: Factory },
    { id: "rewards" as Tab, label: "Phần Thưởng", icon: Trophy },
    { id: "settings" as Tab, label: "Cài Đặt", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleUpdateRequest = (updatedRequest: CollectionRequest) => {
    setRequests(
      requests.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
  };

  const handleDeleteRequest = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <EnterpriseOverview
            stats={stats}
            capacity={capacity}
            requests={requests}
          />
        );
      case "requests":
        return (
          <RequestManagement
            requests={requests}
            onUpdate={handleUpdateRequest}
            onDelete={handleDeleteRequest}
          />
        );
      case "tasks":
        return (
          <EnterpriseTaskManagement
            requests={requests}
            onUpdate={handleUpdateRequest}
          />
        );
      case "capacity":
        return (
          <CapacitySettings capacity={capacity} onUpdate={setCapacity} />
        );
      case "rewards":
        return (
          <RewardConfiguration
            rules={rewardRules}
            onUpdate={setRewardRules}
          />
        );
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <EnterpriseOverview
            stats={stats}
            capacity={capacity}
            requests={requests}
          />
        );
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
            <div className="w-10 h-10 bg-gradient-to-br from-[#0AA468] to-[#067D54] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              ♻️
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">WasteRec</h1>
                <p className="text-xs text-gray-500">Enterprise</p>
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
                {user?.fullName?.charAt(0).toUpperCase() || "E"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || "Enterprise"}
                </p>
                <p className="text-xs text-gray-500 truncate">Doanh Nghiệp</p>
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
            <h1 className="font-bold text-gray-900">Enterprise Portal</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Cài Đặt Doanh Nghiệp</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin công ty và tùy chọn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg text-gray-900">Thông Tin Công Ty</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tên Công Ty
            </label>
            <input
              type="text"
              defaultValue="Green Recycling Co."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Liên Hệ
            </label>
            <input
              type="email"
              defaultValue="contact@greenrecycling.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Số Điện Thoại
            </label>
            <input
              type="tel"
              defaultValue="+84 28 3824 1234"
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
              <p className="font-medium text-gray-900">Yêu Cầu Mới</p>
              <p className="text-sm text-gray-600">Thông báo yêu cầu mới</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <hr />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Task Hoàn Thành</p>
              <p className="text-sm text-gray-600">Thông báo task hoàn thành</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <hr />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Báo Cáo</p>
              <p className="text-sm text-gray-600">Báo cáo hàng tuần qua email</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};