"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import UserCard, { type User } from "@/components/users/UserCard";
import Image from "next/image";

/* ─────────────────── Mock Data ─────────────────── */
const ALL_USERS: User[] = [
  {
    id: 1,
    username: "CaptJohn_87",
    email: "john@example.com",
    accessLevel: "PRO",
    reports: 42,
    lastActive: "2 hours ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 2,
    username: "DeepSeaMike",
    email: "mike@example.com",
    accessLevel: "FREE",
    reports: 18,
    lastActive: "5 hours ago",
    avater: "/avater.png",
  },
  {
    id: 3,
    username: "ReefRunner",
    email: "reef@example.com",
    accessLevel: "PRO",
    reports: 127,
    lastActive: "1 day ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 4,
    username: "SpeedFisher",
    email: "speed@example.com",
    accessLevel: "FREE",
    reports: 8,
    lastActive: "3 days ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 5,
    username: "AquaAngler",
    email: "aqua@example.com",
    accessLevel: "PRO",
    reports: 64,
    lastActive: "1 hour ago",

    verified: true,
    avater: "/avater.png",
  },
  {
    id: 6,
    username: "TidalWave99",
    email: "tidal@example.com",
    accessLevel: "FREE",
    reports: 5,
    lastActive: "1 week ago",
    avater: "/avater.png",
  },
  {
    id: 7,
    username: "LakeLegend",
    email: "lake@example.com",
    accessLevel: "PRO",
    reports: 91,
    lastActive: "30 mins ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 8,
    username: "BaitMaster",
    email: "bait@example.com",
    accessLevel: "FREE",
    reports: 22,
    lastActive: "2 days ago",
    avater: "/avater.png",
  },
  {
    id: 9,
    username: "CoralDiver",
    email: "coral@example.com",
    accessLevel: "PRO",
    reports: 55,
    lastActive: "4 hours ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 10,
    username: "WaveCatcher",
    email: "wave@example.com",
    accessLevel: "FREE",
    reports: 3,
    lastActive: "2 weeks ago",
    avater: "/avater.png",
  },
  {
    id: 11,
    username: "FishingKing_01",
    email: "king@example.com",
    accessLevel: "PRO",
    reports: 210,
    lastActive: "Just now",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 12,
    username: "OceanExplorer",
    email: "ocean@example.com",
    accessLevel: "FREE",
    reports: 14,
    lastActive: "6 hours ago",
    avater: "/avater.png",
  },
  {
    id: 13,
    username: "DeepBlueHook",
    email: "hook@example.com",
    accessLevel: "PRO",
    reports: 77,
    lastActive: "2 days ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 14,
    username: "TroutTracker",
    email: "trout@example.com",
    accessLevel: "FREE",
    reports: 9,
    lastActive: "5 days ago",
    avater: "/avater.png",
  },
  {
    id: 15,
    username: "SalmonSurfer",
    email: "salmon@example.com",
    accessLevel: "PRO",
    reports: 33,
    lastActive: "3 hours ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 16,
    username: "MarlinHunter",
    email: "marlin@example.com",
    accessLevel: "FREE",
    reports: 11,
    lastActive: "1 day ago",
    avater: "/avater.png",
  },
  {
    id: 17,
    username: "BassBoss",
    email: "bass@example.com",
    accessLevel: "PRO",
    reports: 88,
    lastActive: "45 mins ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 18,
    username: "CastingPro",
    email: "casting@example.com",
    accessLevel: "FREE",
    reports: 2,
    lastActive: "3 weeks ago",
    avater: "/avater.png",
  },
  {
    id: 19,
    username: "NetNinja",
    email: "net@example.com",
    accessLevel: "PRO",
    reports: 149,
    lastActive: "1 hour ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 20,
    username: "TackleGuru",
    email: "tackle@example.com",
    accessLevel: "FREE",
    reports: 7,
    lastActive: "4 days ago",
    avater: "/avater.png",
  },
  {
    id: 21,
    username: "PiranhaPete",
    email: "pete@example.com",
    accessLevel: "PRO",
    reports: 60,
    lastActive: "2 hours ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 22,
    username: "ShallowWader",
    email: "shallow@example.com",
    accessLevel: "FREE",
    reports: 20,
    lastActive: "6 days ago",
    avater: "/avater.png",
  },
  {
    id: 23,
    username: "RiverRogue",
    email: "river@example.com",
    accessLevel: "PRO",
    reports: 102,
    lastActive: "Just now",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 24,
    username: "LureMaster_X",
    email: "lure@example.com",
    accessLevel: "FREE",
    reports: 16,
    lastActive: "1 week ago",
    avater: "/avater.png",
  },
  {
    id: 25,
    username: "TigerShark99",
    email: "tiger@example.com",
    accessLevel: "PRO",
    reports: 200,
    lastActive: "3 hours ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 26,
    username: "FlatsWalker",
    email: "flats@example.com",
    accessLevel: "FREE",
    reports: 4,
    lastActive: "2 weeks ago",
    avater: "/avater.png",
  },
  {
    id: 27,
    username: "ClamDigger",
    email: "clam@example.com",
    accessLevel: "PRO",
    reports: 38,
    lastActive: "5 hours ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 28,
    username: "SeaweedSam",
    email: "sam@example.com",
    accessLevel: "FREE",
    reports: 12,
    lastActive: "3 days ago",
    avater: "/avater.png",
  },
  {
    id: 29,
    username: "BayouFisher",
    email: "bayou@example.com",
    accessLevel: "PRO",
    reports: 74,
    lastActive: "1 day ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 30,
    username: "IceHolePro",
    email: "ice@example.com",
    accessLevel: "FREE",
    reports: 6,
    lastActive: "1 month ago",
    avater: "/avater.png",
  },
  {
    id: 31,
    username: "NightCrawler",
    email: "night@example.com",
    accessLevel: "PRO",
    reports: 93,
    lastActive: "2 hours ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 32,
    username: "PondHopper",
    email: "pond@example.com",
    accessLevel: "FREE",
    reports: 28,
    lastActive: "4 hours ago",
    avater: "/avater.png",
  },
  {
    id: 33,
    username: "SpinnerBait",
    email: "spinner@example.com",
    accessLevel: "PRO",
    reports: 115,
    lastActive: "30 mins ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 34,
    username: "MudCat_5",
    email: "mudcat@example.com",
    accessLevel: "FREE",
    reports: 1,
    lastActive: "2 months ago",
    avater: "/avater.png",
  },
  {
    id: 35,
    username: "CrappieKing",
    email: "crappie@example.com",
    accessLevel: "PRO",
    reports: 49,
    lastActive: "1 hour ago",
    verified: true,
    avater: "/avater.png",
  },
  {
    id: 36,
    username: "WillowWader",
    email: "willow@example.com",
    accessLevel: "FREE",
    reports: 17,
    lastActive: "2 days ago",
    avater: "/avater.png",
  },
];

