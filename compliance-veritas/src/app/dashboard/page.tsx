"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RiskChart } from "@/components/dashboard/RiskChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCards />
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskChart />
        <RecentActivities />
      </div>
    </MainLayout>
  );
}