"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CheckCircle2, XCircle, Eye, Search, Filter, AlertTriangle } from 'lucide-react';
import { enterpriseAdminApi, EnterpriseListItem } from '@/lib/api/enterpriseAdminApi';

export const EnterpriseManagement: React.FC = () => {
  const [enterprises, setEnterprises] = useState<EnterpriseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Verified' | 'Rejected'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // Modal states
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; enterpriseId: string | null }>({ isOpen: false, enterpriseId: null });
  const [detailData, setDetailData] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; enterpriseId: string | null; isReapproval?: boolean }>({ isOpen: false, enterpriseId: null });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; enterpriseId: string | null; reason: string }>({ isOpen: false, enterpriseId: null, reason: '' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch enterprises
  const fetchEnterprises = useCallback(async (silentLoad = false) => {
    if (!silentLoad) setIsLoading(true);
    setError(null);
    try {
      const isVerifiedFilter = statusFilter === 'all' ? undefined : statusFilter === 'Verified';
      const result = await enterpriseAdminApi.getEnterprises(
        page,
        pageSize,
        isVerifiedFilter,
        searchTerm || undefined
      );
      
      setEnterprises(result.data);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch enterprises');
    } finally {
      if (!silentLoad) setIsLoading(false);
    }
  }, [page, pageSize, statusFilter, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEnterprises(page === 1 ? false : true);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchEnterprises, page, statusFilter, searchTerm]);

  // Fetch enterprise detail
  useEffect(() => {
    if (detailModal.isOpen && detailModal.enterpriseId) {
      const fetchDetail = async () => {
        setLoadingDetail(true);
        try {
          const result = await enterpriseAdminApi.getEnterpriseDetail(detailModal.enterpriseId!);
          setDetailData(result.data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch enterprise detail');
        } finally {
          setLoadingDetail(false);
        }
      };
      fetchDetail();
    }
  }, [detailModal]);

  // Approve enterprise
  const handleApprove = async () => {
    if (!approveModal.enterpriseId) return;
    setIsSubmitting(true);
    try {
      await enterpriseAdminApi.verifyEnterprise(approveModal.enterpriseId);
      setSuccessMessage('Enterprise approved successfully');
      setApproveModal({ isOpen: false, enterpriseId: null, isReapproval: false });
      setDetailModal({ isOpen: false, enterpriseId: null });
      fetchEnterprises(true);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve enterprise');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reject enterprise
  const handleReject = async () => {
    if (!rejectModal.enterpriseId || !rejectModal.reason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    setIsSubmitting(true);
    try {
      await enterpriseAdminApi.rejectEnterprise(rejectModal.enterpriseId, rejectModal.reason);
      setSuccessMessage('Enterprise rejected successfully');
      setRejectModal({ isOpen: false, enterpriseId: null, reason: '' });
      setDetailModal({ isOpen: false, enterpriseId: null });
      fetchEnterprises(true);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject enterprise');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Verified': return 'success';
      case 'Rejected': return 'danger';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Verified': return 'Đã duyệt';
      case 'Rejected': return 'Bị từ chối';
      case 'Pending': return 'Chờ duyệt';
      default: return status;
    }
  };

  const columns = [
    { key: 'companyName' as const, label: 'Tên Công Ty', width: '25%' },
    { 
      key: 'status' as const, 
      label: 'Trạng Thái',
      width: '15%',
      render: (status: string) => (
        <Badge variant={getStatusBadgeVariant(status)}>
          {getStatusLabel(status)}
        </Badge>
      )
    },
    { 
      key: 'serviceArea' as const, 
      label: 'Khu Vực Phục Vụ',
      width: '20%',
      render: (area?: string) => {
        if (!area) return '-';
        try {
          // Thử parse nếu là JSON (cho dữ liệu cũ)
          const parsed = JSON.parse(area);
          return Array.isArray(parsed) ? parsed.join(', ') : parsed;
        } catch (e) {
          // Nếu không phải JSON (là dữ liệu VARCHAR mới), hiển thị trực tiếp luôn
          return area;
        }
      }
    },
    { key: 'createdAt' as const, label: 'Ngày Tạo', width: '15%', render: (date: string) => new Date(date).toLocaleDateString('vi-VN') },
    {
      key: 'id' as const,
      label: 'Hành Động',
      width: '25%',
      render: (_: any, row: EnterpriseListItem) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDetailModal({ isOpen: true, enterpriseId: row.id })}
            className="gap-1"
          >
            <Eye size={16} /> Chi tiết
          </Button>
          {row.status === 'Pending' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => setApproveModal({ isOpen: true, enterpriseId: row.id, isReapproval: false })}
                className="gap-1"
              >
                <CheckCircle2 size={16} /> Duyệt
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setRejectModal({ isOpen: true, enterpriseId: row.id, reason: '' })}
                className="gap-1"
              >
                <XCircle size={16} /> Từ chối
              </Button>
            </>
          )}
          {row.status === 'Verified' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => setRejectModal({ isOpen: true, enterpriseId: row.id, reason: '' })}
              className="gap-1"
            >
              <XCircle size={16} /> Huỷ duyệt
            </Button>
          )}
          {row.status === 'Rejected' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => setApproveModal({ isOpen: true, enterpriseId: row.id, isReapproval: true })}
              className="gap-1"
            >
              <CheckCircle2 size={16} /> Duyệt lại
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Doanh Nghiệp</h2>
        <p className="text-gray-600">Xem xét và phê duyệt đơn đăng ký doanh nghiệp</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-red-800">Lỗi</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex gap-2 items-center">
                <Search size={16} /> Tìm kiếm công ty
              </div>
            </label>
            <input
              type="text"
              placeholder="Nhập tên công ty..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex gap-2 items-center">
                <Filter size={16} /> Trạng thái
              </div>
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Tất cả</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Verified">Đã duyệt</option>
              <option value="Rejected">Bị từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : enterprises.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            Không có doanh nghiệp nào
          </div>
        ) : (
          <Table columns={columns} data={enterprises} />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} trên {total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Trước
            </Button>
            <span className="flex items-center gap-2">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Chi Tiết Doanh Nghiệp</h3>
              <button
                onClick={() => setDetailModal({ isOpen: false, enterpriseId: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {loadingDetail ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
              ) : detailData ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tên Công Ty</label>
                    <p className="text-base text-gray-900">{detailData.companyName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-base text-gray-900">{detailData.userEmail || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tên Liên Hệ</label>
                      <p className="text-base text-gray-900">{detailData.userFullName || '-'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Khu Vực Phục Vụ</label>
                    <p className="text-base text-gray-900">{detailData.serviceArea || '-'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Năng Lực (kg/ngày)</label>
                    <p className="text-base text-gray-900">{detailData.capacityKgPerDay || '-'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Trạng Thái</label>
                      <Badge variant={getStatusBadgeVariant(detailData.status)}>
                        {getStatusLabel(detailData.status)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ngày Tạo</label>
                      <p className="text-base text-gray-900">{new Date(detailData.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Số Người Thu Gom</label>
                      <p className="text-base text-gray-900">{detailData.collectorCount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Loại Rác Thu Gom</label>
                      <p className="text-base text-gray-900">{detailData.wasteTypeCount}</p>
                    </div>
                  </div>

                  {detailData.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <label className="text-sm font-medium text-red-800">Lý Do Từ Chối</label>
                      <p className="text-sm text-red-700 mt-1">{detailData.rejectionReason}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Không có dữ liệu</p>
              )}
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDetailModal({ isOpen: false, enterpriseId: null })}
              >
                Đóng
              </Button>
              {detailData?.status === 'Pending' && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => setApproveModal({ isOpen: true, enterpriseId: detailData.id, isReapproval: false })}
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setRejectModal({ isOpen: true, enterpriseId: detailData.id, reason: '' })}
                  >
                    Từ chối
                  </Button>
                </>
              )}
              {detailData?.status === 'Verified' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setRejectModal({ isOpen: true, enterpriseId: detailData.id, reason: '' })}
                >
                  Huỷ duyệt
                </Button>
              )}
              {detailData?.status === 'Rejected' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => setApproveModal({ isOpen: true, enterpriseId: detailData.id, isReapproval: true })}
                >
                  Duyệt lại
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex gap-3 mb-4">
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {approveModal.isReapproval ? 'Phê duyệt lại doanh nghiệp?' : 'Phê duyệt doanh nghiệp?'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {approveModal.isReapproval 
                    ? 'Bạn chắc chắn muốn phê duyệt lại doanh nghiệp này?' 
                    : 'Bạn chắc chắn muốn phê duyệt doanh nghiệp này?'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setApproveModal({ isOpen: false, enterpriseId: null, isReapproval: false })}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                variant="success"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleApprove}
              >
                {approveModal.isReapproval ? 'Phê duyệt lại' : 'Phê duyệt'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex gap-3 mb-4">
              <XCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900">Từ chối doanh nghiệp</h3>
                <p className="text-gray-600 text-sm">Vui lòng nhập lý do từ chối/huỷ duyệt</p>
              </div>
            </div>
            <textarea
              placeholder="Nhập lý do..."
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRejectModal({ isOpen: false, enterpriseId: null, reason: '' })}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleReject}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
