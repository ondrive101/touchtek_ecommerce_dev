'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {signOut } from "next-auth/react";
import { toast } from 'react-hot-toast';
import { updateUserInfo } from '@/action/common';
import {
  Lock, Eye, EyeOff, CheckCircle, ShieldCheck,
  KeyRound, ArrowRight, Sparkles, X
} from 'lucide-react';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const passwordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', pct: '25%' };
    if (pwd.length < 8) return { label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-500', pct: '50%' };
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd))
      return { label: 'Strong', color: 'bg-green-500', text: 'text-green-500', pct: '100%' };
    return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500', pct: '75%' };
  };

  const strength = passwordStrength(form.newPassword);

  const passwordRules = [
    { rule: 'At least 8 characters', met: form.newPassword.length >= 8 },
    { rule: 'One uppercase letter', met: /[A-Z]/.test(form.newPassword) },
    { rule: 'One number', met: /\d/.test(form.newPassword) },
    { rule: 'One special character (!@#$...)', met: /[^a-zA-Z0-9]/.test(form.newPassword) },
  ];

  const allRulesMet =
    passwordRules.every((r) => r.met) &&
    form.confirmPassword === form.newPassword &&
    form.currentPassword.length > 0;

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    if (form.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters';
    if (form.newPassword === form.currentPassword)
      errs.newPassword = 'New password must differ from current password';
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const response = await updateUserInfo({
        data: {
          oldPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
      });

      if (!response.success) {
        toast.error(response?.message || 'Failed to update password');
      } else {
        toast.success('Password updated successfully! You will be logged out.');
        handleReset()
        setTimeout(() => {
          signOut({ callbackUrl: "/en" });
        }, 1000);
      
      }
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error(err.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  const inputClass = (field) =>
    `w-full pl-10 pr-10 py-3 border-2 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
      errors[field]
        ? 'border-red-400 bg-red-50 focus:border-red-500'
        : field === 'confirmPassword' && form.confirmPassword && form.confirmPassword === form.newPassword
        ? 'border-green-400 bg-green-50'
        : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">

      {/* Full-page loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 flex-shrink-0" />
            <p className="text-sm font-semibold text-gray-700">Updating password...</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pt-12 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-gray-600">Account Security</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-bold text-gray-900">Change Password</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Change Password
          </h1>
          <p className="text-sm text-gray-500">
            Keep your account secure by updating your password regularly.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pb-20 flex-1">
        <AnimatePresence mode="wait">

            
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              {/* Security Notice */}
              <div className="flex items-start gap-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Security Tip</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Use a unique password that you don't use on any other site. Changing it regularly keeps your account safe.
                  </p>
                </div>
              </div>

              {/* Form Card */}
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-6">

                  {/* Current Password */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <Lock className="w-4 h-4 text-orange-600" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">Current Password</h3>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={show.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                        className={inputClass('currentPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShow('current')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {errors.currentPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> {errors.currentPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* New Password */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <KeyRound className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">New Password</h3>
                    </div>

                    <div className="space-y-4">
                      {/* New password input */}
                      <div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={show.new ? 'text' : 'password'}
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className={inputClass('newPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => toggleShow('new')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <AnimatePresence>
                          {errors.newPassword && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> {errors.newPassword}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Strength bar */}
                        {strength && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3"
                          >
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs text-gray-500">Password strength</span>
                              <span className={`text-xs font-bold ${strength.text}`}>{strength.label}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${strength.color}`}
                                initial={{ width: '0%' }}
                                animate={{ width: strength.pct }}
                                transition={{ duration: 0.4 }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Confirm password input */}
                      <div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={show.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className={inputClass('confirmPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => toggleShow('confirm')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <AnimatePresence>
                          {errors.confirmPassword && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> {errors.confirmPassword}
                            </motion.p>
                          )}
                          {!errors.confirmPassword &&
                            form.confirmPassword &&
                            form.confirmPassword === form.newPassword && (
                              <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-xs text-green-500 mt-1.5 font-medium flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                              </motion.p>
                            )}
                        </AnimatePresence>
                      </div>

                      {/* Rules Checklist */}
                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-700 mb-2.5">Password requirements:</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {passwordRules.map((item, i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: 1 }}
                              className={`flex items-center gap-1.5 text-xs transition-colors ${
                                item.met ? 'text-green-600 font-semibold' : 'text-gray-400'
                              }`}
                            >
                              <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${item.met ? 'text-green-500' : 'text-gray-200'}`} />
                              {item.rule}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || !allRulesMet}
                    whileHover={{ scale: loading || !allRulesMet ? 1 : 1.02 }}
                    whileTap={{ scale: loading || !allRulesMet ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Update Password
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Hint below button when disabled */}
                  <AnimatePresence>
                    {!allRulesMet && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-center text-gray-400 -mt-3"
                      >
                        Complete all requirements above to enable this button
                      </motion.p>
                    )}
                  </AnimatePresence>

                </div>
              </form>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
