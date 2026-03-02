'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Phone, Shield, LogOut,
  Camera, Edit3, Check, X, Eye, EyeOff, Sparkles,
  Monitor, MapPin, Clock, Trash2, Bell,
  Settings, Smartphone
} from 'lucide-react';

const activeSessions = [
  {
    id: 1,
    device: 'Chrome on Windows 11',
    location: 'Delhi, India',
    ip: '192.168.1.1',
    lastActive: '2 minutes ago',
    isCurrent: true,
    icon: Monitor,
    color: 'from-green-400 to-green-600'
  },
  {
    id: 2,
    device: 'Safari on iPhone 15',
    location: 'Mumbai, India',
    ip: '103.21.58.12',
    lastActive: '3 hours ago',
    isCurrent: false,
    icon: Smartphone,
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 3,
    device: 'Firefox on MacBook',
    location: 'Bengaluru, India',
    ip: '49.205.12.34',
    lastActive: '2 days ago',
    isCurrent: false,
    icon: Monitor,
    color: 'from-purple-400 to-purple-600'
  }
];

export default function ProfilePage() {
  const [editingField, setEditingField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sessions, setSessions] = useState(activeSessions);
  const [saved, setSaved] = useState(null);

  const [profile, setProfile] = useState({
    username: 'vishal_singh',
    email: 'vishal@example.com',
    phone: '+91 98765 43210',
    password: '••••••••••',
    avatar: null,
  });

  const [tempValue, setTempValue] = useState('');

  const handleEdit = (field) => {
    setEditingField(field);
    setTempValue(field === 'password' ? '' : profile[field]);
  };

  const handleSave = (field) => {
    if (tempValue.trim()) {
      setProfile({ ...profile, [field]: field === 'password' ? '••••••••••' : tempValue });
      setSaved(field);
      setTimeout(() => setSaved(null), 2000);
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const revokeSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const fieldConfig = [
    {
      key: 'username',
      label: 'Username',
      icon: User,
      type: 'text',
      color: 'from-blue-100 to-blue-200',
      iconColor: 'text-blue-600',
      placeholder: 'Enter username'
    },
    {
      key: 'email',
      label: 'Email Address',
      icon: Mail,
      type: 'email',
      color: 'from-purple-100 to-purple-200',
      iconColor: 'text-purple-600',
      placeholder: 'Enter email'
    },
    {
      key: 'phone',
      label: 'Mobile Number',
      icon: Phone,
      type: 'tel',
      color: 'from-green-100 to-green-200',
      iconColor: 'text-green-600',
      placeholder: 'Enter phone number'
    },
    {
      key: 'password',
      label: 'Password',
      icon: Lock,
      type: 'password',
      color: 'from-orange-100 to-orange-200',
      iconColor: 'text-orange-600',
      placeholder: 'Enter new password'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Hero Header — clean bottom fade, no wave */}
      <section
        className="relative overflow-hidden text-white pt-14 pb-24"
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #000000 50%, #1f2937 100%)'
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 0%, #6366f1 0%, transparent 55%)' }}
        />

        {/* Clean bottom fade into page background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          // style={{ background: 'linear-gradient(to bottom, transparent, rgb(249,250,251))' }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4"
              whileHover={{ scale: 1.04 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-medium">My Account</span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-1">
              Account Settings
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your profile, security &amp; active sessions
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20 relative z-10 space-y-6">

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-xl overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <motion.label
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-black to-gray-700 rounded-lg flex items-center justify-center cursor-pointer shadow-lg border-2 border-white"
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setProfile({ ...profile, avatar: URL.createObjectURL(file) });
                  }}
                />
              </motion.label>
            </div>

            {/* Name & Badges */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{profile.username}</h2>
              <p className="text-gray-500 text-sm mt-0.5">{profile.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Active Account
                </span>
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                  <Shield className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Account Details</h3>
              <p className="text-xs text-gray-500">Update your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            {fieldConfig.map((field, i) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all group bg-gradient-to-r from-gray-50 to-white"
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${field.color} flex items-center justify-center flex-shrink-0`}>
                  <field.icon className={`w-5 h-5 ${field.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">{field.label}</p>
                  <AnimatePresence mode="wait">
                    {editingField === field.key ? (
                      <motion.div
                        key="editing"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="flex items-center gap-2"
                      >
                        <div className="relative flex-1">
                          <input
                            type={field.type === 'password' && !showPassword ? 'password' : 'text'}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            autoFocus
                            placeholder={field.placeholder}
                            className="w-full px-3 py-1.5 border-2 border-black rounded-lg text-sm focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-400 outline-none"
                          />
                          {field.type === 'password' && (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => handleSave(field.key)}
                          className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="display"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-semibold text-gray-900 truncate"
                      >
                        {profile[field.key]}
                        {saved === field.key && (
                          <span className="ml-2 text-green-500 text-xs font-medium">✓ Saved</span>
                        )}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Edit Button */}
                {editingField !== field.key && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(field.key)}
                    className="w-9 h-9 bg-gray-100 hover:bg-black hover:text-white text-gray-500 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Login Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Active Sessions</h3>
                <p className="text-xs text-gray-500">
                  {sessions.length} device{sessions.length !== 1 ? 's' : ''} logged in
                </p>
              </div>
            </div>
            {sessions.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSessions(sessions.filter(s => s.isCurrent))}
                className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Revoke All Others
              </motion.button>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    session.isCurrent
                      ? 'border-green-200 bg-gradient-to-r from-green-50 to-white'
                      : 'border-gray-100 bg-gradient-to-r from-gray-50 to-white hover:border-gray-200'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${session.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <session.icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-gray-900">{session.device}</p>
                      {session.isCurrent && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" /> {session.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" /> {session.lastActive}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{session.ip}</p>
                  </div>

                  {!session.isCurrent && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => revokeSession(session.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-all border border-red-200 hover:border-red-500 flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                      Revoke
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {sessions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-400"
              >
                <Shield className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No other active sessions</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-red-100 p-6"
        >
          <h3 className="text-base font-bold text-red-600 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Danger Zone
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="text-sm font-bold text-gray-900">Delete Account</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Permanently delete your account and all data. This cannot be undone.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 flex items-center gap-2 bg-white border-2 border-red-400 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Sign Out?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                You'll be signed out from this device. Your data is safe.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  Yes, Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
