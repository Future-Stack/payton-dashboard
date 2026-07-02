"use client";

import { FiCheck, FiFileText } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

type ActivityType = {
  id: number;
  title: string;
  user: string;
  time: string;
  icon: React.ElementType;
  iconBg: string;
  dotColor: string;
};

const activities: ActivityType[] = [
  {
    id: 1,
    title: "New user registered",
    user: "FishMaster_22",
    time: "5 min ago",
    icon: FiCheck,
    iconBg: "bg-[#10b981]",
    dotColor: "bg-[#10b981]",
  },
  {
    id: 2,
    title: "Pro upgrade",
    user: "Capt.John_87",
    time: "30 min ago",
    icon: FaCrown,
    iconBg: "bg-[#0ea5e9]",
    dotColor: "bg-[#0ea5e9]",
  },
  {
    id: 3,
    title: "Report submitted",
    user: "Capt.John_87",
    time: "40 min ago",
    icon: FiFileText,
    iconBg: "bg-[#fd5c28]",
    dotColor: "bg-[#fd5c28]",
  },
  {
    id: 4,
    title: "Report submitted",
    user: "Capt.John_87",
    time: "1 hour ago",
    icon: FiFileText,
    iconBg: "bg-[#fd5c28]",
    dotColor: "bg-[#fd5c28]",
  },
];

export default function RecentActivity() {
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
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
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
                  className={`w-10 h-10 rounded-full ${activity.iconBg} flex items-center justify-center text-white shadow-sm shrink-0`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-white leading-snug group-hover:text-slate-50 transition-colors">
                    {activity.title}
                  </span>
                  <span className="text-xs text-[#8f9cae] font-medium">
                    {activity.user}
                  </span>
                </div>
              </div>

              {/* Right: Timestamp */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8f9cae] shrink-0 ml-4">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${activity.dotColor} opacity-60`}
                />
                <span>+ {activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
