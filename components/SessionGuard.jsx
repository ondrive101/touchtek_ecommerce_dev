"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AUTH_ERRORS = ["MissingAccessTokenError", "RefreshAccessTokenError"];

export default function SessionGuard({ children }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.error && AUTH_ERRORS.includes(session.error)) {
      console.warn("[SessionGuard] Auth error detected:", session.error);
      toast.error("Session expired. Please login again.");
      signOut({ callbackUrl: "/en/login" });
    }
  }, [session?.error, status]);

  return children;
}