'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable OTP Input Component
 *
 * Props:
 * - value: string (6-char string, e.g. "123456" or "1_3___")
 * - onChange: (newValue: string) => void
 * - error: boolean
 * - length: number (default 6)
 */
export default function OtpInput({ value = '', onChange, error = false, length = 6 }) {
  const refs = Array.from({ length }, () => React.createRef());

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const newOtp = value.split('');
    newOtp[index] = val.slice(-1);
    onChange(newOtp.join(''));
    if (val && index < length - 1) refs[index + 1].current?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newOtp = value.split('');
      newOtp[index] = '';
      onChange(newOtp.join(''));
      if (index > 0) refs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(paste.padEnd(length, '').slice(0, length));
    refs[Math.min(paste.length, length - 1)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-1.5 justify-between">
      {Array(length).fill('').map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-10 h-11 text-center text-base font-bold border-2 rounded-lg transition-all text-gray-900 outline-none ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10'
          }`}
        />
      ))}
    </div>
  );
}
