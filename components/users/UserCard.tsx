"use client";

import { Ban } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

export type User = {
  id: number;
  username: string;
  email: string;
  accessLevel: "PRO" | "FREE";
  reports: number;
  lastActive: string;
  avater: string;
  avatar?: string;
  verified?: boolean;
};

type UserCardProps = {
  user: User;
  onViewDetails?: () => void;
};

function DropdownMenu({
  onClose,
  onViewDetails,
}: {
  onClose: () => void;
  onViewDetails?: () => void;
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

  const actions = [
    { label: "View Details", icon: FiEye, onClick: onViewDetails },
    { label: "Downgrade to Free", icon: FiEdit2 },
    { label: "Block User", icon: Ban, danger: true },
    { label: "Remove User", icon: FiTrash2, danger: true },
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
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${danger
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

export default function UserCard({ user, onViewDetails }: UserCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user.username
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-[#1E3A5A] border border-[#47596E] rounded-2xl px-5 py-4 flex flex-col gap-3 hover:border-[#2a3f60]/80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group">
      {/* Top Row: Avatar + Name/Email + Dots Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3a4f70] to-[#243050] flex items-center justify-center text-white font-bold text-sm shrink-0 border border-[#2a3a58]">
            <Image src={"/avater.png"} alt={initials} width={50} height={50} />
          </div>

          {/* Name + Email */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white truncate">
                {user.username}
              </span>
              {user.verified && (
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
            />
          )}
        </div>
      </div>

      {/* Bottom Row: Stats */}
      <div className="grid grid-cols-3 gap-4 pt-1 border-t border-[#1f2d40]/40">
        {/* Access Level */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-[#DFE3E8] uppercase tracking-wider font-medium">
            Access Level
          </span>
          <span
            className={`text-[14px] font-bold ${user.accessLevel === "PRO" ? "text-[#ff6b35]" : "text-[#94a3b8]"
              }`}
          >
            {user.accessLevel}
          </span>
        </div>

        {/* Reports */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-[#DFE3E8] uppercase tracking-wider font-medium">
            Reports
          </span>
          <span className="text-[14px] font-bold text-white">
            {user.reports}
          </span>
        </div>

        {/* Last Active */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-[#DFE3E8] uppercase tracking-wider font-medium">
            Last Active
          </span>
          <span className="text-[14px] font-semibold text-white">
            {user.lastActive}
          </span>
        </div>
      </div>
    </div>
  );
}
