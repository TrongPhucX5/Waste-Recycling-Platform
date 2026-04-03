"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Trophy, Medal, Award, Users, MapPin, TrendingUp, Calendar, Filter, Crown, Star } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  reports: number;
  rank: number;
  change: number;
  area: string;
  badges: string[];
  level: string;
}

interface AreaLeaderboard {
  area: string;
  totalPoints: number;
  totalReports: number;
  participants: number;
  rank: number;
  change: number;
}

// Giữ lại mock data cho Tab Khu vực trong lúc chờ Backend WRP-122
const mockAreaLeaders: AreaLeaderboard[] = [
  { area: "Quận 7, Hồ Chí Minh", totalPoints: 15420, totalReports: 823, participants: 156, rank: 1, change: 0 },
  { area: "Thủ Đức, Hồ Chí Minh", totalPoints: 14250, totalReports: 756, participants: 142, rank: 2, change: 1 },
  { area: "Quận 1, Hồ Chí Minh", totalPoints: 13180, totalReports: 698, participants: 128, rank: 3, change: -1 },
  { area: "Quận Bình Thạnh, Hồ Chí Minh", totalPoints: 12540, totalReports: 642, participants: 118, rank: 4, change: 2 },
  { area: "Quận 3, Hồ Chí Minh", totalPoints: 11970, totalReports: 589, participants: 105, rank: 5, change: -2 }
];

const timeRanges = [
  { value: "month", label: "Tháng này" },
  { value: "quarter", label: "Quý này" },
  { value: "year", label: "Năm nay" },
  { value: "all", label: "Tất cả thời gian" }
];

