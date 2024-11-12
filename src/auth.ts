import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"

import prisma from "../prisma/db"
import { schemaLogin } from "./lib/schemas/login-user"
import { checkPassword } from "./lib/utils"

const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        let user = null

        const { email, password } = await schemaLogin.parseAsync(credentials);

        // logic to verify if the user exists
        user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        });

        if (!user) {
          throw new Error("No user was found")
        }
        // logic to salt and hash password
        const isValidPassword = await checkPassword(password, user?.password);

        if (!isValidPassword) {
          throw new Error("Invalid password")
        }

        // return JSON object with the user data
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? `${user.firstName} ${user.lastName}`,
          image: user.image ?? undefined,
          // Optional
          isAdmin: user.isAdmin ?? false,
          isVerified: user.isVerified ?? false,
        };
      },
    }),
    // google
    // other provider
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/"
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(config)