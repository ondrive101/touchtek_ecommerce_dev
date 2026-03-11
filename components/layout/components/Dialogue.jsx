'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Trash2, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

const modalConfig = {
  logout: {
    icon: LogOut,
    iconBg: 'from-red-100 to-red-200',
    iconColor: 'text-red-500',
    confirmBg: 'from-red-500 to-rose-600',
    confirmLabel: 'Yes, Logout',
  },
  delete: {
    icon: Trash2,
    iconBg: 'from-red-100 to-red-200',
    iconColor: 'text-red-500',
    confirmBg: 'from-red-500 to-rose-600',
    confirmLabel: 'Yes, Delete',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'from-green-100 to-green-200',
    iconColor: 'text-green-500',
    confirmBg: 'from-green-500 to-emerald-600',
    confirmLabel: 'OK',
  },
  error: {
    icon: XCircle,
    iconBg: 'from-red-100 to-red-200',
    iconColor: 'text-red-500',
    confirmBg: 'from-red-500 to-rose-600',
    confirmLabel: 'OK',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'from-yellow-100 to-yellow-200',
    iconColor: 'text-yellow-500',
    confirmBg: 'from-yellow-500 to-orange-500',
    confirmLabel: 'Confirm',
  },
};

export default function ConfirmModal({ visible, onConfirm, onClose, type = 'warning', title, message }) {
  const config = modalConfig[type] ?? modalConfig.warning;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-100 relative"
          >
            {/* Close X */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className={`w-16 h-16 bg-gradient-to-br ${config.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`w-8 h-8 ${config.iconColor}`} />
            </div>

            {/* Text */}
            {title && (
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
            )}
            {message && (
              <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className={`flex-1 py-3 bg-gradient-to-r ${config.confirmBg} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm`}
              >
                {config.confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
