"use client";

import { useState } from "react";
import { FiEdit2, FiCheck } from "react-icons/fi";
import { RiVipCrownLine } from "react-icons/ri";

/* ─────────────────── Types ─────────────────── */
interface PlanFeature {
  text: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: "month" | "year";
  features: PlanFeature[];
  badge?: {
    label: string;
    color: "orange" | "teal";
  };
  savingsText?: string;
}

/* ─────────────────── Data ─────────────────── */
const MONTHLY_PLANS: Plan[] = [
  {
    id: "free-monthly",
    name: "Free",
    description: "Basic access for casual anglers",
    price: 0,
    period: "month",
    features: [
      { text: "Submit Fishing Reports Included" },
      { text: "Public Reports 72-hour delay" },
      { text: "Heatmap Delayed" },
      { text: "Report History Last 72 hours(72-hour delay)" },
      { text: "Groups Join existing (Cannot create)" },
      { text: "Weather Forecast Current + 2-day forecast" },
      { text: "Notification System only (Account, password, announcements)" },
      { text: "Future Premium Feature - Not included" },
    ],
  },
  {
    id: "pro-monthly",
    name: "Pro",
    description: "Full access for serious anglers",
    price: 9.99,
    period: "month",
    badge: { label: "POPULAR", color: "orange" },
    features: [
      { text: "Submit Fishing Reports Included" },
      { text: "Public Reports Real-time" },
      { text: "Heatmap Live" },
      { text: "Report History Unlimited history (Real-time access)" },
      { text: "Groups Create & manage groups" },
      { text: "Weather Forecast 5-day extended forecast" },
      {
        text: "Notification All fishing notifications (Hot bites, new reports, weather alerts, group messages)",
      },
      { text: "Future Premium Feature - included" },
    ],
  },
];

/* ─────────────────── Sub-components ─────────────────── */

function PriceBadge({ badge }: { badge: Plan["badge"] }) {
  if (!badge) return null;

  const colorClasses =
    badge.color === "orange"
      ? "bg-[#ff6b35] text-white"
      : "bg-[#0a9396] text-white";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${colorClasses}`}
    >
      {badge.label}
    </span>
  );
}

function PriceDisplay({ plan }: { plan: Plan }) {
  const periodLabel = plan.period === "month" ? "/month" : "/year";

  return (
    <div className="flex flex-col items-end shrink-0">
      <div className="flex items-baseline gap-0.5">
        {plan.price > 0 && (
          <span className="text-sm font-semibold text-[#ff6b35] leading-none">
            $
          </span>
        )}
        <span className="text-3xl font-bold text-white leading-none">
          {plan.price === 0
            ? "0"
            : plan.price % 1 === 0
              ? plan.price.toString()
              : plan.price.toFixed(2)}
        </span>
        <span className="text-sm text-[#7a8a9e] ml-0.5">{periodLabel}</span>
      </div>
      {plan.savingsText && (
        <span className="text-xs font-semibold text-[#0a9396] mt-1">
          {plan.savingsText}
        </span>
      )}
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const isPro = plan.name === "Pro";
  const checkColor = isPro ? "text-[#ff6b35]" : "text-[#7a8a9e]";

  return (
    <div
      className={`
        relative rounded-2xl p-5 sm:p-6 transition-all duration-300
        ${
          isPro
            ? "bg-[#393331] border border-[#FF6B354D]/60"
            : "bg-[#1E3A5A] border border-[#47596E]"
        }  
 
      `}
    >
      {/* Top Row: Name + Price */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          {/* Crown + Badge row */}
          {plan.badge && (
            <div className="flex items-center gap-2 flex-wrap">
              <RiVipCrownLine
                className={`w-4.5 h-4.5 shrink-0 ${
                  plan.badge.color === "orange"
                    ? "text-[#ff6b35]"
                    : "text-[#0a9396]"
                }`}
              />
              <PriceBadge badge={plan.badge} />
            </div>
          )}

          {/* Plan Name */}
          <h3 className="text-lg font-bold text-white leading-snug">
            {plan.name}
          </h3>
          <p className="text-xs text-[#7a8a9e] font-medium">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <PriceDisplay plan={plan} />
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2 mt-4">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2.5">
            <FiCheck
              className={`w-3.5 h-3.5 shrink-0 ${checkColor}`}
              strokeWidth={2.5}
            />
            <span className="text-sm text-[#b0bfd0] font-medium">
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlanSection({ title, plans }: { title: string; plans: Plan[] }) {
  return (
    <section className="bg-[#19304A] border border-[#40638C] rounded-[20px] p-5 sm:p-6 flex flex-col gap-4">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────── Main Component ─────────────────── */
export default function PricingPageClient() {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-full mx-auto animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">
            Subscription Pricing
          </h1>
          <p className="text-sm text-[#7a8a9e] font-medium mt-0.5">
            Manage tier pricing and features
          </p>
        </div>

        {/* Edit Button */}
        {/* <button
          id="pricing-edit-btn"
          onClick={() => setEditMode((prev) => !prev)}
          className="
            flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-[#0a9396] text-white shadow-lg shadow-cyan-900/20
            transition-all duration-200 hover:bg-[#0b8285] hover:scale-[1.02] active:scale-95 shrink-0
          "
        >
          <FiEdit2 className="w-4 h-4" />
          <span>{editMode ? "Done" : "Edit"}</span>
        </button> */}
      </div>

      {/* ── Plan Sections ── */}
      <div className="flex flex-col gap-6">
        <PlanSection title="Monthly Plans" plans={MONTHLY_PLANS} />
      </div>
    </div>
  );
}
