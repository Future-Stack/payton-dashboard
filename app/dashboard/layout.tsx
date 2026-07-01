"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d131f] text-slate-100 flex font-sans">
      {/* Sidebar - fixed left (desktop) / offcanvas (mobile) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Header - fixed top */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Content Body */}
        <main className="flex-1 pt-24 px-4 md:px-8 pb-10 overflow-y-auto max-w-full w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
