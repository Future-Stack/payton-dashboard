"use client";

import { useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import UserCard, { type User } from "@/components/users/UserCard";

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
  },
  {
    id: 2,
    username: "DeepSeaMike",
    email: "mike@example.com",
    accessLevel: "FREE",
    reports: 18,
    lastActive: "5 hours ago",
  },
  {
    id: 3,
    username: "ReefRunner",
    email: "reef@example.com",
    accessLevel: "PRO",
    reports: 127,
    lastActive: "1 day ago",
    verified: true,
  },
  {
    id: 4,
    username: "SpeedFisher",
    email: "speed@example.com",
    accessLevel: "FREE",
    reports: 8,
    lastActive: "3 days ago",
    verified: true,
  },
  {
    id: 5,
    username: "AquaAngler",
    email: "aqua@example.com",
    accessLevel: "PRO",
    reports: 64,
    lastActive: "1 hour ago",
    verified: true,
  },
  {
    id: 6,
    username: "TidalWave99",
    email: "tidal@example.com",
    accessLevel: "FREE",
    reports: 5,
    lastActive: "1 week ago",
  },
  {
    id: 7,
    username: "LakeLegend",
    email: "lake@example.com",
    accessLevel: "PRO",
    reports: 91,
    lastActive: "30 mins ago",
    verified: true,
  },
  {
    id: 8,
    username: "BaitMaster",
    email: "bait@example.com",
    accessLevel: "FREE",
    reports: 22,
    lastActive: "2 days ago",
  },
  {
    id: 9,
    username: "CoralDiver",
    email: "coral@example.com",
    accessLevel: "PRO",
    reports: 55,
    lastActive: "4 hours ago",
    verified: true,
  },
  {
    id: 10,
    username: "WaveCatcher",
    email: "wave@example.com",
    accessLevel: "FREE",
    reports: 3,
    lastActive: "2 weeks ago",
  },
  {
    id: 11,
    username: "FishingKing_01",
    email: "king@example.com",
    accessLevel: "PRO",
    reports: 210,
    lastActive: "Just now",
    verified: true,
  },
  {
    id: 12,
    username: "OceanExplorer",
    email: "ocean@example.com",
    accessLevel: "FREE",
    reports: 14,
    lastActive: "6 hours ago",
  },
  {
    id: 13,
    username: "DeepBlueHook",
    email: "hook@example.com",
    accessLevel: "PRO",
    reports: 77,
    lastActive: "2 days ago",
    verified: true,
  },
  {
    id: 14,
    username: "TroutTracker",
    email: "trout@example.com",
    accessLevel: "FREE",
    reports: 9,
    lastActive: "5 days ago",
  },
  {
    id: 15,
    username: "SalmonSurfer",
    email: "salmon@example.com",
    accessLevel: "PRO",
    reports: 33,
    lastActive: "3 hours ago",
    verified: true,
  },
  {
    id: 16,
    username: "MarlinHunter",
    email: "marlin@example.com",
    accessLevel: "FREE",
    reports: 11,
    lastActive: "1 day ago",
  },
  {
    id: 17,
    username: "BassBoss",
    email: "bass@example.com",
    accessLevel: "PRO",
    reports: 88,
    lastActive: "45 mins ago",
    verified: true,
  },
  {
    id: 18,
    username: "CastingPro",
    email: "casting@example.com",
    accessLevel: "FREE",
    reports: 2,
    lastActive: "3 weeks ago",
  },
  {
    id: 19,
    username: "NetNinja",
    email: "net@example.com",
    accessLevel: "PRO",
    reports: 149,
    lastActive: "1 hour ago",
    verified: true,
  },
  {
    id: 20,
    username: "TackleGuru",
    email: "tackle@example.com",
    accessLevel: "FREE",
    reports: 7,
    lastActive: "4 days ago",
  },
  {
    id: 21,
    username: "PiranhaPete",
    email: "pete@example.com",
    accessLevel: "PRO",
    reports: 60,
    lastActive: "2 hours ago",
    verified: true,
  },
  {
    id: 22,
    username: "ShallowWader",
    email: "shallow@example.com",
    accessLevel: "FREE",
    reports: 20,
    lastActive: "6 days ago",
  },
  {
    id: 23,
    username: "RiverRogue",
    email: "river@example.com",
    accessLevel: "PRO",
    reports: 102,
    lastActive: "Just now",
    verified: true,
  },
  {
    id: 24,
    username: "LureMaster_X",
    email: "lure@example.com",
    accessLevel: "FREE",
    reports: 16,
    lastActive: "1 week ago",
  },
  {
    id: 25,
    username: "TigerShark99",
    email: "tiger@example.com",
    accessLevel: "PRO",
    reports: 200,
    lastActive: "3 hours ago",
    verified: true,
  },
  {
    id: 26,
    username: "FlatsWalker",
    email: "flats@example.com",
    accessLevel: "FREE",
    reports: 4,
    lastActive: "2 weeks ago",
  },
  {
    id: 27,
    username: "ClamDigger",
    email: "clam@example.com",
    accessLevel: "PRO",
    reports: 38,
    lastActive: "5 hours ago",
    verified: true,
  },
  {
    id: 28,
    username: "SeaweedSam",
    email: "sam@example.com",
    accessLevel: "FREE",
    reports: 12,
    lastActive: "3 days ago",
  },
  {
    id: 29,
    username: "BayouFisher",
    email: "bayou@example.com",
    accessLevel: "PRO",
    reports: 74,
    lastActive: "1 day ago",
    verified: true,
  },
  {
    id: 30,
    username: "IceHolePro",
    email: "ice@example.com",
    accessLevel: "FREE",
    reports: 6,
    lastActive: "1 month ago",
  },
  {
    id: 31,
    username: "NightCrawler",
    email: "night@example.com",
    accessLevel: "PRO",
    reports: 93,
    lastActive: "2 hours ago",
    verified: true,
  },
  {
    id: 32,
    username: "PondHopper",
    email: "pond@example.com",
    accessLevel: "FREE",
    reports: 28,
    lastActive: "4 hours ago",
  },
  {
    id: 33,
    username: "SpinnerBait",
    email: "spinner@example.com",
    accessLevel: "PRO",
    reports: 115,
    lastActive: "30 mins ago",
    verified: true,
  },
  {
    id: 34,
    username: "MudCat_5",
    email: "mudcat@example.com",
    accessLevel: "FREE",
    reports: 1,
    lastActive: "2 months ago",
  },
  {
    id: 35,
    username: "CrappieKing",
    email: "crappie@example.com",
    accessLevel: "PRO",
    reports: 49,
    lastActive: "1 hour ago",
    verified: true,
  },
  {
    id: 36,
    username: "WillowWader",
    email: "willow@example.com",
    accessLevel: "FREE",
    reports: 17,
    lastActive: "2 days ago",
  },
];

