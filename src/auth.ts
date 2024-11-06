import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"

import prisma from "../prisma/db"
import { User } from "./api/types"
import { schemaLogin } from "./lib/schemas/login-user"
import { checkPassword } from "./lib/utils"



const authorize = async (credentials: any): Promise<User | null> => {
  let user = null

  const { email, password } = await schemaLogin.parseAsync(credentials);

  // logic to verify if the user exists
  user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!user) {
    throw new Error("No user was found.")
  }
  // logic to salt and hash password
  const isValidPassword = await checkPassword(password, user?.password);

  if (!isValidPassword) {
    throw new Error("Invalid password.")
  }

  console.log("User logged in");
  // return JSON object with the user data
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    // Optional
    isAdmin: user.isAdmin ?? false,
    isVerified: user.isVerified ?? false,
    name: `${user.firstName} ${user.lastName}`,
    image: user.image ?? undefined
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