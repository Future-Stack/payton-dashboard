import Cards from "@/components/dashboard/Cards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AccessLevelDistribution from "@/components/dashboard/AccessLevelDistribution";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-full mx-auto animate-fade-in">
      {/* 4 Metric Cards Grid */}
      <Cards />

      {/* Recent Activity List */}
      <RecentActivity />

      {/* Access Level Distribution Progress bars */}
      <AccessLevelDistribution />
    </div>
  );
}
