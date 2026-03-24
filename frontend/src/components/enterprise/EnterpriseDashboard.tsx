"use client";
import { useState, useEffect } from "react";
import { LayoutDashboard, ClipboardList, Factory, Trophy, CheckSquare } from "lucide-react";
import { reportApi } from "../../lib/api/reportApi";
import { EnterpriseOverview } from "./EnterpriseOverview";
import { RequestManagement } from "./RequestManagement";
import { CapacitySettings } from "./CapacitySettings";
import { RewardConfiguration } from "./RewardConfiguration";
import { EnterpriseTaskManagement } from "./EnterpriseTaskManagement";
import { EnterpriseRequest } from "./types";

export const EnterpriseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState<EnterpriseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await reportApi.getEnterpriseAvailableReports(1, 10, "Pending");
        // Transform API response to EnterpriseRequest format
        const transformedRequests: EnterpriseRequest[] = response.reports.map((report: any, index: number) => ({
          id: index + 1, // Use index as ID since API doesn't provide sequential ID
          type: report.categoryName || "Unknown",
          quantity: "N/A", // API doesn't provide quantity
          location: report.address || "Unknown",
          status: report.status === "Pending" ? "PENDING" : report.status,
          date: new Date(report.createdAt).toLocaleDateString("en-CA"),
          requester: report.citizenName || "Unknown",
        }));
        setRequests(transformedRequests);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);

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
    { id: "tasks", label: "Task Assignment", icon: CheckSquare },
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
        {loading && activeTab === "requests" && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading reports...</p>
          </div>
        )}
        {error && activeTab === "requests" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {activeTab === "overview" && <EnterpriseOverview capacity={capacity} requests={requests} />}
        {activeTab === "requests" && (
            <RequestManagement 
                requests={requests} 
                onStatusChange={handleStatusChange} 
                onAssign={handleAssign}
            />
        )}
        {activeTab === "tasks" && <EnterpriseTaskManagement />}
        {activeTab === "capacity" && <CapacitySettings capacity={capacity} onUpdate={setCapacity} />}
        {activeTab === "rewards" && <RewardConfiguration initialRules={rewardRules} />}
      </div>
    </div>
  );
};