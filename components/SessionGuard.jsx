"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const AUTH_ERRORS = [
  "MissingAccessTokenError",
  "RefreshAccessTokenError",
  "InvalidSession",
];

export default function SessionGuard({ children }) {
  const { data: session, status } = useSession();
  const hasSignedOut = useRef(false); // ✅ prevent duplicate signOut calls

  useEffect(() => {
    if (status === "loading") return;
    if (hasSignedOut.current) return;

    // 🔴 Case 1: Explicit auth errors from JWT callback
    if (session?.error && AUTH_ERRORS.includes(session.error)) {
      console.warn("[SessionGuard] Auth error detected:", session.error);
      hasSignedOut.current = true;
      toast.error("Session expired. Please login again.");
      signOut({ callbackUrl: "/en/login" });
      return;
    }

    // 🟡 Case 2: Session exists but critical fields are missing (the intermittent bug)
    if (status === "authenticated" && session?.user) {
      const { role, email, id } = session.user;

      if (!role || !email || !id) {
        console.warn("[SessionGuard] Corrupt session detected:", {
          role,
          email,
          id,
        });
        hasSignedOut.current = true;
        toast.error("Session data is incomplete. Please login again.");
        signOut({ callbackUrl: "/en/login" });
        return;
      }
    }
  }, [session?.error, session?.user, status]);

  return children;
}