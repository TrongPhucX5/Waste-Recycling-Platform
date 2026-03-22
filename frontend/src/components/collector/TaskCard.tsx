import React from "react";
import { Badge, Button } from "../ui";
import { MapPin, Clock } from "lucide-react";
import { CollectionTask } from "../../lib/api/collectorTaskApi";

interface TaskCardProps {
  task: CollectionTask;
  onUpdateStatus: (task: CollectionTask) => void;
}

const statusColors: Record<string, "warning" | "info" | "success" | "default"> = {
  Assigned: "warning",
  OnTheWay: "info",
  Collected: "success",
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{task.report.categoryName || "Unknown Waste"}</h3>
          <p className="text-sm text-gray-500">From: {task.report.citizenName}</p>
        </div>
        <Badge variant={statusColors[task.status] || "default"}>
          {task.status.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          {task.report.address}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          Assigned: {new Date(task.assignedAt).toLocaleString()}
        </div>
      </div>

      <Button onClick={() => onUpdateStatus(task)} className="w-full">
        {task.status === "Assigned" && "Start Pickup"}
        {task.status === "OnTheWay" && "Confirm Collection"}
        {task.status === "Collected" && "View Details"}
      </Button>
    </div>
  );
};