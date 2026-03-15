import React from "react";
import { Badge, Button } from "../ui";
import { MapPin, Clock } from "lucide-react";

export interface Task {
  id: number;
  type: string;
  quantity: string;
  location: string;
  status: "ASSIGNED" | "ON_THE_WAY" | "COLLECTED" | "COMPLETED";
  pickupTime: string;
  requester: string;
}

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (task: Task) => void;
}

const statusColors = {
  ASSIGNED: "warning",
  ON_THE_WAY: "info",
  COLLECTED: "success",
  COMPLETED: "default",
} as const;

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{task.type} - {task.quantity}</h3>
          <p className="text-sm text-gray-500">From: {task.requester}</p>
        </div>
        <Badge variant={statusColors[task.status] || "default"}>{task.status.replace(/_/g, " ")}</Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          {task.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          Pickup by: {task.pickupTime}
        </div>
      </div>

      <Button onClick={() => onUpdateStatus(task)} className="w-full">
        {task.status === "ASSIGNED" && "Start Pickup"}
        {task.status === "ON_THE_WAY" && "Confirm Collection"}
        {task.status === "COLLECTED" && "View Details"}
      </Button>
    </div>
  );
};