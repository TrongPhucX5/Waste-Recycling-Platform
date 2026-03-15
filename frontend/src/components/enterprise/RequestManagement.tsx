import React, { useState } from "react";
import { 
  Card, 
  Button, 
  Badge, 
  Table, 
  Select, 
  Modal 
} from "../ui";
import { EnterpriseRequest } from "./types";

interface RequestManagementProps {
  requests: EnterpriseRequest[];
  onStatusChange: (id: number, status: string) => void;
  onAssign: (requestId: number, collectorId: string) => void;
}

const MOCK_COLLECTORS = [
  { value: "c1", label: "Collector 1 (Availability: High)" },
  { value: "c2", label: "Collector 2 (Availability: Low)" }, 
  { value: "c3", label: "Collector 3 (Availability: Medium)" },
];

export const RequestManagement: React.FC<RequestManagementProps> = ({ requests, onStatusChange, onAssign }) => {
  const [selectedRequest, setSelectedRequest] = useState<EnterpriseRequest | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState("");

  const handleAssignClick = () => {
    if (selectedRequest && selectedCollector) {
      onAssign(selectedRequest.id, selectedCollector);
      setAssignModalOpen(false);
      setSelectedCollector("");
      setSelectedRequest(null);
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
       <div className="p-6 border-b border-gray-100 flex justify-between items-center">
         <h2 className="text-xl font-bold text-gray-800">Incoming Collection Requests</h2>
         <div className="flex gap-2">
           <Button variant="outline" size="sm">Filter</Button>
           <Button variant="outline" size="sm">Export</Button>
         </div>
       </div>
       <Table
          data={requests}
          columns={[
            { label: "ID", key: "id" },
            { label: "Type", key: "type" },
            { label: "Quantity", key: "quantity" },
            { label: "Location", key: "location" },
            { label: "Date", key: "date" },
            { 
               label: "Status", 
               key: "status",
               render: (val: string) => (
                 <Badge variant={val === "APPROVED" ? "success" : val === "PENDING" ? "warning" : "default"}>
                   {val}
                 </Badge>
               )
            },
            {
               label: "Actions",
               key: "id",
               render: (_: any, row: any) => (
                 <div className="flex gap-2">
                   {row.status === "PENDING" && (
                     <>
                       <Button 
                         size="sm" 
                         variant="primary" 
                         onClick={() => onStatusChange(row.id, "APPROVED")}
                       >
                         Approve
                       </Button>
                       <Button 
                         size="sm" 
                         variant="danger" 
                         onClick={() => onStatusChange(row.id, "REJECTED")}
                       >
                         Reject
                       </Button>
                     </>
                   )}
                   {row.status === "APPROVED" && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => {
                          setSelectedRequest(row);
                          setAssignModalOpen(true);
                        }}
                      >
                        Assign Collector
                      </Button>
                   )}
                 </div>
               )
            }
          ]}
       />

      {/* Assign Collector Modal */}
      <Modal 
        isOpen={assignModalOpen} 
        onClose={() => setAssignModalOpen(false)}
        title="Assign Collector"
        onConfirm={handleAssignClick}
        confirmText="Confirm Assignment"
      >
        <div className="space-y-4">
           <p className="text-sm text-gray-600">
             Assigning request <b>#{selectedRequest?.id}</b> ({selectedRequest?.type}, {selectedRequest?.quantity})
           </p>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Select Collector</label>
             <Select 
               options={MOCK_COLLECTORS}
               value={selectedCollector}
               onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCollector(e.target.value)}
               placeholder="Choose a Collector..."
             />
           </div>
        </div>
      </Modal>
    </Card>
  );
};