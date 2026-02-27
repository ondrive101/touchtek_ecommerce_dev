import * as z from 'zod';

// ─── Shared Fields ─────────────────────────────────────────────────────────────
const fullNameField = z
  .string()
  .min(1, 'Full name is required')
  .min(3, 'Min 3 characters')
  .max(50, 'Max 50 characters');

// ─── Register: Email + Password ────────────────────────────────────────────────
export const register_registerSchema = z
  .object({
    fullName: fullNameField,
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Min 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms & Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ─── Register: Phone OTP ───────────────────────────────────────────────────────
export const register_phoneSchema = z.object({
  fullName: fullNameField,
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});

// ─── OTP Verification ──────────────────────────────────────────────────────────
export const register_otpSchema = z.object({
  otp: z
    .string()
    .min(6)
    .max(6)
    .regex(/^\d{6}$/, 'OTP must be numeric'),
});




export const login_loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const login_phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export const login_otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});
