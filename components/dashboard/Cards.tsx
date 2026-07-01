"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FiUsers, FiFileText, FiDollarSign } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

// Dynamically import react-apexcharts to avoid SSR hydration issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Cards() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /* ─────────────── Card 1: Total Users ─────────────── */
  const usersAreaOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "total-users",
      type: "area",
      sparkline: { enabled: true },
      animations: { enabled: true, speed: 800 },
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: { curve: "smooth", colors: ["#fd5c28"], width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        colorStops: [
          { offset: 0, color: "#fd5c28", opacity: 0.55 },
          { offset: 100, color: "#fd5c28", opacity: 0.02 },
        ],
      },
    },
    tooltip: { enabled: false },
    colors: ["#fd5c28"],
    grid: { show: false, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
  };
  const usersAreaSeries = [
    {
      name: "Users",
      data: [29800, 30200, 29900, 30700, 30400, 31000, 30700, 31200],
    },
  ];

  /* ─────────────── Card 3: Total Reports ─────────────── */
  const reportsDonutOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "total-reports",
      type: "donut",
      sparkline: { enabled: true },
      animations: { enabled: true },
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    colors: ["#fd5c28", "#00897b"],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: { size: "68%" },
      },
    },
    tooltip: { enabled: false },
  };
  const reportsDonutSeries = [27, 73];

  /* ─────────────── Card 4: Total Revenue ─────────────── */
  const revenueBarOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "total-revenue",
      type: "bar",
      sparkline: { enabled: true },
      animations: { enabled: true },
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: "end",
        columnWidth: "45%",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        gradientToColors: ["#a23d14"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.85,
      },
    },
    colors: ["#fd5c28"],
    tooltip: { enabled: false },
    grid: { show: false, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
  };
  const revenueBarSeries = [
    { name: "Revenue", data: [35, 60, 42, 80, 50, 75, 48, 65, 55, 70] },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
      {/* ── CARD 1: Total Users ── */}
      <div className="bg-[#182235] rounded-3xl overflow-hidden flex flex-col h-68 border border-[#1f2d40]/40 shadow-lg">
        {/* Content area */}
        <div className="flex-1 flex flex-col px-6 pt-5">
          {/* Big number */}
          <h3 className="text-[2rem] font-extrabold text-white tracking-tight leading-none">
            31,200
          </h3>

          {/* Area Chart – fills remaining space */}
          <div className="flex-1 -mx-2 mt-3">
            {isMounted && (
              <Chart
                options={usersAreaOptions}
                series={usersAreaSeries}
                type="area"
                height="100%"
                width="100%"
              />
            )}
          </div>

          {/* Label Pill */}
          <div className="flex items-center gap-2 bg-[#0d131f]/60 rounded-xl py-1.5 px-3 w-fit mb-3">
            <span className="w-6 h-6 rounded-lg bg-[#ff6b35] flex items-center justify-center text-white shrink-0">
              <FiUsers className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-semibold text-slate-200 whitespace-nowrap">
              Total Users
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#ff5a1f] px-5 py-2.5 flex justify-between items-center text-white text-[10px] font-semibold tracking-wide shrink-0">
          <span>Total users increase rate</span>
          <span className="flex items-center gap-1 bg-white/10 py-0.5 px-2 rounded-full">
            ↗ +42 this week
          </span>
        </div>
      </div>

      {/* ── CARD 2: Pro Users (3D Slanted Columns SVG) ── */}
      <div className="bg-[#182235] rounded-3xl overflow-hidden flex flex-col h-68 border border-[#1f2d40]/40 shadow-lg">
        <div className="flex-1 flex flex-col px-6 pt-5">
          {/* Big number */}
          <h3 className="text-[2rem] font-extrabold text-white tracking-tight leading-none">
            342
          </h3>

          {/* Custom 3D Slanted Bar SVG */}
          <div className="flex-1 flex items-end justify-center pb-1 mt-2">
            <svg
              viewBox="0 0 290 110"
              className="w-full h-full max-h-30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="og" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff7a45" />
                  <stop offset="100%" stopColor="#c94010" />
                </linearGradient>
                <linearGradient id="yg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffc533" />
                  <stop offset="100%" stopColor="#d68000" />
                </linearGradient>
                <linearGradient id="tg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#26d0be" />
                  <stop offset="100%" stopColor="#008573" />
                </linearGradient>
              </defs>
              {/* Bar 1: Total users (tallest, orange) */}
              <polygon points="12,30 78,10 78,105 12,105" fill="url(#og)" />
              <text
                x="45"
                y="24"
                fill="#fff"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
                transform="rotate(-12,45,24)"
                opacity="0.92"
              >
                Total users
              </text>
              <h2>hello world</h2>
              {/* Bar 2: Premium user (medium, yellow) */}
              <polygon points="108,70 174,55 174,105 108,105" fill="url(#yg)" />
              <text
                x="141"
                y="50"
                fill="#fff"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
                transform="rotate(-8,141,50)"
                opacity="0.92"
              >
                Premium user
              </text>
              {/* Bar 3: Free user (shorter, teal) */}
              <polygon points="204,58 270,42 270,105 204,105" fill="url(#tg)" />
              <text
                x="237"
                y="38"
                fill="#fff"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
                transform="rotate(-10,237,38)"
                opacity="0.92"
              >
                Free user
              </text>
            </svg>
          </div>

          {/* Label Pill */}
          <div className="flex items-center gap-2 bg-[#0d131f]/60 rounded-xl py-1.5 px-3 w-fit mb-3">
            <span className="w-6 h-6 rounded-lg bg-[#00897b] flex items-center justify-center text-white shrink-0">
              <FaCrown className="w-3 h-3" />
            </span>
            <span className="text-[11px] font-semibold text-slate-200 whitespace-nowrap">
              Pro Users
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#00897b] px-5 py-2.5 flex justify-between items-center text-white text-[10px] font-semibold tracking-wide shrink-0">
          <span>Total pro users increase rate</span>
          <span className="flex items-center gap-1 bg-white/10 py-0.5 px-2 rounded-full">
            ↗ 27% conversion
          </span>
        </div>
      </div>

      {/* ── CARD 3: Total Reports (Donut + Legend) ── */}
      <div className="bg-[#182235] rounded-3xl overflow-hidden flex flex-col h-68 border border-[#1f2d40]/40 shadow-lg">
        <div className="flex-1 flex flex-col px-6 pt-5">
          {/* Big number */}
          <h3 className="text-[2rem] font-extrabold text-white tracking-tight leading-none">
            8,562
          </h3>

          {/* Legend + Donut Chart row */}
          <div className="flex-1 flex items-center justify-between gap-4 mt-2">
            {/* Left: Legend */}
            <div className="flex flex-col gap-3 min-w-0">
              <div className="flex items-start gap-2">
                <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[#fd5c28] shrink-0" />
                <span className="text-[11px] font-bold text-white leading-snug">
                  Total Report - 8562
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00897b] shrink-0" />
                <span className="text-[11px] font-semibold text-[#8f9cae]">
                  Today - 124
                </span>
              </div>
            </div>

            {/* Right: Donut */}
            <div className="w-22 h-22 shrink-0">
              {isMounted && (
                <Chart
                  options={reportsDonutOptions}
                  series={reportsDonutSeries}
                  type="donut"
                  height="100%"
                  width="100%"
                />
              )}
            </div>
          </div>

          {/* Label Pill */}
          <div className="flex items-center gap-2 bg-[#0d131f]/60 rounded-xl py-1.5 px-3 w-fit mb-3">
            <span className="w-6 h-6 rounded-lg bg-[#e65100] flex items-center justify-center text-white shrink-0">
              <FiFileText className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-semibold text-slate-200 whitespace-nowrap">
              Total Reports
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#e65100] px-5 py-2.5 flex justify-between items-center text-white text-[10px] font-semibold tracking-wide shrink-0">
          <span>Report submitted</span>
          <span className="flex items-center gap-1 bg-white/10 py-0.5 px-2 rounded-full">
            ↗ +124 today
          </span>
        </div>
      </div>

      {/* ── CARD 4: Total Revenue (Rounded Bars) ── */}
      <div className="bg-[#182235] rounded-3xl overflow-hidden flex flex-col h-68 border border-[#1f2d40]/40 shadow-lg">
        <div className="flex-1 flex flex-col px-6 pt-5">
          {/* Big number */}
          <h3 className="text-[2rem] font-extrabold text-white tracking-tight leading-none">
            $2,000
          </h3>

          {/* Bar Chart – fills remaining space */}
          <div className="flex-1 -mx-2 mt-2">
            {isMounted && (
              <Chart
                options={revenueBarOptions}
                series={revenueBarSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            )}
          </div>

          {/* Label Pill */}
          <div className="flex items-center gap-2 bg-[#0d131f]/60 rounded-xl py-1.5 px-3 w-fit mb-3">
            <span className="w-6 h-6 rounded-lg bg-[#bf360c] flex items-center justify-center text-white shrink-0">
              <FiDollarSign className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-semibold text-slate-200 whitespace-nowrap">
              Total Revenue
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#bf360c] px-5 py-2.5 flex justify-between items-center text-white text-[10px] font-semibold tracking-wide shrink-0">
          <span>This month</span>
          <span className="font-extrabold text-sm">$ 892</span>
        </div>
      </div>
    </div>
  );
}
