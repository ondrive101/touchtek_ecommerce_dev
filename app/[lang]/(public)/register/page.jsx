'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "react-hot-toast";
import { getPasswordStrength,maskOtpTarget } from '@/lib/utils/functions';
import { addUser } from "@/action/common";
import { register_registerSchema, register_phoneSchema, register_otpSchema } from '@/lib/utils/validator';
import {
  Eye, EyeOff, Lock, Mail, Sparkles, Shield,
  Phone, ArrowLeft, KeyRound, User, UserPlus, CheckCircle2,Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import OtpInput from '@/components/layout/components/OTP';
import authConfig from '@/components/layout/config/authConfig';

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

// ─── Input Field ──────────────────────────────────────────────────────────────
const InputField = ({ icon: Icon, error, rightEl, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      {...props}
      className={`w-full pl-11 ${rightEl ? 'pr-12' : 'pr-4'} py-3 border-2 rounded-lg transition-all text-sm text-gray-900 placeholder:text-gray-400 outline-none ${
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
          : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10'
      }`}
    />
    {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
  </div>
);

// ─── Submit Button ────────────────────────────────────────────────────────────
const SubmitButton = ({ isLoading, loadingText, icon: Icon, text, disabled }) => (
  <button
    type="submit"
    disabled={isLoading || disabled}
    className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <>
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{loadingText}</span>
      </>
    ) : (
      <>
        <Icon className="w-5 h-5" />
        <span>{text}</span>
      </>
    )}
  </button>
);

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ name }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, type: 'spring', stiffness: 200 }}
    className="text-center py-6 space-y-5"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 260 }}
      className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto"
    >
      <CheckCircle2 className="w-10 h-10 text-green-600" />
    </motion.div>

    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You&apos;re all set, {name}! 🎉
      </h2>
      <p className="text-sm text-gray-500">
        Your Touchtek account has been created. Sign in to get started.
      </p>
    </div>

    <Link
      href="/login"
      className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold text-sm"
    >
      Sign In to Your Account
    </Link>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading]                     = useState(false);
  const [isGoogleLoading, setIsGoogleLoading]         = useState(false);

  const initialMode = authConfig.isEnabled('register', 'emailPassword') ? 'email' : 'phone';
  const [mode, setMode] = useState(initialMode);

  const [otpTarget, setOtpTarget]           = useState('');
  const [registeredName, setRegisteredName] = useState('');
  const [otpValue, setOtpValue]             = useState('');
  const [otpError, setOtpError]             = useState('');
  const [resendTimer, setResendTimer]       = useState(0);

  // ─── Config flags ──────────────────────────────────────────────────────────
  const showEmailTab = authConfig.isEnabled('register', 'emailPassword');
  const showPhoneTab = authConfig.isEnabled('register', 'phoneOtp');
  const showGoogle   = authConfig.isEnabled('register', 'google');
  const useEmailOtp  = authConfig.isEnabled('register', 'emailOtp');
  const isOtpScreen  = mode === 'email-otp' || mode === 'phone-otp';
  const showTabs     = showEmailTab && showPhoneTab && (mode === 'email' || mode === 'phone');

  // ─── Forms ────────────────────────────────────────────────────────────────
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(register_registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', agreeToTerms: false },
  });

  const { register: registerPhone, handleSubmit: handlePhoneSubmit, formState: { errors: phoneErrors } } = useForm({
    resolver: zodResolver(register_phoneSchema),
    defaultValues: { fullName: '', phone: '' },
  });

  const watchedPassword = watch('password', '');
  const strength = getPasswordStrength(watchedPassword);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
  };

  const resetOtp = () => { setOtpValue(''); setOtpError(''); };

  const triggerOtpSend = (target, nextMode) => {
    setIsLoading(true);
    setOtpTarget(target);
    console.log(`[Auth] Sending OTP to: ${target}`);
    // 🔁 Replace with your API call: sendOtp(target)
    setTimeout(() => { setIsLoading(false); setMode(nextMode); startResendTimer(); }, 1200);
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────
const handleRegister = async (payload) => {
    try {
      // toast.error('registration disabled by admin');

      const response = await addUser(payload);
         if (!response.success) {
           toast.error(response.message);
         } else {
           setMode("success");
         }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(error.message || "Error creating account");
    } finally {
     setIsLoading(false);
    }
  };








  const onEmailSubmit = async (data) => {
    setRegisteredName(data.fullName.split(' ')[0]);
    if (useEmailOtp) {
      triggerOtpSend(data.email, 'email-otp');
    } else {
      setIsLoading(true);
      console.log('[Auth] Register:', data);
      const payload = {
        type:'email',
        data
      }
      const response = await handleRegister(payload);
      // 🔁 Replace with your API call: registerWithEmail(data)
      // setTimeout(() => { setIsLoading(false); setMode('success'); }, 1500);
    }
  };

  const onPhoneSubmit = async (data) => {
    setRegisteredName(data.fullName.split(' ')[0]);
    triggerOtpSend(`+91 ${data.phone}`, 'phone-otp');
  };

  const onOtpSubmit = () => {
    const result = register_otpSchema.safeParse({ otp: otpValue });
    if (!result.success) { setOtpError(result.error.errors[0].message); return; }
    setOtpError('');
    setIsLoading(true);
    console.log(`[Auth] Verifying OTP: ${otpValue} for: ${otpTarget}`);
    // 🔁 Replace with your API call: verifyOtp(otpTarget, otpValue)
    setTimeout(() => { setIsLoading(false); setMode('success'); }, 1500);
  };

  const handleGoogleRegister = () => {
    setIsGoogleLoading(true);
    console.log('[Auth] Google register initiated');
    // 🔁 Replace with: signIn('google') — next-auth / firebase
    setTimeout(() => { setIsGoogleLoading(false); setRegisteredName('User'); setMode('success'); }, 1500);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    resetOtp();
    startResendTimer();
    console.log(`[Auth] Resending OTP to: ${otpTarget}`);
    // 🔁 Replace with your API call: resendOtp(otpTarget)
  };

  const goBackFromOtp = () => {
    setMode(mode === 'email-otp' ? 'email' : 'phone');
    resetOtp();
  };

  const EyeToggle = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} className="text-gray-400 hover:text-gray-700 transition-colors">
      {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
        >

          {/* ── Header ─────────────────────────────────────────────────────── */}
          {mode !== 'success' && (
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-2xl mb-4 shadow-lg"
              >
                <span className="text-3xl font-bold text-white">T</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {isOtpScreen ? 'Verify OTP' : 'Create Account'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isOtpScreen
                    ? `6-digit code sent to ${maskOtpTarget(otpTarget)}`
                    : 'Join Touchtek — it only takes a minute'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2 mt-4"
              >
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-gray-700">Secure & Private</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </motion.div>
            </div>
          )}

          {/* ── Tab Switcher — only when BOTH methods enabled ───────────────── */}
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
                  onClick={() => { setMode('email'); resetOtp(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('phone'); resetOtp(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Phone
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {/* ── Success ────────────────────────────────────────────────────── */}
            {mode === 'success' && (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SuccessScreen name={registeredName} />
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                EMAIL REGISTER FORM
            ══════════════════════════════════════════ */}
            {mode === 'email' && (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit(onEmailSubmit)}
                className="space-y-5"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <InputField icon={User} error={errors.fullName} {...register('fullName')} type="text" placeholder="John Doe" />
                  <FieldError message={errors.fullName?.message} />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <InputField icon={Mail} error={errors.email} {...register('email')} type="email" placeholder="you@example.com" />
                  <FieldError message={errors.email?.message} />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <InputField
                    icon={Lock}
                    error={errors.password}
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    rightEl={<EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />}
                  />
                  {watchedPassword.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${
                        strength.score <= 1 ? 'text-red-500'
                        : strength.score <= 2 ? 'text-orange-400'
                        : strength.score <= 3 ? 'text-yellow-500'
                        : 'text-green-600'
                      }`}>{strength.label}</p>
                    </motion.div>
                  )}
                  <FieldError message={errors.password?.message} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <InputField
                    icon={Lock}
                    error={errors.confirmPassword}
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    rightEl={<EyeToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />}
                  />
                  <FieldError message={errors.confirmPassword?.message} />
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      {...register('agreeToTerms')}
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded cursor-pointer accent-black shrink-0"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                      I agree to Touchtek's{' '}
                      <Link href="#" className="text-black font-semibold hover:underline">Terms</Link>
                      {' '}&{' '}
                      <Link href="#" className="text-black font-semibold hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                  <FieldError message={errors.agreeToTerms?.message} />
                </div>

                <SubmitButton
                  isLoading={isLoading}
                  loadingText={useEmailOtp ? 'Sending OTP...' : 'Creating Account...'}
                  icon={UserPlus}
                  text="Create Account"
                />

                {useEmailOtp && (
                  <p className="text-center text-sm text-gray-400">
                    A verification code will be sent to your email
                  </p>
                )}
              </motion.form>
            )}

            {/* ══════════════════════════════════════════
                PHONE REGISTER FORM
            ══════════════════════════════════════════ */}
            {mode === 'phone' && (
              <motion.form
                key="phone-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handlePhoneSubmit(onPhoneSubmit)}
                className="space-y-5"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <InputField
                    icon={User}
                    error={phoneErrors.fullName}
                    {...registerPhone('fullName')}
                    type="text"
                    placeholder="Vishal Singh"
                  />
                  <FieldError message={phoneErrors.fullName?.message} />
                </div>

                {/* Phone — numbers only */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-gray-200 pr-3">
                      <span className="text-base">🇮🇳</span>
                      <span className="text-sm font-semibold text-gray-600">+91</span>
                    </div>
                    <input
                      {...registerPhone('phone')}
                      type="text"
                      inputMode="numeric"
                      placeholder="98765 43210"
                      maxLength={10}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                        e.target.value = cleaned;
                        registerPhone('phone').onChange(e);
                      }}
                      onKeyDown={(e) => {
                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                        if (allowedKeys.includes(e.key)) return;
                        if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;
                        if (!/^\d$/.test(e.key)) e.preventDefault();
                      }}
                      className={`w-full pl-24 pr-4 py-3 border-2 rounded-lg transition-all text-sm text-gray-900 placeholder:text-gray-400 outline-none ${
                        phoneErrors.phone
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10'
                      }`}
                    />
                  </div>
                  <FieldError message={phoneErrors.phone?.message} />
                  <p className="text-sm text-gray-400 mt-1.5">
                    We'll send a 6-digit OTP to verify your number.
                  </p>
                </div>

                <SubmitButton isLoading={isLoading} loadingText="Sending OTP..." icon={Phone} text="Send OTP" />
              </motion.form>
            )}

            {/* ══════════════════════════════════════════
                OTP SCREEN — shared for email-otp & phone-otp
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
                {/* Back button only — masked target shown in header */}
                <button
                  type="button"
                  onClick={goBackFromOtp}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {mode === 'email-otp' ? 'Change email' : 'Change number'}
                </button>

                {/* OTP boxes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Enter OTP</label>
                  <OtpInput
                    value={otpValue}
                    onChange={setOtpValue}
                    error={!!otpError}
                    length={6}
                  />
                  <FieldError message={otpError} />
                </div>

                {/* Resend */}
                <div className="text-center text-sm">
                  {resendTimer > 0 ? (
                    <p className="text-gray-500">
                      Resend OTP in <span className="font-semibold text-gray-800">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button type="button" onClick={handleResendOtp} className="text-black font-semibold hover:underline">
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onOtpSubmit}
                  disabled={isLoading || otpValue.length < 6}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? <><Loader2 className="h-5 w-5 animate-spin" /><span>Verifying...</span></>
                    : <><KeyRound className="w-5 h-5" /><span>Verify & Create Account</span></>
                  }
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Divider + Google ────────────────────────────────────────────── */}
          {!isOtpScreen && mode !== 'success' && showGoogle && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or sign up with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-6 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <><Loader2 className="h-5 w-5 text-gray-500" /><span>Connecting...</span></>
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

          {/* ── Sign In Link ─────────────────────────────────────────────────── */}
          {mode !== 'success' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center text-sm text-gray-600 mt-6"
            >
              Already have an account?{' '}
              <Link href="/login" className="text-black font-semibold hover:underline">Sign in</Link>
            </motion.p>
          )}

        </motion.div>
      </div>
    </div>
  );
}
