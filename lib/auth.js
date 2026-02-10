import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { loginUser } from "@/action/common";
import { api } from "@/config/axios.config";

export const authOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    async authorize(credentials) {
        try {
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

        
          // Call your backend login API
          const response = await loginUser(credentials);

          // Check response
          if (!response.success) {
            throw new Error(response.message || "Invalid credentials");
          }

          if (response.data.user.department !== 'admin') {
            throw new Error("Only admin can login this dashboard");
         }

          // Return user object (this will be passed to jwt callback)
          const user = {
            id: response.data.user.id,
            email:response.data.user.email || '',
            name: response.data.user.name,
            image: response.data.user.image || '',
            department: response.data.user.department,
            role: response.data.user.role || '',
            accessToken: response.data.token,
          };

          // console.log("User authenticated successfully:", user);
          return user;

        } catch (error) {
          console.error("Authorization error:", error.message);
          // Return null to show error on login page
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return true;
    },

    async jwt({ token, user,trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.department = user.department;
        token.role = user.role;
        token.accessToken = user.accessToken
        // console.log("JWT token created for user:", user);
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.department = token.department;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken
      }
    return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};