const ITEMS_PER_PAGE = 5;

type FilterOption = "ALL" | "PRO" | "FREE";

export default function UsersPageClient() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("ALL");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Filtered + Searched users ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_USERS.filter((u) => {
      const matchSearch =
        !q ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchFilter = filter === "ALL" || u.accessLevel === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

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

  function handleFilterChange(val: FilterOption) {
    setFilter(val);
    setFilterOpen(false);
    setCurrentPage(1);
  }

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
    <div className="flex flex-col gap-5 w-full max-w-full mx-auto animate-fade-in">
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
            className="w-full bg-[#182235] border border-[#1f2d40]/60 text-white placeholder-[#7a8a9e]
                       pl-11 pr-4 py-3 rounded-xl text-sm font-medium
                       focus:outline-none focus:border-[#ff6b35]/50 focus:ring-1 focus:ring-[#ff6b35]/20
                       transition-all"
          />
        </div>

        {/* Filter Button + Dropdown */}
        <div className="relative">
          <button
            id="user-filter-btn"
            onClick={() => setFilterOpen((p) => !p)}
            className="flex items-center gap-2 bg-[#ff6b35] hover:bg-[#fd5c28] text-white
                       px-5 py-3 rounded-xl text-sm font-semibold
                       transition-all duration-200 hover:scale-[1.02] active:scale-95
                       shadow-lg shadow-orange-900/20"
          >
            <FiFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {filter !== "ALL" && (
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {filter}
              </span>
            )}
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-12 z-50 w-40 bg-[#1a2540] border border-[#2a3a58] rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
              {(["ALL", "PRO", "FREE"] as FilterOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleFilterChange(opt)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    filter === opt
                      ? "bg-[#ff6b35]/20 text-[#ff6b35]"
                      : "text-slate-300 hover:bg-[#243050] hover:text-white"
                  }`}
                >
                  {opt === "ALL"
                    ? "All Users"
                    : opt === "PRO"
                      ? "PRO Users"
                      : "FREE Users"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Users List Panel ── */}
      <div className="bg-[#0f1929]/60 border border-[#1f2d40]/50 rounded-2xl p-5 flex flex-col gap-4">
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
              <UserCard key={user.id} user={user} />
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
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[#7a8a9e]
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
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                    safePage === p
                      ? "bg-[#ff6b35] text-white shadow-md shadow-orange-900/30"
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
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[#7a8a9e]
                         hover:text-white hover:bg-[#1f2d40]/60 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all"
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
