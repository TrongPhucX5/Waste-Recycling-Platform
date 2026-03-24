"use client";
import React from "react";
import {
  Truck,
  MapPin,
  Phone,
  Trash2,
  Clock,
  Weight,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface CollectionTask {
  id: string;
  taskNumber: string;
  reportNumber: string;
  location: string;
  address: string;
  wasteType: string;
  estimatedWeight: number;
  status: "pending" | "assigned" | "on_the_way" | "collected";
  createdAt: string;
  latitude: number;
  longitude: number;
  citizenName: string;
  contactPhone: string;
}

interface Props {
  tasks: CollectionTask[];
  onSelectTask: (task: CollectionTask) => void;
}

export const TaskList: React.FC<Props> = ({ tasks, onSelectTask }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "assigned":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "on_the_way":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "collected":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ Xử Lý";
      case "assigned":
        return "Đã Giao";
      case "on_the_way":
        return "Đang Trên Đường";
      case "collected":
        return "Đã Thu Gom";
      default:
        return status;
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case "Hữu cơ":
        return "bg-green-100 text-green-700";
      case "Tái chế":
        return "bg-blue-100 text-blue-700";
      case "Nguy hiểm":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Danh Sách Công Việc</h1>
        <p className="text-gray-600 mt-2">
          {tasks.length} công việc đang chờ hoặc đang thực hiện
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {["Tất cả", "Chờ Giao", "Đang Làm"].map((filter) => (
          <button
            key={filter}
            className="px-4 py-3 font-medium text-gray-700 hover:text-[#0AA468] border-b-2 border-transparent hover:border-[#0AA468] transition-all"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {task.taskNumber}
                    </h3>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Báo cáo: {task.reportNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{task.createdAt}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Vị Trí</p>
                    <p className="text-sm font-medium text-gray-900">
                      {task.address}
                    </p>
                  </div>
                </div>

                {/* Waste Type */}
                <div className="flex items-start gap-3">
                  <Trash2 size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Loại Rác</p>
                    <span
                      className={`inline-block text-xs font-bold px-2 py-1 rounded mt-1 ${getWasteTypeColor(
                        task.wasteType
                      )}`}
                    >
                      {task.wasteType}
                    </span>
                  </div>
                </div>

                {/* Weight */}
                <div className="flex items-start gap-3">
                  <Weight size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Trọng Lượng Dự Kiến
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {task.estimatedWeight} kg
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Liên Hệ</p>
                    <p className="text-sm font-medium text-gray-900">
                      {task.citizenName}
                    </p>
                    <p className="text-xs text-gray-600">{task.contactPhone}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {task.status === "assigned" && (
                  <>
                    <button
                      onClick={() => onSelectTask(task)}
                      className="flex-1 py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Truck size={18} />
                      Bắt Đầu Thu Gom
                    </button>
                    <button
                      onClick={() => onSelectTask(task)}
                      className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-lg transition-all"
                    >
                      Chi Tiết
                    </button>
                  </>
                )}

                {task.status === "on_the_way" && (
                  <>
                    <button
                      onClick={() => onSelectTask(task)}
                      className="flex-1 py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Xác Nhận Hoàn Thành
                    </button>
                    <button
                      onClick={() => onSelectTask(task)}
                      className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-lg transition-all"
                    >
                      Chi Tiết
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Truck size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-semibold">Không có công việc nào</p>
            <p className="text-gray-500 text-sm mt-1">
              Tất cả công việc đã hoàn thành
            </p>
          </div>
        )}
      </div>
    </div>
  );
};