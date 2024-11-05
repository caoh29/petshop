"use server"

import prisma from "../../../../prisma/db";

import { SchemaRegister, schemaRegister } from "@/lib/schemas/register-user";
import { SchemaLogin, schemaLogin } from "@/lib/schemas/login-user";

import { signIn } from "@/auth";

import { saltAndHashPassword } from "@/lib/utils";

export async function registerUserAction(data: SchemaRegister) {
  const validatedFields = await schemaRegister.safeParseAsync(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Register.",
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
    });

    if (existingUser) {
      return {
        errors: {
          email: ["Email already exists"],
        },
        message: "Email already exists. Failed to Register.",
      };
    }
  } catch (error) {
    console.error("Error checking for existing user:", error);
    return {
      errors: {
        email: ["Error checking for existing user"],
      },
      message: "Error checking for existing user. Failed to Register.",
    };
  }

  try {
    const pwHash = await saltAndHashPassword(validatedFields.data.password);

    const user = await prisma.user.create({
      data: {
        firstName: validatedFields.data.firstName,
        lastName: validatedFields.data.lastName,
        email: validatedFields.data.email,
        password: pwHash,
        isAdmin: false,
        isVerified: false,
      },
    });

    if (user) {
      return {
        data: {
          message: "User registered successfully",
          status: 201,
        },
      };
    } else {
      return {
        errors: {
          email: ["Error registering user in DB"],
        },
        message: "Error registering user in DB. Failed to Register.",
      };
    }
  } catch (error) {
    console.error("Error registering user in DB:", error);
    return {
      errors: {
        email: ["Error registering user in DB"],
      },
      message: "Error registering user in DB. Failed to Register.",
    };
  }
}

export async function loginUserAction(data: SchemaLogin) {
  const validatedFields = await schemaLogin.safeParseAsync(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    };
  }

  try {
    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirectTo: "/",
    });

    return {
      data: {
        message: "User logged in successfully",
      },
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      errors: {
        email: ["Error logging in user"],
      },
      message: "Error logging in user. Failed to Login.",
    };
  }
}
