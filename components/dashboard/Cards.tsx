"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FiUsers, FiFileText, FiDollarSign } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { DashboardStatsResponse } from "@/services/api/dashboardService";

interface CardsProps {
  stats: DashboardStatsResponse["data"]["stats"];
  monthlyRevenue: DashboardStatsResponse["data"]["monthlyRevenue"];
  monthlyRegistrations: DashboardStatsResponse["data"]["monthlyRegistrations"];
}

export default function Cards({
  stats,
  monthlyRevenue,
  monthlyRegistrations,
}: CardsProps) {
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

    tooltip: {
      enabled: true,
      theme: "dark",
      x: {
        show: true,
      },
    },
    xaxis: {
      type: "category",
      tickAmount: "dataPoints",
      categories: monthlyRegistrations.map((m) => m.month),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    colors: ["#fd5c28"],
    grid: { show: false, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
  };
  const usersAreaSeries = [
    {
      name: "Users",
      data: monthlyRegistrations.map((m) => m.count),
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
    colors: ["#00897b", "#fd5c28"],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: { size: "68%" },
      },
    },
    tooltip: { enabled: true },
  };
  const reportsDonutSeries = [
    stats.reports.today,
    Math.max(0, stats.reports.total - stats.reports.today),
  ];

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
    dataLabels: {
      enabled: false,
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
    xaxis: {
      type: "category",
      tickAmount: "dataPoints",
      categories: monthlyRevenue.map((m) => m.month),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      show: false,
      min: 0,
      max: Math.max(...monthlyRevenue.map((m) => m.revenue), 100),
    },
    colors: ["#fd5c28"],
    tooltip: {
      enabled: true,
      theme: "dark",
      x: {
        show: true,
        formatter: (val, opts) => {
          return String(
            opts?.dataPointIndex !== undefined
              ? monthlyRevenue[opts.dataPointIndex]?.month || val
              : val,
          );
        },
      },
      y: {
        title: {
          formatter: () => "Revenue:",
        },
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
    grid: { show: false, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
  };
  const revenueBarSeries = [
    { name: "Revenue", data: monthlyRevenue.map((m) => m.revenue) },
  ];

  /* ─────────────── Card 2: Pro Users Dynamic SVG ─────────────── */
  const proUsersCount = stats.proUsers.total;
  const freeUsersCount = Math.max(0, stats.users.total - proUsersCount);

  const getBarProps = (
    xLeft: number,
    xRight: number,
    value: number,
    label: string,
  ) => {
    const ratio =
      stats.users.total > 0 ? Math.min(1, value / stats.users.total) : 0;
    const leftH = Math.max(15, 70 * ratio); // give min height so text doesn't hit bottom
    const rightH = Math.max(15, 90 * ratio);
    const yLeft = 110 - leftH;
    const yRight = 110 - rightH;
    const midX = xLeft + (xRight - xLeft) / 2;
    const midY = yLeft + (yRight - yLeft) / 2;
    const textY = midY - 14;
    const angle = Math.atan2(yRight - yLeft, xRight - xLeft) * (180 / Math.PI);
    return {
      points: `${xLeft},${yLeft} ${xRight},${yRight} ${xRight},110 ${xLeft},110`,
      textX: midX,
      textY,
      transform: `rotate(${angle.toFixed(1)}, ${midX}, ${textY})`,
      labelText: `${label}: ${value.toLocaleString()}`,
    };
  };

  const totalProps = getBarProps(15, 85, stats.users.total, "Total");
  const proProps = getBarProps(105, 175, proUsersCount, "Pro");
  const freeProps = getBarProps(195, 265, freeUsersCount, "Free");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
      {/* ── CARD 1: Total Users ── */}
      <div className="bg-[#FF6B35] rounded-3xl overflow-hidden flex flex-col h-68.5 shadow-lg">
        <div className="flex-1 min-h-0 flex flex-col px-6 pt-2 bg-[#19304A] rounded-b-4xl">
          {/* Big number */}
          <h3 className="text-[2rem] font-bold text-white tracking-tight leading-none mt-3">
            {stats.users.total.toLocaleString()}
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
            {stats.users.changeText}
          </span>
        </div>
      </div>

      {/* ── CARD 2: Pro Users ── */}
      <div className="bg-[#00897b] rounded-3xl overflow-hidden flex flex-col h-68.5 shadow-lg">
        <div className="flex-1 min-h-0 flex flex-col px-6 pt-5 bg-[#19304A] rounded-b-4xl">
          <h3 className="text-[2rem] font-bold text-white tracking-tight leading-none">
            {stats.proUsers.total.toLocaleString()}
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
                points={totalProps.points}
                fill="url(#og)"
                stroke="url(#og)"
                strokeWidth="12"
                strokeLinejoin="round"
              />
              <text
                x={totalProps.textX}
                y={totalProps.textY}
                fill="#f8fafc"
                fontSize="11"
                fontWeight="400"
                textAnchor="middle"
                transform={totalProps.transform}
              >
                {totalProps.labelText}
              </text>

              <polygon
                points={proProps.points}
                fill="url(#yg)"
                stroke="url(#yg)"
                strokeWidth="12"
                strokeLinejoin="round"
              />
              <text
                x={proProps.textX}
                y={proProps.textY}
                fill="#f8fafc"
                fontSize="11"
                fontWeight="400"
                textAnchor="middle"
                transform={proProps.transform}
              >
                {proProps.labelText}
              </text>

              <polygon
                points={freeProps.points}
                fill="url(#tg)"
                stroke="url(#tg)"
                strokeWidth="12"
                strokeLinejoin="round"
              />
              <text
                x={freeProps.textX}
                y={freeProps.textY}
                fill="#f8fafc"
                fontSize="11"
                fontWeight="400"
                textAnchor="middle"
                transform={freeProps.transform}
              >
                {freeProps.labelText}
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
            {stats.proUsers.changeText}
          </span>
        </div>
      </div>

      {/* ── CARD 3: Total Reports (Donut + Legend) ── */}
      <div className="bg-[#9A670B] rounded-3xl overflow-hidden flex flex-col h-68 shadow-lg">
        <div className="flex-1 min-h-0 flex flex-col px-6 pt-5 bg-[#19304A] rounded-b-4xl">
          {/* Big number */}
          <h3 className="text-[2rem] font-extrabold text-white tracking-tight leading-none">
            {stats.reports.total.toLocaleString()}
          </h3>

          {/* Legend + Donut Chart row */}
          <div className="flex-1 flex items-center justify-between gap-4 mt-2">
            {/* Left: Legend */}
            <div className="flex flex-col gap-1.75 min-w-0">
              <div className="flex items-start gap-2">
                <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[#fd5c28] shrink-0" />
                <span className="text-[18px] font-bold text-white leading-snug">
                  Total Report - {stats.reports.total}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00897b] shrink-0" />
                <span className="text-[14px] font-semibold text-white">
                  Today - {stats.reports.today}
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
            {stats.reports.changeText}
          </span>
        </div>
      </div>

      {/* ── CARD 4: Total Revenue (Rounded Bars) ── */}
      <div className="bg-[#bf360c] rounded-3xl overflow-hidden flex flex-col h-68.5 shadow-lg">
        <div className="flex-1 min-h-0 flex flex-col px-6 pt-5 bg-[#19304A] rounded-b-4xl">
          {/* Big number */}
          <h3 className="text-[2rem] font-extrabold text-white tracking-tight leading-none">
            ${stats.revenue.total.toLocaleString()}
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
          <span className="font-normal text-sm">
            $ {stats.revenue.thisMonth.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
