"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Add password reset logic here
    // router.push("/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #284A6C 100%)",
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[440px] p-10 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt="On The Bite Logo"
            width={120}
            height={80}
            className="object-contain h-[70px] w-auto mb-4"
            priority
          />
          <h1 className="text-2xl font-bold text-[#0A1628] mb-3">
            Reset Password
          </h1>
          <p className="text-[13px] font-medium text-gray-500 text-center leading-relaxed">
            You are all set.Now it's time to create a new password.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleVerify}>
          <div className="space-y-1">
            <label className="text-[14px] font-semibold text-[#0A1628]">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-[18px] h-[18px]" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="admin123"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40 focus:border-[#FF6A3D] transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[14px] font-semibold text-[#0A1628]">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-[18px] h-[18px]" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="admin123"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40 focus:border-[#FF6A3D] transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 w-full">
            <Link
              href="/verify-otp"
              className="flex-1 flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-[#0A1628] text-sm font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 bg-[#FF6A3D] hover:bg-[#E55B30] text-white text-sm font-semibold py-3 rounded-lg transition-colors"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
