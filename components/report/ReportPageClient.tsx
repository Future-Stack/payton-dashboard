"use client";

import { useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import ReportCard, { type Report } from "@/components/report/ReportCard";

/* ─────────────────── Mock Data ─────────────────── */
const ALL_REPORTS: Report[] = [
  {
    id: 1,
    username: "CaptJohn_87",
    timeAgo: "2 hours ago",
    status: "approved",
    grid: "C-12",
    species: "Tuna",
  },
  {
    id: 2,
    username: "Jason Clip",
    timeAgo: "4 hours ago",
    status: "tagged",
    flagCount: 3,
    grid: "D-15",
    species: "Snapper",
  },
  {
    id: 3,
    username: "DeepSeaMike",
    timeAgo: "4 hours ago",
    status: "tagged",
    flagCount: 2,
    grid: "D-15",
    species: "Snapper",
  },
  {
    id: 4,
    username: "ReefRunner",
    timeAgo: "6 hours ago",
    status: "approved",
    grid: "E-8",
    species: "Grouper",
  },
  {
    id: 5,
    username: "Rutherford",
    timeAgo: "6 hours ago",
    status: "approved",
    grid: "E-8",
    species: "Snapper",
  },
  {
    id: 6,
    username: "AquaAngler",
    timeAgo: "8 hours ago",
    status: "tagged",
    flagCount: 1,
    grid: "B-4",
    species: "Marlin",
  },
  {
    id: 7,
    username: "TidalWave99",
    timeAgo: "10 hours ago",
    status: "approved",
    grid: "F-11",
    species: "Wahoo",
  },
  {
    id: 8,
    username: "LakeLegend",
    timeAgo: "12 hours ago",
    status: "tagged",
    flagCount: 4,
    grid: "A-3",
    species: "Bass",
  },
  {
    id: 9,
    username: "BaitMaster",
    timeAgo: "1 day ago",
    status: "approved",
    grid: "G-9",
    species: "Flounder",
  },
  {
    id: 10,
    username: "CoralDiver",
    timeAgo: "1 day ago",
    status: "tagged",
    flagCount: 2,
    grid: "C-7",
    species: "Grouper",
  },
  {
    id: 11,
    username: "WaveCatcher",
    timeAgo: "2 days ago",
    status: "approved",
    grid: "H-2",
    species: "Tuna",
  },
  {
    id: 12,
    username: "FishingKing_01",
    timeAgo: "2 days ago",
    status: "tagged",
    flagCount: 5,
    grid: "B-6",
    species: "Snapper",
  },
  {
    id: 13,
    username: "OceanExplorer",
    timeAgo: "3 days ago",
    status: "approved",
    grid: "D-14",
    species: "Sailfish",
  },
  {
    id: 14,
    username: "DeepBlueHook",
    timeAgo: "3 days ago",
    status: "tagged",
    flagCount: 1,
    grid: "E-5",
    species: "Marlin",
  },
  {
    id: 15,
    username: "TroutTracker",
    timeAgo: "4 days ago",
    status: "approved",
    grid: "A-10",
    species: "Trout",
  },
  {
    id: 16,
    username: "SalmonSurfer",
    timeAgo: "5 days ago",
    status: "tagged",
    flagCount: 3,
    grid: "C-1",
    species: "Salmon",
  },
];

const ITEMS_PER_PAGE = 5;

type FilterTab = "All" | "Approved" | "Removed";

export default function ReportPageClient() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSpecies, setFilterSpecies] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());

  /* ── Species list for filter ── */
  const speciesList = useMemo(() => {
    const all = ALL_REPORTS.map((r) => r.species);
    return ["All", ...Array.from(new Set(all)).sort()];
  }, []);

  /* ── Filtered reports ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_REPORTS.filter((r) => {
      if (deletedIds.has(r.id)) return false;

      const matchSearch =
        !q ||
        r.username.toLowerCase().includes(q) ||
        r.species.toLowerCase().includes(q) ||
        r.grid.toLowerCase().includes(q);

      const matchSpecies =
        filterSpecies === "All" || r.species === filterSpecies;

      const matchTab =
        activeTab === "All"
          ? true
          : activeTab === "Approved"
            ? r.status === "approved"
            : removedIds.has(r.id); // "Removed" tab shows removed items

      return matchSearch && matchSpecies && matchTab;
    });
  }, [search, activeTab, filterSpecies, deletedIds, removedIds]);

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

  function handleTabChange(tab: FilterTab) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function handleDelete(id: number) {
    setDeletedIds((prev) => new Set(prev).add(id));
    setRemovedIds((prev) => new Set(prev).add(id));
  }

  /* ── Page numbers with ellipsis ── */
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

  const tabs: FilterTab[] = ["All", "Approved", "Removed"];

  return (
    <div className="flex flex-col gap-5 w-full max-w-full mx-auto animate-fade-in">
      {/* ── Search + Filter Bar ── */}
      <div className="flex items-center gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8a9e] w-4 h-4 pointer-events-none" />
          <input
            id="report-search"
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search users by name or email..."
            className="
              w-full bg-[#182235] border border-[#1f2d40]/60
              text-white placeholder-[#7a8a9e]
              pl-11 pr-4 py-3 rounded-xl text-sm font-medium
              focus:outline-none focus:border-[#0a9396]/50 focus:ring-1 focus:ring-[#0a9396]/20
              transition-all
            "
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            id="report-filter-btn"
            onClick={() => setFilterOpen((p) => !p)}
            className="
              flex items-center gap-2 bg-[#0a9396] hover:bg-[#0b8285]
              text-white px-5 py-3 rounded-xl text-sm font-semibold
              transition-all duration-200 hover:scale-[1.02] active:scale-95
              shadow-lg shadow-cyan-900/20
            "
          >
            <FiFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {filterSpecies !== "All" && (
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                1
              </span>
            )}
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-12 z-50 w-44 bg-[#1a2540] border border-[#2a3a58] rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-dropdown">
              {speciesList.map((sp) => (
                <button
                  key={sp}
                  onClick={() => {
                    setFilterSpecies(sp);
                    setFilterOpen(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    filterSpecies === sp
                      ? "bg-[#0a9396]/20 text-[#0a9396]"
                      : "text-slate-300 hover:bg-[#243050] hover:text-white"
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Reports Panel ── */}
      <div className="bg-[#0e1929]/70 border border-[#1a2d45]/50 rounded-2xl p-5 flex flex-col gap-4">
        {/* ── Tab Filters ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => handleTabChange(tab)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200
                ${
                  activeTab === tab
                    ? "bg-[#0a9396] text-white shadow-md shadow-cyan-900/30"
                    : "text-[#7a8a9e] hover:text-white hover:bg-[#1f2d40]/60"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Total Count ── */}
        <div>
          <h2 className="text-base font-bold text-white">
            Total{" "}
            <span className="text-[#7a8a9e] font-semibold">
              ({filtered.length})
            </span>
          </h2>
        </div>

        {/* ── Report Cards ── */}
        {paginated.length > 0 ? (
          <div className="flex flex-col gap-3">
            {paginated.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#5a6a82]">
            <FiSearch className="w-10 h-10 opacity-40" />
            <p className="text-sm font-medium">No reports found</p>
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
              className="
                flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[#7a8a9e]
                hover:text-white hover:bg-[#1f2d40]/60 disabled:opacity-30 disabled:cursor-not-allowed
                transition-all
              "
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
                  className={`
                    w-9 h-9 rounded-lg text-sm font-semibold transition-all
                    ${
                      safePage === p
                        ? "bg-[#0a9396] text-white shadow-md shadow-cyan-900/30"
                        : "text-[#7a8a9e] hover:text-white hover:bg-[#1f2d40]/60"
                    }
                  `}
                >
                  {p}
                </button>
              ),
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="
                flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[#7a8a9e]
                hover:text-white hover:bg-[#1f2d40]/60 disabled:opacity-30 disabled:cursor-not-allowed
                transition-all
              "
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
