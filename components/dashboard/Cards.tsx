"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FiUsers, FiFileText, FiDollarSign } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
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
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: "#E85C05",
            opacity: 1,
          },
          {
            offset: 100,
            color: "#E85C05",
            opacity: 1,
          },
        ],
      },
    },

    stroke: {
      curve: "smooth",
      width: 1,
      colors: ["rgba(0, 212, 255, 0.10)"],
    },

    tooltip: { enabled: true },
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
    tooltip: { enabled: true },
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
    tooltip: { enabled: true },
    grid: { show: false, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
  };
  const revenueBarSeries = [
    { name: "Revenue", data: [35, 60, 42, 80, 50, 75, 48, 65, 55, 70] },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
      {/* ── CARD 1: Total Users ── */}
      <div className="bg-[#FF6B35] rounded-3xl overflow-hidden flex flex-col h-68.5 shadow-lg">
        <div className="flex-1 min-h-0 flex flex-col px-6 pt-2 bg-[#19304A] rounded-b-4xl">
          {/* Big number */}
          <h3 className="text-[2rem] font-bold text-white tracking-tight leading-none mt-3">
            31,200
          </h3>

          {/* Area Chart – fills remaining space */}
          <div className="flex-1 -mx-2 -mt-3 h-20">
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
          <div className="flex items-center gap-2  rounded-xl py-2 px-4 w-fit mt-2 mb-2 shrink-0 shadow-sm">
            <span className="w-6 h-6 rounded-lg bg-[#ff6b35] flex items-center justify-center text-white shrink-0">
              <FiUsers className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-normal text-slate-200 whitespace-nowrap">
              Total Users
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="px-5 py-1 flex justify-between items-center text-white text-sm font-normal tracking-wide shrink-0">
          <span>Total users increase rate</span>
          <span className="flex items-center gap-1 bg-white/10  px-2 rounded-full">
            ↗ +42 this week
          </span>
        </div>
      </div>

      {/* ── CARD 2: Pro Users ── */}
      <div className="bg-[#00897b] rounded-3xl overflow-hidden flex flex-col h-68.5 shadow-lg">
        <div className="flex-1 min-h-0 flex flex-col px-6 pt-5 bg-[#19304A] rounded-b-4xl">
          <h3 className="text-[2rem] font-bold text-white tracking-tight leading-none">
            342
          </h3>

          <div className="flex-1 min-h-0 flex items-end justify-center pb-1 mt-2">
            <svg
              viewBox="0 0 280 120"
              className="w-full h-full max-h-32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="og" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#c2410c" />
                </linearGradient>
                <linearGradient id="yg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="tg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
              </defs>

              <polygon
                points="15,40 85,20 85,110 15,110"
                fill="url(#og)"
                stroke="url(#og)"
                strokeWidth="12"
                strokeLinejoin="round"
              />
              <text
                x="50"
                y="14"
                fill="#f8fafc"
                fontSize="11"
                fontWeight="400"
                textAnchor="middle"
                transform="rotate(-15, 50, 14)"
              >
                Total users
              </text>

              <polygon
                points="105,75 175,65 175,110 105,110"
                fill="url(#yg)"
                stroke="url(#yg)"
                strokeWidth="12"
                strokeLinejoin="round"
              />
              <text
                x="140"
                y="53"
                fill="#f8fafc"
                fontSize="11"
                fontWeight="400"
                textAnchor="middle"
                transform="rotate(-8, 140, 53)"
              >
                Premium user
              </text>

              <polygon
                points="195,50 265,35 265,110 195,110"
                fill="url(#tg)"
                stroke="url(#tg)"
                strokeWidth="12"
                strokeLinejoin="round"
              />
              <text
                x="230"
                y="30"
                fill="#f8fafc"
                fontSize="11"
                fontWeight="400"
                textAnchor="middle"
                transform="rotate(-12, 230, 30)"
              >
                Free user
              </text>
            </svg>
          </div>

          <div className="flex items-center gap-3 py-1 mt-2 mb-3 w-fit shrink-0">
            <span className="w-8 h-8 rounded-xl bg-[#00897b] flex items-center justify-center text-white shrink-0">
              <FaCrown className="w-5 h-5" />
            </span>
            <span className="text-sm font-normal text-white whitespace-nowrap">
              Pro Users
            </span>
          </div>
        </div>
        {/* bottom banner  */}
        <div className="px-5 py-1 flex justify-between items-center text-white text-sm font-normal tracking-wide shrink-0">
          <span>Total pro users increase rate</span>
          <span className="flex items-center gap-1 font-normal">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
            27% conversion
          </span>
        </div>
      </div>

      {/* ── CARD 3: Total Reports (Donut + Legend) ── */}
      <div className="bg-[#9A670B] rounded-3xl overflow-hidden flex flex-col h-68 shadow-lg">
        <div className="flex-1 min-h-0 flex flex-col px-6 pt-5 bg-[#19304A] rounded-b-4xl">
          {/* Big number */}
          <h3 className="text-[2rem] font-extrabold text-white tracking-tight leading-none">
            8,562
          </h3>

          {/* Legend + Donut Chart row */}
          <div className="flex-1 flex items-center justify-between gap-4 mt-2">
            {/* Left: Legend */}
            <div className="flex flex-col gap-1.75 min-w-0">
              <div className="flex items-start gap-2">
                <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[#fd5c28] shrink-0" />
                <span className="text-[18px] font-bold text-white leading-snug">
                  Total Report - 8562
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00897b] shrink-0" />
                <span className="text-[14px] font-semibold text-white">
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
          <div className="flex items-center gap-2  rounded-xl py-2 px-4 w-fit mt-2 mb-3 shrink-0 shadow-sm">
            <span className="w-6 h-6 rounded-lg bg-[#9A670B] flex items-center justify-center text-white shrink-0">
              <FiFileText className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-semibold text-slate-200 whitespace-nowrap">
              Total Reports
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="px-5 py-1 flex justify-between items-center text-white text-sm font-normal tracking-wide shrink-0">
          <span>Report submitted</span>
          <span className="flex items-center gap-1 bg-white/10   px-2 rounded-full">
            ↗ +124 today
          </span>
        </div>
      </div>

      {/* ── CARD 4: Total Revenue (Rounded Bars) ── */}
      <div className="bg-[#bf360c] rounded-3xl overflow-hidden flex flex-col h-68.5 shadow-lg">
        <div className="flex-1 min-h-0 flex flex-col px-6 pt-5 bg-[#19304A] rounded-b-4xl">
          {/* Big number */}
          <h3 className="text-[2rem] font-extrabold text-white tracking-tight leading-none">
            $2,000
          </h3>

          {/* Bar Chart – fills remaining space */}
          <div className="flex-1 -mx-2 h-20">
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
          <div className="flex items-center gap-2  rounded-xl py-2 px-4 w-fit mt-2 mb-3 shrink-0 shadow-sm">
            <span className="w-6 h-6 rounded-lg bg-[#bf360c] flex items-center justify-center text-white shrink-0">
              <FiDollarSign className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-normal text-slate-200 whitespace-nowrap">
              Total Revenue
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="px-5 py-1 flex justify-between items-center text-white text-[14px] font-normal tracking-wide shrink-0">
          <span>This month</span>
          <span className="font-normal text-sm">$ 892</span>
        </div>
      </div>
    </div>
  );
}
