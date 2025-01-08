'use server';

import { auth } from '@/auth';
import { schemaProfile, SchemaProfile } from '@/lib/schemas/profile-user';
import prisma from '../../../../prisma/db';

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