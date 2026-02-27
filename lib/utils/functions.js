// ─── Password Strength ────────────────────────────────────────────────────────
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-400' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-400' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' };
  return { score, label: 'Very Strong', color: 'bg-green-600' };
};

// ─── Mask OTP Target ──────────────────────────────────────────────────────────
export const maskOtpTarget = (target) => {
  if (!target) return '';
  if (target.startsWith('+91')) {
    const digits = target.replace('+91 ', '').replace(/\s/g, '');
    const masked = '•'.repeat(Math.max(digits.length - 4, 0)) + digits.slice(-4);
    return `+91 ${masked}`;
  }
  const [localPart, domain] = target.split('@');
  if (!domain) return target;
  const maskedLocal = localPart[0] + '•'.repeat(Math.max(localPart.length - 1, 3));
  return `${maskedLocal}@${domain}`;
};