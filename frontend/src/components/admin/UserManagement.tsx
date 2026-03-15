import React, { useState } from 'react';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Edit2, Trash2, Shield, UserCheck } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'citizen' | 'collector' | 'enterprise';
  status: 'active' | 'suspended';
  lastActive: string;
}

const initialUsers: User[] = [
  { id: '1', name: 'Nguyễn Văn A', email: 'a.nguyen@example.com', role: 'citizen', status: 'active', lastActive: '2024-03-15 10:30' },
  { id: '2', name: 'Trần Thị B', email: 'b.tran@example.com', role: 'collector', status: 'active', lastActive: '2024-03-14 15:45' },
  { id: '3', name: 'Công ty Môi trường X', email: 'contact@env-x.com', role: 'enterprise', status: 'active', lastActive: '2024-03-15 09:00' },
  { id: '4', name: 'Admin User', email: 'admin@system.com', role: 'admin', status: 'active', lastActive: 'Now' },
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'primary';
      case 'enterprise': return 'info';
      case 'collector': return 'warning';
      default: return 'success';
    }
  };

  const columns = [
    { key: 'name', label: 'Tên người dùng' },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Vai trò',
      render: (role: User['role']) => (
        <Badge variant={getRoleBadgeVariant(role)}>{role.toUpperCase()}</Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Trạng thái',
      render: (status: User['status']) => (
        <Badge variant={status === 'active' ? 'success' : 'danger'}>
          {status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
        </Badge>
      )
    },
    { key: 'lastActive', label: 'Hoạt động cuối' },
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <Button>
          <UserCheck className="mr-2 h-4 w-4" /> Thêm quản trị viên
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-4 flex gap-4">
            <input 
                type="text" 
                placeholder="Tìm kiếm người dùng..." 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="all">Tất cả vai trò</option>
                <option value="citizen">Citizen</option>
                <option value="collector">Collector</option>
                <option value="enterprise">Enterprise</option>
                <option value="admin">Admin</option>
            </select>
        </div>
        <Table columns={columns} data={users} />
      </div>
    </div>
  );
};
