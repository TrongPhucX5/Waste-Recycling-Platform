import React from "react";
import { CollectorDashboard } from "@/components/collector/CollectorDashboard";

export default function CollectorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Collector Portal</h1>
          <p className="mt-2 text-gray-600">Track assigned tasks, update collection status, and view history.</p>
        </div>
        <CollectorDashboard />
      </main>
    </div>
  );
}