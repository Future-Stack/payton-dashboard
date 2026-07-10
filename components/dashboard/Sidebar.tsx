"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { BiWalletAlt } from "react-icons/bi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiGrid,
    },
    {
      name: "User",
      path: "/dashboard/users",
      icon: FiUsers,
    },
    {
      name: "Report",
      path: "/dashboard/reports",
      icon: FiFileText,
    },
    {
      name: "Pricing",
      path: "/dashboard/pricing",
      icon: BiWalletAlt,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: FiSettings,
    },
  ];

  const sidebarContent = (
    <aside
      className="w-64   border-r border-[#1f293d]/50 flex flex-col justify-between h-full py-6 px-4"
      style={{
        background: "rgba(48, 48, 48, 0.22)",
        backdropFilter: "blur(39.5px)",
      }}
    >
      {/* Top Section: Logo & Nav Links */}
      <div className="flex flex-col gap-8">
        {/* Logo Container */}
        <div className="flex justify-between md:justify-center items-center py-2">
          <Link
            href="/dashboard"
            className="relative block h-20 w-32 transition-transform hover:scale-105"
            onClick={onClose}
          >
            <Image
              src="/logo.png"
              alt="On The Bite Logo"
              fill
              sizes="128px"
              className="object-contain"
              priority
            />
          </Link>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden w-8 h-8 rounded-full bg-[#1a233a] hover:bg-[#232d45] border border-[#1f293d]/50
                       flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.path ||
                  pathname.startsWith(item.path + "/");

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-[30px] transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-linear-to-r from-[#ff6b35] to-[#fd5c28] text-white shadow-[0_4px_15px_rgba(253,92,40,0.35)]"
                    : "text-[#94a3b8] hover:text-white hover:bg-[#1a233a]/50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-[#94a3b8]"}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Log Out Button */}
      <div className="mt-auto px-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-[#ff3b30] hover:bg-[#ff453a] active:bg-[#d02e25] text-white py-3 px-4 rounded-full font-semibold shadow-lg shadow-red-900/20 transition-all duration-300 hover:scale-[1.02]"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop: always-visible fixed sidebar ── */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-30">
        {sidebarContent}
      </div>

      {/* ── Mobile: offcanvas overlay ── */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
