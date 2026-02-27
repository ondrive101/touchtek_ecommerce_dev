"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SessionGuard({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
        console.log('referesh token error logging out',)
    //   signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  return children;
}