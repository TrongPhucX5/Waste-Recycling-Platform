"use client";
import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { reportApi } from "../../lib/api/reportApi";
import { MessageSquare, CheckCircle, XCircle } from "lucide-react";

export const EnterpriseComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    try {
      const resp = await reportApi.getEnterpriseComplaints(1, 50, statusFilter === "all" ? undefined : statusFilter);
      setComplaints(resp.data || []);
    } catch (err) {
      console.error("Lỗi load complaints", err);
      alert("Không thể tải danh sách khiếu nại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  // SignalR connection to receive new complaint notifications
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ?? "http://localhost:8080";
    const conn = new HubConnectionBuilder()
      .withUrl(`${apiBase}/hubs/task`, { accessTokenFactory: () => localStorage.getItem("token") || "" })
      .withAutomaticReconnect()
      .build();

    conn.start().then(() => {
      conn.on("NewComplaint", (payload: any) => {
        // Simple strategy: reload list when notified
        load();
      });
    }).catch((err) => {
      console.warn("SignalR connect failed", err);
    });

    return () => {
      conn.stop().catch(() => {});
    };
  }, []);

  const handleAction = async (id: string, action: "resolve" | "reject") => {
    const reason = window.prompt(action === "resolve" ? "Nhập ghi chú/đáp ứng khi giải quyết:" : "Nhập lý do từ chối:");
    if (reason === null) return;
    if (reason.trim() === "") { alert("Vui lòng nhập nội dung"); return; }

    try {
      setActionLoading(true);
      if (action === "resolve") {
        await reportApi.enterpriseResolveComplaint(id, reason);
        alert("Đã giải quyết khiếu nại");
      } else {
        await reportApi.enterpriseRejectComplaint(id, reason);
        alert("Đã từ chối khiếu nại");
      }
      load();
    } catch (err) {
      console.error(err);
      alert("Thao tác thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Khiếu nại của người dân</h2>
        <p className="text-gray-600">Danh sách khiếu nại liên quan tới doanh nghiệp của bạn</p>
      </div>

      <div className="flex items-center gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded">
          <option value="all">Tất cả</option>
          <option value="Open">Mới</option>
          <option value="InProgress">Đang xử lý</option>
          <option value="Resolved">Đã giải quyết</option>
          <option value="Rejected">Bị từ chối</option>
        </select>
        <button onClick={load} className="px-3 py-2 bg-emerald-500 text-white rounded">Làm mới</button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : complaints.length === 0 ? (
        <div className="text-gray-500">Không có khiếu nại</div>
      ) : (
        <div className="space-y-4">
          {complaints.map(c => (
            <div key={c.id} className="p-4 border rounded bg-white">
              <div className="flex justify-between">
                <div>
                  <div className="font-bold">{c.reportId ? `Báo cáo ${String(c.reportId).slice(0,8)}` : "Không có báo cáo"}</div>
                  <div className="text-sm text-gray-600">{c.citizenName || "Người dùng ẩn danh"} • {new Date(c.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm font-semibold">{c.status}</div>
              </div>

              <div className="mt-3 bg-gray-50 p-3 rounded">{c.content}</div>

              <div className="flex gap-2 mt-3">
                {c.status === "Open" && (
                  <>
                    <button disabled={actionLoading} onClick={() => handleAction(c.id, "resolve")} className="px-3 py-2 bg-emerald-600 text-white rounded flex items-center gap-2">
                      <CheckCircle size={16} /> Đồng ý & Tạo nhiệm vụ
                    </button>
                    <button disabled={actionLoading} onClick={() => handleAction(c.id, "reject")} className="px-3 py-2 border border-red-500 text-red-600 rounded flex items-center gap-2">
                      <XCircle size={16} /> Từ chối
                    </button>
                  </>
                )}
                {c.status !== "Open" && (
                  <div className="text-sm text-gray-700">Phản hồi: {c.adminResponse || "Không có"}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
