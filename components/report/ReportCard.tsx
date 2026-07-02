"use client";

import { useState } from "react";
import { FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { TbRipple, TbMapPin, TbAnchor, TbFish } from "react-icons/tb";

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
  return name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();
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

export default function ReportCard({
  report,
  onApprove,
  onDelete,
}: ReportCardProps) {
  const [localStatus, setLocalStatus] = useState(report.status);
  const [deleted, setDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div
            className={`
              w-10 h-10 rounded-full bg-linear-to-br ${getAvatarGradient(report.id)}
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
            <span className="text-xs text-[#6a7e9a] mt-0.5">
              {report.timeAgo}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {report.flagCount && (
            <span
              className="text-[12px] text-[#FF6B35] font-semibold rounded-sm px-4 py-1"
              style={{
                background: "rgba(255, 107, 53, 0.2)",
              }}
            >
              {report.flagCount} flags
            </span>
          )}
          <span
            className={`
              text-[12px] text-[#FF6B35] font-semibold rounded-sm px-4 py-1 uppercase tracking-wide
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
          onClick={() => setIsModalOpen(true)}
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
          aria-label={`Delete report by ${report.username}`}
          onClick={handleDelete}
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

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden">
          {/* Modal Container */}
          <div className="bg-[#1C2028] w-full max-w-110 rounded-2xl shadow-2xl shadow-black/50 border border-[#2A303C] flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#2A303C] shrink-0">
              <h2 className="text-xl font-bold text-white">Report Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2A303C] hover:bg-[#343B4A] text-gray-400 transition-colors cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-6 overflow-hidden">
              {/* Report Information Container */}
              <div className="bg-[#242933] border border-[#2A303C] rounded-2xl p-4 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">
                    Report Information
                  </h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981]/10 rounded-md border border-[#10B981]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                    <span className="text-xs text-[#10B981] font-medium">
                      Online
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                    <span className="text-[#8B95A5] text-sm">User</span>
                    <span className="text-white text-sm font-medium">
                      {report.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                    <span className="text-[#8B95A5] text-sm">Grid</span>
                    <span className="text-white text-sm font-medium">
                      {report.grid}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                    <span className="text-[#8B95A5] text-sm">Species</span>
                    <span className="text-white text-sm font-medium">
                      {report.species}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                    <span className="text-[#8B95A5] text-sm">Status</span>
                    <span
                      className={`text-sm font-bold uppercase ${
                        localStatus === "approved"
                          ? "text-[#10B981]"
                          : localStatus === "tagged"
                            ? "text-[#FF6B35]"
                            : "text-[#3B82F6]"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                    <span className="text-[#8B95A5] text-sm">Flags</span>
                    <span className="text-white text-sm font-bold">
                      {report.flagCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fishing Details Container */}
              <div className="bg-[#242933] border border-[#2A303C] rounded-2xl p-4 shrink-0">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Fishing Details
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <TbRipple className="w-5 h-5" />
                      <span className="text-[#8B95A5] text-sm">Depth</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      120 ft
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                    <div className="flex items-center gap-2 text-blue-400">
                      <TbMapPin className="w-5 h-5" />
                      <span className="text-[#8B95A5] text-sm">Position</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      Suspended
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <TbAnchor className="w-5 h-5" />
                      <span className="text-[#8B95A5] text-sm">Method</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      Trolling
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                    <div className="flex items-center gap-2 text-teal-400">
                      <TbFish className="w-5 h-5" />
                      <span className="text-[#8B95A5] text-sm">Bait</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      Ballyhoo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
