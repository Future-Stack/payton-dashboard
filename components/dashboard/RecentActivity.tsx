"use client";

import { FiCheck, FiFileText } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { DashboardStatsResponse } from "@/services/api/dashboardService";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  activities: DashboardStatsResponse["data"]["recentActivity"];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <section
      className="     p-6 md:p-8"
      style={{
        borderRadius: "20px",
        border: "1px solid #223C59",
        background: "#19304A",
      }}
    >
      <h2 className="text-lg font-bold text-white mb-5 tracking-wide">
        Recent Activity
      </h2>

      <div className="flex flex-col gap-3">
        {activities.slice(0, 5).map((activity, index) => {
          let Icon = FiCheck;
          let iconBg = "bg-[#10b981]";
          let dotColor = "bg-[#10b981]";

          if (activity.type === "REPORT_SUBMITTED") {
            Icon = FiFileText;
            iconBg = "bg-[#fd5c28]";
            dotColor = "bg-[#fd5c28]";
          } else if (activity.type === "USER_REGISTERED") {
            Icon = FiCheck;
            iconBg = "bg-[#10b981]";
            dotColor = "bg-[#10b981]";
          } else if (activity.type === "PRO_UPGRADE") {
            Icon = FaCrown;
            iconBg = "bg-[#0ea5e9]";
            dotColor = "bg-[#0ea5e9]";
          }

          const [title, user] = activity.message.split(":");

          return (
            <div
              key={index}
              className="flex items-center justify-between   hover:bg-[#0d131f]/80 transition-colors   px-5 py-4 group"
              style={{
                borderRadius: " 12px",
                background: " rgba(34, 68, 107, 0.50)",
                backdropFilter: " blur(29.5px)",
              }}
            >
              {/* Left: Icon + Content */}
              <div className="flex items-center gap-4">
                {/* Icon bubble */}
                <div
                  className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center text-white shadow-sm shrink-0`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-white leading-snug group-hover:text-slate-50 transition-colors">
                    {title?.trim()}
                  </span>
                  <span className="text-xs text-[#8f9cae] font-medium">
                    {user?.trim()}
                  </span>
                </div>
              </div>

              {/* Right: Timestamp */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8f9cae] shrink-0 ml-4">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-60`}
                />
                <span>
                  {formatDistanceToNow(new Date(activity.timestamp))} ago
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
