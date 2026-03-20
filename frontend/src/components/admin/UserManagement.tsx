import React, { useState, useEffect, useCallback } from 'react';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Edit2, Trash2, UserCheck, Search, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'citizen' | 'collector' | 'enterprise';
  isActive: boolean;
  lastActiveDate: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // --- States cho Form Thêm ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '', fullName: '', phone: '', role: 'admin', district: '', ward: ''
  });

  // --- States cho Modal Khóa/Mở Khóa ---
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, userId: '', isActive: false });
  const [isToggling, setIsToggling] = useState(false);

  // --- States cho Modal Đổi Quyền ---
  const [editRoleModal, setEditRoleModal] = useState({ isOpen: false, userId: '', role: '' });
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // 👉 NÂNG CẤP 1: Thêm tham số silentLoad để không làm chớp bảng
  const fetchUsers = useCallback(async (silentLoad = false) => {
    if (!silentLoad) setIsLoading(true); // Chỉ hiện spinner to khi load lần đầu hoặc search
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (roleFilter !== 'all') queryParams.append('role', roleFilter);

      const response = await fetch(`http://localhost:8080/api/admin/users?${queryParams.toString()}`);
      if (response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    } finally {
      if (!silentLoad) setIsLoading(false);
    }
  }, [searchTerm, roleFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(false); // Gõ search thì vẫn hiện loading cho người ta biết
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchUsers]);

  // --- NÂNG CẤP 2: Hàm thêm User gọi silentLoad ---
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsAddModalOpen(false);
        setFormData({ email: '', fullName: '', phone: '', role: 'admin', district: '', ward: '' });
        fetchUsers(true); // True = Tải lại ngầm, không chớp bảng
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- NÂNG CẤP 3: Hàm thực thi Khóa/Mở khóa ---
  const executeToggleStatus = async () => {
    setIsToggling(true);
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${confirmModal.userId}/toggle-status`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setConfirmModal({ isOpen: false, userId: '', isActive: false });
        fetchUsers(true); // Tải lại ngầm
      }
    } finally {
      setIsToggling(false);
    }
  };

  // --- NÂNG CẤP 4: Hàm thực thi Đổi quyền ---
  const executeUpdateRole = async () => {
    setIsUpdatingRole(true);
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${editRoleModal.userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole: editRoleModal.role })
      });
      if (response.ok) {
        setEditRoleModal({ isOpen: false, userId: '', role: '' });
        fetchUsers(true); // Tải lại ngầm
      }
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'primary';
      case 'enterprise': return 'info';
      case 'collector': return 'warning';
      default: return 'success';
    }
  };

  const columns = [
    { key: 'fullName', label: 'Tên người dùng' },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Vai trò',
      render: (role: string) => (
        <Badge variant={getRoleBadgeVariant(role)}>{role?.toUpperCase() || 'UNKNOWN'}</Badge>
      )
    },
    { 
      key: 'isActive', 
      label: 'Trạng thái',
      render: (isActive: boolean) => (
        <Badge variant={isActive ? 'success' : 'danger'}>
          {isActive ? 'Hoạt động' : 'Tạm khóa'}
        </Badge>
      )
    },
    { key: 'lastActiveDate', label: 'Hoạt động cuối' },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_: unknown, user: User) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            title="Chỉnh sửa quyền"
            onClick={() => setEditRoleModal({ isOpen: true, userId: user.id, role: user.role })}
          >
            <Edit2 size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={user.isActive ? "text-red-500 border-red-200 hover:bg-red-50" : "text-green-500 border-green-200 hover:bg-green-50"} 
            title={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
            onClick={() => setConfirmModal({ isOpen: true, userId: user.id, isActive: user.isActive })}
          >
            {user.isActive ? <Trash2 size={16} /> : <UserCheck size={16} />}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white shadow-md">
          <UserCheck className="mr-2 h-4 w-4" /> Thêm quản trị viên
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 flex gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Tìm theo tên hoặc email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-72 transition-all" />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white cursor-pointer" >
                <option value="all">Tất cả vai trò</option>
                <option value="citizen">Citizen</option>
                <option value="collector">Collector</option>
                <option value="enterprise">Enterprise</option>
                <option value="admin">Admin</option>
            </select>
        </div>
        
        {isLoading ? (
            <div className="py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
        ) : users.length > 0 ? (
            <Table columns={columns} data={users} />
        ) : (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">Không tìm thấy người dùng nào phù hợp.</div>
        )}
      </div>

      {/* --- MODAL THÊM --- (Giữ nguyên không đổi) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Thêm Người Dùng Mới</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" required placeholder="Nguyễn Văn A" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required placeholder="email@example.com" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input type="text" placeholder="090..." className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none bg-white" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="admin">Quản trị viên</option>
                    <option value="collector">Người thu gom</option>
                    <option value="enterprise">Doanh nghiệp</option>
                    <option value="citizen">Người dân</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Hủy</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:bg-orange-300">{isSubmitting ? 'Đang lưu...' : 'Lưu lại'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL XÁC NHẬN KHÓA/MỞ KHÓA (Giao diện chuẩn thực tế) --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl text-center">
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${confirmModal.isActive ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
              {confirmModal.isActive ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {confirmModal.isActive ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {confirmModal.isActive 
                ? 'Tài khoản này sẽ không thể đăng nhập vào hệ thống nữa. Bạn có chắc chắn không?' 
                : 'Tài khoản này sẽ được phép hoạt động trở lại trong hệ thống.'}
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setConfirmModal({ isOpen: false, userId: '', isActive: false })} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium w-full">Hủy</button>
              <button onClick={executeToggleStatus} disabled={isToggling} className={`px-5 py-2.5 text-white rounded-lg font-medium w-full ${confirmModal.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {isToggling ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CHỌN QUYỀN (Thay cho window.prompt phèn) --- */}
      {editRoleModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Cập nhật Vai trò</h3>
              <button onClick={() => setEditRoleModal({ isOpen: false, userId: '', role: '' })} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Chọn quyền hạn mới cho người dùng này trong hệ thống.</p>
            <div className="mb-6">
              <select 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-800 font-medium"
                value={editRoleModal.role} 
                onChange={(e) => setEditRoleModal({ ...editRoleModal, role: e.target.value })}
              >
                <option value="admin">Quản trị viên (Admin)</option>
                <option value="collector">Người thu gom (Collector)</option>
                <option value="enterprise">Doanh nghiệp (Enterprise)</option>
                <option value="citizen">Người dân (Citizen)</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditRoleModal({ isOpen: false, userId: '', role: '' })} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Hủy</button>
              <button onClick={executeUpdateRole} disabled={isUpdatingRole} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                {isUpdatingRole ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};