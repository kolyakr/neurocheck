import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // TODO: Replace with actual API call to your backend
        // For now, using mock authentication
        if (
          credentials.email === "test@example.com" &&
          credentials.password === "password"
        ) {
          return {
            id: "1",
            email: credentials.email,
            name: "Test User",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
