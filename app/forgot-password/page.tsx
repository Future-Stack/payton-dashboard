"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api/authService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => authService.forgetPassword(data),
    onSuccess: (data, variables) => {
      toast.success(data.message || "OTP sent to your email");
      router.push(`/reset-password?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: any) => { // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
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
            Do you forgot your password. It&apos;s ease to reset, just provide your
            email address. We&apos;ll send you a OTP code.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              {...register("email")}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#284A6C] focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-400 ${errors.email ? "border-red-500" : "border-gray-200"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
            )}
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
              disabled={forgotPasswordMutation.isPending}
              className="flex-1 bg-[#FF6A3D] hover:bg-[#E55B30] disabled:bg-[#FF6A3D]/70 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
