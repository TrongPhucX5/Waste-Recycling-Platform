"use client";
import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Package,
  Phone,
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

interface Props {
  requests: CollectionRequest[];
  onUpdate: (request: CollectionRequest) => void;
  onDelete: (id: string) => void;
}

export const RequestManagement: React.FC<Props> = ({
  requests,
  onUpdate,
  onDelete,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CollectionRequest | null>(null);
  const [formData, setFormData] = useState({
    wasteType: "",
    quantity: "",
    location: "",
    deadline: "",
    notes: "",
  });

  const filteredRequests =
    selectedStatus === "all"
      ? requests
      : requests.filter((r) => r.status === selectedStatus);

  const handleOpenModal = (request?: CollectionRequest) => {
    if (request) {
      setSelectedRequest(request);
      setFormData({
        wasteType: request.wasteType,
        quantity: request.quantity.toString(),
        location: request.location,
        deadline: request.deadline,
        notes: request.notes,
      });
    } else {
      setSelectedRequest(null);
      setFormData({
        wasteType: "",
        quantity: "",
        location: "",
        deadline: "",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleSave = () => {
    if (!formData.wasteType || !formData.quantity || !formData.location) {
      alert("Vui lòng điền tất cả các trường bắt buộc");
      return;
    }

    if (selectedRequest) {
      onUpdate({
        ...selectedRequest,
        wasteType: formData.wasteType,
        quantity: Number(formData.quantity),
        location: formData.location,
        deadline: formData.deadline,
        notes: formData.notes,
      });
    } else {
      const newRequest: CollectionRequest = {
        id: Date.now().toString(),
        requestNumber: `#REQ-${Math.floor(Math.random() * 10000)}`,
        wasteType: formData.wasteType,
        quantity: Number(formData.quantity),
        location: formData.location,
        status: "pending",
        createdAt: new Date().toLocaleString("vi-VN"),
        deadline: formData.deadline,
        notes: formData.notes,
        citizenName: "N/A",
        contactPhone: "N/A",
      };
      onUpdate(newRequest);
    }

    handleCloseModal();
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const request = requests.find((r) => r.id === id);
    if (request) {
      onUpdate({
        ...request,
        status: newStatus as CollectionRequest["status"],
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "approved":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "assigned":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ Xử Lý";
      case "approved":
        return "Đã Phê Duyệt";
      case "assigned":
        return "Đã Giao";
      case "completed":
        return "Hoàn Thành";
      case "rejected":
        return "Từ Chối";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Yêu Cầu Thu Gom</h1>
          <p className="text-gray-600 mt-2">
            {requests.length} yêu cầu tổng cộng
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="py-2.5 px-4 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Tạo Yêu Cầu
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {["all", "pending", "approved", "assigned", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-all ${
              selectedStatus === status
                ? "border-[#0AA468] text-[#0AA468]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {status === "all"
              ? "Tất Cả"
              : status === "pending"
              ? "Chờ Xử Lý"
              : status === "approved"
              ? "Đã Phê Duyệt"
              : status === "assigned"
              ? "Đã Giao"
              : "Hoàn Thành"}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
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
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{request.notes}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{request.createdAt}</p>
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
                  <Phone size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Người Gửi</p>
                    <p className="text-sm font-medium text-gray-900">
                      {request.citizenName}
                    </p>
                    <p className="text-xs text-gray-600">{request.contactPhone}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {request.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(request.id, "approved")}
                      className="flex-1 py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Phê Duyệt
                    </button>
                    <button
                      onClick={() => handleStatusChange(request.id, "rejected")}
                      className="flex-1 py-2.5 border-2 border-red-300 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-all"
                    >
                      Từ Chối
                    </button>
                  </>
                )}

                {request.status === "approved" && (
                  <button
                    onClick={() => handleStatusChange(request.id, "assigned")}
                    className="flex-1 py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all"
                  >
                    Giao Task
                  </button>
                )}

                {request.status !== "completed" && request.status !== "rejected" && (
                  <>
                    <button
                      onClick={() => handleOpenModal(request)}
                      className="py-2.5 px-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-lg transition-all flex items-center gap-2"
                    >
                      <Edit2 size={18} />
                      Sửa
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Bạn có chắc chắn muốn xóa yêu cầu này?"
                      )
                    ) {
                      onDelete(request.id);
                    }
                  }}
                  className="py-2.5 px-4 border-2 border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold rounded-lg transition-all flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-semibold">Không có yêu cầu nào</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedRequest ? "Chỉnh Sửa Yêu Cầu" : "Tạo Yêu Cầu Mới"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Loại Rác *
                </label>
                <select
                  value={formData.wasteType}
                  onChange={(e) =>
                    setFormData({ ...formData, wasteType: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                >
                  <option value="">Chọn loại rác</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Paper">Paper</option>
                  <option value="Metal">Metal</option>
                  <option value="Glass">Glass</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Số Lượng (kg) *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                  placeholder="Nhập số lượng"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Vị Trí *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                  placeholder="Nhập vị trí"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hạn Chót
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Ghi Chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468] resize-none"
                  placeholder="Nhập ghi chú"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all"
              >
                {selectedRequest ? "Cập Nhật" : "Tạo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};