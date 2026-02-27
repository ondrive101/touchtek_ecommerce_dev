/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              TOUCHTEK — AUTH METHOD CONFIG               ║
 * ║                                                          ║
 * ║  Control every auth method independently per page.      ║
 * ║  No need to touch any UI component — just flip flags.   ║
 * ╚══════════════════════════════════════════════════════════╝
 */

const authConfig = {

  // ─────────────────────────────────────────────────────────
  // LOGIN PAGE CONTROLS
  // ─────────────────────────────────────────────────────────
  login: {
    /**
     * Email + Password tab
     * - true  → shows Email tab with password field
     * - false → hides Email tab entirely
     */
    emailPassword: true,

    /**
     * Email OTP step (only applies if emailPassword is true)
     * - true  → after email+password form, sends OTP to email for 2-step verify
     * - false → logs in directly with email+password, no OTP step
     */
    emailOtp: false,

    /**
     * Phone OTP tab
     * - true  → shows Phone tab, sends OTP to mobile
     * - false → hides Phone tab entirely
     */
    phoneOtp: false,

    /**
     * Google OAuth button
     * - true  → shows "Continue with Google" button
     * - false → hides Google button entirely
     */
    google: false,
  },

  // ─────────────────────────────────────────────────────────
  // REGISTRATION PAGE CONTROLS
  // ─────────────────────────────────────────────────────────
  register: {
    /**
     * Email + Password tab
     * - true  → shows Email tab with name, email, password, confirm fields
     * - false → hides Email tab entirely
     */
    emailPassword: true,

    /**
     * Email OTP verification step (only applies if emailPassword is true)
     * - true  → after form submit, sends OTP to email for verification
     * - false → creates account directly without OTP step
     */
    emailOtp: false,

    /**
     * Phone OTP tab
     * - true  → shows Phone tab with name + phone, sends OTP to mobile
     * - false → hides Phone tab entirely
     */
    phoneOtp: false,

    /**
     * Google OAuth button
     * - true  → shows "Continue with Google" button
     * - false → hides Google button entirely
     */
    google: false,
  },

  // ─────────────────────────────────────────────────────────
  // HELPER — use this in UI components
  //
  // Usage:
  //   authConfig.isEnabled('login', 'google')     → true/false
  //   authConfig.isEnabled('register', 'phoneOtp') → true/false
  // ─────────────────────────────────────────────────────────
  isEnabled(page, method) {
    const pageConfig = this[page];
    if (!pageConfig) {
      console.warn(`[authConfig] Unknown page: "${page}". Use "login" or "register".`);
      return false;
    }
    if (!(method in pageConfig)) {
      console.warn(`[authConfig] Unknown method: "${method}" for page "${page}".`);
      return false;
    }
    return pageConfig[method] === true;
  },
};

export default authConfig;


/* ═══════════════════════════════════════════════════════════
   QUICK REFERENCE — COMMON SCENARIOS
   ═══════════════════════════════════════════════════════════

   ┌─ Disable phone login only (keep phone register) ────────
   │  login:    { phoneOtp: false }
   │  register: { phoneOtp: true  }
   └──────────────────────────────────────────────────────────

   ┌─ Disable phone everywhere ───────────────────────────────
   │  login:    { phoneOtp: false }
   │  register: { phoneOtp: false }
   └──────────────────────────────────────────────────────────

   ┌─ Disable Google login only ──────────────────────────────
   │  login:    { google: false }
   │  register: { google: true  }
   └──────────────────────────────────────────────────────────

   ┌─ Disable Google everywhere ──────────────────────────────
   │  login:    { google: false }
   │  register: { google: false }
   └──────────────────────────────────────────────────────────

   ┌─ Email direct login (no OTP step) ───────────────────────
   │  login:    { emailOtp: false }
   └──────────────────────────────────────────────────────────

   ┌─ Phone + Google only (no email anywhere) ────────────────
   │  login:    { emailPassword: false, phoneOtp: true, google: true }
   │  register: { emailPassword: false, phoneOtp: true, google: true }
   └──────────────────────────────────────────────────────────

   ┌─ Google only (no email, no phone anywhere) ──────────────
   │  login:    { emailPassword: false, phoneOtp: false, google: true }
   │  register: { emailPassword: false, phoneOtp: false, google: true }
   └──────────────────────────────────────────────────────────

   ═══════════════════════════════════════════════════════════ */
