"use client";
import React, { useState } from "react";
import { MapPin, Search, Filter, Trash2, Briefcase } from "lucide-react";

export const NearYouPage: React.FC = () => {
  const [radius, setRadius] = useState(2);
  const [filterType, setFilterType] = useState("all");

  const activities = [
    {
      id: 1,
      type: "report",
      title: "Rác tại số 45 Trần Duy Hưng",
      distance: 0.2,
      time: "10 phút trước",
      icon: "🗑️",
      reporter: "Nguyễn Văn B",
      status: "pending",
    },
    {
      id: 2,
      type: "business",
      title: "ABC Recycling Company",
      distance: 0.5,
      icon: "♻️",
      address: "789 Cầu Giấy",
      wasteTypes: "Hữu cơ, Tái chế",
      status: "active",
    },
    {
      id: 3,
      type: "report",
      title: "Rác quanh bến xe",
      distance: 1.2,
      time: "1 giờ trước",
      icon: "🗑️",
      reporter: "Trần Thị C",
      status: "in_progress",
    },
    {
      id: 4,
      type: "business",
      title: "XYZ Waste Management",
      distance: 1.5,
      icon: "♻️",
      address: "123 Hàng Bài",
      wasteTypes: "Nguy hiểm, Khác",
      status: "active",
    },
  ];

  const filteredActivities =
    filterType === "all"
      ? activities
      : activities.filter((a) => a.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hoạt Động Gần Đây
        </h1>
        <p className="text-gray-600">Báo cáo rác & doanh nghiệp xung quanh bạn</p>
      </div>

      {/* Radius Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <label className="block text-sm font-semibold text-gray-900">
          Bán Kính: {radius} km
        </label>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.5"
          value={radius}
          onChange={(e) => setRadius(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>0.5 km</span>
          <span>5 km</span>
          <span>10 km</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "all", label: "Tất cả", icon: "📍" },
          { value: "report", label: "Báo Cáo Rác", icon: "🗑️" },
          { value: "business", label: "Doanh Nghiệp", icon: "♻️" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterType(filter.value)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterType === filter.value
                ? "bg-[#0AA468] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            {activity.type === "report" ? (
              // Report Item
              <div className="flex items-start gap-4">
                <span className="text-3xl">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                      {activity.status === "pending" ? "Chờ xử lý" : "Đang xử lý"}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Báo cáo bởi {activity.reporter}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#0AA468]">
                    {activity.distance} km
                  </p>
                </div>
              </div>
            ) : (
              // Business Item
              <div className="flex items-start gap-4">
                <span className="text-3xl">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <MapPin size={14} />
                    {activity.address}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activity.wasteTypes?.split(",").map((type, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-green-100 text-green-700 rounded px-2 py-1"
                      >
                        {type.trim()}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ✓ Hoạt động
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#0AA468]">
                    {activity.distance} km
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};