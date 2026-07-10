"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import UserCard, { type ApiUser } from "@/components/users/UserCard";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/axios";
import { formatDistanceToNow } from "date-fns";

const ITEMS_PER_PAGE = 10;

type SubscriptionLevel = "All" | "Free" | "Pro";
type AccountStatus = "All" | "Active" | "Blocked";
type ReportCount = "All" | "Low (< 20)" | "Medium (20-49)" | "High (50+)";

type FilterState = {
  subscriptionLevel: SubscriptionLevel;
  accountStatus: AccountStatus;
  reportCount: ReportCount;
};

const UserCardSkeleton = () => (
  <div className="bg-[#1E3A5A] border border-[#47596E] rounded-2xl px-5 py-4 flex flex-col gap-3 animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2a3a58]"></div>
        <div className="flex flex-col gap-2">
          <div className="w-24 h-4 bg-[#2a3a58] rounded"></div>
          <div className="w-32 h-3 bg-[#2a3a58] rounded"></div>
        </div>
      </div>
      <div className="w-8 h-8 rounded-lg bg-[#2a3a58]"></div>
    </div>
    <div className="grid grid-cols-3 gap-4 pt-1 border-t border-[#1f2d40]/40">
      <div className="flex flex-col gap-2 mt-2">
        <div className="w-16 h-3 bg-[#2a3a58] rounded"></div>
        <div className="w-12 h-4 bg-[#2a3a58] rounded"></div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="w-16 h-3 bg-[#2a3a58] rounded"></div>
        <div className="w-10 h-4 bg-[#2a3a58] rounded"></div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="w-16 h-3 bg-[#2a3a58] rounded"></div>
        <div className="w-20 h-4 bg-[#2a3a58] rounded"></div>
      </div>
    </div>
  </div>
);

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

  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
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

  const { data: apiResponse, isLoading, isFetching } = useQuery({
    queryKey: ['users', currentPage, ITEMS_PER_PAGE, search, filterState],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', ITEMS_PER_PAGE.toString());
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      if (filterState.reportCount === "Low (< 20)") params.append('reportCount', 'LESS_THAN_20');
      else if (filterState.reportCount === "Medium (20-49)") params.append('reportCount', 'BETWEEN_20_AND_49');
      else if (filterState.reportCount === "High (50+)") params.append('reportCount', 'GREATER_THAN_50');

      if (filterState.subscriptionLevel === "Free") params.append('plan', 'FREE');
      else if (filterState.subscriptionLevel === "Pro") params.append('plan', 'PRO');

      if (filterState.accountStatus === "Active") params.append('status', 'ACTIVE');
      else if (filterState.accountStatus === "Blocked") params.append('status', 'BLOCKED');

      const res = await apiClient.get(`/admin/users?${params.toString()}`);
      return res.data;
    },
  });

  const users = apiResponse?.data || [];
  const meta = apiResponse?.meta || { total: 0, page: 1, limit: ITEMS_PER_PAGE, totalPages: 1 };
  const totalPages = Math.max(1, meta.totalPages);
  const safePage = Math.min(currentPage, totalPages);

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

          {filterOpen && (
            <div className="absolute right-0 top-12 z-50 w-[320px] bg-[#222831] border border-[#393e46] rounded-xl shadow-2xl shadow-black/60 p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">Subscription Level</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["All", "Free", "Pro"] as SubscriptionLevel[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setLocalFilter((p) => ({ ...p, subscriptionLevel: opt }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${localFilter.subscriptionLevel === opt
                        ? "bg-[#117A88] text-white"
                        : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">Account Status</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["All", "Active", "Blocked"] as AccountStatus[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setLocalFilter((p) => ({ ...p, accountStatus: opt }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${localFilter.accountStatus === opt
                        ? "bg-[#117A88] text-white"
                        : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">Report Count</span>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    onClick={() => setLocalFilter((p) => ({ ...p, reportCount: "All" }))}
                    className={`col-span-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${localFilter.reportCount === "All"
                      ? "bg-[#117A88] text-white"
                      : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setLocalFilter((p) => ({ ...p, reportCount: "Low (< 20)" }))}
                    className={`col-span-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${localFilter.reportCount === "Low (< 20)"
                      ? "bg-[#117A88] text-white"
                      : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                      }`}
                  >
                    Low (&lt; 20)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLocalFilter((p) => ({ ...p, reportCount: "Medium (20-49)" }))}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${localFilter.reportCount === "Medium (20-49)"
                      ? "bg-[#117A88] text-white"
                      : "bg-[#2a3143] text-slate-300 hover:bg-[#343c53] hover:text-white"
                      }`}
                  >
                    Medium (20-49)
                  </button>
                  <button
                    onClick={() => setLocalFilter((p) => ({ ...p, reportCount: "High (50+)" }))}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${localFilter.reportCount === "High (50+)"
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
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Total{" "}
            {isLoading ? (
              <div className="w-8 h-4 bg-[#2a3a58] animate-pulse rounded"></div>
            ) : (
              <span className="text-[#7a8a9e] font-semibold">
                ({meta.total})
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className={`flex flex-col gap-3 transition-opacity duration-200 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {users.map((user: ApiUser) => (
              <UserCard
                key={user.userId}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-4 border-t border-[#1f2d40]/40 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1 || isFetching}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white
                         hover:text-white hover:bg-[#1f2d40]/60 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all"
            >
              <FiChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-2 text-[#5a6a82] text-sm select-none">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  disabled={isFetching}
                  className={`w-9 h-9 rounded-md text-sm font-semibold transition-all ${safePage === p
                    ? "bg-[#D9ECFF] text-black shadow-md shadow-orange-900/30 border border-[#E4E4E7]"
                    : "text-[#7a8a9e] hover:text-white hover:bg-[#1f2d40]/60 disabled:opacity-30"
                    }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages || isFetching}
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
              <div className="flex items-center justify-between p-5 border-b border-[#393e46] shrink-0">
                <h3 className="text-lg font-bold text-white">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#303846] text-[#7a8a9e] hover:text-white hover:bg-[#3d4759] transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-8">
                  {selectedUser.profileImage ? (
                    <Image
                      src={selectedUser.profileImage}
                      alt="Avatar"
                      width={60}
                      height={60}
                      className="rounded-full object-cover w-16 h-16"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#3a4f70] to-[#243050] flex items-center justify-center text-white font-bold text-2xl shrink-0 border-2 border-[#2a3a58]">
                      {selectedUser.name
                        ? selectedUser.name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase()
                        : "U"}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-bold text-white">
                      {selectedUser.name}
                    </h4>
                    <p className="text-[#7a8a9e] text-sm">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">Status</span>
                    <span className={`text-sm font-semibold uppercase ${selectedUser.status === "ACTIVE" ? "text-[#00d287]" : "text-red-400"}`}>
                      {selectedUser.status || "Unknown"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">Role</span>
                    <span className="text-sm font-medium text-white">{selectedUser.role}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">Access Level</span>
                    <span className={`text-sm font-bold uppercase ${selectedUser.subscription.plan !== "FREE" ? "text-[#ff6b35]" : "text-[#94a3b8]"}`}>
                      {selectedUser.subscription.plan}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">Reports</span>
                    <span className="text-sm font-medium text-white">{selectedUser.reportsCount}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">Created At</span>
                    <span className="text-sm font-medium text-white">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#7a8a9e]">Last Active</span>
                    <span className="text-sm font-medium text-white">
                      {selectedUser.lastActive ? formatDistanceToNow(new Date(selectedUser.lastActive), { addSuffix: true }) : "Never"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
