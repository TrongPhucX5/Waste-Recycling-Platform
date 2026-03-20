import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { BarChart as BarChartIcon, Activity, Users, FileText, AlertTriangle } from 'lucide-react';
import { StatCard } from '../shared/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#3B82F6'];

interface DashboardStats {
  totalUsers: number;
  totalReports: number;
  pendingComplaints: number;
  totalWasteWeight: number;
  monthlyTraffic?: { month: string; count: number; userCount?: number }[];
  userDistribution?: { role: string; count: number }[];
  recentLogs?: { user: string; action: string; time: string; type: string }[];
}

export const SystemActivity: React.FC = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Khởi tạo state bằng mảng rỗng (Chờ dữ liệu thật từ API)
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Đã hardcode URL Backend Docker
        const response = await fetch('http://localhost:8080/api/admin/users/stats');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        
        if (json.data) {
          setData(json.data);

          // 1. Cập nhật Line Chart nếu API có trả về monthlyTraffic
          if (json.data.monthlyTraffic && json.data.monthlyTraffic.length > 0) {
            const chartData = json.data.monthlyTraffic.map((item: any) => ({
              name: item.month,
              reports: item.count,
              users: item.userCount || 0 // Không dùng số ảo nữa
            }));
            setTrafficData(chartData);
          }

          // 2. Cập nhật Pie Chart nếu API có trả về userDistribution
          if (json.data.userDistribution && json.data.userDistribution.length > 0) {
            const pieChartData = json.data.userDistribution.map((item: any) => ({
              name: item.role === 'citizen' ? 'Người dân' : 
                    item.role === 'collector' ? 'Người thu gom' : 'Doanh nghiệp',
              value: item.count
            }));
            setPieData(pieChartData);
          }

          // 3. Cập nhật Log hoạt động nếu API có trả về recentLogs
          if (json.data.recentLogs && json.data.recentLogs.length > 0) {
            setLogs(json.data.recentLogs);
          }
        }
        setError(null);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        // Không fallback về dữ liệu giả nữa
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  // Cấu trúc mảng thẻ thống kê
  const stats = data ? [
    { title: 'Tổng người dùng', value: data.totalUsers.toLocaleString(), icon: Users, trend: 'up' as const, trendValue: '+0%', color: 'blue' as const },
    { title: 'Báo cáo mới', value: data.totalReports.toLocaleString(), icon: FileText, trend: 'up' as const, trendValue: '+0%', color: 'green' as const },
    { title: 'Khiếu nại chờ', value: data.pendingComplaints.toLocaleString(), icon: AlertTriangle, trend: 'down' as const, trendValue: '-0%', color: 'red' as const },
    { title: 'Rác tái chế (kg)', value: Math.round(data.totalWasteWeight).toLocaleString(), icon: BarChartIcon, trend: 'up' as const, trendValue: '+0%', color: 'amber' as const },
  ] : [
    { title: 'Tổng người dùng', value: '0', icon: Users, trend: 'up' as const, trendValue: '0%', color: 'blue' as const },
    { title: 'Báo cáo mới', value: '0', icon: FileText, trend: 'up' as const, trendValue: '0%', color: 'green' as const },
    { title: 'Khiếu nại chờ', value: '0', icon: AlertTriangle, trend: 'down' as const, trendValue: '0%', color: 'red' as const },
    { title: 'Rác tái chế (kg)', value: '0', icon: BarChartIcon, trend: 'up' as const, trendValue: '0%', color: 'amber' as const },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Giám sát hệ thống</h2>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
          Cập nhật lúc: {new Date().toLocaleTimeString()}
          {error && <span className="text-red-500 ml-2">(Lỗi: {error})</span>}
        </span>
      </div>
      
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Đường */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Lưu lượng báo cáo & truy cập (7 tháng gần đây)</h3>
          <div className="h-72 flex items-center justify-center">
            {trafficData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="users" name="Người dùng" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="reports" name="Báo cáo" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 italic">Chưa có dữ liệu thống kê theo tháng</p>
            )}
          </div>
        </div>

        {/* Biểu đồ Tròn */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Phân bố tài khoản</h3>
          <div className="h-64 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 italic">Chưa có dữ liệu phân bố</p>
            )}
          </div>
          
          {/* Chú thích màu sắc (Chỉ hiện khi có dữ liệu) */}
          {pieData.length > 0 && (
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log hoạt động */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Log hoạt động gần đây</h3>
        <div className="space-y-3">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-3 rounded-lg transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${log.type === 'report' ? 'bg-green-100 text-green-600' : log.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Activity size={16} />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 block text-sm">{log.user}</span>
                    <span className="text-gray-500 text-xs">{log.action}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{log.time}</span>
              </div>
            ))
          ) : (
             <p className="text-gray-400 italic text-center py-4">Chưa có hoạt động nào gần đây</p>
          )}
        </div>
      </div>
    </div>
  );
};