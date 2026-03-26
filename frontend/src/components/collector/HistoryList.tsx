import React, { useEffect, useState } from "react";
import { Table, Badge } from "../ui";
import { collectorTaskApi, CollectionTask } from "../../lib/api/collectorTaskApi";

export const HistoryList: React.FC = () => {
  const [historyTasks, setHistoryTasks] = useState<CollectionTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await collectorTaskApi.getTasks("Collected");
      setHistoryTasks(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const tableData = historyTasks.map(task => ({
    id: task.id.substring(0, 8) + "...",
    type: task.report.categoryName || "Unknown",
    quantity: task.collectedWeightKg ? `${task.collectedWeightKg}kg` : "N/A",
    location: task.report.address,
    completedAt: task.completedAt ? new Date(task.completedAt).toLocaleString() : "N/A",
    status: task.status
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Completed Collections</h3>
        <Badge variant="success">Total: {historyTasks.length}</Badge>
      </div>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading history...</div>
      ) : (
        <Table 
          data={tableData}
          columns={[
            { label: "ID", key: "id", width: "10%" },
            { label: "Type", key: "type", width: "20%" },
            { label: "Quantity", key: "quantity", width: "15%" },
            { label: "Location", key: "location", width: "25%" },
            { label: "Completed At", key: "completedAt", width: "20%" },
            { 
              label: "Status", 
              key: "status",
              render: (val: string) => <Badge variant="success">{val}</Badge>
            }
          ]}
        />
      )}
    </div>
  );
};