const ITEMS_PER_PAGE = 5;

type SubscriptionLevel = "All" | "Free" | "Pro";
type AccountStatus = "All" | "Active" | "Blocked";
type ReportCount = "All" | "Low (< 20)" | "Medium (20-49)" | "High (50+)";

type FilterState = {
  subscriptionLevel: SubscriptionLevel;
  accountStatus: AccountStatus;
  reportCount: ReportCount;
};

export default function UsersPageClient() {
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState<FilterState>({
    subscriptionLevel: "All",
    accountStatus: "All",
    reportCount: "All",
  });
  const [localFilter, setLocalFilter] = useState<FilterState>(filterState);

  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedUser]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Filtered + Searched users ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_USERS.filter((u) => {
      const matchSearch =
        !q ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);

      const sub = filterState.subscriptionLevel;
      const matchSub =
        sub === "All" ||
        (sub === "Pro" && u.accessLevel === "PRO") ||
        (sub === "Free" && u.accessLevel === "FREE");

      const acc = filterState.accountStatus;
      const matchAcc =
        acc === "All" ||
        (acc === "Active" && u.verified) ||
        (acc === "Blocked" && !u.verified);

      const rep = filterState.reportCount;
      let matchRep = true;
      if (rep === "Low (< 20)") matchRep = u.reports < 20;
      else if (rep === "Medium (20-49)")
        matchRep = u.reports >= 20 && u.reports <= 49;
      else if (rep === "High (50+)") matchRep = u.reports >= 50;

      return matchSearch && matchSub && matchAcc && matchRep;
    });
  }, [search, filterState]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  function handleSearchChange(val: string) {
    setSearch(val);
    setCurrentPage(1);
  }

  function applyFilter() {
    setFilterState(localFilter);
    setFilterOpen(false);
    setCurrentPage(1);
  }

  const activeFiltersCount =
    (filterState.subscriptionLevel !== "All" ? 1 : 0) +
    (filterState.accountStatus !== "All" ? 1 : 0) +
    (filterState.reportCount !== "All" ? 1 : 0);

  /* ── Pagination page numbers (with ellipsis) ── */
  function getPageNumbers() {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (safePage > 3) pages.push("...");
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (safePage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="relative flex flex-col gap-5 w-full max-w-full mx-auto animate-fade-in">
      {/* ── Search + Filter Bar ── */}
      <div className="flex items-center gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8a9e] w-4 h-4 pointer-events-none" />
          <input
            id="user-search"
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-[#19304A] border border-[#525D6D] text-white placeholder-[#7a8a9e]
                       pl-11 pr-4 py-3 rounded-2xl text-sm font-medium
                       focus:outline-none focus:border-[#ff6b35]/50 focus:ring-1 focus:ring-[#ff6b35]/20
                       transition-all"
          />
        </div>

        {/* Filter Button + Dropdown */}
        <div className="relative" ref={filterMenuRef}>
          <button
            id="user-filter-btn"
            onClick={() => {
              if (!filterOpen) setLocalFilter(filterState);
              setFilterOpen((p) => !p);
            }}
            className="flex items-center gap-2 bg-[#117A88] hover:bg-[#117A88]/50 text-white
                       px-5 py-3 rounded-2xl text-sm font-semibold border border-[#525D6D]
                       transition-all duration-200 hover:scale-[1.02] active:scale-95
                       shadow-lg shadow-orange-900/20 cursor-pointer"
          >
            <FiFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Serarch filter dropdown  */}
          {filterOpen && (
            <div className="absolute right-0 top-12 z-50 w-[320px] bg-[#222831] border border-[#393e46] rounded-xl shadow-2xl shadow-black/60 p-5 flex flex-col gap-4">
              {/* Subscription Level */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Subscription Level
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["All", "Free", "Pro"] as SubscriptionLevel[]).map(
                    (opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setLocalFilter((p) => ({
                            ...p,
                            subscriptionLevel: opt,
                          }))
                        }
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                          localFilter.subscriptionLevel === opt
                            ? "bg-[#117A88] text-white"
                            : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Account Status */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Account Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["All", "Active", "Blocked"] as AccountStatus[]).map(
                    (opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setLocalFilter((p) => ({ ...p, accountStatus: opt }))
                        }
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                          localFilter.accountStatus === opt
                            ? "bg-[#117A88] text-white"
                            : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Report Count */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Report Count
                </span>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    onClick={() =>
                      setLocalFilter((p) => ({ ...p, reportCount: "All" }))
                    }
                    className={`col-span-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                      localFilter.reportCount === "All"
                        ? "bg-[#117A88] text-white"
                        : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() =>
                      setLocalFilter((p) => ({
                        ...p,
                        reportCount: "Low (< 20)",
                      }))
                    }
                    className={`col-span-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                      localFilter.reportCount === "Low (< 20)"
                        ? "bg-[#117A88] text-white"
                        : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                    }`}
                  >
                    Low (&lt; 20)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setLocalFilter((p) => ({
                        ...p,
                        reportCount: "Medium (20-49)",
                      }))
                    }
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                      localFilter.reportCount === "Medium (20-49)"
                        ? "bg-[#117A88] text-white"
                        : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                    }`}
                  >
                    Medium (20-49)
                  </button>
                  <button
                    onClick={() =>
                      setLocalFilter((p) => ({
                        ...p,
                        reportCount: "High (50+)",
                      }))
                    }
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                      localFilter.reportCount === "High (50+)"
                        ? "bg-[#117A88] text-white"
                        : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                    }`}
                  >
                    High (50+)
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={applyFilter}
                  className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white py-2 px-6 rounded-lg text-sm font-semibold transition-colors"
                >
                  Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Users List Panel ── */}
      <div className="bg-[#19304A] border border-[#223C59] rounded-[20px] p-5 flex flex-col gap-4">
        {/* Header: Total count */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            Total{" "}
            <span className="text-[#7a8a9e] font-semibold">
              ({filtered.length})
            </span>
          </h2>
        </div>
        {/* User Cards */}
        {paginated.length > 0 ? (
          <div className="flex flex-col gap-3">
            {paginated.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onViewDetails={() => setSelectedUser(user)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#5a6a82]">
            <FiSearch className="w-10 h-10 opacity-40" />
            <p className="text-sm font-medium">No users found</p>
            <p className="text-xs opacity-60">
              Try adjusting your search or filter
            </p>
          </div>
        )}
        {/* ── Pagination ── */}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-4 border-t border-[#1f2d40]/40 flex-wrap">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white
                         hover:text-white hover:bg-[#1f2d40]/60 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all"
            >
              <FiChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 text-[#5a6a82] text-sm select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  className={`w-9 h-9 rounded-md text-sm font-semibold transition-all ${
                    safePage === p
                      ? "bg-[#D9ECFF] text-black shadow-md shadow-orange-900/30 border border-[#E4E4E7]"
                      : "text-[#7a8a9e] hover:text-white hover:bg-[#1f2d40]/60"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white
                         hover:text-white hover:bg-[#1f2d40]/60 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all"
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── User Details Modal ── */}
      {mounted &&
        selectedUser &&
        createPortal(
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#1e2330]/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#242b38] w-full max-w-md rounded-2xl border border-[#393e46] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#393e46] shrink-0">
                <h3 className="text-lg font-bold text-white">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#303846] text-[#7a8a9e] hover:text-white hover:bg-[#3d4759] transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-8">
                  {selectedUser?.avater ? (
                    <Image
                      src={"/avater.png"}
                      alt="Avatar"
                      width={60}
                      height={60}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#3a4f70] to-[#243050] flex items-center justify-center text-white font-bold text-2xl shrink-0 border-2 border-[#2a3a58]">
                      {selectedUser.username
                        .replace(/[^a-zA-Z]/g, "")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-bold text-white">
                      {selectedUser.username}
                    </h4>
                    <p className="text-[#7a8a9e] text-sm">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">Status</span>
                    <span
                      className={`text-sm font-semibold uppercase ${selectedUser.verified !== false ? "text-[#00d287]" : "text-red-400"}`}
                    >
                      {selectedUser.verified !== false ? "ACTIVE" : "BLOCKED"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">Access Level</span>
                    <span
                      className={`text-sm font-semibold uppercase ${selectedUser.accessLevel === "PRO" ? "text-[#ff6b35]" : "text-[#94a3b8]"}`}
                    >
                      {selectedUser.accessLevel}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">Join Date</span>
                    <span className="text-sm font-semibold text-white">
                      2025-01-15
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">
                      Total Reports
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {selectedUser.reports}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
