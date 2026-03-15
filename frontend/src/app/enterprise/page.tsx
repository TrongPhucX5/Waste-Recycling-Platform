"use client";
import React from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { EnterpriseDashboard } from "../../components/enterprise/EnterpriseDashboard";

export default function EnterprisePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Enterprise Portal</h1>
          <p className="mt-2 text-gray-600">Manage recycling operations, track collections, and configure rewards.</p>
        </div>
        <EnterpriseDashboard />
      </main>
      <Footer />
    </div>
  );
}
