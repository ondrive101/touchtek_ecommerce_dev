import Credentials from "next-auth/providers/credentials";

import { loginUser, refreshAccessToken } from "@/action/common";

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
          if (
            credentials?.type === "email" &&
            (!credentials?.email || !credentials?.password)
          ) {
            throw new Error("Email and password are required");
          }

          // Call your backend login API
          const { type, email, password } = credentials;
          const payload = {
            type,
            data: {
              email,
              password,
            },
          };
          const response = await loginUser(payload);

          // Check response
          if (!response.success) {
            throw new Error(response.message || "Invalid credentials");
          }

          console.log("response received", response);

          // Return user object (this will be passed to jwt callback)
          const user = {
            name: response.data.user.name,
            email: response.data.user.email || "",
            id: response.data.user.id,
            image: response.data.user.image || "",
            role: response.data.user.role || "",
            accessToken: response.data.user.accessToken || "",
            refreshToken: response.data.user.refreshToken || "",
            accessTokenExpiry: response.data.user.accessTokenExpiry,
          };
          return user;
        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // ✅ First login — store everything
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiry = user.accessTokenExpiry;
      }


      // 🚨 Guard — if accessToken is missing after first login, force logout
      if (!user && !token.accessToken) {
        return { ...token, error: "MissingAccessTokenError" };
      }

      // ✅ Auto-refresh if accessToken expired
      // console.log('token expiry',token, token.accessTokenExpiry,  Date.now())
      if (token.accessTokenExpiry && Date.now() > token.accessTokenExpiry) {
        const response = await refreshAccessToken({
          refreshToken: token.refreshToken,
        });

        if (!response.success) {
          // Refresh failed — signal client to re-login
          return { ...token, error: "RefreshAccessTokenError" };
        }

        // ✅ Merge new token values into existing token
        token = {
          ...token,
          accessToken: response.data.user.accessToken,
          refreshToken: response.data.user.refreshToken ?? token.refreshToken,
          accessTokenExpiry: response.data.user.accessTokenExpiry,
          error: null,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.role = token.role;
      }

      // ✅ forward refresh errors so client can react (e.g. signOut on error)
      session.error = token.error || null;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};
