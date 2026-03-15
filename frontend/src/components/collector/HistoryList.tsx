import React from "react";
import { Table, Badge } from "../ui";

interface HistoryItem {
  id: number;
  type: string;
  quantity: string;
  location: string;
  completedAt: string;
  status: "COMPLETED";
}

const mockHistory: HistoryItem[] = [
  { id: 101, type: "Plastic", quantity: "25kg", location: "District 2", completedAt: "2024-03-01 10:30", status: "COMPLETED" },
  { id: 102, type: "Paper", quantity: "15kg", location: "Binh Thanh", completedAt: "2024-03-02 14:15", status: "COMPLETED" },
  { id: 103, type: "Metal", quantity: "40kg", location: "Thu Duc", completedAt: "2024-03-05 09:00", status: "COMPLETED" },
];

export const HistoryList: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Completed Collections</h3>
        <Badge variant="success">Total: {mockHistory.length}</Badge>
      </div>
      <Table 
        data={mockHistory}
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
    </div>
  );
};