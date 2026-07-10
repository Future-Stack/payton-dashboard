"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Lock, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api/authService";
import { toast } from "sonner";
import OtpInput from "react-otp-input";

const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) =>
      authService.resetPassword({
        otp: data.otp,
        email: email,
        newPassword: data.newPassword,
      }),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully");
      router.push("/");
    },
    onError: (error: any) => { // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!email) {
      toast.error("Email address is missing. Please start over.");
      router.push("/forgot-password");
      return;
    }
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] p-10 animate-fade-in">
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
          {email
            ? `Please enter the 6-digit OTP sent to ${email} and set your new password.`
            : "You are all set. Now it&apos;s time to create a new password."}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-[14px] font-semibold text-[#0A1628]">
            OTP Code
          </label>
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, value } }) => (
              <OtpInput
                value={value}
                onChange={onChange}
                numInputs={6}
                renderSeparator={<span className="w-2 md:w-3"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{}} // override default style if needed
                    className={`w-10! h-10! sm:w-12! sm:h-12! text-center text-lg font-semibold text-gray-800 border border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40 focus:border-[#FF6A3D] transition-all bg-white ${
                      errors.otp ? "border-red-500" : "border-[#FF6A3D]/50"
                    }`}
                  />
                )}
                containerStyle="flex justify-center w-full pt-2 pb-2"
              />
            )}
          />
          {errors.otp && (
            <p className="text-red-500 text-xs mt-1 font-medium text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

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
              {...register("newPassword")}
              placeholder="Enter new password"
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40 focus:border-[#FF6A3D] transition-all text-gray-700 placeholder:text-gray-400 ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.newPassword.message}
            </p>
          )}
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
              {...register("confirmPassword")}
              placeholder="Confirm new password"
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40 focus:border-[#FF6A3D] transition-all text-gray-700 placeholder:text-gray-400 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4 w-full">
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-[#0A1628] text-sm font-semibold py-3 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="flex-1 bg-[#FF6A3D] hover:bg-[#E55B30] disabled:bg-[#FF6A3D]/70 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #284A6C 100%)",
      }}
    >
      <Suspense
        fallback={
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] p-10 flex justify-center items-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF6A3D]" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
