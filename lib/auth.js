import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { api } from "@/config/axios.config";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        if (!credentials.email?.endsWith(process.env.ALLOWED_DOMAIN)) {
          throw new Error("You are not allowed to access this platform");
        }

        try {
          // Sending a request to your backend's login endpoint
          const {data} = await api.post("/user/login", {
            email: credentials.email,
            password: credentials.password,
          });
          return data.user;
        } catch (error) {
          // Handle any errors thrown by the backend
          throw new Error(
            error?.response?.data?.message || "An error occurred"
          );
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email?.endsWith(process.env.ALLOWED_DOMAIN)) {
        throw new Error("You are not allowed to access this platform");
      }
      return true;
    },

    async jwt({ token, user }) {
     
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.team = user.team;
        token.connectionID = user.connectionID;
        token.department = user.department;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.team = token.team;
        session.user.department = token.department;
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.connectionID = token.connectionID;
      }
    return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV !== "production",
};
