"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(179); // 2:59 in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Add OTP verification logic here
    // router.push("/reset-password");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #284A6C 100%)",
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-110 p-10 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt="On The Bite Logo"
            width={120}
            height={80}
            className="object-contain h-17.5 w-auto mb-4"
            priority
          />
          <h1 className="text-2xl font-bold text-[#0A1628] mb-3">Verify OTP</h1>
          <p className="text-[13px] font-medium text-gray-500 text-center leading-relaxed">
            We have sent you a 6 digit OTP code to your provided email:
            example@email.com please input that code here to proceed.
          </p>
        </div>

        <form
          className="flex flex-col items-center space-y-6"
          onSubmit={handleVerify}
        >
          <div className="flex flex-col items-center w-full space-y-4">
            {/* <div className="text-[14px] font-medium text-[#FF6A3D]">
              {formatTime(timeLeft)}
            </div> */}

            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="w-2 md:w-3"></span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{}} // override default style if needed
                  className="w-10! h-10! sm:w-12! sm:h-12! text-center text-lg font-semibold text-gray-800 border border-dashed border-[#FF6A3D]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40 focus:border-[#FF6A3D] transition-all bg-white"
                />
              )}
              containerStyle="flex justify-center w-full"
            />
          </div>

          <div className="flex gap-4 pt-4 w-full">
            <Link
              href="/forgot-password"
              className="flex-1 flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-3 rounded-lg transition-colors"
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
