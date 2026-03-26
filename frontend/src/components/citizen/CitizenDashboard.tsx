"use client";
import React, { useState } from "react";
import { PlusCircle, ListTodo, Trophy } from "lucide-react";
import { ReportForm } from "./ReportForm";
import { ReportList } from "./ReportList";
import { RewardsTab } from "./RewardsTab";

// 1. Nhập các component dùng chung vừa tạo
import { NotificationCenter, UserProfileMenu } from "@/components/shared";

type Tab = "report" | "history" | "rewards";

export const CitizenDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("report");

  const tabs = [
    { id: "report" as Tab, label: "Báo Cáo Rác", icon: PlusCircle },
    { id: "history" as Tab, label: "Nhật Ký & Trạng Thái", icon: ListTodo },
    { id: "rewards" as Tab, label: "Điểm & Xếp Hạng", icon: Trophy },
  ];

  return (
    // Sử dụng flex-col và gap để tạo khoảng cách giữa Header và khung nội dung
    <div className="flex flex-col gap-6">
      
      {/* --- PHẦN MỚI: HEADER CỦA DASHBOARD --- */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Bảng Điều Khiển Công Dân</h1>
          <p className="text-sm text-gray-500">Quản lý báo cáo và điểm thưởng của bạn</p>
        </div>
        
        {/* Nơi chứa Chuông thông báo và Profile */}
        <div className="flex items-center gap-4">
          <NotificationCenter />
          {/* Đường kẻ dọc phân cách cho đẹp mắt */}
          <div className="h-8 w-px bg-gray-200"></div> 
          <UserProfileMenu />
        </div>
      </div>
      {/* ------------------------------------- */}

      {/* Phần khung nội dung cũ của bạn giữ nguyên */}
      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-100 bg-gray-50/50">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                    ${
                      isActive
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon size={18} className={isActive ? "text-emerald-500" : "text-gray-400"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === "report" && <ReportForm onSubmit={() => setActiveTab("history")} />}
          {activeTab === "history" && <ReportList />}
          {activeTab === "rewards" && <RewardsTab />}
        </div>
      </div>
    </div>
  );
};