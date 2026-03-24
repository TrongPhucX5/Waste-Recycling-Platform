"use client";
import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Package,
  CheckCircle,
  Clock,
  User,
  AlertCircle,
  BarChart3,
} from "lucide-react";

interface CollectionRequest {
  id: string;
  requestNumber: string;
  wasteType: string;
  quantity: number;
  location: string;
  status: "pending" | "approved" | "assigned" | "completed" | "rejected";
  createdAt: string;
  deadline: string;
  notes: string;
  citizenName: string;
  contactPhone: string;
  assignedCollector?: string;
}

interface Collector {
  id: string;
  name: string;
  rating: number;
  completedTasks: number;
  availability: "available" | "busy" | "offline";
}

interface Props {
  requests: CollectionRequest[];
  onUpdate: (request: CollectionRequest) => void;
}

const MOCK_COLLECTORS: Collector[] = [
  {
    id: "1",
    name: "Trần Văn A",
    rating: 4.8,
    completedTasks: 156,
    availability: "available",
  },
  {
    id: "2",
    name: "Nguyễn Thị B",
    rating: 4.6,
    completedTasks: 142,
    availability: "available",
  },
  {
    id: "3",
    name: "Lê Văn C",
    rating: 4.5,
    completedTasks: 128,
    availability: "busy",
  },
];

export const EnterpriseTaskManagement: React.FC<Props> = ({
  requests,
  onUpdate,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<CollectionRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState<string>("");

  const assignableRequests = requests.filter(
    (r) => r.status === "approved" || r.status === "pending"
  );

  const handleOpenModal = (request: CollectionRequest) => {
    setSelectedRequest(request);
    setSelectedCollector("");
    setIsModalOpen(true);
  };

  const handleAssign = () => {
    if (!selectedCollector || !selectedRequest) {
      alert("Vui lòng chọn người thu gom");
      return;
    }

    const collector = MOCK_COLLECTORS.find((c) => c.id === selectedCollector);
    if (collector) {
      onUpdate({
        ...selectedRequest,
        status: "assigned",
        assignedCollector: collector.name,
      });
      setIsModalOpen(false);
      setSelectedRequest(null);
      alert(`Task ${selectedRequest.requestNumber} đã được giao cho ${collector.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Giao Task Người Thu Gom</h1>
        <p className="text-gray-600 mt-2">
          Giao công việc cho người thu gom
        </p>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {assignableRequests.length > 0 ? (
          assignableRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {request.requestNumber}
                    </h3>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-blue-100 text-blue-700 border-blue-300"
                      }`}
                    >
                      {request.status === "pending" ? "Chờ Xử L��" : "Đã Phê Duyệt"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{request.notes}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Waste Type */}
                <div className="flex items-start gap-3">
                  <Package size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Loại Rác</p>
                    <p className="text-sm font-medium text-gray-900">
                      {request.wasteType}
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-start gap-3">
                  <BarChart3 size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Số Lượng</p>
                    <p className="text-sm font-medium text-gray-900">
                      {request.quantity} kg
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Vị Trí</p>
                    <p className="text-sm font-medium text-gray-900">
                      {request.location}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Hạn Chót</p>
                    <p className="text-sm font-medium text-gray-900">
                      {request.deadline}
                    </p>
                  </div>
                </div>

                {/* Citizen Info */}
                <div className="flex items-start gap-3">
                  <User size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Người Gửi</p>
                    <p className="text-sm font-medium text-gray-900">
                      {request.citizenName}
                    </p>
                    <p className="text-xs text-gray-600">{request.contactPhone}</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleOpenModal(request)}
                  className="flex-1 py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Truck size={18} />
                  Giao Task
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-semibold">
              Không có task để giao
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Giao Task {selectedRequest.requestNumber}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Request Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Loại Rác:</strong> {selectedRequest.wasteType}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Số Lượng:</strong> {selectedRequest.quantity} kg
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Vị Trí:</strong> {selectedRequest.location}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Hạn Chót:</strong> {selectedRequest.deadline}
                </p>
              </div>

              {/* Collectors List */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Chọn Người Thu Gom
                </h3>
                <div className="space-y-3">
                  {MOCK_COLLECTORS.map((collector) => (
                    <div
                      key={collector.id}
                      onClick={() => setSelectedCollector(collector.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCollector === collector.id
                          ? "border-[#0AA468] bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold text-gray-900">
                              {collector.name}
                            </p>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                collector.availability === "available"
                                  ? "bg-green-100 text-green-700"
                                  : collector.availability === "busy"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {collector.availability === "available"
                                ? "Sẵn Sàng"
                                : collector.availability === "busy"
                                ? "Đang Bận"
                                : "Ngoại Tuyến"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            ⭐ {collector.rating} • {collector.completedTasks} công việc
                          </p>
                        </div>
                        {selectedCollector === collector.id && (
                          <CheckCircle
                            size={24}
                            className="text-[#0AA468] shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedCollector}
                className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
              >
                Giao Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};