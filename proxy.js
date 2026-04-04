import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { getToken } from "next-auth/jwt";
import { jwtVerify } from "jose";

// ─── Config ────────────────────────────────────────────────────────────────

let defaultLocale = "en";
let locales = ["en"];

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);

// Old PHP / dead URLs → return 410 Gone
const GONE_PREFIXES = [
  "/product/",
  "/products/",
  "/ajax/",
  "/wishlist.php",
 
];

// Routes that require login (any role)
const PROTECTED_ROUTES = [
  "/en/dashboard",
  "/en/cart",
  "/en/checkout",
  "/en/user/orders",
  "/en/user/rewards",
  "/en/user/support",
  "/en/user/notifications",
  "/en/user/affiliates",
  "/en/user/profile",
  "/en/user/password",
  "/en/user/address",
];

// Routes locked to specific roles
// key = route prefix, value = allowed roles
const ROLE_ROUTES = {
  "/en/admin":   ["admin"],
};

// Logged-in users should not access these → redirect to dashboard
const AUTH_ONLY_ROUTES = [
  "/en/login",
  "/en/register",
  "/en/forgot-password",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getLocale(request) {
  try {
    const acceptedLanguage = request.headers.get("accept-language");
    if (!acceptedLanguage || acceptedLanguage.trim() === "*") {
      return defaultLocale;
    }
    let headers = { "accept-language": acceptedLanguage };
    let languages = new Negotiator({ headers }).languages();
    const validLanguages = languages.filter((lang) => {
      try {
        Intl.getCanonicalLocales(lang);
        return true;
      } catch {
        return false;
      }
    });
    if (validLanguages.length === 0) return defaultLocale;
    return match(validLanguages, locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

async function getSession(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    return token; // { id, role, email, name, accessToken, error, ... } or null
  } catch (err) {
    console.log("getToken ERROR:", err.message);
    return null;
  }
}

// ─── Main Middleware ──────────────────────────────────────────────────────────

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // ── STEP 1: 410 Gone ─────────────────────────────────────────────────────
  const isGone = GONE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isGone) {
    return new NextResponse("Gone", { status: 410 });
  }

  // ── STEP 2: Locale redirect ───────────────────────────────────────────────
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  // ── STEP 3: Get session via NextAuth ──────────────────────────────────────
  const session = await getSession(request);
  const isLoggedIn = !!session && !session.error; // also check no token errors
  const userRole = session?.role ?? null;

  // ── STEP 4: Handle token errors (expired refresh token → force re-login) ──
  if (session?.error === "RefreshAccessTokenError" ||
      session?.error === "MissingAccessTokenError") {
    const loginUrl = new URL("/en/login", request.url);
    // loginUrl.searchParams.set("callbackUrl", pathname);
    // loginUrl.searchParams.set("error", session.error); // show message on login page
    return NextResponse.redirect(loginUrl);
  }

  // ── STEP 5: Redirect logged-in users away from auth pages ─────────────────
  const isAuthPage = AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r));
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  // ── STEP 6: Protect login-required routes ─────────────────────────────────
  const requiresLogin = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (requiresLogin && !isLoggedIn) {
    const loginUrl = new URL("/en/login", request.url);
    // loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── STEP 7: Role-based access control ─────────────────────────────────────
  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(routePrefix)) {
      if (!isLoggedIn) {
        const loginUrl = new URL("/en/login", request.url);
        // loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(
          new URL("/en/unauthorized", request.url)
        );
      }
      break;
    }
  }

  // ── STEP 8: Pass through — forward user info as headers ───────────────────
  if (isLoggedIn) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(session.id ?? ""));
    requestHeaders.set("x-user-role", String(userRole ?? ""));

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|assets|docs|.*\\..*|_next).*)"],
};