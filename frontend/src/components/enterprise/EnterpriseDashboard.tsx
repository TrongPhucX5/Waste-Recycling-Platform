"use client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Factory,
  Trophy,
  CheckSquare,
  Users,
  ChartColumnBig,
  Settings,
  History,
} from "lucide-react";
import { reportApi } from "../../lib/api/reportApi";
import {
  enterpriseTaskApi,
  EnterpriseCollector,
  EnterpriseProfile,
  EnterpriseTaskStats,
  EnterpriseWasteCategory,
} from "../../lib/api/enterpriseTaskApi";
import {
  enterpriseRewardApi,
  EnterpriseRewardRule,
  UpdateEnterpriseRewardRuleItem,
} from "../../lib/api/enterpriseRewardApi";
import { useAuth } from "@/contexts/AuthContext";
import { EnterpriseOverview } from "./EnterpriseOverview";
import { RequestManagement } from "./RequestManagement";
import { CapacitySettings } from "./CapacitySettings";
import { RewardConfiguration } from "./RewardConfiguration";
import { EnterpriseTaskManagement } from "./EnterpriseTaskManagement";
import { CollectorsManagement } from "./CollectorsManagement";
import { ReportsAnalytics } from "./ReportsAnalytics";
import { EnterpriseWasteAnalytics } from "./EnterpriseWasteAnalytics";
import { ProfileSettings } from "./ProfileSettings";
import { EnterpriseHistoryTable } from "./EnterpriseHistoryTable";
import { EnterpriseRequest } from "./types";

