'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, CheckCircle, Send, Sparkles, Shield } from 'lucide-react';
import {TouchtekLogo } from "@/components/svg";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('Signup data:', data);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
            backgroundSize: '40px 40px',
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
          <div className="text-center mb-8">
            {/* Clickable Touchtek Logo - Goes to Home */}
            <Link href="/">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-2xl mb-4 shadow-lg cursor-pointer mx-auto hover:shadow-2xl transition-all duration-200"
              >
                <span className="text-3xl font-bold text-white">T</span>
              </motion.div>
            </Link>

            {isSent ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h1>
                <p className="text-sm text-gray-600">Welcome to Touchtek! Check your email to verify</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-sm text-gray-600">Join Touchtek in 30 seconds</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2 mt-4"
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-700">Secure Signup</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </motion.div>
          </div>

          {isSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-3">
                <p className="text-lg font-semibold text-gray-900">
                  Welcome aboard!
                </p>
                <p className="text-sm text-gray-600">
                  Please check your email to verify your account. 
                  Then you can start exploring Touchtek products.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold"
              >
                Go to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('fullName')}
                      type="text"
                      id="fullName"
                      placeholder="John Doe"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg transition-all text-gray-900 placeholder:text-gray-400 ${
                        errors.fullName
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.fullName.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg transition-all text-gray-900 placeholder:text-gray-400 ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg transition-all text-gray-900 placeholder:text-gray-400 ${
                        errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 }}>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg transition-all text-gray-900 placeholder:text-gray-400 ${
                        errors.confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-lg hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </motion.button>
              </form>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-black font-semibold hover:underline">Sign in</Link>
              </motion.p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
