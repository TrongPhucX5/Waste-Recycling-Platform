import React, { useState, useEffect } from 'react';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Edit2, Trash2, UserCheck, Search } from 'lucide-react';

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

  // Hook gọi API từ Backend .NET
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Build URL với query parameters cho search và filter
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (roleFilter !== 'all') queryParams.append('role', roleFilter);

        // TODO: Thay localhost:5001 bằng cổng chạy API C# của bạn
        const response = await fetch(`http://localhost:8080/api/admin/users?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Mở dòng này khi đã có Auth JWT
          }
        });

        if (response.ok) {
          const result = await response.json();
          // Giả sử API trả về định dạng { data: [...] }
          setUsers(result.data || []); 
        } else {
            // Nếu API chưa sẵn sàng, render tạm mảng rỗng thay vì lỗi màn hình
            setUsers([]);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce: Đợi 500ms sau khi người dùng ngừng gõ mới gọi API
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, roleFilter]); // Tự động gọi lại API khi search hoặc filter thay đổi

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
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
      render: (role: User['role']) => (
        <Badge variant={getRoleBadgeVariant(role)}>{role.toUpperCase()}</Badge>
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
          <Button variant="outline" size="sm" title="Chỉnh sửa quyền">
            <Edit2 size={16} />
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" title="Khóa/Xóa">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <Button>
          <UserCheck className="mr-2 h-4 w-4" /> Thêm quản trị viên
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 flex gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Tìm theo tên hoặc email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-72 transition-all"
                />
            </div>
            <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white cursor-pointer"
            >
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
                <span className="ml-3 text-gray-500">Đang tải dữ liệu...</span>
            </div>
        ) : users.length > 0 ? (
            <Table columns={columns} data={users} />
        ) : (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                Không tìm thấy người dùng nào phù hợp. (Nếu chưa bật Backend, bảng sẽ trống).
            </div>
        )}
      </div>
    </div>
  );
};