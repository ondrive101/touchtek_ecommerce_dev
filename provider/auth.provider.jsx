"use client";

import { SessionProvider } from "next-auth/react";
import SessionGuard from "@/components/SessionGuard";

const AuthProvider = ({ children }) => {
  return <SessionProvider basePath="/api/auth"><SessionGuard>{children}</SessionGuard></SessionProvider>;
};

export default AuthProvider;
