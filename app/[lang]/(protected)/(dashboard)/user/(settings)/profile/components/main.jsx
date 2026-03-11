'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAccountInfo, updateUserInfo } from "@/action/common";
import {signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import {
  User, Mail, Phone, Shield, LogOut,
  Edit3, Check, X, Sparkles,
  Clock, Trash2, Bell, Settings
} from 'lucide-react';
import ConfirmModal from '@/components/layout/components/Dialogue';

export default function ProfilePage() {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [savingField, setSavingField] = useState(null);

  const [modal, setModal] = useState({
    visible: false,
    type: "warning",
    title: "",
    message: "",
    onConfirm: null,
  });

  const { data: accountInfo, isLoading, isError, refetch } = useQuery({
    queryKey: ["account-info"],
    queryFn: () => getAccountInfo(),
    staleTime: 30 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Account Info Not Found</h1>
          <p className="text-gray-600 mb-8">The account info you're looking for doesn't exist.</p>
        </main>
      </div>
    );
  }

  const user = accountInfo?.data?.user;

  const closeModal = () => setModal((prev) => ({ ...prev, visible: false }));

  const handleLogout = async() => {
    closeModal();
    await signOut({ callbackUrl: "/en" });
  };

  const handleDeleteAccount = () => {
    console.log("called delete account");
    closeModal();
  };

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue ?? "");
  };

  const handleSave = async (field) => {
    if (!tempValue.trim()) {
      setEditingField(null);
      return;
    }

    setSavingField(field);

    try {
      const response = await updateUserInfo({
        data:{
         [field]: tempValue.trim()
        }
      });

      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success("Updated successfully");
        await refetch();
        setEditingField(null);
      }
    } catch (err) {
      console.error("Error updating user info:", err);
      toast.error(err.message || "Error updating user info");
    } finally {
      setSavingField(null);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const fieldConfig = [
    {
      key: "name",
      label: "Full Name",
      icon: User,
      type: "text",
      color: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600",
      placeholder: "Enter your name",
      value: user?.name ?? "",
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      color: "from-purple-100 to-purple-200",
      iconColor: "text-purple-600",
      placeholder: "Enter email",
      value: user?.email ?? "",
    },
    {
      key: "mobile",
      label: "Mobile Number",
      icon: Phone,
      type: "tel",
      color: "from-green-100 to-green-200",
      iconColor: "text-green-600",
      placeholder: "Enter phone number",
      value: user?.mobile ?? "",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Save overlay — blocks interaction & shows spinner while API call is in flight */}
      {savingField && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 flex-shrink-0" />
            <p className="text-sm font-semibold text-gray-700">Saving changes...</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section
        className="relative overflow-hidden text-white pt-14 pb-24"
        style={{ background: "linear-gradient(135deg, #111827 0%, #000000 50%, #1f2937 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 0%, #6366f1 0%, transparent 55%)" }}
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
            <p className="text-gray-400 text-sm">Manage your profile &amp; security</p>
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
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-xl flex-shrink-0">
              <span className="text-3xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            </div>

            {/* Name & Badges */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{user?.name}</h2>
              <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  {user?.status === "active" ? "Active Account" : user?.status}
                </span>
                {user?.verify_email ? (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                    <Shield className="w-3 h-3" />
                    Email Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-200">
                    <Clock className="w-3 h-3" />
                    Email Unverified
                  </span>
                )}
              </div>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setModal({
                  visible: true,
                  type: "logout",
                  title: "Sign Out?",
                  message: "You'll be signed out from this device. Your data is safe.",
                  onConfirm: handleLogout,
                })
              }
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
                        className="flex items-center gap-2 "
                      >
                        <input
                          type={field.type}
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          autoFocus
                          placeholder={field.placeholder}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave(field.key);
                            if (e.key === "Escape") handleCancel();
                          }}
                          className="flex-1 px-3 py-1.5 border-2 border-black rounded-lg text-sm focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-400 outline-none "
                        />
                        <button
                          onClick={() => handleSave(field.key)}
                          disabled={!!savingField}
                          className="w-8 h-8 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          {savingField === field.key ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={!!savingField}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-600 rounded-lg flex items-center justify-center transition-colors"
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
                        {field.value || (
                          <span className="text-gray-400 font-normal italic">Not set</span>
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
                    onClick={() => handleEdit(field.key, field.value)}
                    className="w-9 h-9 bg-gray-100 hover:bg-black hover:text-white text-gray-500 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
              onClick={() =>
                setModal({
                  visible: true,
                  type: "delete",
                  title: "Delete Account?",
                  message: "This will permanently delete your account and all associated data. This action cannot be undone.",
                  onConfirm: handleDeleteAccount,
                })
              }
              className="flex-shrink-0 flex items-center gap-2 bg-white border-2 border-red-400 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </motion.button>
          </div>
        </motion.div>
      </main>

      <ConfirmModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />
    </div>
  );
}
