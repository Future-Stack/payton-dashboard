"use client";

import { Ban, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

export type ApiUser = {
  userId: string;
  name: string;
  email: string;
  profileImage: string | null;
  role: string;
  status: string;
  createdAt: string;
  lastActive: string | null;
  reportsCount: number;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string | null;
  };
};

type UserCardProps = {
  user: ApiUser;
  onViewDetails?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
};

function DropdownMenu({
  onClose,
  onViewDetails,
  onDelete,
  onToggleStatus,
  userStatus,
}: {
  onClose: () => void;
  onViewDetails?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
  userStatus: string;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const isSuspended = userStatus === "SUSPEND";

  const actions = [
    { label: "View Details", icon: FiEye, onClick: onViewDetails },
    { 
      label: isSuspended ? "Activate User" : "Suspend User", 
      icon: isSuspended ? CheckCircle : Ban, 
      danger: !isSuspended, 
      onClick: onToggleStatus 
    },
    { label: "Remove User", icon: FiTrash2, danger: true, onClick: onDelete },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-8 z-50 w-54 bg-[#1a2540] border border-[#2a3a58] rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-dropdown"
    >
      {actions.map(({ label, icon: Icon, danger, onClick }) => (
        <button
          key={label}
          onClick={() => {
            if (onClick) onClick();
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
            danger
              ? "text-red-400 hover:bg-red-500/10"
              : "text-slate-300 hover:bg-[#243050] hover:text-white"
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}

export default function UserCard({
  user,
  onViewDetails,
  onDelete,
  onToggleStatus,
}: UserCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user.name
    ? user.name
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="bg-[#1E3A5A] border border-[#47596E] rounded-2xl px-5 py-4 flex flex-col gap-3 hover:border-[#2a3f60]/80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group">
      {/* Top Row: Avatar + Name/Email + Dots Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3a4f70] to-[#243050] flex items-center justify-center text-white font-bold text-sm shrink-0 border border-[#2a3a58] overflow-hidden">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={initials}
                width={50}
                height={50}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Name + Email */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white truncate">
                {user.name}
              </span>
              {user.status === "ACTIVE" && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-orange-500/20 shrink-0">
                  <svg
                    className="w-2.5 h-2.5 text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>
            <span className="text-xs text-[#7a8a9e] truncate">
              {user.email}
            </span>
          </div>
        </div>

        {/* Dots Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="User options"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a8a9e] hover:text-white hover:bg-[#243050] transition-all"
          >
            <FiMoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <DropdownMenu
              onClose={() => setMenuOpen(false)}
              onViewDetails={onViewDetails}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              userStatus={user.status}
            />
          )}
        </div>
      </div>

      {/* Bottom Row: Stats */}
      <div className="grid grid-cols-4 gap-4 pt-1 border-t border-[#1f2d40]/40">
        {/* Access Level */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-[#DFE3E8] uppercase tracking-wider font-medium">
            Access Level
          </span>
          <span
            className={`text-[14px] font-bold ${
              user.subscription?.plan === "PRO" &&
              user.subscription?.status === "ACTIVE"
                ? "text-[#ff6b35]"
                : "text-[#94a3b8]"
            }`}
          >
            {user.subscription?.plan === "PRO" &&
            user.subscription?.status === "ACTIVE"
              ? "PRO"
              : "FREE"}
          </span>
        </div>

        {/* Reports */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-[#DFE3E8] uppercase tracking-wider font-medium">
            Reports
          </span>
          <span className="text-[14px] font-bold text-white">
            {user.reportsCount}
          </span>
        </div>

        {/* Last Active */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-[#DFE3E8] uppercase tracking-wider font-medium">
            Last Active
          </span>
          <span className="text-[14px] font-semibold text-white">
            {user.lastActive
              ? formatDistanceToNow(new Date(user.lastActive), {
                  addSuffix: true,
                })
              : "Never"}
          </span>
        </div>
        {/* User Status */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-[#DFE3E8] uppercase tracking-wider font-medium">
            Status
          </span>
          <span className="text-[14px] font-semibold text-white">
            {user.status}
          </span>
        </div>
      </div>
    </div>
  );
}
