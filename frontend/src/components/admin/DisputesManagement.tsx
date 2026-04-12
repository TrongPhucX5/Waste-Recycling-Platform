"use client";
import React, { useState, useEffect } from "react";
import { API_CONFIG } from "@/lib/api/config";
import { Search, AlertCircle, CheckCircle, XCircle, MessageSquare, ShieldAlert } from "lucide-react";
import { ConfirmationModal, useConfirmation } from "../shared/ConfirmationModal";
import { ToastContainer, useToast } from "../shared/Toast";

interface Dispute {
  id: string;
  number: string;
  citizen: string;
  report: string;
  status: string; // "pending" | "resolved" | "rejected"
  createdAt: string;
  content: string;
  adminResponse?: string;
}

export const DisputesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals & Toast
  const modal = useConfirmation();
  const toast = useToast();

  // 1. GỌI API LẤY DANH SÁCH KHIẾU NẠI
  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";

      // Khởi tạo URL với phân trang cơ bản
      let url = `${API_CONFIG.BASE_URL}/admin/complaints?page=1&pageSize=100`;
      
      // Nếu có tìm kiếm thì thêm vào URL để Backend xử lý
      if (searchTerm.trim() !== "") {
        url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
      }

      // Nếu có lọc trạng thái (và không phải 'all') thì thêm vào URL
      if (filterStatus !== "all") {
        url += `&status=${filterStatus}`;
      }

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "*/*"
        }
      });

      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");

      const json = await response.json();
      
      // SỬA: Lấy dữ liệu từ biến 'data' theo chuẩn C# của ông
      const apiData = json.data || [];

      const mapStatus = (statusNum: any) => {
        const s = statusNum?.toString().toLowerCase();
        if (s === "1" || s === "resolved") return "resolved";
        if (s === "2" || s === "rejected") return "rejected";
        return "pending";
      };

      const formattedDisputes = apiData.map((item: any) => ({
        id: item.id,
        number: `#C-${item.id.substring(0, 6).toUpperCase()}`,
        citizen: item.citizenName || item.citizen?.fullName || "Người dùng ẩn danh",
        report: item.reportId ? `#R-${item.reportId.substring(0, 6).toUpperCase()}` : "Không rõ",
        status: mapStatus(item.status),
        createdAt: new Date(item.createdAt).toLocaleString("vi-VN"),
        content: item.content || "Không có nội dung chi tiết",
        adminResponse: item.adminResponse || "",
      }));

      setDisputes(formattedDisputes);
    } catch (error) {
      console.error("Lỗi fetch disputes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API khi thay đổi Search hoặc Filter
  useEffect(() => {
    // Dùng setTimeout để tránh gọi API liên tục khi người dùng đang gõ phím (Debounce)
    const delayDebounceFn = setTimeout(() => {
      fetchDisputes();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterStatus]);

  // 2. XỬ LÝ ĐỒNG Ý / TỪ CHỐI KHIẾU NẠI
  const handleAction = async (id: string, action: "resolve" | "reject") => {
    const actionName = action === "resolve" ? "ĐỒNG Ý và GIẢI QUYẾT" : "TỪ CHỐI";
    const actionTitle = action === "resolve" ? "Giải Quyết Khiếu Nại" : "Từ Chối Khiếu Nại";
    
    const adminResponse = await modal.prompt({
      title: actionTitle,
      message: `Nhập phản hồi/quyết định của bạn để ${actionName} khiếu nại này:`,
      placeholder: "Nhập phản hồi chi tiết cho người dân...",
      confirmText: action === "resolve" ? "Giải Quyết" : "Từ Chối",
      cancelText: "Hủy",
    });

    if (adminResponse === null) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || "";
      
      const url = `${API_CONFIG.BASE_URL}/admin/complaints/${id}/${action}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ adminResponse: adminResponse })
      });

      if (response.ok) {
        toast.success(`Khiếu nại đã được ${action === "resolve" ? "giải quyết" : "từ chối"} thành công!`);
        fetchDisputes();
      } else {
        const errJson = await response.json();
        toast.error("Thao tác thất bại: " + (errJson.message || `Lỗi ${response.status}`));
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối mạng!");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper UI
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Chờ Xử Lý";
      case "resolved": return "Đã Giải Quyết";
      case "rejected": return "Bị Từ Chối";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle size={14} className="shrink-0"/>;
      case "resolved": return <CheckCircle size={14} className="shrink-0"/>;
      case "rejected": return <XCircle size={14} className="shrink-0"/>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-2">
      {/* Filter Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm khiếu nại</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập mã khiếu nại, tên người dân..."
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
              <option value="resolved">Đã Giải Quyết</option>
              <option value="rejected">Bị Từ Chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-100 border-t-emerald-600"></div>
          <p className="mt-4 text-gray-500 font-medium text-sm">Đang đồng bộ dữ liệu khiếu nại...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.length > 0 ? (
            disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Header Card */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">{dispute.number}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Báo cáo liên quan: <span className="font-semibold text-emerald-600 cursor-pointer hover:underline">{dispute.report}</span>
                    </p>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(dispute.status)} shadow-sm`}>
                    {getStatusIcon(dispute.status)}
                    <span>{getStatusLabel(dispute.status)}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-5 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Người Khiếu Nại</p>
                    <p className="font-medium text-gray-900">{dispute.citizen}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ngày Gửi</p>
                    <p className="font-medium text-gray-900">{dispute.createdAt}</p>
                  </div>
                </div>

                {/* Content Box */}
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 mb-5">
                  <p className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} className="text-amber-600" /> Nội dung khiếu nại:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed italic">"{dispute.content}"</p>
                </div>

                {/* Actions & Responses */}
                {dispute.status === "pending" ? (
                  <div className="flex gap-3 pt-5 border-t border-gray-100">
                    <button 
                      disabled={actionLoading}
                      onClick={() => handleAction(dispute.id, "reject")}
                      className="flex-1 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      Từ Chối
                    </button>
                    <button 
                      disabled={actionLoading}
                      onClick={() => handleAction(dispute.id, "resolve")}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 disabled:opacity-50"
                    >
                      <CheckCircle size={18} />
                      Đồng Ý & Xử Lý
                    </button>
                  </div>
                ) : (
                  <div className="pt-5 border-t border-gray-100">
                    <div className={`rounded-xl p-4 border ${dispute.status === "resolved" ? "bg-emerald-50/50 border-emerald-200" : "bg-red-50/50 border-red-200"}`}>
                      <p className={`text-sm font-bold mb-1 flex items-center gap-2 ${dispute.status === "resolved" ? "text-emerald-900" : "text-red-900"}`}>
                        {dispute.status === "resolved" ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                        {dispute.status === "resolved" ? "Quyết định giải quyết:" : "Lý do từ chối:"}
                      </p>
                      <p className={`text-sm leading-relaxed ${dispute.status === "resolved" ? "text-emerald-800" : "text-red-800"}`}>
                        {dispute.adminResponse || "Không có phản hồi chi tiết."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldAlert size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold">Trống</p>
              <p className="text-gray-500 text-sm mt-1">Không tìm thấy khiếu nại nào phù hợp.</p>
            </div>
          )}
        </div>
      )}

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