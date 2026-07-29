"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Shield,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { validateResetTokenApi, resetPasswordUser } from "@/action/common";

const schema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!token || !email) {
        setIsValidToken(false);
        setIsValidating(false);
        return;
      }

      try {
        const res = await validateResetTokenApi(token, email);
        if (res?.success || res?.valid) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          if (res?.message) {
            toast.error(res.message);
          }
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkTokenValidity();
  }, [token, email]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        email,
        token,
        newPassword: data.newPassword,
      };
      const res = await resetPasswordUser(payload);
      if (res?.success) {
        setIsSuccess(true);
        toast.success(res.message || "Password reset successfully!");
      } else {
        toast.error(res?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ── 1. Loading state during validation ──────────────────────────────────────
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-gray-800 mb-4" />
        <p className="text-sm font-semibold text-gray-600">Validating password reset token...</p>
      </div>
    );
  }

  // ── 2. Invalid or Expired Token screen ─────────────────────────────────────
  if (!isValidToken && !isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
          <p className="text-sm text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new reset link.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold text-sm"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  // ── 3. Main Form & Success Screen ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
        >
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="text-center py-4 space-y-5"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Complete! 🎉</h2>
                <p className="text-sm text-gray-600">
                  Your password has been successfully updated. You can now log in with your new password.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold text-sm"
              >
                Sign In to Your Account
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-2xl mb-4 shadow-lg">
                  <KeyRound className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h1>
                <p className="text-sm text-gray-600">Please enter a new secure password for {email}</p>

                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2 mt-4">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-700">Encrypted Update</span>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
              </div>

              {/* Password Reset Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register("newPassword")}
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg transition-all text-gray-900 placeholder:text-gray-400 outline-none ${
                        errors.newPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg transition-all text-gray-900 placeholder:text-gray-400 outline-none ${
                        errors.confirmPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5" />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                <Link href="/login" className="text-black font-semibold hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4 inline" />
                  Back to Login
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
