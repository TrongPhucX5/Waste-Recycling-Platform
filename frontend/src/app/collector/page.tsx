import React from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { CollectorDashboard } from "../../components/collector/CollectorDashboard";

export default function CollectorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CollectorDashboard />
      </main>
      <Footer />
    </div>
  );
}