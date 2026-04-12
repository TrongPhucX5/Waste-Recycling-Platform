"use client";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Eye, X, Check, XCircle, AlertCircle, FileText, User, MessageSquare } from "lucide-react";
import { ImageGallery } from "../shared/ImageGallery";
import { ConfirmationModal, useConfirmation } from "../shared/ConfirmationModal";
import { ToastContainer, useToast } from "../shared/Toast";
import { Portal } from "../shared/Portal";

interface Report {
  id: string;
  reportNumber: string;
  citizen: string;
  location: string;
  wasteType: string;
  status: string;
  description: string;
  images: string[];
  createdAt: string;
  points: number;
}

export const ReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Image gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  // Modal hooks
  const modal = useConfirmation();
  const toast = useToast();

  // 1. GỌI API LẤY DANH SÁCH BÁO CÁO
  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || ""; 

      const response = await fetch("http://localhost:8080/api/reports/all?page=1&pageSize=100", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "*/*"
        }
      });

      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
      
      const json = await response.json();
      const apiData = json.reports || []; 

      const mapStatus = (statusNum: number) => {
        switch (statusNum) {
          case 0: return "pending";
          case 1: return "accepted";
          case 2: return "assigned";
          case 3: return "collected";
          case 4: return "rejected";
          default: return "pending";
        }
      };

      const formattedReports = apiData.map((item: any) => ({
        id: item.id,
        reportNumber: `#R-${item.id.substring(0, 6).toUpperCase()}`,
        citizen: item.citizenName || "Người dùng ẩn danh",
        location: item.address || "Chưa cập nhật vị trí",
        wasteType: item.categoryName || "Khác",
        status: mapStatus(item.status),
        description: item.description || "Chưa có mô tả chi tiết.",
        images: item.reportImages?.map((img: any) => img.imageUrl) || [],
        createdAt: new Date(item.createdAt).toLocaleString("vi-VN"),
        points: item.points || 0,
      }));

      setReports(formattedReports);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 2. HÀM XỬ LÝ DUYỆT / TỪ CHỐI BÁO CÁO
  const handleReportAction = async (reportId: string, action: "accept" | "reject") => {
    if (action === "reject") {
      const reason = await modal.prompt({
        title: "Từ Chối Báo Cáo",
        message: "Vui lòng nhập lý do từ chối báo cáo này:",
        placeholder: "Vd: Ảnh không rõ, vị trí không chính xác...",
        confirmText: "Từ Chối",
        cancelText: "Hủy",
      });
      
      if (reason === null) return;
      
      await executeRejectAction(reportId, reason);
    } else {
      const confirmed = await modal.confirm({
        title: "Xác Nhận Duyệt Báo Cáo",
        message: "Bạn có chắc chắn muốn duyệt báo cáo này không?",
        type: "confirm",
        confirmText: "Duyệt",
        cancelText: "Hủy",
      });
      
      if (confirmed) {
        await executeApproveAction(reportId);
      }
    }
  };

  const executeApproveAction = async (reportId: string) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || "";
      const url = `http://localhost:8080/api/reports/${reportId}/accept`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "*/*",
        }
      });

      if (response.ok) {
        toast.success("Báo cáo đã được duyệt thành công!");
        setSelectedReport(null);
        fetchReports();
      } else if (response.status === 403) {
        toast.error("Lỗi 403: Tài khoản Admin chưa được cấp quyền!");
      } else {
        toast.error(`Thao tác thất bại (Lỗi ${response.status})`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi gọi API!");
    } finally {
      setActionLoading(false);
    }
  };

  const executeRejectAction = async (reportId: string, reason: string) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || "";
      const url = `http://localhost:8080/api/reports/${reportId}/reject`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "*/*",
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        toast.success("Báo cáo đã được từ chối!");
        setSelectedReport(null);
        fetchReports();
      } else if (response.status === 403) {
        toast.error("Lỗi 403: Tài khoản Admin chưa được cấp quyền!");
      } else {
        toast.error(`Thao tác thất bại (Lỗi ${response.status})`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi gọi API!");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Chờ Xử Lý" };
    if (s === "accepted") return { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Đã Duyệt" };
    if (s === "rejected") return { color: "bg-red-100 text-red-700 border-red-200", label: "Từ Chối" };
    if (s === "assigned") return { color: "bg-purple-100 text-purple-700 border-purple-200", label: "Đã Giao" };
    if (s === "collected") return { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Hoàn Thành" };
    return { color: "bg-gray-100 text-gray-700 border-gray-200", label: status };
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || report.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-2">
      {/* Filter Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm báo cáo</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập mã, tên người dùng hoặc vị trí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
              />
            </div>
          </div>
          <div className="w-full sm:w-64">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white cursor-pointer transition-all text-sm font-medium text-gray-700"
            >
              <option value="all">Tất Cả Trạng Thái</option>
              <option value="pending">Chờ Xử Lý</option>
              <option value="accepted">Đã Duyệt</option>
              <option value="rejected">Từ Chối</option>
              <option value="assigned">Đã Giao Thu Gom</option>
              <option value="collected">Hoàn Thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Báo Cáo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Người Dùng</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Vị Trí</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Loại Rác</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Trạng Thái</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-100 border-t-emerald-600"></div>
                    <p className="mt-4 text-gray-500 font-medium text-sm">Đang đồng bộ dữ liệu...</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-semibold">Trống</p>
                    <p className="text-gray-500 text-sm mt-1">Không tìm thấy báo cáo nào phù hợp.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const statusInfo = getStatusStyle(report.status);
                  return (
                    <tr key={report.id} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{report.reportNumber}</p>
                          <p className="text-xs text-gray-500 mt-0.5 font-medium">{report.createdAt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm font-medium">{report.citizen}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-gray-600 text-sm font-medium line-clamp-2">{report.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                          {report.wasteType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color} shadow-sm`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="p-2 bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-lg transition-all text-gray-500 hover:text-emerald-600 shadow-sm"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedReport && (
        <Portal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl m-4 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Chi Tiết Báo Cáo {selectedReport.reportNumber}</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Được gửi vào: {selectedReport.createdAt}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-full text-gray-500 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto grow">
              
              {/* Top Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                    <User size={16} /> Người báo cáo
                  </div>
                  <p className="font-bold text-gray-900 text-lg">{selectedReport.citizen}</p>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col justify-center items-start">
                  <div className="text-sm font-semibold text-gray-500 mb-2">Trạng thái xử lý</div>
                  <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-bold border ${getStatusStyle(selectedReport.status).color}`}>
                    {getStatusStyle(selectedReport.status).label}
                  </span>
                </div>
              </div>

              {/* Location & Type */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-1">
                    <MapPin size={16} /> Vị trí được báo cáo
                  </div>
                  <p className="font-medium text-gray-900 leading-relaxed">{selectedReport.location}</p>
                </div>
                <div className="border-t border-emerald-100 pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-800">Phân loại rác:</span>
                  <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-emerald-100">
                    {selectedReport.wasteType}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <MessageSquare size={16} className="text-gray-400" /> Mô tả chi tiết
                </h3>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-700 text-sm font-medium leading-relaxed">
                  {selectedReport.description || "Người dân không để lại mô tả nào."}
                </div>
              </div>

              {/* Images */}
              {selectedReport.images && selectedReport.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Hình ảnh đính kèm ({selectedReport.images.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedReport.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setGalleryImages(selectedReport.images);
                          setGalleryOpen(true);
                        }}
                        className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-emerald-500 transition-all cursor-pointer group relative shadow-sm"
                      >
                        <img
                          src={img}
                          alt={`Report image ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50%' y='50%' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='10'%3EImage Error%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl shrink-0">
              {selectedReport.status.toLowerCase() === "pending" ? (
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => handleReportAction(selectedReport.id, "reject")}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                    <XCircle size={18} /> Từ Chối
                  </button>
                  <button
                    onClick={() => handleReportAction(selectedReport.id, "accept")}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm shadow-emerald-200 disabled:opacity-50"
                  >
                    <Check size={18} /> Duyệt Báo Cáo
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 justify-center bg-gray-100 py-3 rounded-xl border border-gray-200 font-medium text-sm">
                  <AlertCircle size={18} />
                  Báo cáo này đã được xử lý và khóa thao tác.
                </div>
              )}
            </div>

          </div>
        </div>
        </Portal>
      )}

      {/* Image Gallery Modal */}
      <ImageGallery
        images={galleryImages}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        title={selectedReport ? `Ảnh Báo Cáo ${selectedReport.reportNumber}` : "Hình Ảnh"}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal.isOpen}
        config={modal.config}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
        isLoading={actionLoading}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};