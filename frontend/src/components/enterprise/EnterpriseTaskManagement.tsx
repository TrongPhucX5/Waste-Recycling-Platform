"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  Select,
  Modal,
} from "../ui";
import { enterpriseTaskApi, EnterpriseCollectionTask, EnterpriseCollector } from "../../lib/api/enterpriseTaskApi";
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

  // Fetch tasks and collectors on component mount
  useEffect(() => {
    fetchData();
  }, [filterStatus, showUnassignedOnly]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, collectorsData] = await Promise.all([
        enterpriseTaskApi.getTasks(
          filterStatus !== "all" ? filterStatus : undefined,
          showUnassignedOnly
        ),
        enterpriseTaskApi.getAvailableCollectors(),
      ]);
      setTasks(tasksData);
      setCollectors(collectorsData);
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
                { value: "all", label: "All Statuses" },
                { value: "Assigned", label: "Assigned" },
                { value: "OnTheWay", label: "On the Way" },
                { value: "Collected", label: "Collected" },
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
                Show Unassigned Only
              </span>
            </label>
          </div>

          <div className="flex items-end">
            <Button
              onClick={fetchData}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      <Card className="p-6 overflow-x-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task: EnterpriseCollectionTask) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
              >
                {/* Task Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Task {task.id.substring(0, 8)}...
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      {task.report.categoryName && (
                        <Badge className="bg-purple-100 text-purple-800">
                          {task.report.categoryName}
                        </Badge>
                      )}
                      {!task.collectorId && (
                        <Badge className="bg-red-100 text-red-800">
                          Unassigned
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(task.assignedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Report Details */}
                <div className="bg-gray-50 rounded p-3 mb-3 space-y-2 text-sm">
                  <div className="flex gap-2 items-start">
                    <MapPin className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {task.report.address}
                      </p>
                      <p className="text-gray-600">
                        📍 {task.report.latitude.toFixed(6)}, {task.report.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start">
                    <User className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {task.report.citizenName}
                      </p>
                      {task.report.citizenPhone && (
                        <p className="text-gray-600">{task.report.citizenPhone}</p>
                      )}
                    </div>
                  </div>

                  {task.report.description && (
                    <div className="text-gray-700 border-t border-gray-200 pt-2 mt-2">
                      <p className="font-medium mb-1">Description:</p>
                      <p>{task.report.description}</p>
                    </div>
                  )}
                </div>

                {/* Collector Assignment Info */}
                {task.collectorId ? (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3 text-sm">
                    <p className="font-medium text-blue-900 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Assigned Collector
                    </p>
                    <p className="text-blue-800 mt-1">{task.collectorName}</p>
                    {task.collectorPhone && (
                      <p className="text-blue-700">{task.collectorPhone}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-3 text-sm">
                    <p className="font-medium text-amber-900 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      No collector assigned
                    </p>
                  </div>
                )}

                {/* Collection Data (if completed) */}
                {task.status === "Collected" && task.collectedWeightKg && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-3 text-sm">
                    <p className="font-medium text-green-900">Collection Completed</p>
                    <p className="text-green-800 mt-1">
                      Weight: {task.collectedWeightKg} kg
                    </p>
                    {task.notes && (
                      <p className="text-green-700 mt-1">Notes: {task.notes}</p>
                    )}
                  </div>
                )}

                {/* Action Button */}
                {!task.collectorId && task.status === "Assigned" && (
                  <Button
                    onClick={() => handleAssignClick(task)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Assign Collector
                  </Button>
                )}
              </div>
            ))}
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
