import React, { useState } from 'react';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface Dispute {
    id: string;
    submittedBy: string;
    type: 'points' | 'report' | 'classification';
    status: 'open' | 'resolved' | 'rejected';
    description: string;
    date: string;
}

const initialDisputes: Dispute[] = [
    { id: 'D-001', submittedBy: 'Nguyễn Văn A', type: 'points', status: 'open', description: 'Chưa nhận được điểm thưởng cho báo cáo #123', date: '2024-03-14' },
    { id: 'D-002', submittedBy: 'Trần Thị B', type: 'classification', status: 'resolved', description: 'AI phân loại sai rác hữu cơ thành rác tái chế', date: '2024-03-13' },
    { id: 'D-003', submittedBy: 'Công ty C', type: 'report', status: 'open', description: 'Báo cáo sai sự thật về địa điểm thu gom', date: '2024-03-15' },
];

export const DisputeResolution: React.FC = () => {
    const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);

    const columns = [
        { key: 'id', label: 'Mã khiếu nại' },
        { key: 'submittedBy', label: 'Người gửi' },
        { 
            key: 'type', 
            label: 'Loại',
            render: (type: Dispute['type']) => (
                <span className="capitalize">{type}</span>
            )
        },
        { 
          key: 'status', 
          label: 'Trạng thái',
          render: (status: Dispute['status']) => (
            <Badge variant={status === 'resolved' ? 'success' : status === 'open' ? 'warning' : 'danger'}>
              {status === 'open' ? 'Chờ xử lý' : status === 'resolved' ? 'Đã giải quyết' : 'Từ chối'}
            </Badge>
          )
        },
        { key: 'description', label: 'Nội dung', width: '30%' },
        { key: 'date', label: 'Ngày gửi' },
        {
          key: 'actions',
          label: 'Hành động',
          render: (_: unknown, row: Dispute) => (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" title="Duyệt">
                <CheckCircle size={18} />
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" title="Từ chối">
                <XCircle size={18} />
              </Button>
              <Button variant="outline" size="sm" title="Chi tiết">
                <MessageSquare size={18} />
              </Button>
            </div>
          )
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Giải quyết tranh chấp & Khiếu nại</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex gap-4 mb-4">
                     <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="open">Chờ xử lý</option>
                        <option value="resolved">Đã giải quyết</option>
                     </select>
                </div>
                <Table columns={columns} data={disputes} />
            </div>
        </div>
    );
};
