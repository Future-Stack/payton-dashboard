"use client";

import { DashboardStatsResponse } from "@/services/api/dashboardService";

interface AccessLevelDistributionProps {
  distribution: DashboardStatsResponse['data']['accessLevelDistribution'];
}

export default function AccessLevelDistribution({ distribution }: AccessLevelDistributionProps) {
  // Map API response colors depending on label
  const items = distribution.map(item => {
    let barColor = "from-[#26d0be] to-[#00897b]";
    if (item.label === "Pro Users") {
      barColor = "from-[#ff7a45] to-[#fd5c28]";
    }
    return {
      label: item.label,
      count: item.count,
      percent: item.percentage,
      barColor,
    };
  });

  return (
    <section className="bg-[#19304A] rounded-3xl border border-[#1f2d40]/40 shadow-lg p-6 md:p-8">
      <h2 className="text-lg font-bold text-white mb-6 tracking-wide">
        Access Level Distribution
      </h2>

      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2.5">
            {/* Row: Label + Count */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8f9cae] font-medium">
                {item.label}
              </span>
              <span className="text-sm font-bold text-white">
                {item.count.toLocaleString()} ({item.percent}%)
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 bg-[#0d131f]/70 rounded-full overflow-hidden border border-[#1f2d40]/30">
              <div
                className={`h-full bg-gradient-to-r ${item.barColor} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
