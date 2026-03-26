"use client";
import React, { useState } from "react";
import { Search, MapPin, User, Clock, CheckCircle } from "lucide-react";

interface Task {
  id: string;
  taskNumber: string;
  report: string;
  collector: string;
  location: string;
  status: "pending" | "on_way" | "collected";
  createdAt: string;
  deadline: string;
  wasteQuantity: string;
}

export const CollectionTasks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      taskNumber: "#T-001",
      report: "#R-001",
      collector: "Trần Văn B",
      location: "123 Cầu Giấy, Hà Nội",
      status: "collected",
      createdAt: "2026-03-23 14:30",
      deadline: "2026-03-23 18:00",
      wasteQuantity: "50kg",
    },
    {
      id: "2",
      taskNumber: "#T-002",
      report: "#R-002",
      collector: "Lê Văn D",
      location: "456 Trần Duy Hưng, Hà Nội",
      status: "on_way",
      createdAt: "2026-03-23 10:15",
      deadline: "2026-03-23 17:00",
      wasteQuantity: "30kg",
    },
    {
      id: "3",
      taskNumber: "#T-003",
      report: "#R-003",
      collector: "Phạm Văn E",
      location: "789 Hàng Bài, Hà Nội",
      status: "pending",
      createdAt: "2026-03-23 09:00",
      deadline: "2026-03-24 18:00",
      wasteQuantity: "25kg",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "on_way":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "collected":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ Nhân Viên";
      case "on_way":
        return "Đang Trên Đường";
      case "collected":
        return "Đã Thu Gom";
      default:
        return status;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.taskNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.collector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Thu Gom</h1>
        <p className="text-gray-600 mt-2">
          Theo dõi các task giao cho người thu gom
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
        >
          <option value="all">Tất Cả Trạng Thái</option>
          <option value="pending">Chờ Nhân Viên</option>
          <option value="on_way">Đang Trên Đường</option>
          <option value="collected">Đã Thu Gom</option>
        </select>
      </div>

      {/* Tasks Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-lg text-gray-900">
                  {task.taskNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Báo cáo: {task.report}
                </p>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                  task.status
                )}`}
              >
                {getStatusLabel(task.status)}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-gray-700">
                <User size={16} className="text-gray-400" />
                <span className="text-sm">{task.collector}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <span className="text-sm">{task.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm">
                  Hạn: {task.deadline}
                </span>
              </div>
            </div>

            {/* Waste Info */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Lượng rác:</strong> {task.wasteQuantity}
              </p>
            </div>

            {/* Action Button */}
            <button className="w-full py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all">
              Xem Chi Tiết
            </button>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 font-semibold">
            Không tìm thấy task nào
          </p>
        </div>
      )}
    </div>
  );
};