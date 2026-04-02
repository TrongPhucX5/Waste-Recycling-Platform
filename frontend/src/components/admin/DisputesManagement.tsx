"use client";
import React, { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle, XCircle, MessageSquare } from "lucide-react";

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

  // 1. GỌI API LẤY DANH SÁCH KHIẾU NẠI
  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";

      // Khởi tạo URL với phân trang cơ bản
      let url = "http://localhost:8080/api/admin/complaints?page=1&pageSize=100";
      
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
    
    // Bật hộp thoại yêu cầu Admin nhập cách xử lý / lý do
    const adminResponse = window.prompt(`Nhập phản hồi/quyết định của bạn để ${actionName} khiếu nại này:`);
    
    if (adminResponse === null) return; // User bấm Cancel
    if (adminResponse.trim() === "") {
      alert("Bạn phải nhập phản hồi cho người dân!");
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || "";
      
      const url = `http://localhost:8080/api/admin/complaints/${id}/${action}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ adminResponse: adminResponse })
      });

      if (response.ok) {
        alert(`Đã ${actionName.toLowerCase()} khiếu nại thành công!`);
        fetchDisputes(); // Load lại danh sách
      } else {
        const errJson = await response.json();
        alert("Thao tác thất bại: " + (errJson.message || response.status));
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối mạng!");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper UI
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "resolved": return "bg-green-100 text-green-700 border-green-300";
      case "rejected": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
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
      case "pending": return <AlertCircle size={16} />;
      case "resolved": return <CheckCircle size={16} />;
      case "rejected": return <XCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khiếu Nại</h1>
        <p className="text-gray-600 mt-2">Tiếp nhận và giải quyết khiếu nại từ người dân</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã khiếu nại, người dân, nội dung..."
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
      {loading ? (
        <div className="text-center py-12 text-blue-600 font-medium">Đang tải dữ liệu khiếu nại...</div>
      ) : (
        <div className="space-y-4">
          {disputes.length > 0 ? (
            disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header Card */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg text-gray-900">{dispute.number}</p>
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-1 mt-1">
                      Báo cáo liên quan: <span className="text-blue-600 hover:underline cursor-pointer">{dispute.report}</span>
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(dispute.status)}`}>
                    {getStatusIcon(dispute.status)}
                    <span>{getStatusLabel(dispute.status)}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <p className="text-sm text-gray-500">Người Khiếu Nại</p>
                      <p className="font-bold text-gray-900">{dispute.citizen}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Ngày Tạo</p>
                      <p className="font-medium text-gray-900">{dispute.createdAt}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <MessageSquare size={16} /> Nội dung khiếu nại:
                    </p>
                    <p className="text-sm text-amber-800 italic">"{dispute.content}"</p>
                  </div>
                </div>

                {/* Actions & Responses */}
                {dispute.status === "pending" ? (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button 
                      disabled={actionLoading}
                      onClick={() => handleAction(dispute.id, "resolve")}
                      className="flex-1 py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle size={18} />
                      Đồng Ý & Xử Lý
                    </button>
                    <button 
                      disabled={actionLoading}
                      onClick={() => handleAction(dispute.id, "reject")}
                      className="flex-1 py-2.5 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      Từ Chối
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100">
                    <div className={`rounded-lg p-4 border ${dispute.status === "resolved" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                      <p className={`text-sm font-semibold mb-1 ${dispute.status === "resolved" ? "text-green-900" : "text-red-900"}`}>
                        {dispute.status === "resolved" ? "✓ Quyết định giải quyết:" : "✕ Lý do từ chối:"}
                      </p>
                      <p className={`text-sm ${dispute.status === "resolved" ? "text-green-800" : "text-red-800"}`}>
                        {dispute.adminResponse || "Không có phản hồi chi tiết."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 font-semibold">Không tìm thấy khiếu nại nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};