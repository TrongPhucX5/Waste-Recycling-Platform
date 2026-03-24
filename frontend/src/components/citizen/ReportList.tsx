"use client";
import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Trash2,
  Star,
  Filter,
  Search,
} from "lucide-react";

export const ReportList: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const reports = [
    {
      id: 123,
      address: "123 Cầu Giấy, Hà Nội",
      wasteType: "Hữu cơ",
      status: "completed",
      points: 60,
      rating: 5,
      date: "23/03/2026 14:20",
      image: "🖼️",
      collectorName: "Nguyễn Văn B",
      description: "Rác thải quanh bụi cây, lượng khoảng 50kg",
    },
    {
      id: 124,
      address: "456 Trần Duy Hưng, Hà Nội",
      wasteType: "Tái chế",
      status: "in_progress",
      points: 30,
      rating: null,
      date: "23/03/2026 11:00",
      image: "🖼️",
      collectorName: "Trần Thị C",
      description: "Túi nilon và giấy cardboard",
    },
    {
      id: 125,
      address: "789 Hàng Bài, Hà Nội",
      wasteType: "Hữu cơ",
      status: "pending",
      points: null,
      rating: null,
      date: "23/03/2026 10:30",
      image: "🖼️",
      collectorName: null,
      description: "Rác thải quanh thùng rác công cộng",
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      completed: {
        label: "Hoàn thành",
        color: "bg-green-100 text-green-700 border-green-300",
        icon: CheckCircle,
      },
      in_progress: {
        label: "Đang xử lý",
        color: "bg-blue-100 text-blue-700 border-blue-300",
        icon: Clock,
      },
      pending: {
        label: "Chờ xử lý",
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: AlertCircle,
      },
    };
    return configs[status];
  };

  const wasteTypeColors: Record<string, string> = {
    "Hữu cơ": "bg-green-100 text-green-700",
    "Tái chế": "bg-blue-100 text-blue-700",
    "Nguy hiểm": "bg-red-100 text-red-700",
    "Khác": "bg-gray-100 text-gray-700",
  };

  const filteredReports = reports.filter((report) => {
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesSearch =
      report.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm báo cáo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "all", label: "Tất cả" },
            { value: "pending", label: "Chờ xử lý" },
            { value: "in_progress", label: "Đang xử lý" },
            { value: "completed", label: "Hoàn thành" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterStatus === filter.value
                  ? "bg-[#0AA468] text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => {
            const statusConfig = getStatusConfig(report.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div
                key={report.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-3xl shrink-0">
                      {report.image}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            wasteTypeColors[report.wasteType]
                          }`}
                        >
                          {report.wasteType}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                            statusConfig.color
                          }`}
                        >
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>
                      </div>

                      <p className="font-bold text-gray-900 flex items-center gap-1">
                        <MapPin size={16} className="text-[#0AA468]" />
                        {report.address}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {report.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">{report.date}</p>
                    </div>

                    {/* Points */}
                    <div className="text-right shrink-0">
                      {report.points && (
                        <p className="text-2xl font-bold text-green-600">
                          +{report.points}
                        </p>
                      )}
                      <p className="text-xs text-gray-600">pts</p>
                    </div>
                  </div>

                  {/* Footer */}
                  {report.status === "completed" && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Thu gom bởi <span className="font-semibold">{report.collectorName}</span>
                          </p>
                        </div>
                        {report.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(report.rating)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className="fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {report.status === "in_progress" && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-sm text-gray-700">
                        👤 Đang xử lý bởi <span className="font-semibold">{report.collectorName}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Trash2 size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">Không có báo cáo nào</p>
            <p className="text-gray-500 text-sm">Hãy tạo báo cáo đầu tiên của bạn</p>
          </div>
        )}
      </div>
    </div>
  );
};