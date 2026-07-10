"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !token) {
      router.push("/");
    }
  }, [isMounted, token, router]);

  if (!isMounted || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6A3D]" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-slate-100 flex font-sans"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #284A6C 100%)",
      }}
    >
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
