"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import Cards from "./Cards";
import RecentActivity from "./RecentActivity";
import AccessLevelDistribution from "./AccessLevelDistribution";

export default function DashboardContainer() {
  const { data, isLoading, isError, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 w-full max-w-full mx-auto animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800 rounded-3xl h-68 w-full"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-800 rounded-[20px] w-full border border-slate-700"></div>
        <div className="h-64 bg-slate-800 rounded-[20px] w-full border border-slate-700"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-8 text-center bg-red-900/20 text-red-400 rounded-xl border border-red-900/50">
        <p className="font-semibold text-lg">Failed to load dashboard data</p>
        <p className="text-sm mt-2">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data?.data) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-full mx-auto animate-fade-in">
      <Cards
        stats={data.data.stats}
        monthlyRevenue={data.data.monthlyRevenue}
        monthlyRegistrations={data?.data?.monthlyRegistrations}
      />
      <RecentActivity activities={data.data.recentActivity} />
      <AccessLevelDistribution
        distribution={data.data.accessLevelDistribution}
      />
    </div>
  );
}
