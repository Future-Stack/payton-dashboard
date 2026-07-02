"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to send OTP here
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
            Forgot Password!
          </h1>
          <p className="text-[13px] font-medium text-gray-500 text-center leading-relaxed">
            Do you forgot your password. It's ease to reset, just provide your
            email address. We'll send you a OTP code.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSendOTP}>
          <div>
            <label
              htmlFor="email"
              className="block text-[13px] font-semibold text-[#1F2937] mb-1.5"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="admin@onthebite.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#284A6C] focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 bg-[#FF6A3D] hover:bg-[#E55B30] text-white text-sm font-semibold py-3 rounded-lg transition-colors"
            >
              Send OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
