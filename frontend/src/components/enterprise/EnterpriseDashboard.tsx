"use client";
import { useState, useEffect } from "react";
import { LayoutDashboard, ClipboardList, Factory, Trophy, CheckSquare } from "lucide-react";
import { reportApi } from "../../lib/api/reportApi";
import { enterpriseTaskApi, EnterpriseWasteCategory, EnterpriseProfile } from "../../lib/api/enterpriseTaskApi";
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
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [enterpriseProfile, setEnterpriseProfile] = useState<EnterpriseProfile>({
    id: "",
    companyName: "",
    serviceArea: "",
    capacityKgPerDay: null,
  });
  const [categories, setCategories] = useState<EnterpriseWasteCategory[]>([]);
  const [acceptedWasteTypeIds, setAcceptedWasteTypeIds] = useState<number[]>([]);

  // Capacity State for overview card
  const [capacity, setCapacity] = useState({
    wasteTypes: ["plastic", "paper"],
    maxCapacity: 5000,
    serviceArea: "HCMC",
  });

  // Reward Rules State
  const [rewardRules, setRewardRules] = useState([
    { type: "Plastic", pointsPerKg: 10 },
    { type: "Paper", pointsPerKg: 5 },
  ]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await reportApi.getEnterpriseAvailableReports(1, 10, "Pending");
        const transformedRequests: EnterpriseRequest[] = response.reports.map((report: any) => ({
          reportId: report.id,
          type: report.categoryName || "Unknown",
          quantity: "N/A",
          location: report.address || "Unknown",
          status: report.status || "Pending",
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

    const fetchEnterpriseProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const profileResponse = await enterpriseTaskApi.getProfile();
        const wasteTypesResponse = await enterpriseTaskApi.getWasteTypes();

        setEnterpriseProfile({
          id: profileResponse.id,
          companyName: profileResponse.companyName,
          serviceArea: profileResponse.serviceArea ?? "",
          capacityKgPerDay: profileResponse.capacityKgPerDay,
        });
        setCategories(wasteTypesResponse.allCategories);
        setAcceptedWasteTypeIds(wasteTypesResponse.acceptedIds);

        setCapacity({
          wasteTypes: wasteTypesResponse.allCategories
            .filter((category) => wasteTypesResponse.acceptedIds.includes(category.id))
            .map((category) => category.name),
          maxCapacity: profileResponse.capacityKgPerDay ?? 0,
          serviceArea: profileResponse.serviceArea ?? "",
        });
      } catch (err) {
        setProfileError(err instanceof Error ? err.message : "Failed to load enterprise profile");
        console.error(err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchReports();
    fetchEnterpriseProfile();
  }, []);

  const handleStatusChange = (reportId: string, status: string) => {
    setRequests((prev) => prev.map((req) => (req.reportId === reportId ? { ...req, status } : req)));
  };

  const handleAssign = (reportId: string, collectorId: string) => {
    handleStatusChange(reportId, "Assigned");
    alert(`Task assigned to collector ${collectorId}`);
  };

  const handleSaveCapacity = async (payload: {
    serviceArea: string;
    capacityKgPerDay: number | null;
    wasteCategoryIds: number[];
  }) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      await enterpriseTaskApi.updateProfile({
        serviceArea: payload.serviceArea,
        capacityKgPerDay: payload.capacityKgPerDay,
      });
      await enterpriseTaskApi.updateWasteTypes({ wasteCategoryIds: payload.wasteCategoryIds });

      setEnterpriseProfile((prev) => ({
        ...prev,
        serviceArea: payload.serviceArea,
        capacityKgPerDay: payload.capacityKgPerDay,
      }));
      setAcceptedWasteTypeIds(payload.wasteCategoryIds);
      setCapacity({
        wasteTypes: categories
          .filter((category) => payload.wasteCategoryIds.includes(category.id))
          .map((category) => category.name),
        maxCapacity: payload.capacityKgPerDay ?? 0,
        serviceArea: payload.serviceArea,
      });
      alert("Enterprise profile updated successfully.");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to save enterprise settings");
      console.error(err);
      alert(profileError || "Failed to save enterprise settings.");
    } finally {
      setProfileLoading(false);
    }
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
        {activeTab === "capacity" && (
          <CapacitySettings
            profile={enterpriseProfile}
            categories={categories}
            acceptedIds={acceptedWasteTypeIds}
            onSave={handleSaveCapacity}
            saving={profileLoading}
            error={profileError}
          />
        )}
        {activeTab === "rewards" && <RewardConfiguration initialRules={rewardRules} />}
      </div>
    </div>
  );
};