import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { authMiddleware } from "@/middleware.config";

let defaultLocale = "en";
let locales = ["en"];

function getLocale(request) {
  try {
    const acceptedLanguage = request.headers.get("accept-language");

    // ✅ If missing, wildcard (*), or invalid — fall back immediately
    if (!acceptedLanguage || acceptedLanguage.trim() === "*") {
      return defaultLocale;
    }

    let headers = { "accept-language": acceptedLanguage };
    let languages = new Negotiator({ headers }).languages();

    // ✅ Filter out invalid locale tags before passing to match()
    const validLanguages = languages.filter((lang) => {
      try {
        Intl.getCanonicalLocales(lang);
        return true;
      } catch {
        return false;
      }
    });

    // ✅ If nothing valid remains, use default
    if (validLanguages.length === 0) return defaultLocale;

    return match(validLanguages, locales, defaultLocale);
  } catch {
    // ✅ Final safety net — never crash, always return default
    return defaultLocale;
  }
}


const GONE_PREFIXES = [
  "/product/",
  "/products/",
  "/ajax/",
  "/wishlist.php",
  // Add more patterns from your GSC list
];

export function proxy(request) {
  const pathname = request.nextUrl.pathname;


  console.log('pathname',pathname)


// ✅ STEP 1: Check for dead old PHP URLs FIRST (before locale redirect)
  const isGone = GONE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  
  if (isGone) {
    return new NextResponse("Gone", { status: 410 });
  }




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
}

export const config = {
  matcher: ["/((?!api|assets|docs|.*\\..*|_next).*)"],
};
