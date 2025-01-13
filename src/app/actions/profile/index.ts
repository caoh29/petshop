'use server';

import { auth } from '@/auth';
import { schemaProfile, SchemaProfile } from '@/lib/schemas/profile-user';
import prisma from '../../../../prisma/db';
import { revalidatePath } from 'next/cache';
import { schemaChangePassword, SchemaChangePassword } from '@/lib/schemas/change-password';
import { saltAndHashPassword } from "@/lib/utils";

export async function updateUserAction({ data }: { data: SchemaProfile }) {
  const session = await auth();

  if (!session) return {
    errors: ["Unauthorized"],
    message: "You are Unauthorized",
  };

  const validatedFields = await schemaProfile.safeParseAsync(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields",
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.user?.id },
      data: {
        ...data,
        firstName: data.firstName.trim().toLowerCase(),
        lastName: data.lastName.trim().toLowerCase(),
        address: data.address?.trim().toLowerCase(),
        address2: data.address2?.trim().toLowerCase(),
        city: data.city?.trim().toLowerCase(),
        zip: data.zip?.trim().toUpperCase(),
      }
    });

    revalidatePath('/profile');

    return {
      data: {
        message: "User successfully updated",
        updated: true,
      },
    };
  } catch (error) {
    console.error("Error updating user details:", error);
    return {
      errors: {
        server: ["Error updating user details"],
      },
      message: "Error updating user details",
    };
  }
}


export async function changePasswordAction(data: SchemaChangePassword) {
  const session = await auth();

  if (!session) return {
    errors: ["Unauthorized"],
    message: "You are Unauthorized",
  };

  const validatedFields = await schemaChangePassword.safeParseAsync(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields",
    };
  }

  try {
    const arePasswordsEqual = validatedFields.data.newPassword === validatedFields.data.confirmNewPassword;

    if (!arePasswordsEqual) {
      throw new Error("Passwords do not match")
    }

    const isValidLength = validatedFields.data.newPassword.length >= 8;

    if (!isValidLength) {
      throw new Error("Password must be at least 8 characters long")
    }

    const pwHash = await saltAndHashPassword(validatedFields.data.newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: session.user?.id },
      data: {
        password: pwHash,
      }
    });

    if (!updatedUser) {
      throw new Error("Error updating user password")
    }

    revalidatePath('/profile');

    return {
      data: {
        message: "Password successfully updated",
        updated: true,
      },
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      errors: {
        server: ["Error updating password"],
      },
      message: "Error updating password",
    };
  }
}