// Mảng avatar ngẫu nhiên cho sinh động
const randomAvatars = ["👩‍💼", "👨‍🌾", "👩‍🎓", "👨‍💻", "👩‍🏫", "👨‍🔧", "👩‍⚕️"];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"individual" | "area">("individual");
  const [timeRange, setTimeRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // States cho dữ liệu thật
  const [individualLeaders, setIndividualLeaders] = useState<LeaderboardEntry[]>([]);
  const [areaLeaders, setAreaLeaders] = useState<AreaLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [areaLoading, setAreaLoading] = useState(true);
  const [footerStats, setFooterStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    totalReports: 0,
    treesSaved: 0
  });

  useEffect(() => {
    // 1. Fetch Leaderboard Cá Nhân (Public - không cần token)
    const fetchIndividualLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/citizens/rewards/leaderboard?page=1&pageSize=50");

        if (response.ok) {
          const json = await response.json();
          const apiData = json.data || [];
          
          const formatted = apiData.map((item: any, index: number): LeaderboardEntry => {
            let level = "Thành viên Đồng";
            let badges = ["Mới tham gia"];
            if (item.totalPoints >= 2000) { level = "Thành viên Bạch Kim"; badges = ["Chiến thần xanh", "Thành viên VIP"]; }
            else if (item.totalPoints >= 1000) { level = "Thành viên Vàng"; badges = ["Chuyên gia", "Báo cáo nhanh"]; }
            else if (item.totalPoints >= 500) { level = "Thành viên Bạc"; badges = ["Tích cực"]; }

            return {
              id: item.citizenId,
              name: item.citizenName,
              points: item.totalPoints,
              reports: item.reportCount,
              rank: index + 1,
              change: 0, // Backend hiện tại chưa lưu lịch sử thay đổi rank
              area: "Hồ Chí Minh", // Backend hiện tại chưa join bảng User để lấy Address
              badges: badges,
              level: level,
              avatar: randomAvatars[index % randomAvatars.length]
            };
          });
          setIndividualLeaders(formatted);
        }
      } catch (error) {
        console.error("Lỗi fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    // 2. Fetch Khu Vực (THÊM MỚI VÀO ĐÂY)
    const fetchAreaLeaderboard = async () => {
      try {
        setAreaLoading(true);
        const response = await fetch("http://localhost:8080/api/citizens/rewards/leaderboard/area?page=1&pageSize=50");
        if (response.ok) {
          const json = await response.json();
          const apiData = json.data || [];
          
          const formatted = apiData.map((item: any, index: number) => ({
            area: item.area,
            totalPoints: item.totalPoints,
            totalReports: item.totalReports,
            participants: item.participants,
            rank: index + 1,
            change: 0 // Mock change
          }));
          setAreaLeaders(formatted);
        }
      } catch (error) {
        console.error("Lỗi fetch area leaderboard:", error);
      } finally {
        setAreaLoading(false);
      }
    };

    // 3. Fetch Footer Stats (Giữ nguyên như cũ)
    const fetchFooterStats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/public/statistics");
        if (response.ok) {
          const json = await response.json();
          const data = json.data || json;
          setFooterStats({
            totalUsers: data.totalUsers || 0,
            totalPoints: data.totalPoints || 0,
            totalReports: data.totalReports || 0, // Giả định có
            treesSaved: data.treesSaved || 0
          });
        }
      } catch (error) {
        console.error("Lỗi fetch stats:", error);
      }
    };

    fetchIndividualLeaderboard();
    fetchAreaLeaderboard(); // Gọi hàm mới
    fetchFooterStats();
  }, []);

  const filteredIndividuals = useMemo(() => {
    return individualLeaders.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.area.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [individualLeaders, searchTerm]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300";
      case 2: return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300";
      case 3: return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300";
      default: return "bg-white border-gray-200";
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Bảng Xếp Hạng</h1>
          </div>
          <p className="text-emerald-100 text-lg">
            Vinh danh các "Chiến thần xanh" và khu vực tiêu biểu trong việc bảo vệ môi trường
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("individual")}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "individual" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="w-4 h-4" /> Cá nhân
              </button>
              <button
                onClick={() => setActiveTab("area")}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "area" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MapPin className="w-4 h-4" /> Khu vực
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {activeTab === "individual" && (
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tên hoặc khu vực..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "individual" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="lg:col-span-3 text-center py-12 text-gray-500">Đang tải bảng xếp hạng...</div>
            ) : filteredIndividuals.length === 0 ? (
              <div className="lg:col-span-3 text-center py-12 text-gray-500">Không tìm thấy dữ liệu.</div>
            ) : (
              <>
                {/* Top 3 Winners */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {filteredIndividuals.slice(0, 3).map((person) => (
                      <div key={person.id} className={`relative rounded-2xl border-2 p-6 text-center ${getRankColor(person.rank)}`}>
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                            person.rank === 1 ? "bg-yellow-500" : person.rank === 2 ? "bg-gray-400" : "bg-amber-600"
                          }`}>
                            {getRankIcon(person.rank)}
                          </div>
                        </div>

                        <div className="text-6xl mb-4 mt-8">{person.avatar}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{person.name}</h3>
                        <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                          {person.level}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Điểm:</span>
                            <span className="font-bold text-lg text-emerald-600">{formatNumber(person.points)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Báo cáo:</span>
                            <span className="font-semibold">{formatNumber(person.reports)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{person.area}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 justify-center">
                          {person.badges.map((badge, i) => (
                            <span key={i} className="px-2 py-1 bg-white rounded-full text-xs font-medium border border-gray-200">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rest of List */}
                <div className="lg:col-span-3 space-y-4">
                  {filteredIndividuals.slice(3).map((person) => (
                    <div key={person.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-12 text-center">
                        {getRankIcon(person.rank)}
                      </div>
                      <div className="text-3xl hidden sm:block">{person.avatar}</div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-semibold text-gray-900">{person.name}</h3>
                        <p className="text-sm text-gray-600 flex justify-center sm:justify-start items-center gap-1">
                          <MapPin className="w-3 h-3" /> {person.area}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                            {person.level}
                          </span>
                        </div>
                      </div>
                      <div className="text-center sm:text-right mt-4 sm:mt-0">
                        <div className="text-xl font-bold text-emerald-600">{formatNumber(person.points)}</div>
                        <div className="text-sm text-gray-600">{formatNumber(person.reports)} báo cáo</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Area Leaderboard */
          <div className="space-y-4">
            {areaLeaders.map((area) => (
              <div key={area.area} className={`bg-white rounded-xl shadow-sm border-2 p-6 ${getRankColor(area.rank)}`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 text-center">
                      {getRankIcon(area.rank)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{area.area}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {formatNumber(area.participants)} người
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" /> {formatNumber(area.totalReports)} báo cáo
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-gray-100">
                    <div className="text-2xl font-bold text-emerald-600">{formatNumber(area.totalPoints)}</div>
                    <div className="text-sm text-gray-600">điểm tổng</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats - Lấy data thật từ API */}
        <div className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Thống kê toàn hệ thống</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">{formatNumber(footerStats.totalUsers)}</div>
                <div className="text-sm text-gray-600">Người dùng tích cực</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{formatNumber(footerStats.totalPoints)}</div>
                <div className="text-sm text-gray-600">Tổng điểm thưởng</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-1">{formatNumber(footerStats.totalReports)}</div>
                <div className="text-sm text-gray-600">Báo cáo hợp lệ</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">{formatNumber(footerStats.treesSaved)}</div>
                <div className="text-sm text-gray-600">Cây xanh đã cứu</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}