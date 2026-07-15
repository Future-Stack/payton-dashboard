"use client";

import { useState } from "react";
import {
  FiBell,
  FiDatabase,
  FiUser,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";

/* ─────────────────── Toggle Switch ─────────────────── */
function Toggle({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a9396]/60 ${checked ? "bg-[#0a9396]" : "bg-[#1e2d42]"
        }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-0.75px"
          }`}
      />
    </button>
  );
}

/* ─────────────────── Section Header ─────────────────── */
function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <Icon className="w-4 h-4 text-[#0a9396]" />
      <h2 className="text-sm font-semibold text-white tracking-wide">
        {title}
      </h2>
    </div>
  );
}

/* ─────────────────── Notification Row ─────────────────── */
function NotificationRow({
  id,
  title,
  description,
  checked,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[#1a2d45]/50 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white leading-snug">{title}</p>
        <p className="text-xs text-[#5e7a99] mt-0.5">{description}</p>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

/* ─────────────────── Slider Row ─────────────────── */
function SliderRow({
  id,
  title,
  description,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (val: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className="py-4 border-b border-[#1a2d45]/50 last:border-b-0"

    //     style={{
    //       borderRadius: '16px',
    // border: '1px solid rgba(255, 255, 255, 0.10)',
    // background: '#1E3A5A'
    //     }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-white">{title}</p>
        <span className="text-xs font-semibold text-[#0a9396]">
          {displayValue}
        </span>
      </div>

      {/* Custom styled range */}
      <div className="relative h-1.5 rounded-full bg-[#1a2d45] mb-2.5">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-[#0a9396] to-[#08b4b8] transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={title}
        />
        {/* Thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-[#0a9396] pointer-events-none transition-all duration-150"
          style={{ left: `calc(${percentage}% - 7px)` }}
        />
      </div>

      <p className="text-xs text-[#5e7a99]">{description}</p>
    </div>
  );
}

/* ─────────────────── Main Component ─────────────────── */
export default function SettingsPageClient() {
  /* ── Notification state ── */
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [flaggedReports, setFlaggedReports] = useState(true);
  const [newUserRegistrations, setNewUserRegistrations] = useState(false);
  const [suspiciousActivity, setSuspiciousActivity] = useState(true);

  /* ── Data retention state ── */
  const [reportRetention, setReportRetention] = useState(365);
  const [userDataRetention, setUserDataRetention] = useState(730);
  const [autoDeleteBanned, setAutoDeleteBanned] = useState(false);

  /* ── Toast state ── */
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    showToast("Settings saved successfully!", "success");
  };

  const handleReset = () => {
    setEmailNotifications(true);
    setFlaggedReports(true);
    setNewUserRegistrations(false);
    setSuspiciousActivity(true);
    setReportRetention(365);
    setUserDataRetention(730);
    setAutoDeleteBanned(false);
    showToast("Settings reset to defaults.", "info");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full mx-auto animate-fade-in relative ">
      {/* ── Toast Notification ── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white transition-all duration-300 animate-fade-in ${toast.type === "success"
            ? "bg-[#0a9396] shadow-cyan-900/30"
            : "bg-[#1e2d42] shadow-slate-900/50"
            }`}
        >
          {toast.type === "success" ? (
            <FiSave className="w-4 h-4 shrink-0" />
          ) : (
            <FiRefreshCw className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-xl font-bold text-white leading-tight">
          Admin Settings
        </h1>
      </div>

      {/* ── Main Card ── */}
      <div className="bg-[#19304A] border border-[#40638C] rounded-[20px] p-6 sm:p-8 flex flex-col gap-8">
        {/* ── Admin Notifications Section ── */}
        <section>
          <SectionHeader icon={FiBell} title="Admin Notifications" />
          <div
            className="flex flex-col"
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              background: "#1E3A5A",
              padding: "5px 15px 1px 17px",
            }}
          >
            <NotificationRow
              id="toggle-email-notifications"
              title="Email Notifications"
              description="Receive alerts via email"
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
            <NotificationRow
              id="toggle-flagged-reports"
              title="Flagged Reports"
              description="New flagged content alerts"
              checked={flaggedReports}
              onChange={setFlaggedReports}
            />
            <NotificationRow
              id="toggle-new-user-registrations"
              title="New User Registrations"
              description="Alert when users sign up"
              checked={newUserRegistrations}
              onChange={setNewUserRegistrations}
            />
            <NotificationRow
              id="toggle-suspicious-activity"
              title="Suspicious Activity"
              description="Security and abuse alerts"
              checked={suspiciousActivity}
              onChange={setSuspiciousActivity}
            />
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#1a2d45]/50" />

        {/* ── Data Retention Section ── */}
        <section>
          <SectionHeader icon={FiDatabase} title="Data Retention" />
          <div
            className="flex flex-col"
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              background: "#1E3A5A",
              padding: "5px 15px 1px 17px",
            }}
          >
            <SliderRow
              id="slider-report-retention"
              title="Report Retention"
              description={`Delete reports older than ${reportRetention} days (${Math.round(reportRetention / 30)} months)`}
              value={reportRetention}
              min={30}
              max={730}
              step={30}
              displayValue={`${reportRetention} days`}
              onChange={setReportRetention}
            />
            <SliderRow
              id="slider-user-data-retention"
              title="User Data Retention"
              description={`Delete inactive user data after ${userDataRetention} days (${Math.round(userDataRetention / 365)} years)`}
              value={userDataRetention}
              min={90}
              max={1825}
              step={30}
              displayValue={`${userDataRetention} days`}
              onChange={setUserDataRetention}
            />

            {/* Auto-Delete Banned Users toggle row */}
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white leading-snug">
                  Auto-Delete Banned Users
                </p>
                <p className="text-xs text-[#5e7a99] mt-0.5">
                  Remove user data after 90 days
                </p>
              </div>
              <Toggle
                id="toggle-auto-delete-banned"
                checked={autoDeleteBanned}
                onChange={setAutoDeleteBanned}
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#1a2d45]/50" />

        {/* ── Admin Account Section ── */}
        <section>
          <SectionHeader icon={FiUser} title="Admin Account" />
          <div
            className="flex flex-col gap-2"
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              background: "#1E3A5A",
              padding: "5px 15px 10px 17px",
            }}
          >
            <label
              htmlFor="admin-email"
              className="text-xs font-medium text-[#7a8a9e]"
            >
              Admin Email
            </label>
            <div className="relative">
              <input
                id="admin-email"
                type="text"
                className="w-full bg-[#0a1120] border border-[#1a2d45]/80 rounded-xl px-4 py-3 text-sm text-[#b0bfd0] placeholder-[#3d5168] focus:outline-none focus:border-[#0a9396]/60 focus:ring-1 focus:ring-[#0a9396]/30 transition-all duration-200 pr-11"
                placeholder="admin@onthebite.com"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ── Action Buttons ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          id="settings-reset-btn"
          onClick={handleReset}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#0a9396] hover:bg-[#088c8f] active:scale-95 transition-all duration-200 shadow-lg shadow-cyan-900/20"
        >
          <FiRefreshCw className="w-4 h-4" />
          Reset to Defaults
        </button>

        <button
          id="settings-save-btn"
          onClick={handleSave}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-[#ff6b35] to-[#fd5c28] hover:from-[#fd5c28] hover:to-[#e84d1f] active:scale-95 transition-all duration-200 shadow-lg shadow-orange-900/20"
        >
          <FiSave className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
