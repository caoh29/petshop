import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { NextResponse } from "next/server"

import { PrismaAdapter } from "@auth/prisma-adapter"

import prisma from "../prisma/db"
import { schemaLogin } from "./lib/schemas/login-user"
import { checkPassword } from "./lib/utils"
import { PROTECTED_ROUTES } from "./routes"


declare module "next-auth" {
  interface User {
    isAdmin?: boolean;
    isVerified?: boolean;
  }

  interface Session {
    user: {
      isAdmin: boolean;
      isVerified: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    isAdmin?: boolean
  }
}

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
        const isValidPassword = await checkPassword(password, user?.password ?? '');

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
    Google({
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        // logic to verify if the user exists
        const user = await prisma.user.findUnique({
          where: {
            email: profile.email.toLowerCase(),
          },
        });

        if (user) {
          if (!user.image || !user.name) {
            const updatedUser = await prisma.user.update({
              where: {
                email: profile.email.toLowerCase(),
              },
              data: {
                image: profile.picture,
                name: profile.name,
                isVerified: profile.email_verified,
              },
            });

            return {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              image: updatedUser.image,
              isAdmin: updatedUser.isAdmin ?? false,
              isVerified: updatedUser.isVerified ?? false,
            }
          }

          return {
            id: user.id,
            name: user.name ?? `${user.firstName} ${user.lastName}`,
            email: user.email,
            image: user.image ?? undefined,
            isAdmin: user.isAdmin ?? false,
            isVerified: user.isVerified ?? false,
          }
        }

        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture,
          isVerified: profile.email_verified,
          isAdmin: false,
        }
      },
    }),
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
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id!;
        session.user.isAdmin = token.isAdmin ?? false;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl }, }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = PROTECTED_ROUTES.has(nextUrl.pathname);

      if (isOnProtectedRoute && !isLoggedIn) {
        return false;
      }
      if (nextUrl.pathname.startsWith('/auth') && isLoggedIn) {
        return NextResponse.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(config)