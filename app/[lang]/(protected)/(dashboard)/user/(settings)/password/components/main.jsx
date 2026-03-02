'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleReset = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setSuccess(false);
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

      {/* Clean Page Header */}
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

          {/* SUCCESS STATE */}
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Password Updated!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-sm text-gray-500 mb-8 max-w-xs mx-auto"
              >
                Your password has been changed successfully. All other active sessions will be signed out for security.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-3 mb-8"
              >
                {[
                  { icon: ShieldCheck, label: 'Account Secured', color: 'text-green-500', bg: 'bg-green-50 border-green-100' },
                  { icon: KeyRound, label: 'New Key Active', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
                  { icon: Sparkles, label: 'Sessions Cleared', color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' },
                ].map((item, i) => (
                  <div key={i} className={`rounded-xl p-3 border ${item.bg} flex flex-col items-center gap-1.5`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <p className="text-xs font-semibold text-gray-700 text-center">{item.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3"
              >
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  Change Again
                </button>
                <motion.a
                  href="/profile"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  Back to Profile
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </motion.div>

          ) : (

            /* FORM STATE */
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
                          {!errors.confirmPassword && form.confirmPassword && form.confirmPassword === form.newPassword && (
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
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
