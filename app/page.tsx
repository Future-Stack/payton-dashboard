"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #284A6C 100%)",
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[440px] p-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="On The Bite Logo"
            width={120}
            height={80}
            className="object-contain h-[70px] w-auto mb-2"
            priority
          />
          <h1 className="text-2xl font-bold text-[#0A1628] mt-2 mb-1">
            Admin Access
          </h1>
          <p className="text-[13px] font-medium text-gray-500">
            On The Bite Management Portal
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
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

          <div>
            <label
              htmlFor="password"
              className="block text-[13px] font-semibold text-[#1F2937] mb-1.5"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#284A6C] focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-400 tracking-widest"
              required
            />
            <div className="flex justify-end mt-1.5">
              <Link
                href="/forgot-password"
                className="text-[10px] font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#FF6A3D] hover:bg-[#E55B30] text-white text-sm font-semibold py-3 rounded-lg transition-colors"
            >
              Log In to Admin
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 font-medium">
            Admin access only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
