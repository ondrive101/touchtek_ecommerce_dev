"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  LogIn,
  Sparkles,
  Shield,
  Phone,
  ArrowLeft,
  KeyRound,Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getSession, signIn} from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {maskOtpTarget } from '@/lib/utils/functions';
import Link from "next/link";
import Image from "next/image";
import OtpInput from "@/components/layout/components/OTP";
import authConfig from "@/components/layout/config/authConfig";
import { login_loginSchema, login_phoneSchema, login_otpSchema } from '@/lib/utils/validator';

// ─── Field Error ──────────────────────────────────────────────────────────────
const FieldError = ({ message }) =>
  message ? (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-600 mt-1 flex items-center gap-1"
    >
      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
      {message}
    </motion.p>
  ) : null;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const initialMode = authConfig.isEnabled("login", "emailPassword")
    ? "email"
    : "phone";
  const [loginMode, setLoginMode] = useState(initialMode);

  const [otpTarget, setOtpTarget] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // ─── Config-derived display flags ─────────────────────────────────────────
  const showEmailTab = authConfig.isEnabled("login", "emailPassword");
  const showPhoneTab = authConfig.isEnabled("login", "phoneOtp");
  const showGoogle = authConfig.isEnabled("login", "google");
  const useEmailOtp = authConfig.isEnabled("login", "emailOtp");
  const isOtpScreen = loginMode === "email-otp" || loginMode === "phone-otp";

  // (1) Show tabs ONLY when BOTH email and phone are enabled — single tab looks broken
  const showTabs = showEmailTab && showPhoneTab && !isOtpScreen;

  // ─── Email Form ────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(login_loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  // ─── Phone Form ────────────────────────────────────────────────────────────
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm({
    resolver: zodResolver(login_phoneSchema),
    defaultValues: { phone: "" },
  });

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetOtp = () => {
    setOtpValue("");
    setOtpError("");
  };

  const triggerOtpSend = (target, nextMode) => {
    setIsLoading(true);
    setOtpTarget(target);
    console.log(`[Auth] Sending OTP to: ${target}`);
    // 🔁 Replace with your API call: sendOtp(target)
    setTimeout(() => {
      setIsLoading(false);
      setLoginMode(nextMode);
      startResendTimer();
    }, 1200);
  };
  
  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleLogin = async (payload) => {
    try {
      toast.error('login disabled by admin');
      // setIsLoading(true);
      // console.log("Payload:", payload);

      // const response = await signIn("credentials", {
      //   type:payload.type,
      //   email: payload.data.email,
      //   password: payload.data.password,
      //   redirect: false,
      // });

      // if (!response?.ok || response?.error) {
      //   toast.error(response?.error || "Invalid credentials");
      //   return;
      // }
      // toast.success("Login successful!");
      // const session = await getSession();
      // console.log('session', session)

    } catch (error) {
      console.error("Error login account:", error);
      toast.error(error.message || "Error login account");
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = async (data) => {
    if (useEmailOtp) {
      triggerOtpSend(data.email, "email-otp");
    } else {
      
      const payload = {
        type: "email",
        data,
      };
      await handleLogin(payload);
    }
  };


  const onPhoneSubmit = async (data) => {
    triggerOtpSend(`+91 ${data.phone}`, "phone-otp");
  };

  const onOtpSubmit = async () => {
    const result = login_otpSchema.safeParse({ otp: otpValue });
    if (!result.success) {
      setOtpError(result.error.errors[0].message);
      return;
    }
    setOtpError("");
    setIsLoading(true);
    console.log(`[Auth] Verifying OTP: ${otpValue} for: ${otpTarget}`);
    // 🔁 Replace with your API call: verifyOtp(otpTarget, otpValue)
    setTimeout(() => {
      setIsLoading(false);
      alert("Login successful!");
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    console.log("[Auth] Google login initiated");
    // 🔁 Replace with: signIn('google') — next-auth / firebase
    setTimeout(() => {
      setIsGoogleLoading(false);
      alert("Google login successful!");
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    console.log(`[Auth] Resending OTP to: ${otpTarget}`);
    resetOtp();
    startResendTimer();
    // 🔁 Replace with your API call: resendOtp(otpTarget)
  };

  const goBackFromOtp = () => {
    setLoginMode(loginMode === "email-otp" ? "email" : "phone");
    resetOtp();
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
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
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-2xl mb-4 shadow-lg"
            >
              <span className="text-3xl font-bold text-white">T</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isOtpScreen ? "Enter OTP" : "Welcome Back"}
              </h1>
              {/* (fix) "Code sent to" only appears in header on OTP screen */}
              <p className="text-sm text-gray-600">
                {isOtpScreen
                  ? `6-digit code sent to ${maskOtpTarget(otpTarget)}`
                  : "Sign in to your Touchtek account"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2 mt-4"
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-700">
                Secure Login
              </span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </motion.div>
          </div>

          {/* ── Tab Switcher ────────────────────────────────────────────────── */}
          {/* (1) Only shown when BOTH emailPassword AND phoneOtp are enabled */}
          <AnimatePresence>
            {showTabs && (
              <motion.div
                key="tabs"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex bg-gray-100 rounded-xl p-1 mb-6"
              >
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("email");
                    resetOtp();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                    loginMode === "email"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("phone");
                    resetOtp();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                    loginMode === "phone"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Phone
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Forms ───────────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {/* ══════════════════════════════════════════
                EMAIL LOGIN FORM
            ══════════════════════════════════════════ */}
            {loginMode === "email" && (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg transition-all text-gray-900 placeholder:text-gray-400 outline-none ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10"
                      }`}
                    />
                  </div>
                  <FieldError message={errors.email?.message} />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg transition-all text-gray-900 placeholder:text-gray-400 outline-none ${
                        errors.password
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <FieldError message={errors.password?.message} />
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      {...register("rememberMe")}
                      type="checkbox"
                      className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer accent-black"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="#"
                    className="text-black font-semibold hover:underline transition-all"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>
                        {useEmailOtp ? "Sending OTP..." : "Signing In..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>
                        {useEmailOtp ? "Continue with OTP" : "Sign In"}
                      </span>
                    </>
                  )}
                </button>

                {useEmailOtp && (
                  <p className="text-center text-xs text-gray-400">
                    A one-time code will be sent to your email
                  </p>
                )}
              </motion.form>
            )}

            {/* ══════════════════════════════════════════
                PHONE LOGIN FORM
            ══════════════════════════════════════════ */}
            {loginMode === "phone" && (
              <motion.form
                key="phone-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handlePhoneSubmit(onPhoneSubmit)}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-gray-200 pr-3">
                      <span className="text-base">🇮🇳</span>
                      <span className="text-sm font-semibold text-gray-600">
                        +91
                      </span>
                    </div>
                    <input
                      {...registerPhone("phone")}
                      type="text"
                      inputMode="numeric"
                      id="phone"
                      placeholder="98765 43210"
                      maxLength={10}
                      onChange={(e) => {
                        // Strip non-digits, keep max 10 chars, update RHF state
                        const cleaned = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        e.target.value = cleaned;
                        registerPhone("phone").onChange(e);
                      }}
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "Tab",
                          "Escape",
                          "Enter",
                          "ArrowLeft",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowDown",
                          "Home",
                          "End",
                        ];
                        if (allowedKeys.includes(e.key)) return;
                        if (
                          e.ctrlKey &&
                          ["a", "c", "v", "x"].includes(e.key.toLowerCase())
                        )
                          return;
                        if (!/^\d$/.test(e.key)) e.preventDefault();
                      }}
                      className={`w-full pl-24 pr-4 py-3 border-2 rounded-lg transition-all text-gray-900 placeholder:text-gray-400 outline-none ${
                        phoneErrors.phone
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10"
                      }`}
                    />
                  </div>
                  <FieldError message={phoneErrors.phone?.message} />
                  <p className="text-xs text-gray-400 mt-1.5">
                    We'll send a 6-digit OTP to verify your number.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      <span>Send OTP</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* ══════════════════════════════════════════
                OTP VERIFICATION SCREEN
                Shared for both email-otp & phone-otp
            ══════════════════════════════════════════ */}
            {isOtpScreen && (
              <motion.div
                key="otp-screen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Back button only — no "Code sent to" here, already shown in header */}
                <button
                  type="button"
                  onClick={goBackFromOtp}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {loginMode === "email-otp" ? "Change email" : "Change number"}
                </button>

                {/* OTP boxes — reusable component */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Enter OTP
                  </label>
                  <OtpInput
                    value={otpValue}
                    onChange={setOtpValue}
                    error={!!otpError}
                    length={6}
                  />
                  <FieldError message={otpError} />
                </div>

                {/* Resend OTP */}
                <div className="text-center text-sm">
                  {resendTimer > 0 ? (
                    <p className="text-gray-500">
                      Resend OTP in{" "}
                      <span className="font-semibold text-gray-800">
                        {resendTimer}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-black font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={onOtpSubmit}
                  disabled={isLoading || otpValue.length < 6}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5" />
                      <span>Verify & Sign In</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Divider + Google ────────────────────────────────────────────── */}
          {/* (2) Uses /public/images/auth/google.png via next/image */}
          {!isOtpScreen && showGoogle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-6 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Image
                      src="/images/auth/google.png"
                      alt="Google"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ── Sign Up Link ─────────────────────────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center text-sm text-gray-600 mt-6"
          >
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-black font-semibold hover:underline"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
