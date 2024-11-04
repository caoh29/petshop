import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"

import prisma from "../prisma/db"
import { User } from "./api/types"
import { schemaLogin } from "./lib/schemas/login-user"
import { saltAndHashPassword } from "./lib/utils"



const authorize = async (credentials: any): Promise<User | null> => {
  let user = null

  const { email, password } = await schemaLogin.parseAsync(credentials);

  // logic to salt and hash password
  const pwHash = await saltAndHashPassword(password)

  // logic to verify if the user exists
  user = await prisma.user.findUnique({
    where: {
      email: email,
      password: pwHash,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials.")
  }

  // return JSON object with the user data
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@domain.com" },
        password: { label: "Password", type: "password" }
      },
      authorize: authorize,
    })
  ],
})