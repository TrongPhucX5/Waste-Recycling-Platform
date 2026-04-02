"use client";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Eye, X, Check, XCircle, AlertCircle } from "lucide-react";

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
        images: [],
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

  // 2. HÀM XỬ LÝ DUYỆT / TỪ CHỐI BÁO CÁO ĐÃ FIX GỬI BODY
  const handleReportAction = async (reportId: string, action: "accept" | "reject") => {
    let requestBody = null;

    if (action === "reject") {
      // Hỏi lý do nếu là từ chối
      const reason = window.prompt("Vui lòng nhập lý do từ chối báo cáo này:");
      if (reason === null) return; // User bấm Cancel thì hủy
      if (reason.trim() === "") {
        alert("Bạn phải nhập lý do từ chối!");
        return;
      }
      requestBody = JSON.stringify({ reason: reason });
    } else {
      if (!window.confirm("Bạn có chắc chắn muốn DUYỆT báo cáo này?")) return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || "";
      const url = `http://localhost:8080/api/reports/${reportId}/${action}`;

      const options: RequestInit = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "*/*",
        }
      };

      // Nếu có body (Dành cho Reject) thì thêm Content-Type và body vào request
      if (requestBody) {
        options.headers = {
          ...options.headers,
          "Content-Type": "application/json"
        };
        options.body = requestBody;
      }

      const response = await fetch(url, options);

      if (response.ok) {
        alert("Thao tác thành công!");
        setSelectedReport(null); 
        fetchReports(); 
      } else if (response.status === 403) {
        // Bắt luôn lỗi 403 để báo cho ông biết
        alert("Lỗi 403 Forbidden: Tài khoản Admin chưa được cấp quyền gọi API này. Hãy kiểm tra [Authorize] trong C#!");
      } else {
        alert("Thao tác thất bại, API báo lỗi: " + response.status);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi gọi API!");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return { color: "bg-yellow-100 text-yellow-700 border-yellow-300", label: "Chờ Xử Lý" };
    if (s === "accepted") return { color: "bg-blue-100 text-blue-700 border-blue-300", label: "Đã Duyệt" };
    if (s === "rejected") return { color: "bg-red-100 text-red-700 border-red-300", label: "Từ Chối" };
    if (s === "assigned") return { color: "bg-purple-100 text-purple-700 border-purple-300", label: "Đã Giao" };
    if (s === "collected") return { color: "bg-green-100 text-green-700 border-green-300", label: "Hoàn Thành" };
    return { color: "bg-gray-100 text-gray-700 border-gray-300", label: status };
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
    <div className="space-y-6 relative">
      {/* Header & Filter giữ nguyên */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Báo Cáo</h1>
        <p className="text-gray-600 mt-2">Duyệt và quản lý báo cáo rác thải từ người dân</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã, người dùng hoặc vị trí..."
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
          <option value="accepted">Đã Duyệt</option>
          <option value="rejected">Từ Chối</option>
          <option value="assigned">Đã Giao Thu Gom</option>
          <option value="collected">Hoàn Thành</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Báo Cáo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Người Dùng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vị Trí</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Loại Rác</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-blue-600 font-medium">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500 font-medium">Không tìm thấy báo cáo nào</td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const statusInfo = getStatusStyle(report.status);
                  return (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{report.reportNumber}</p>
                          <p className="text-xs text-gray-500">{report.createdAt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 text-sm">{report.citizen}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                          <span className="text-gray-900 text-sm line-clamp-2">{report.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-700">
                          {report.wasteType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-[#0AA468]"
                          title="Xem chi tiết"
                        >
                          <Eye size={20} />
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

      {/* MODAL CHI TIẾT BÁO CÁO FIX LỖI KHOẢNG TRẮNG */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header - Cố định */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Chi Tiết Báo Cáo {selectedReport.reportNumber}</h2>
                <p className="text-sm text-gray-500 mt-1">Ngày gửi: {selectedReport.createdAt}</p>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Vùng cho phép cuộn */}
            <div className="p-6 space-y-6 overflow-y-auto grow">
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Người báo cáo</p>
                  <p className="font-semibold text-gray-900">{selectedReport.citizen}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Trạng thái hiện tại</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(selectedReport.status).color}`}>
                    {getStatusStyle(selectedReport.status).label}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Loại rác</p>
                  <p className="font-medium text-gray-900">{selectedReport.wasteType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Vị trí</p>
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-[#0AA468] shrink-0" />
                    <p className="font-medium text-gray-900">{selectedReport.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Mô tả chi tiết</p>
                <p className="text-gray-700 bg-white border border-gray-200 p-4 rounded-lg">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.images && selectedReport.images.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Hình ảnh đính kèm</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedReport.images.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img} alt={`Report img ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - Cố định */}
            {selectedReport.status.toLowerCase() === "pending" ? (
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end shrink-0">
                <button
                  onClick={() => handleReportAction(selectedReport.id, "reject")}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle size={20} />
                  Từ Chối
                </button>
                <button
                  onClick={() => handleReportAction(selectedReport.id, "accept")}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-green-200"
                >
                  <Check size={20} />
                  Duyệt Báo Cáo
                </button>
              </div>
            ) : (
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center gap-3 text-gray-500 justify-center shrink-0">
                <AlertCircle size={20} />
                <p className="font-medium">Báo cáo này đã được xử lý và không thể thay đổi trạng thái.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};