"use client";
import React from "react";
import { EnterpriseDashboard } from "@/components/enterprise/EnterpriseDashboard";
import { EnterpriseStatusCheck } from "@/components/enterprise/EnterpriseStatusCheck";

export default function EnterprisePage() {
  return (
    <EnterpriseStatusCheck>
      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <EnterpriseDashboard />
      </main>
    </EnterpriseStatusCheck>
  );
}
