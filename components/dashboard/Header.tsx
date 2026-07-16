"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiSearch, FiMenu } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/api/userService";
import { UserRound } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: userProfileResponse, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getMe,
    retry: false,
  });

  const user = userProfileResponse?.data;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header
      className="h-20 
                 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 lg:left-64 z-20"
      style={{
        borderLeft: "1px solid rgba(255, 255, 255, 0.20)",
        background: "rgba(48, 48, 48, 0.22)",
        backdropFilter: "blur(39.5px)",
      }}
    >
      {/* ── Left: Hamburger (mobile only) + Search Bar ── */}
      <div className="flex items-center gap-3 flex-1 max-w-104">
        {/* Hamburger menu - mobile only */}
        <button
          id="sidebar-toggle"
          aria-label="Open sidebar"
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 bg-[#1b2336] hover:bg-[#232d45] border border-[#1f2d40]/60 hover:border-[#ff6b35]/20
                     rounded-full flex items-center justify-center text-slate-300 hover:text-white
                     transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        {/* <div className="relative group flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f9cae] w-4 h-4 transition-colors group-focus-within:text-[#ff6b35] pointer-events-none" />
          <input
            id="dashboard-search"
            type="text"
            placeholder="Search"
            className="w-full   text-white placeholder-[#7a8a9e]
                       pl-11 pr-4 py-2.5 rounded-full text-sm font-medium
                       border border-[#1f2d40]/60
                       focus:border-[#ff6b35]/50 focus:outline-none focus:ring-1 focus:ring-[#ff6b35]/20
                       transition-all"
            style={{
              borderRadius: "40px",
              background: "rgba(255, 255, 255, 0.20)",
            }}
          />
        </div> */}
      </div>

      {/* ── Right: Bell + Profile ── */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notification Bell */}
        {/* <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationOpen((p) => !p)}
            aria-label="Notifications"
            className="relative w-10 h-10  hover:bg-[#232d45] border border-[#1f2d40]/60 hover:border-[#ff6b35]/20
                       rounded-full flex items-center justify-center text-slate-300 hover:text-white
                       transition-all hover:scale-105 active:scale-95 group"
            style={{
              borderRadius: "40px",
              background: "rgba(255, 255, 255, 0.20)",
            }}
          >
           
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3.92773 9.27681C3.92777 4.84136 7.54406 1.24985 11.9999 1.24985C16.4557 1.24985 20.072 4.84139 20.072 9.27687C20.0721 10.3086 20.1415 11.0872 20.6172 11.7871C20.7983 12.0496 21.1412 12.4934 21.3695 12.8504C21.6254 13.2501 21.8753 13.7323 21.9612 14.294C22.2415 16.1268 20.9493 17.3135 19.6624 17.8452C15.1297 19.7181 8.87004 19.7181 4.33734 17.8452C3.05043 17.3135 1.75824 16.1268 2.03855 14.294C2.12447 13.7323 2.3744 13.2501 2.63021 12.8504C2.85861 12.4934 3.20156 12.0495 3.38259 11.787C3.85826 11.0872 3.92764 10.3085 3.92773 9.27681Z"
                fill="#F5F7FF"
              />
              <path
                d="M14.7775 21.9509C13.9741 22.4562 13.0186 22.7476 11.9983 22.7476C10.9781 22.7476 10.0226 22.4562 9.21922 21.9509C8.50617 21.5025 8.14965 21.2783 8.27441 20.9056C8.39918 20.5328 8.89114 20.5746 9.87506 20.6581C11.2822 20.7774 12.7144 20.7774 14.1216 20.6581C15.1055 20.5746 15.5975 20.5328 15.7223 20.9056C15.847 21.2783 15.4905 21.5025 14.7775 21.9509Z"
                fill="#F5F7FF"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
         
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-white rounded-full ring-2 ring-[#1b2336]" />
          </button>
 
          {notificationOpen && (
            <div className="absolute right-[-60px] sm:right-0 top-14 z-50 w-[300px] sm:w-[320px] bg-[#222831] border border-[#393e46] rounded-xl shadow-2xl shadow-black/60 p-4 sm:p-5 flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#393e46] pb-2">
                <h3 className="text-white font-semibold text-base">Notifications</h3>
                <span className="text-[#ff6b35] text-xs font-medium bg-[#ff6b35]/10 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
               
                <div className="p-3 bg-[#2a3143]/50 hover:bg-[#2a3143] rounded-xl transition-colors cursor-pointer border border-[#393e46]/50">
                  <p className="text-sm text-slate-200 font-medium mb-1">New User Registration</p>
                  <p className="text-xs text-slate-400">CaptJohn_87 just signed up as a PRO member.</p>
                  <p className="text-[10px] text-[#7a8a9e] mt-2">2 minutes ago</p>
                </div>
                <div className="p-3 bg-[#2a3143]/50 hover:bg-[#2a3143] rounded-xl transition-colors cursor-pointer border border-[#393e46]/50">
                  <p className="text-sm text-slate-200 font-medium mb-1">System Update</p>
                  <p className="text-xs text-slate-400">Server maintenance completed successfully.</p>
                  <p className="text-[10px] text-[#7a8a9e] mt-2">1 hour ago</p>
                </div>
                <div className="p-3 bg-[#2a3143]/50 hover:bg-[#2a3143] rounded-xl transition-colors cursor-pointer border border-[#393e46]/50">
                  <p className="text-sm text-slate-200 font-medium mb-1">New Report</p>
                  <p className="text-xs text-slate-400">A new issue was reported by ReefRunner.</p>
                  <p className="text-[10px] text-[#7a8a9e] mt-2">3 hours ago</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#393e46] flex justify-center">
                <button className="text-sm text-[#ff6b35] hover:text-[#ff6b35]/80 font-semibold transition-colors">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div> */}

        {/* Profile Card */}
        <div
          className="flex items-center gap-3  border border-[#1f2d40]/60
                     rounded-2xl py-1.5 pl-2 pr-4 hover:border-[#ff6b35]/25 transition-all cursor-default select-none"
          style={{
            background: "rgba(255, 255, 255, 0.20)",
          }}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full overflow-hidden
                        
                       flex items-center justify-center text-white shadow-sm shrink-0"
          >
            {user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt="avatar"
                width={42}
                height={42}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound className="w-6 h-6 text-slate-300" />
            )}
          </div>

          {/* User Details - hidden on very small screens */}
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white truncate max-w-[150px]">
              {isLoading ? "Loading..." : user?.name || "User"}
            </span>
            <span className="text-[11px] text-white font-medium mt-1 truncate max-w-[150px]">
              {isLoading ? "..." : user?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
