"use server"

import prisma from "../../../../prisma/db";

import { SchemaRegister, schemaRegister } from "@/lib/schemas/register-user";
import { SchemaLogin, schemaLogin } from "@/lib/schemas/login-user";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth"

import { saltAndHashPassword } from "@/lib/utils";
import { revalidatePath } from "next/cache";

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
        server: ["An error occurred while checking for existing user"],
      },
      message: "An error occurred. Failed to register.",
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
          server: ["Error registering user in database"],
        },
        message: "Error registering user in database. Failed to Register.",
      };
    }
  } catch (error) {
    console.error("An error occurred while registering the user.", error);
    return {
      errors: {
        server: ["Error encrypting password"],
      },
      message: "Error encrypting password. Failed to Register.",
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
    const callbackUrl = await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });

    // check
    if (callbackUrl) revalidatePath(callbackUrl);

    return {
      data: {
        message: "User logged in successfully",
        callbackUrl,
      },
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    if (error instanceof AuthError) {
      // console.log(error.cause?.err?.message);
      if (error.cause?.err?.message === "No user was found") {
        return {
          errors: {
            email: ["Invalid Email. No user registered with this email"],
          },
          message: "Email not found. Failed to Login.",
        };
      } else if (error.cause?.err?.message === "Invalid password") {
        return {
          errors: {
            password: ["Invalid password"],
          },
          message: "Invalid password. Failed to Login.",
        };
      } else {
        return {
          errors: {
            server: ["An error occurred while logging in"],
          },
          message: "An error occurred. Failed to Login.",
        };
      }
    }
    return {
      errors: {
        server: ["Error logging in user"],
      },
      message: "Error logging in user. Failed to Login.",
    };
  }
}

export async function logoutUserAction() {
  try {
    const isSignedOut = await signOut({ redirect: false });

    // check
    if (isSignedOut) revalidatePath("/");
    return {
      data: {
        message: "User logged out successfully",
        isSignedOut,
      },
    };
  } catch (error) {
    console.error("Error logging out user:", error);
    return {
      errors: {
        server: ["Error logging out user"],
      },
      message: "Error logging out user. Failed to Logout.",
    };
  }
}