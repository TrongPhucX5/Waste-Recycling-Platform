"use client";
import React, { useState } from "react";
import { LayoutDashboard, ClipboardList, Factory, Trophy } from "lucide-react";
import { EnterpriseOverview } from "./EnterpriseOverview";
import { RequestManagement } from "./RequestManagement";
import { CapacitySettings } from "./CapacitySettings";
import { RewardConfiguration } from "./RewardConfiguration";
import { EnterpriseRequest } from "./types";

// Mock Data
const MOCK_REQUESTS: EnterpriseRequest[] = [
  { id: 1, type: "Plastic", quantity: "50kg", location: "District 1, HCMC", status: "PENDING", date: "2024-03-10", requester: "Nguyen Van A" },
  { id: 2, type: "Paper", quantity: "20kg", location: "District 3, HCMC", status: "PENDING", date: "2024-03-11", requester: "Tran Thi B" },
  { id: 3, type: "Metal", quantity: "100kg", location: "Thu Duc City", status: "APPROVED", date: "2024-03-12", requester: "Le Van C" },
];

export const EnterpriseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  
  // Capacity State
  const [capacity, setCapacity] = useState({
    wasteTypes: ["plastic", "paper"],
    maxCapacity: 5000, 
    serviceArea: "HCMC"
  });

  // Reward Rules State
  const [rewardRules, setRewardRules] = useState([
     { type: "Plastic", pointsPerKg: 10 },
     { type: "Paper", pointsPerKg: 5 },
  ]);

  const handleStatusChange = (id: number, status: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const handleAssign = (requestId: number, collectorId: string) => {
      // Simulate assignment
      handleStatusChange(requestId, "ASSIGNED");
      alert(`Task assigned to collector ${collectorId}`);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "requests", label: "Requests", icon: ClipboardList },
    { id: "capacity", label: "Capacity", icon: Factory },
    { id: "rewards", label: "Rewards", icon: Trophy },
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
        {activeTab === "overview" && <EnterpriseOverview capacity={capacity} requests={requests} />}
        {activeTab === "requests" && (
            <RequestManagement 
                requests={requests} 
                onStatusChange={handleStatusChange} 
                onAssign={handleAssign}
            />
        )}
        {activeTab === "capacity" && <CapacitySettings capacity={capacity} onUpdate={setCapacity} />}
        {activeTab === "rewards" && <RewardConfiguration initialRules={rewardRules} />}
      </div>
    </div>
  );
};