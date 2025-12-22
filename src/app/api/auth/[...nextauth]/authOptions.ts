/* eslint-disable @typescript-eslint/no-unused-vars */

import { login } from "@/api/user";
import { AuthResponse } from "@/interfaces/global";
import { User } from "@/interfaces/user/user";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = (
  req: NextApiRequest,
  res: NextApiResponse
): NextAuthOptions => {
  return {
    pages: {
      signIn: "/",
      // newUser: "/auth/new-user",
    },
    session: {
      strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
      async signIn({ user }) {
        const userLoged: User = user as User;
        if (!userLoged?.token || !userLoged?.refreshToken) return false;

        return !!user;
      },
      async jwt({ token, user }) {
        const context: AuthResponse = user as AuthResponse;
        if (user) {
          token.id = user.id;
          token.user = user;
          token.token = context.token;
          token.refreshToken = context.refreshToken;
        }

        return token;
      },
      async session({ session, token }) {
        session.user = token.user as AuthResponse;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).token = token.token;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).refreshToken = token.refreshToken;

        return session;
      },
    },
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          let session = null;
          if (credentials?.email && credentials.password)
            session = await login({
              email: credentials.email,
              password: credentials.password,
            });

          if (!session?.token) throw new Error("Identifiant invalide");

          return {
            id: session.id,
            name: session.firstName + " " + session.lastName,
            email: session.email,
            token: session.token,
            refreshToken: session.refreshToken,
          };
        },
      }),
    ],
  };
};
