"use client";
import React, { useState } from "react";
import { Search, AlertCircle, CheckCircle, XCircle, MessageSquare } from "lucide-react";

interface Dispute {
  id: string;
  number: string;
  citizen: string;
  report: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
  description: string;
}

export const DisputesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: "1",
      number: "#D-001",
      citizen: "Nguyễn Văn A",
      report: "#R-001",
      reason: "Không được thu gom đúng hạn",
      status: "resolved",
      createdAt: "2026-03-22 10:30",
      description: "Báo cáo lúc 14:30, nhưng đến 20:00 vẫn chưa được thu gom",
    },
    {
      id: "2",
      number: "#D-002",
      citizen: "Trần Thị B",
      report: "#R-002",
      reason: "Phân loại không đúng",
      status: "pending",
      createdAt: "2026-03-23 09:15",
      description: "Báo cáo là rác tái chế nhưng bị cho vào rác hữu cơ",
    },
    {
      id: "3",
      number: "#D-003",
      citizen: "Lê Văn C",
      report: "#R-003",
      reason: "Thu gom không đầy đủ",
      status: "pending",
      createdAt: "2026-03-23 14:00",
      description: "Chỉ thu gom được 30kg trong khi báo cáo 50kg",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "resolved":
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
      case "resolved":
        return "Đã Giải Quyết";
      case "rejected":
        return "Bị Từ Chối";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={18} />;
      case "resolved":
        return <CheckCircle size={18} />;
      case "rejected":
        return <XCircle size={18} />;
      default:
        return null;
    }
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || dispute.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khiếu Nại</h1>
        <p className="text-gray-600 mt-2">
          Tiếp nhận và giải quyết khiếu nại từ người dân
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khiếu nại..."
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
          <option value="resolved">Đã Giải Quyết</option>
          <option value="rejected">Bị Từ Chối</option>
        </select>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.map((dispute) => (
          <div
            key={dispute.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-lg text-gray-900">
                  {dispute.number}
                </p>
                <p className="text-sm text-gray-600">
                  Báo cáo: {dispute.report}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                    dispute.status
                  )}`}
                >
                  {getStatusIcon(dispute.status)}
                  {getStatusLabel(dispute.status)}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Người Khiếu Nại</p>
                  <p className="font-medium text-gray-900">{dispute.citizen}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Ngày Tạo</p>
                  <p className="font-medium text-gray-900">{dispute.createdAt}</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm font-semibold text-red-900 mb-2">
                  ⚠️ Lý do khiếu nại:
                </p>
                <p className="text-sm text-red-700">{dispute.reason}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  📝 Mô tả chi tiết:
                </p>
                <p className="text-sm text-gray-700">{dispute.description}</p>
              </div>
            </div>

            {/* Actions */}
            {dispute.status === "pending" && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={18} />
                  Đồng Ý Khiếu Nại
                </button>
                <button className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                  <XCircle size={18} />
                  Từ Chối Khiếu Nại
                </button>
              </div>
            )}

            {dispute.status === "resolved" && (
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-semibold text-green-900">
                    ✓ Đã Giải Quyết
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Quyết định: Hoàn trả 60 điểm cho người dùng
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredDisputes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 font-semibold">
            Không tìm thấy khiếu nại nào
          </p>
        </div>
      )}
    </div>
  );
};