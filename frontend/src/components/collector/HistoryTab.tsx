"use client";
import React from "react";
import { CheckCircle, MapPin, Weight, Calendar, Trash2 } from "lucide-react";

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
}

export const HistoryTab: React.FC<Props> = ({ tasks }) => {
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
        <h1 className="text-3xl font-bold text-gray-900">Lịch Sử Thu Gom</h1>
        <p className="text-gray-600 mt-2">
          {tasks.length} công việc đã hoàn thành
        </p>
      </div>

      {/* History Cards */}
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {task.taskNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {task.reportNumber} - Hoàn Thành
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-300">
                    ✓ Đã Thu Gom
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
                      Trọng Lượng
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {task.estimatedWeight} kg
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Ngày Thu Gom
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {task.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* View Detail Button */}
              <button className="w-full py-2.5 text-[#0AA468] font-bold border-2 border-[#0AA468] rounded-lg hover:bg-green-50 transition-all">
                Xem Chi Tiết
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-semibold">Không có lịch sử nào</p>
            <p className="text-gray-500 text-sm mt-1">
              Bạn chưa hoàn thành công việc nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
};