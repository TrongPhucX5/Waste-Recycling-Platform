import React from 'react';
import { Card } from '../ui/Card';
import { BarChart, Activity, Users, FileText, AlertTriangle } from 'lucide-react';
import { StatCard } from '../shared/StatCard';

export const SystemActivity: React.FC = () => {
  const stats = [
    { title: 'Tổng người dùng', value: '1,234', icon: Users, trend: 'up' as const, trendValue: '+12%', color: 'blue' as const },
    { title: 'Báo cáo mới', value: '85', icon: FileText, trend: 'up' as const, trendValue: '+5%', color: 'green' as const },
    { title: 'Khiếu nại đang xử lý', value: '12', icon: AlertTriangle, trend: 'down' as const, trendValue: '-2%', color: 'red' as const },
    { title: 'Lượng rác tái chế (kg)', value: '5,600', icon: BarChart, trend: 'up' as const, trendValue: '+20%', color: 'amber' as const },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Giám sát hệ thống</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            label={stat.title} 
            value={stat.value} 
            icon={<stat.icon size={24} />}
            trend={stat.trend}
            trendValue={stat.trendValue}
            color={stat.color} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-80">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Phân bố người dùng</h3>
            <div className="flex h-full items-center justify-center text-gray-400">
              [Biểu đồ tròn User Types Placeholder]
            </div>
          </div>
        </Card>
        <Card className="h-80">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Lưu lượng truy cập hệ thống (Real-time)</h3>
            <div className="flex h-full items-center justify-center text-gray-400">
              [Biểu đồ đường Traffic Placeholder]
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Log hoạt động gần đây</h3>
        <div className="space-y-4">
          {[
            { user: 'Nguyễn Văn A', action: 'Đã gửi báo cáo rác thải', time: '10 phút trước' },
            { user: 'Admin System', action: 'Đã duyệt tài khoản doanh nghiệp X', time: '1 giờ trước' },
            { user: 'Trần Thị B', action: 'Yêu cầu hỗ trợ về điểm thưởng', time: '2 giờ trước' },
            { user: 'Hệ thống AI', action: 'Tự động phân loại 15 ảnh rác', time: '3 giờ trước' },
          ].map((log, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-emerald-500" />
                <span className="font-medium text-gray-700">{log.user}</span>
                <span className="text-gray-500 text-sm">{log.action}</span>
              </div>
              <span className="text-xs text-gray-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
