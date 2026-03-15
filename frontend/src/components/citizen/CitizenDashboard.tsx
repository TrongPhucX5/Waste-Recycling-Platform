"use client";
import React, { useState } from "react";
import { PlusCircle, ListTodo, Trophy } from "lucide-react";
import { ReportForm } from "./ReportForm";
import { ReportList } from "./ReportList";
import { RewardsTab } from "./RewardsTab";

type Tab = "report" | "history" | "rewards";

export const CitizenDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("report");

  const tabs = [
    { id: "report" as Tab, label: "Báo Cáo Rác", icon: PlusCircle },
    { id: "history" as Tab, label: "Nhật Ký & Trạng Thái", icon: ListTodo },
    { id: "rewards" as Tab, label: "Điểm & Xếp Hạng", icon: Trophy },
  ];

  return (
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
  );
};
