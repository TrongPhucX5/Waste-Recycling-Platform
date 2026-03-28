"use client";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { RouteGuard } from "@/components/auth/RouteGuard";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requiredRole="citizen">
      <div className="min-h-screen">
        <Navbar />
        {children}
      </div>
    </RouteGuard>
  );
}
