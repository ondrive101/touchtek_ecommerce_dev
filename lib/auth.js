import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { loginUser, googleLoginUser, refreshAccessToken } from "@/action/common";
const REFRESH_MARGIN_MS = 30_000;    // 30 seconds before actual expiry

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        type: { label: "Type", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate input

          if (!credentials?.type) {
            throw new Error("Login type is required");
          }

          if (
            credentials?.type === "email" &&
            (!credentials?.email || !credentials?.password)
          ) {
            throw new Error("Email and password are required");
          }

          // Call your backend login API
          const payload = {
            type: credentials.type,
            data: {
              email: credentials.email,
              password: credentials.password,
            },
          };
          const response = await loginUser(payload);

          // Check response
          if (!response.success) {
            throw new Error(response.message || "Invalid credentials");
          }

          const u = response?.data?.user;

          if (!u?.id || !u?.accessToken) {
            throw new Error("Invalid login response from server");
          }

          // Return user object (this will be passed to jwt callback)
          return {
            id: u.id,
            name: u.name || "",
            email: u.email || "",
            role: u.role || "customer",
            accessToken: u.accessToken,
            refreshToken: u.refreshToken || "",
            accessTokenExpiry: u.accessTokenExpiry, // already ms from server
          };
        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // 1. Check Google email verification
        if (profile?.email_verified !== true) {
          console.error("❌ [GOOGLE AUTH] Email not verified by Google");
          return false;
        }

        // 2. Perform backend API sync with Express server
        try {
          const payload = {
            email: user.email,
            name: user.name,
            googleId: account.providerAccountId,
            avatar: user.image,
          };
          console.log("🔄 [GOOGLE AUTH SYNC] Syncing user with backend API:", payload.email);

          const response = await googleLoginUser(payload);

          // Extract detailed error message
          const errorMsg =
            response?.message ||
            response?.data?.message ||
            response?.data?.msg ||
            response?.error ||
            "Backend server sync failed. Please check your backend connection.";

          if (response?.data?.user?.accessToken) {
            console.log("✅ [GOOGLE AUTH SYNC SUCCESS] Backend user authenticated");
            // Store backend user object on user parameter so jwt callback receives it
            user.backendUser = response.data.user;
            return true;
          } else {
            console.error("❌ [GOOGLE AUTH BACKEND SYNC FAILED]:", errorMsg);
            // Returning false cancels NextAuth sign-in and prevents redirect to /user/dashboard
            return false;
          }
        } catch (err) {
          console.error("❌ [GOOGLE AUTH SYNC EXCEPTION]:", err?.message || err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // 1. Initial Google Sign In / Registration Flow
      if (account?.provider === "google" && user?.backendUser) {
        const u = user.backendUser;
        return {
          ...token,
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role || "customer",
          accessToken: u.accessToken,
          refreshToken: u.refreshToken || "",
          accessTokenExpiry: u.accessTokenExpiry,
          error: null,
        };
      }

      // 2. Credentials First login — populate token from authorize()
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiry: user.accessTokenExpiry,
          error: null,
        };
      }


      // 🚨 Guard — if accessToken is missing after first login, force logout
      if (!token.accessToken) {
        return { ...token, error: "MissingAccessTokenError" };
      }

      const shouldRefresh =
        token.accessTokenExpiry &&
        Date.now() > token.accessTokenExpiry - REFRESH_MARGIN_MS;

      if (!shouldRefresh) return token;
      if (!token.refreshToken) {
        return { ...token, error: "RefreshAccessTokenError" };
      }

      const response = await refreshAccessToken({
        refreshToken: token.refreshToken,
      });

      if (!response?.success || !response?.data?.user?.accessToken) {
        return { ...token, error: "RefreshAccessTokenError" };
      }
      const next = response.data.user;

      return {
        ...token,
        accessToken: next.accessToken,
        refreshToken: next.refreshToken ?? token.refreshToken,
        accessTokenExpiry: next.accessTokenExpiry, // already ms
        error: null,
      };
    },

    async session({ session, token }) {
      // Only expose safe, non-sensitive fields to the client
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
      }

      // Do NOT put accessToken / refreshToken on session.
      // Server actions read them via getToken() directly from the JWT cookie.
      session.error = token.error || null;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/en/login",
    error: "/en/login",
  },
  debug: process.env.NODE_ENV === "development",
};
