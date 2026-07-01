"use client";

import { useState } from "react";
import { FiTrash2, FiCheck } from "react-icons/fi";

export type Report = {
  id: number;
  username: string;
  avatar?: string;
  timeAgo: string;
  status: "approved" | "tagged" | "pending";
  flagCount?: number;
  grid: string;
  species: string;
};

type ReportCardProps = {
  report: Report;
  onApprove?: (id: number) => void;
  onDelete?: (id: number) => void;
};

function getInitials(name: string) {
  return name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
}

function getAvatarGradient(id: number) {
  const gradients = [
    "from-[#2d6a9f] to-[#1a3f6f]",
    "from-[#2d7a6a] to-[#1a4f40]",
    "from-[#6a2d9f] to-[#3f1a6f]",
    "from-[#9f6a2d] to-[#6f3f1a]",
    "from-[#2d4a9f] to-[#1a2f6f]",
    "from-[#9f2d6a] to-[#6f1a40]",
  ];
  return gradients[id % gradients.length];
}

export default function ReportCard({ report, onApprove, onDelete }: ReportCardProps) {
  const [localStatus, setLocalStatus] = useState(report.status);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  function handleApprove() {
    setLocalStatus("approved");
    onApprove?.(report.id);
  }

  function handleDelete() {
    setDeleted(true);
    onDelete?.(report.id);
  }

  const statusLabel =
    localStatus === "approved"
      ? "approved"
      : localStatus === "tagged"
      ? "tagged"
      : "pending";

  const statusClass =
    localStatus === "approved"
      ? "bg-[#1a6a4a]/80 text-emerald-300 border border-emerald-700/40"
      : localStatus === "tagged"
      ? "bg-[#7c3a1a]/80 text-orange-300 border border-orange-700/40"
      : "bg-[#1a2a5a]/80 text-blue-300 border border-blue-700/40";

  const showActionButtons = localStatus === "tagged";

  return (
    <div
      className="
        bg-[#0e1929] border border-[#1a2d45]/60 rounded-2xl p-5
        hover:border-[#1e3555]/80 hover:shadow-xl hover:shadow-black/30
        transition-all duration-300 group animate-fade-in
      "
      role="article"
      aria-label={`Report by ${report.username}`}
    >
      {/* ── Top Row: Avatar + Name + Status ── */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className={`
              w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(report.id)}
              flex items-center justify-center text-white font-bold text-xs
              shrink-0 border-2 border-[#1f3252]/60 shadow-md
            `}
          >
            {getInitials(report.username)}
          </div>

          {/* Name + Time */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate leading-tight">
              {report.username}
            </span>
            <span className="text-xs text-[#6a7e9a] mt-0.5">{report.timeAgo}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {report.flagCount && (
            <span className="text-[10px] text-orange-400 font-semibold">
              {report.flagCount} flags
            </span>
          )}
          <span
            className={`
              text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wide
              ${statusClass}
            `}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* ── Grid + Species Row ── */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#4a5e78] uppercase tracking-wider font-medium">
            Grid
          </span>
          <span className="text-sm font-semibold text-[#c8d8e8]">{report.grid}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#4a5e78] uppercase tracking-wider font-medium">
            Species
          </span>
          <span className="text-sm font-semibold text-[#c8d8e8]">{report.species}</span>
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
            text-center
          "
          onClick={() => console.log("View details for", report.id)}
        >
          View Details
        </button>

        {/* Approve Button (only for tagged) */}
        {showActionButtons && (
          <button
            id={`approve-${report.id}`}
            aria-label={`Approve report by ${report.username}`}
            onClick={handleApprove}
            className="
              w-10 h-10 rounded-xl bg-[#1a3a2a] hover:bg-[#1f4a35]
              border border-emerald-800/40 hover:border-emerald-600/60
              flex items-center justify-center text-emerald-400
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
          aria-label={`Delete report by ${report.username}`}
          onClick={handleDelete}
          className="
            w-10 h-10 rounded-xl bg-[#3a1a1a] hover:bg-[#4a2020]
            border border-red-900/40 hover:border-red-700/60
            flex items-center justify-center text-red-400
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
