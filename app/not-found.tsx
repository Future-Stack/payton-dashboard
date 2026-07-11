"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #284A6C 100%)",
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-110 p-10 animate-fade-in text-center">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="On The Bite Logo"
            width={120}
            height={80}
            className="object-contain h-17.5 w-auto mb-6"
            priority
          />
          <h1 className="text-7xl font-bold text-[#FF6A3D] mb-2">404</h1>
          <h2 className="text-xl font-bold text-[#0A1628] mb-3">
            Page Not Found
          </h2>
          <p className="text-[13px] font-medium text-gray-500">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center w-full bg-[#FF6A3D] hover:bg-[#E55B30] text-white text-sm font-semibold py-3 rounded-lg transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
