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
import { TbRipple, TbMapPin, TbAnchor, TbFish } from "react-icons/tb";
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
type ReportStatus = "All" | "approved" | "tagged";
type FlagCount = "All" | "Low (<3)" | "High (3+)";

type FilterState = {
  status: ReportStatus;
  species: string;
  flagCount: FlagCount;
};

export default function ReportPageClient() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    status: "All",
    species: "All",
    flagCount: "All",
  });
  const [localFilter, setLocalFilter] = useState<FilterState>(filterState);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedReport) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedReport]);

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
        filterState.species === "All" || r.species === filterState.species;

      const matchStatus =
        filterState.status === "All" || r.status === filterState.status;

      const flags = r.flagCount || 0;
      let matchFlags = true;
      if (filterState.flagCount === "Low (<3)") matchFlags = flags < 3;
      else if (filterState.flagCount === "High (3+)") matchFlags = flags >= 3;

      const matchTab =
        activeTab === "All"
          ? true
          : activeTab === "Approved"
            ? r.status === "approved"
            : removedIds.has(r.id); // "Removed" tab shows removed items

      return (
        matchSearch && matchSpecies && matchStatus && matchFlags && matchTab
      );
    });
  }, [search, activeTab, filterState, deletedIds, removedIds]);

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

  function applyFilter() {
    setFilterState(localFilter);
    setFilterOpen(false);
    setCurrentPage(1);
  }

  const activeFiltersCount =
    (filterState.status !== "All" ? 1 : 0) +
    (filterState.species !== "All" ? 1 : 0) +
    (filterState.flagCount !== "All" ? 1 : 0);

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
              {/* Report Status */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Report Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["All", "approved", "tagged"] as ReportStatus[]).map(
                    (opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setLocalFilter((p) => ({
                            ...p,
                            status: opt,
                          }))
                        }
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center capitalize ${
                          localFilter.status === opt
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

              {/* Flag Count */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Flag Count
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["All", "Low (<3)", "High (3+)"] as FlagCount[]).map(
                    (opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setLocalFilter((p) => ({ ...p, flagCount: opt }))
                        }
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                          localFilter.flagCount === opt
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

              {/* Species */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">Species</span>
                <div className="relative">
                  <select
                    value={localFilter.species}
                    onChange={(e) =>
                      setLocalFilter((p) => ({ ...p, species: e.target.value }))
                    }
                    className="w-full bg-[#2a3143] border border-[#393e46] text-white py-2 px-3 rounded-lg text-sm font-medium appearance-none focus:outline-none focus:border-[#117A88]"
                  >
                    {speciesList.map((species) => (
                      <option key={species} value={species}>
                        {species}
                      </option>
                    ))}
                  </select>
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

      {/* ── Reports Panel ── */}
      <div className="bg-[#19304A] border border-[#223C59] rounded-[20px] p-5 flex flex-col gap-4">
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
                onViewDetails={(report) => setSelectedReport(report)}
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
                flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white
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
                flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white
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

      {/* ── Modal Overlay ── */}
      {mounted &&
        selectedReport &&
        createPortal(
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden animate-fade-in">
            {/* Modal Container */}
            <div className="bg-[#1C2028] w-full max-w-110 rounded-2xl shadow-2xl shadow-black/50 border border-[#2A303C] flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#2A303C] shrink-0">
                <h2 className="text-xl font-bold text-white">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2A303C] hover:bg-[#343B4A] text-gray-400 transition-colors cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar">
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
                        {selectedReport.username}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                      <span className="text-[#8B95A5] text-sm">Grid</span>
                      <span className="text-white text-sm font-medium">
                        {selectedReport.grid}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                      <span className="text-[#8B95A5] text-sm">Species</span>
                      <span className="text-white text-sm font-medium">
                        {selectedReport.species}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                      <span className="text-[#8B95A5] text-sm">Status</span>
                      <span
                        className={`text-sm font-bold uppercase ${
                          selectedReport.status === "approved"
                            ? "text-[#10B981]"
                            : selectedReport.status === "tagged"
                              ? "text-[#FF6B35]"
                              : "text-[#3B82F6]"
                        }`}
                      >
                        {selectedReport.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                      <span className="text-[#8B95A5] text-sm">Flags</span>
                      <span className="text-white text-sm font-bold">
                        {selectedReport.flagCount || 0}
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
          </div>,
          document.body,
        )}
    </div>
  );
}
