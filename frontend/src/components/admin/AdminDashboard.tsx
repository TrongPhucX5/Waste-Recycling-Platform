"use client";
import React, { useState } from 'react';
import { Users, Activity, AlertTriangle, Cpu, LayoutDashboard } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { SystemActivity } from './SystemActivity';

type Tab = 'dashboard' | 'users' | 'activity' | 'disputes' | 'ai-tools';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'users' as Tab, label: 'Quản lý người dùng', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SystemActivity />;
      case 'users':
        return <UserManagement />;
      case 'activity':
        return <SystemActivity />; // Reusing for now or could be more detailed logs
      default:
        return <SystemActivity />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Navigation - could be separate component but keeping here for simplicity context */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
            <h1 className="text-xl font-bold text-amber-600 flex items-center gap-2">
                <span className="bg-amber-100 p-1 rounded">♻️</span> Admin Portal
            </h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <Icon size={20} className={isActive ? 'text-amber-600' : 'text-gray-400'} />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
             <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">AD</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Administrator</p>
                    <p className="text-xs text-gray-500 truncate">admin@system.com</p>
                </div>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
             <h1 className="font-bold text-gray-800">Admin Dashboard</h1>
             {/* Simple mobile menu trigger could go here */}
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};
