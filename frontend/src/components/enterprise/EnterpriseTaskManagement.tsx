"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Button,
  Badge,
  Select,
  Modal,
} from "../ui";
import {
  enterpriseTaskApi,
  EnterpriseCollectionTask,
  EnterpriseCollector,
  EnterpriseTaskStats,
} from "../../lib/api/enterpriseTaskApi";
import { AlertCircle, MapPin, User, CheckCircle } from "lucide-react";

export const EnterpriseTaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<EnterpriseCollectionTask[]>([]);
  const [collectors, setCollectors] = useState<EnterpriseCollector[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<EnterpriseCollectionTask | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [taskStats, setTaskStats] = useState<EnterpriseTaskStats>({
    totalTasks: 0,
    totalUnassigned: 0,
    totalAssigned: 0,
    totalOnTheWay: 0,
    totalCollected: 0,
    totalWeightKg: 0,
  });

  // Fetch tasks and collectors on component mount
  useEffect(() => {
    fetchData();
  }, [filterStatus, showUnassignedOnly]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, collectorsData, statsData] = await Promise.all([
        enterpriseTaskApi.getTasks(
          filterStatus !== "all" ? filterStatus : undefined,
          showUnassignedOnly
        ),
        enterpriseTaskApi.getAvailableCollectors(),
        enterpriseTaskApi.getStats(),
      ]);
      setTasks(tasksData);
      setCollectors(collectorsData);
      setTaskStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (task: EnterpriseCollectionTask) => {
    setSelectedTask(task);
    setSelectedCollector("");
    setAssignModalOpen(true);
  };

  const handleAssignConfirm = async () => {
    if (!selectedTask || !selectedCollector) {
      alert("Please select a collector");
      return;
    }

    try {
      await enterpriseTaskApi.assignCollector(selectedTask.id, selectedCollector);
      alert("Collector assigned successfully!");
      setAssignModalOpen(false);
      setSelectedTask(null);
      setSelectedCollector("");
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to assign collector");
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Assigned: "bg-blue-100 text-blue-800",
      OnTheWay: "bg-yellow-100 text-yellow-800",
      Collected: "bg-green-100 text-green-800",
    };
    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  const unassignedCount = tasks.filter((t: EnterpriseCollectionTask) => !t.collectorId).length;

  const mapTasks = tasks.filter(
    (task) =>
      task.report.latitude !== null &&
      task.report.longitude !== null &&
      !Number.isNaN(task.report.latitude) &&
      !Number.isNaN(task.report.longitude)
  );

  const mapUrl = useMemo(() => {
    if (!mapTasks.length) return "";
    const centerLat = mapTasks[0].report.latitude;
    const centerLon = mapTasks[0].report.longitude;
    const url = new URL("https://staticmap.openstreetmap.de/staticmap.php");
    url.searchParams.set("center", `${centerLat},${centerLon}`);
    url.searchParams.set("zoom", "13");
    url.searchParams.set("size", "900x320");
    url.searchParams.set("markers", `${centerLat},${centerLon},red-pushpin`);
    mapTasks.slice(1, 8).forEach((task) => {
      url.searchParams.append(
        "markers",
        `${task.report.latitude},${task.report.longitude},blue-pushpin`
      );
    });
    return url.toString();
  }, [mapTasks]);

  const mapLink = useMemo(() => {
    if (!mapTasks.length) return "https://www.openstreetmap.org";
    const first = mapTasks[0].report;
    return `https://www.openstreetmap.org/?mlat=${first.latitude}&mlon=${first.longitude}#map=13/${first.latitude}/${first.longitude}`;
  }, [mapTasks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Collector Assignment Management
        </h2>
        <p className="text-gray-600">
          {unassignedCount > 0 && (
            <span className="font-semibold">
              ⚠️ {unassignedCount} unassigned task(s)
            </span>
          )}
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 uppercase font-medium">Total Tasks</p>
          <p className="text-3xl font-bold text-gray-900 mt-3">{taskStats.totalTasks}</p>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 uppercase font-medium">Unassigned</p>
          <p className="text-3xl font-bold text-red-600 mt-3">{taskStats.totalUnassigned}</p>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 uppercase font-medium">On The Way</p>
          <p className="text-3xl font-bold text-yellow-700 mt-3">{taskStats.totalOnTheWay}</p>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 uppercase font-medium">Collected</p>
          <p className="text-3xl font-bold text-emerald-600 mt-3">{taskStats.totalCollected}</p>
        </Card>
      </div>

      {mapTasks.length > 0 && (
        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bản đồ vị trí thu gom</h3>
              <p className="text-sm text-gray-500 mt-1">
                Hiển thị {mapTasks.length} vị trí thu gom hiện tại. Nhấn vào bản đồ để xem chi tiết.
              </p>
            </div>
            <span className="text-xs uppercase tracking-wide text-gray-400">
              WRP-113
            </span>
          </div>
          <a href={mapLink} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-gray-200">
            <img
              src={mapUrl}
              alt="Enterprise collection task locations"
              className="w-full h-[320px] object-cover"
              loading="lazy"
            />
          </a>
          <p className="text-xs text-gray-500 mt-2">
            Chỉ hiển thị tối đa 8 vị trí trên bản đồ.
          </p>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <Select
              options={[
                { value: "all", label: "Tất cả trạng thái (All)" },
                { value: "Assigned", label: "Đã gán (Assigned)" },
                { value: "OnTheWay", label: "Trên đường (On the Way)" },
                { value: "Collected", label: "Hoàn thành (Collected)" },
              ]}
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnassignedOnly}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowUnassignedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Chỉ hiển thị chưa được gán (Unassigned Only)
              </span>
            </label>
          </div>

          <div className="flex items-end">
            <Button
              onClick={fetchData}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Đang tải dữ liệu..." : "Tải lại dữ liệu (Refresh)"}
            </Button>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100 flex items-center justify-between">
            <p>💡 <b>Lưu ý:</b> Nút <strong>Gán Nhiệm Vụ (Assign)</strong> được gắn ở từng công việc trong danh sách phía bên dưới.</p>
        </div>
      </Card>

      {/* Tasks List */}
      <Card className="overflow-hidden mt-4">
        <div className="border-b border-gray-100 px-6 py-4">
          <h4 className="font-semibold text-gray-900">Collection Tasks Directory</h4>
        </div>

        {tasks.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-500">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p>No tasks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-3">Task Details</th>
                  <th className="px-6 py-3">Location & Contact</th>
                  <th className="px-6 py-3">Collector</th>
                  <th className="px-6 py-3">Status & Data</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {tasks.map((task: EnterpriseCollectionTask) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 align-top">
                      <p className="font-semibold text-gray-900">Task {task.id.substring(0, 8)}</p>
                      <p className="text-xs text-gray-500 mt-1">Date: {new Date(task.assignedAt).toLocaleDateString()}</p>
                      {task.report.categoryName && (
                        <div className="mt-2">
                          <Badge className="bg-purple-100 text-purple-800">{task.report.categoryName}</Badge>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top max-w-xs">
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 truncate" title={task.report.address}>{task.report.address}</p>
                          <p className="text-xs text-gray-500">📍 {task.report.latitude.toFixed(4)}, {task.report.longitude.toFixed(4)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{task.report.citizenName}</p>
                          {task.report.citizenPhone && <p className="text-xs text-gray-500">{task.report.citizenPhone}</p>}
                        </div>
                      </div>
                      {task.report.description && (
                        <p className="text-xs text-gray-600 mt-2 border-t border-gray-100 pt-2 truncate" title={task.report.description}>
                          Note: {task.report.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      {task.collectorId ? (
                        <div>
                          <p className="font-medium text-blue-700 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> {task.collectorName}
                          </p>
                          {task.collectorPhone && <p className="text-xs text-gray-500">{task.collectorPhone}</p>}
                        </div>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Unassigned</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-2 items-start">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        {task.status.toLowerCase() === "collected" && task.collectedWeightKg && (
                          <div className="text-xs text-green-700 font-medium bg-green-50 px-2 py-1 rounded inline-block border border-green-200">
                            Weight: {task.collectedWeightKg} kg
                            {task.notes && <p className="text-green-600 truncate max-w-[120px]" title={task.notes}>{task.notes}</p>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {!task.collectorId && task.status.toLowerCase() === "assigned" ? (
                        <Button
                          onClick={() => handleAssignClick(task)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Assign
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Assign Collector Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedTask(null);
          setSelectedCollector("");
        }}
        title="Assign Collector to Task"
        onConfirm={handleAssignConfirm}
        confirmText="Assign"
      >
        <div className="space-y-4">
          {selectedTask && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm font-medium text-blue-900">Task Details</p>
                <p className="text-sm text-blue-800 mt-1">
                  Location: {selectedTask.report.address}
                </p>
                <p className="text-sm text-blue-800">
                  Citizen: {selectedTask.report.citizenName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Collector
                </label>
                {collectors.length === 0 ? (
                  <p className="text-sm text-red-600">
                    No collectors available for this enterprise
                  </p>
                ) : (
                  <Select
                    options={collectors.map((c) => ({
                      value: c.id,
                      label: `${c.name} (${c.taskCount} active task${c.taskCount !== 1 ? "s" : ""})`,
                    }))}
                    value={selectedCollector}
                    onChange={(e) => setSelectedCollector(e.target.value)}
                    placeholder="Choose a Collector..."
                  />
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
