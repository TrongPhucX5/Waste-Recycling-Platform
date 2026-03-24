"use client";
import React, { useState } from "react";
import { Search, Filter, Eye, CheckCircle, XCircle, MapPin } from "lucide-react";

interface Report {
  id: string;
  reportNumber: string;
  citizen: string;
  location: string;
  wasteType: string;
  status: "pending" | "accepted" | "assigned" | "collected";
  description: string;
  images: number;
  createdAt: string;
  points: number;
}

export const ReportsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      reportNumber: "#R-001",
      citizen: "Nguyễn Văn A",
      location: "123 Cầu Giấy, Hà Nội",
      wasteType: "Hữu cơ",
      status: "collected",
      description: "Rác quanh cây xanh, lượng khoảng 50kg",
      images: 3,
      createdAt: "2026-03-23 14:30",
      points: 60,
    },
    {
      id: "2",
      reportNumber: "#R-002",
      citizen: "Trần Thị B",
      location: "456 Trần Duy Hưng, Hà Nội",
      wasteType: "Tái chế",
      status: "assigned",
      description: "Túi nilon, giấy cardboard",
      images: 2,
      createdAt: "2026-03-23 10:15",
      points: 45,
    },
    {
      id: "3",
      reportNumber: "#R-003",
      citizen: "Lê Văn C",
      location: "789 Hàng Bài, Hà Nội",
      wasteType: "Hữu cơ",
      status: "pending",
      description: "Rác quanh thùng rác công cộng",
      images: 1,
      createdAt: "2026-03-23 09:00",
      points: 30,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "accepted":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "assigned":
        return "bg-purple-100 text-purple-700 border-purple-300";
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
      case "accepted":
        return "Chấp Nhận";
      case "assigned":
        return "Đã Giao";
      case "collected":
        return "Hoàn Thành";
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

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Báo Cáo</h1>
        <p className="text-gray-600 mt-2">
          Quản lý tất cả báo cáo rác thải từ người dân
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
        >
          <option value="all">Tất Cả Trạng Thái</option>
          <option value="pending">Chờ Xử Lý</option>
          <option value="accepted">Chấp Nhận</option>
          <option value="assigned">Đã Giao</option>
          <option value="collected">Hoàn Thành</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Báo Cáo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Người Dùng
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Vị Trí
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Loại Rác
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Điểm
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {report.reportNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.createdAt}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{report.citizen}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-gray-900 text-sm">
                        {report.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getWasteTypeColor(
                        report.wasteType
                      )}`}
                    >
                      {report.wasteType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600">+{report.points}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Eye size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 font-semibold">
              Không tìm thấy báo cáo nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
};