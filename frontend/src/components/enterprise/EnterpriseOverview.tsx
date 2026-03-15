import React from "react";
import { Card } from "../ui";
import { EnterpriseRequest } from "./types";

interface EnterpriseOverviewProps {
  capacity: {
    maxCapacity: number;
    wasteTypes: string[];
    serviceArea: string;
  };
  requests: EnterpriseRequest[];
}

export const EnterpriseOverview: React.FC<EnterpriseOverviewProps> = ({ capacity, requests }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 bg-white border border-gray-100 shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Capacity</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{capacity.maxCapacity} kg</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">45% Used</p>
      </Card>
      
      <Card className="p-6 bg-white border border-gray-100 shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Pending Requests</h3>
        <p className="text-3xl font-bold text-yellow-600 mt-2">
          {requests.filter(r => r.status === "PENDING").length}
        </p>
        <p className="text-xs text-gray-500 mt-2">Action needed</p>
      </Card>

      <Card className="p-6 bg-white border border-gray-100 shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Collected</h3>
        <p className="text-3xl font-bold text-emerald-600 mt-2">1,250 kg</p>
        <p className="text-xs text-gray-500 mt-2">+12% from last month</p>
      </Card>

      {/* Charts Section Placeholder */}
      <div className="md:col-span-3 mt-6">
        <Card className="p-6">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Collection Trends</h3>
           <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l border-gray-200">
              {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="w-full bg-emerald-100 hover:bg-emerald-200 rounded-t-md relative group transition-all" style={{ height: `${h}%` }}>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                     {h * 10}kg
                   </div>
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-2 text-xs text-gray-500 px-4">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </Card>
      </div>
    </div>
  );
};