interface EnterpriseDashboardProps {
  initialTab?: string;
}

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ initialTab = "dashboard" }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
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
  const [collectors, setCollectors] = useState<EnterpriseCollector[]>([]);
  const [taskStats, setTaskStats] = useState<EnterpriseTaskStats | null>(null);
  const [rewardRules, setRewardRules] = useState<EnterpriseRewardRule[]>([]);
  const [rewardLoading, setRewardLoading] = useState(true);
  const [rewardError, setRewardError] = useState<string | null>(null);

  // Capacity State for overview card
  const [capacity, setCapacity] = useState({
    wasteTypes: ["plastic", "paper"],
    maxCapacity: 5000,
    serviceArea: "HCMC",
  });

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
          status: (report.status || "Pending").toUpperCase(),
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
        const [profileResponse, wasteTypesResponse, rewardRulesResponse, statsResponse, collectorsResponse] = await Promise.all([
          enterpriseTaskApi.getProfile(),
          enterpriseTaskApi.getWasteTypes(),
          enterpriseRewardApi.getRewardRules(),
          enterpriseTaskApi.getStats(),
          enterpriseTaskApi.getAvailableCollectors(),
        ]);

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

        setRewardRules(rewardRulesResponse);
        setTaskStats(statsResponse);
        setCollectors(collectorsResponse);
      } catch (err) {
        setProfileError(err instanceof Error ? err.message : "Failed to load enterprise profile");
        console.error(err);
      } finally {
        setProfileLoading(false);
        setRewardLoading(false);
      }
    };

  const fetchTaskStats = async () => {
    try {
      const statsResponse = await enterpriseTaskApi.getStats();
      setTaskStats(statsResponse);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchEnterpriseProfile();
    fetchTaskStats();
  }, []);

  const refreshCollectors = async () => {
    try {
      const latestCollectors = await enterpriseTaskApi.getAvailableCollectors();
      setCollectors(latestCollectors);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshStats = async () => {
    try {
      const stats = await enterpriseTaskApi.getStats();
      setTaskStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (reportId: string, status: string) => {
    setRequests((prev) => prev.map((req) => (req.reportId === reportId ? { ...req, status } : req)));
  };

  const handleAssign = (reportId: string, collectorId: string) => {
    handleStatusChange(reportId, "Assigned");
    alert(`Task assigned to collector ${collectorId}`);
    refreshStats();
    refreshCollectors();
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

  const handleSaveRewardRules = async (rules: UpdateEnterpriseRewardRuleItem[]) => {
    setRewardLoading(true);
    setRewardError(null);

    try {
      await enterpriseRewardApi.updateRewardRules(rules);
      const latestRules = await enterpriseRewardApi.getRewardRules();
      setRewardRules(latestRules);
      alert("Reward rules updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update reward rules";
      setRewardError(message);
      console.error(err);
      alert(message);
    } finally {
      setRewardLoading(false);
    }
  };

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview of requests, capacity, and operations",
    },
    {
      id: "requests",
      label: "Collection Requests",
      icon: ClipboardList,
      description: "Review and approve incoming waste reports",
    },
    {
      id: "tasks",
      label: "Assign Tasks",
      icon: CheckSquare,
      description: "Assign approved requests to collectors",
    },
    {
      id: "history",
      label: "History",
      icon: History,
      description: "View completed task history",
    },
    {
      id: "collectors",
      label: "Collectors",
      icon: Users,
      description: "Monitor collector availability and workload",
    },
    {
      id: "capacity",
      label: "Capacity Management",
      icon: Factory,
      description: "Configure service area, categories, and capacity",
    },
    {
      id: "analytics",
      label: "Reports & Analytics",
      icon: ChartColumnBig,
      description: "Track waste statistics by area, type, and time trends",
    },
    {
      id: "rewards",
      label: "Reward Rules",
      icon: Trophy,
      description: "Set points and quality bonus by waste category",
    },
    {
      id: "settings",
      label: "Profile / Settings",
      icon: Settings,
      description: "Enterprise profile and account controls",
    },
  ];

  const activeConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-4 lg:h-fit">
        <div className="mb-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-emerald-100">Recycling Enterprise</p>
          <p className="mt-1 text-lg font-semibold">{enterpriseProfile.companyName || user?.fullName || "Enterprise"}</p>
          <p className="text-xs text-emerald-100">Operations Center</p>
        </div>

        <nav className="space-y-1" aria-label="Enterprise Sections">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-emerald-600" : "text-gray-400"} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="space-y-6">
        <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{activeConfig.label}</h2>
              <p className="mt-1 text-sm text-gray-600">{activeConfig.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-semibold text-amber-600">
                  {requests.filter((request) => request.status === "PENDING").length}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
                <p className="text-xs text-gray-500">Collectors</p>
                <p className="text-lg font-semibold text-sky-700">{collectors.length}</p>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-center col-span-2 sm:col-span-1">
                <p className="text-xs text-gray-500">Collected</p>
                <p className="text-lg font-semibold text-emerald-700">{taskStats?.totalCollected ?? 0}</p>
              </div>
            </div>
          </div>
        </header>

        {loading && activeTab === "requests" && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading reports...</p>
          </div>
        )}

        {error && activeTab === "requests" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {activeTab === "dashboard" && taskStats && <EnterpriseOverview capacity={capacity} requests={requests} stats={taskStats} />}

        {activeTab === "requests" && (
          <RequestManagement
            requests={requests}
            onStatusChange={handleStatusChange}
            onAssign={handleAssign}
          />
        )}

        {activeTab === "tasks" && <EnterpriseTaskManagement />}

        {activeTab === "history" && <EnterpriseHistoryTable />}

        {activeTab === "collectors" && (
          <CollectorsManagement
            collectors={collectors}
            loading={profileLoading}
            error={profileError}
            onRefresh={refreshCollectors}
          />
        )}

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

        {activeTab === "analytics" && <EnterpriseWasteAnalytics />}

        {activeTab === "rewards" && (
          <RewardConfiguration
            categories={categories}
            existingRules={rewardRules}
            onSave={handleSaveRewardRules}
            saving={rewardLoading}
            error={rewardError}
          />
        )}

        {activeTab === "settings" && (
          <ProfileSettings
            profile={enterpriseProfile}
            email={user?.email ?? ""}
          />
        )}
      </section>
    </div>
  );
};