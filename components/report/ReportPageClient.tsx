"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import { TbRipple, TbMapPin, TbAnchor, TbFish } from "react-icons/tb";
import ReportCard, { type Report } from "@/components/report/ReportCard";
import { reportService } from "@/services/api/reportService";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

/* ─────────────────── Types & Constants ─────────────────── */
const ITEMS_PER_PAGE = 10;
type FilterTab = "All" | "Approved" | "Removed";
type UserSubscription = "All" | "FREE" | "PRO";
type ReportStatus = "All" | "APPROVED" | "REMOVED" | "PENDING";

type FilterState = {
  status: ReportStatus;
  userSubscription: UserSubscription;
};

function formatTimeAgo(dateString: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}

export default function ReportPageClient() {
  // State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    status: "All",
    userSubscription: "All",
  });
  const [localFilter, setLocalFilter] = useState<FilterState>(filterState);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mounted, setMounted] = useState(false);

  const queryClient = useQueryClient();

  // API State with React Query
  const { data, isLoading, isFetching, error: queryError, refetch } = useQuery({
    queryKey: ["reports", { debouncedSearch, activeTab, filterState, currentPage }],
    queryFn: async () => {
      const params: any = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (debouncedSearch) params.search = debouncedSearch;

      if (activeTab === "Approved") {
        params.status = "APPROVED";
      } else if (activeTab === "Removed") {
        params.status = "REMOVED";
      } else if (filterState.status !== "All") {
        params.status = filterState.status;
      }

      if (filterState.userSubscription !== "All") {
        params.userSubscription = filterState.userSubscription;
      }

      const res = await reportService.getReports(params);
      
      const fetchedReports: Report[] = res.data.map(
        (apiItem: any): Report => ({
          id: apiItem.reportId,
          username: apiItem.user?.name || "Unknown",
          avatar: apiItem.user?.profileImage,
          email: apiItem.user?.email,
          timeAgo: formatTimeAgo(apiItem.submittedAt),
          status: apiItem.status || "PENDING",
          confirmBite: apiItem.confirmBite || 0,
          flagCount: apiItem.confirmBite + apiItem.rejectBite,
          grid: apiItem.zoneName || apiItem.zoneId || "Unknown",
          species:
            apiItem.species
              ?.map((s: any) => `${s.quantity} ${s.speciesName}`)
              .join(", ") || "Unknown",
          depth: apiItem.depth,
          position: apiItem.position,
          method: apiItem.method,
          bait: apiItem.bait,
        })
      );

      return {
        reports: fetchedReports,
        totalCount: res.meta.total,
        totalPages: res.meta.totalPages,
      };
    },
    placeholderData: keepPreviousData,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;
      if (status === 429 || status === 401 || status === 403 || status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const reports = data?.reports || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;
  const error = queryError ? queryError.message : null;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportService.deleteReport(id),
    onSuccess: () => {
      toast.success("Report successfully removed");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to delete report"
      );
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      if (mounted) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [search, mounted]);

  function handleSearchChange(val: string) {
    setSearch(val);
  }

  function handleTabChange(tab: FilterTab) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function applyFilter() {
    setFilterState(localFilter);
    setFilterOpen(false);
    setCurrentPage(1);
    if (localFilter.status !== "All") {
      setActiveTab("All");
    }
  }

  const activeFiltersCount =
    (filterState.status !== "All" ? 1 : 0) +
    (filterState.userSubscription !== "All" ? 1 : 0);

  /* ── Page numbers with ellipsis ── */
  function getPageNumbers() {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
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
            placeholder="Search reports by user name or email..."
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

          {/* Search filter dropdown  */}
          {filterOpen && (
            <div className="absolute right-0 top-12 z-50 w-[320px] bg-[#222831] border border-[#393e46] rounded-xl shadow-2xl shadow-black/60 p-5 flex flex-col gap-4">
              {/* Report Status */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  Report Status
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    ["All", "APPROVED", "REMOVED", "PENDING"] as ReportStatus[]
                  ).map((opt) => (
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
                  ))}
                </div>
              </div>

              {/* User Subscription */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">
                  User Subscription
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["All", "FREE", "PRO"] as UserSubscription[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setLocalFilter((p) => ({ ...p, userSubscription: opt }))
                      }
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                        localFilter.userSubscription === opt
                          ? "bg-[#117A88] text-white"
                          : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={applyFilter}
                  className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white w-full py-2 px-6 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Reports Panel ── */}
      <div className="bg-[#19304A] border border-[#223C59] rounded-[20px] p-5 flex flex-col gap-4">
        {/* ── Tab Filters & Refresh ── */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                id={`tab-${tab.toLowerCase()}`}
                onClick={() => handleTabChange(tab)}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer
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
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 text-sm text-[#7a8a9e] hover:text-white transition-colors cursor-pointer"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* ── Total Count ── */}
        <div>
          <h2 className="text-base font-bold text-white">
            Total{" "}
            <span className="text-[#7a8a9e] font-semibold">({totalCount})</span>
          </h2>
        </div>

        {/* ── Status & Error Handlers ── */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-400">
            <p className="text-sm font-medium">Failed to load reports.</p>
            <p className="text-xs opacity-60">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white py-1.5 px-4 rounded-md text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="h-28 bg-[#1E3A5A]/50 border border-[#47596E]/50 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="flex flex-col gap-3">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onViewDetails={(r) => setSelectedReport(r)}
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
              disabled={currentPage === 1 || isLoading}
              className="
                flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white
                hover:text-white hover:bg-[#1f2d40]/60 disabled:opacity-30 disabled:cursor-not-allowed
                transition-all cursor-pointer
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
                  disabled={isLoading}
                  className={`
                    w-9 h-9 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer
                    ${
                      currentPage === p
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
              disabled={currentPage === totalPages || isLoading}
              className="
                flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white
                hover:text-white hover:bg-[#1f2d40]/60 disabled:opacity-30 disabled:cursor-not-allowed
                transition-all cursor-pointer
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
                        {selectedReport.username}{" "}
                        {selectedReport.email
                          ? `(${selectedReport.email})`
                          : ""}
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
                      <span className="text-white text-sm font-medium text-right max-w-[60%]">
                        {selectedReport.species}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                      <span className="text-[#8B95A5] text-sm">Status</span>
                      <span
                        className={`text-sm font-bold uppercase ${
                          selectedReport.status?.toLowerCase() === "approved"
                            ? "text-[#10B981]"
                            : selectedReport.status?.toLowerCase() === "tagged"
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
                        {selectedReport.depth || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                      <div className="flex items-center gap-2 text-blue-400">
                        <TbMapPin className="w-5 h-5" />
                        <span className="text-[#8B95A5] text-sm">Position</span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {selectedReport.position || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <TbAnchor className="w-5 h-5" />
                        <span className="text-[#8B95A5] text-sm">Method</span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {selectedReport.method || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-[#2C323E]">
                      <div className="flex items-center gap-2 text-teal-400">
                        <TbFish className="w-5 h-5" />
                        <span className="text-[#8B95A5] text-sm">Bait</span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {selectedReport.bait || "N/A"}
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
