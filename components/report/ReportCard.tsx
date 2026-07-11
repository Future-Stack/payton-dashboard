"use client";

import { useState } from "react";
import { FiTrash2, FiCheck } from "react-icons/fi";

export type Report = {
  id: string;
  username: string;
  avatar?: string | null;
  timeAgo: string;
  confirmBite: number;
  status:
    | "APPROVED"
    | "REMOVED"
    | "PENDING"
    | "approved"
    | "tagged"
    | "pending";
  flagCount?: number;
  grid: string;
  species: string;

  // Extra fields for details modal
  depth?: string;
  position?: string;
  method?: string;
  bait?: string;
  email?: string;
};

type ReportCardProps = {
  report: Report;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (report: Report) => void;
};

function getInitials(name: string) {
  return (
    name
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 2)
      .toUpperCase() || "US"
  );
}

function getAvatarGradient(id: string) {
  const gradients = [
    "from-[#2d6a9f] to-[#1a3f6f]",
    "from-[#2d7a6a] to-[#1a4f40]",
    "from-[#6a2d9f] to-[#3f1a6f]",
    "from-[#9f6a2d] to-[#6f3f1a]",
    "from-[#2d4a9f] to-[#1a2f6f]",
    "from-[#9f2d6a] to-[#6f1a40]",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export default function ReportCard({
  report,
  onViewDetails,
  onDelete,
}: ReportCardProps) {
  const [localStatus, setLocalStatus] = useState(report.status);

  const showActionButtons = localStatus === "tagged";

  return (
    <div
      className="
        bg-[#1E3A5A] border border-[#47596E] rounded-2xl p-5
        hover:border-[#1e3555]/80 hover:shadow-xl hover:shadow-black/30
        transition-all duration-300 group animate-fade-in "
      role="article"
      aria-label={`Report by ${report.username}`}
    >
      {/* ── Top Row: Avatar + Name + Status ── */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          {report.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={report.avatar}
              alt={report.username}
              className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-[#1f3252]/60 shadow-md"
            />
          ) : (
            <div
              className={`
                w-10 h-10 rounded-full bg-linear-to-br ${getAvatarGradient(report.id)}
                flex items-center justify-center text-white font-bold text-xs
                shrink-0 border-2 border-[#1f3252]/60 shadow-md
              `}
            >
              {getInitials(report.username)}
            </div>
          )}

          {/* Name + Time */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate leading-tight">
              {report.username}
            </span>
            <span className="text-xs text-[#6a7e9a] mt-0.5">
              {report.timeAgo}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {report.confirmBite && (
            <span
              className="text-[12px] text-[#FF6B35] font-semibold rounded-sm px-4 py-1"
              style={{
                background: "rgba(255, 107, 53, 0.2)",
              }}
            >
              {report.confirmBite} flags
            </span>
          )}

          <span
            className={`
              text-[12px] text-[#FF6B35] font-semibold rounded-sm px-4 py-1 uppercase tracking-wide
              ${report.status === "APPROVED" && "bg-[#10B981]/20 text-[#10B981]"}
            `}
          >
            {report.status}
          </span>
        </div>
      </div>

      {/* ── Grid + Species Row ── */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">
            Grid
          </span>
          <span className="text-sm font-semibold text-white">
            {report.grid}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">
            Species
          </span>
          <span className="text-sm font-semibold text-white">
            {report.species}
          </span>
        </div>
      </div>

      {/* ── Action Row: View Details + Approve/Delete ── */}
      <div className="flex items-center gap-2">
        {/* View Details Button */}
        <button
          id={`view-details-${report.id}`}
          className="
            flex-1 bg-[#0a9396] hover:bg-[#0b8285] active:bg-[#087275]
            text-white text-sm font-semibold py-2.5 px-4 rounded-xl
            transition-all duration-200 hover:shadow-lg hover:shadow-cyan-900/30
            text-center cursor-pointer
          "
          onClick={() => onViewDetails?.(report)}
        >
          View Details
        </button>

        {/* Approve Button (only for tagged) */}
        {showActionButtons && (
          <button
            id={`approve-${report.id}`}
            aria-label={`Approve report by ${report.username}`}
            className="
              w-10 h-10 rounded-xl bg-[#10B981]  
              border border-emerald-800/40 hover:border-emerald-600/60
              flex items-center justify-center text-white
              transition-all duration-200 hover:scale-105 active:scale-95
              shrink-0
            "
          >
            <FiCheck className="w-4 h-4" />
          </button>
        )}

        {/* Delete Button */}
        <button
          id={`delete-${report.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(report.id);
          }}
          aria-label={`Delete report by ${report.username}`}
          className="
            w-10 h-10 rounded-xl bg-[#FB2C36] hover:bg-[#4a2020]
            border border-red-900/40 
            flex items-center justify-center text-white
            transition-all duration-200 hover:scale-105 active:scale-95
            shrink-0
          "
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
