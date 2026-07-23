import Credentials from "next-auth/providers/credentials";

import { loginUser, refreshAccessToken } from "@/action/common";
const REFRESH_MARGIN_MS = 30_000;    // 30 seconds before actual expiry

export const authOptions = {
  providers: [
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
    async signIn({ user }) {
      // Add real checks here later, e.g.:
      // if (user.banned) return false;
      return true;
    },


    async jwt({ token, user }) {
      // First login — populate token from authorize()
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
  },
  debug: process.env.NODE_ENV === "development",
};
