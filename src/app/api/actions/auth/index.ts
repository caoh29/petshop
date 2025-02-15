"use server"

import prisma from "../../../../../prisma/db";

import { SchemaRegister, schemaRegister } from "@/lib/schemas/register-user";
import { SchemaLogin, schemaLogin } from "@/lib/schemas/login-user";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth"

import { saltAndHashPassword } from "@/lib/utils";

import { Resend } from 'resend';
import EmailOTPTemplate from "@/app/components/EmailOTPTemplate";
import { schemaForgotPassword, SchemaForgotPassword } from "@/lib/schemas/forgot-password";

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Buffer } from 'buffer';
import { AuthTokenData } from "@/types/types";
import { schemaChangePassword, SchemaChangePassword } from "@/lib/schemas/change-password";
import { revalidatePath } from "next/cache";


const ALGORITHM = "aes-256-gcm";
// const ENCRYPTION_KEY = randomBytes(32).toString('hex'); // 32 bytes key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 12; // For aes-256-gcm, this is always 12


const resend = new Resend(process.env.RESEND_API_KEY);

// import { revalidatePath } from "next/cache";

export async function registerUserAction(data: SchemaRegister) {
  const validatedFields = await schemaRegister.safeParseAsync(data);

  let existingUser;

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Register.",
    };
  }

  try {
    existingUser = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
    });

    if (existingUser && !existingUser.isGuest) {
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

    let user;
    if (existingUser && existingUser.isGuest === true) {
      user = await prisma.user.update({
        where: { email: existingUser.email },
        data: {
          firstName: validatedFields.data.firstName,
          lastName: validatedFields.data.lastName,
          password: pwHash,
          isGuest: false,
        },
      })
    } else {
      user = await prisma.user.create({
        data: {
          firstName: validatedFields.data.firstName,
          lastName: validatedFields.data.lastName,
          email: validatedFields.data.email,
          password: pwHash,
          isAdmin: false,
          isVerified: false,
        },
      });
    }

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
    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });

    return {
      data: {
        message: "User logged in successfully",
        isSignedIn: true,
      },
    };
  } catch (error) {
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

export async function checkIfUserExistsAction(data: SchemaForgotPassword) {
  try {
    const validatedFields = await schemaForgotPassword.safeParseAsync(data);
    if (!validatedFields.success) {
      return {
        errors: {
          email: validatedFields.error.issues.map((issue) => issue.message),
        }
      }
    }

    const { email } = validatedFields.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const { otp, otpExpiry, token } = await createOTP(user.id);

      const emailResponse = await sendOTP(user.email, otp, otpExpiry);

      if (!emailResponse) {
        return {
          errors: {
            server: ["Failed to send OTP"],
          },
          message: "Failed to send OTP",
        };
      }

      return {
        data: {
          token,
          status: 200,
        },
      };
    } else {
      return {
        errors: {
          email: ["User does not exist"],
        },
        status: 404,
      };
    }
  } catch (error) {
    console.error("Error checking for existing user:", error);
    return {
      errors: {
        server: ["An error occurred while checking for existing user"],
      },
      message: "An error occurred. Failed to check for existing user.",
    };
  }
}

export async function checkOTPAction(userOtp: string, date: Date, token: string) {
  try {
    const tokenData = await verifyToken(token, 'otp');

    if (!tokenData) {
      throw new Error("Invalid token");
    }

    const { userId } = tokenData;

    const oTPToken = await prisma.oTPToken.findUnique({
      where: { userId, token }, select: {
        code: true,
        expires: true
      }
    });

    if (!oTPToken) {
      throw new Error("User not found");
    }

    const { code, expires } = oTPToken;

    if (!code || !expires) {
      throw new Error("OTP not found");
    }

    if (code !== Number(userOtp)) {
      throw new Error("Invalid OTP");
    }

    if (expires < date) {
      throw new Error("OTP expired");
    }

    const isInvalidated = await invalidateToken(token, 'otp');

    if (!isInvalidated) {
      throw new Error("Failed to invalidate token");
    }

    // Generate new token with 5 minutes expiration
    const newToken = await generateToken(userId, 5);

    // Save new token to corresponding table in database
    await prisma.passwordResetToken.create({
      data: {
        userId,
        token: newToken,
        expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    return newToken;
  } catch (error) {
    console.error("Error checking OTP:", error);
    return null;
  }
}

export async function changePasswordWithTokenAction(data: SchemaChangePassword, token: string) {
  try {
    const tokenData = await verifyToken(token, 'reset');

    if (!tokenData) {
      throw new Error("Invalid token");
    }

    const { userId } = tokenData;

    const validatedFields = await schemaChangePassword.safeParseAsync(data);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields",
      };
    }

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
      where: { id: userId },
      data: {
        password: pwHash,
      }
    });

    if (!updatedUser) {
      throw new Error("Error updating user password")
    }

    revalidatePath("/auth/signin");

    return {
      data: {
        message: "Password successfully updated",
        updated: true,
      },
    };
  } catch (error) {
    console.error("Error changing password: ", error);
    throw new Error("Failed to change password");
  }
}

async function createOTP(userId: string) {
  try {
    // Create otp
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const token = await generateToken(userId, 10);

    // Save otp to user
    await prisma.oTPToken.create({
      data: {
        userId,
        token,
        code: otp,
        expires: otpExpiry
      },
    });

    return { otp, token, otpExpiry };
  } catch (error) {
    console.error("Error creating OTP:", error);
    throw new Error("Failed to create OTP");
  }
}

async function sendOTP(email: string, otp: number, otpExpiry: Date) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'PetShop <support@store.caoh29.dev>',
      to: [email],
      subject: 'Did you forget your password?',
      react: EmailOTPTemplate({ otp, otpExpiry }),
    });

    if (error) {
      throw new Error("Resend failed to send OTP");
    }

    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
}

async function generateToken(userId: string, duration: number = 10): Promise<string> {
  try {
    // Creates a expiration date
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + duration); // Short-lived (10 minutes)

    // Data to encrypt
    const data: AuthTokenData = {
      userId,
      expires,
    };

    // Generate IV
    const iv = randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv);

    // Encrypt the data
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Combine IV and encrypted data
    // const token = `${IV.toString('hex')}:${encrypted}`;
    const token = `${iv.toString("hex")}:${encrypted}`;

    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate reset token');
  }
}


async function verifyToken(token: string, type: 'otp' | 'reset'): Promise<AuthTokenData | null> {
  try {
    // Split IV and encrypted data
    const [ivHex, encrypted] = token.split(':');

    if (!ivHex || !encrypted) {
      return null;
    }
    // Convert IV back to Buffer
    const iv = Buffer.from(ivHex, 'hex');

    // Create decipher
    const decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv);

    // Decrypt the data
    const decrypted = decipher.update(encrypted, 'hex', 'utf8');

    // Parse JSON
    const data: AuthTokenData = JSON.parse(decrypted);

    // Check expiration
    if (new Date() > new Date(data.expires)) {
      return null;
    }

    // Check if token is invalidated
    if (type === 'reset') {
      const tokenExists = await prisma.passwordResetToken.findUnique({
        where: {
          token,
        },
        select: {
          isUsed: true,
        },
      });

      if (!tokenExists || tokenExists.isUsed) {
        return null;
      }
    } else if (type === 'otp') {
      const tokenExists = await prisma.oTPToken.findUnique({
        where: {
          token,
        },
        select: {
          isUsed: true,
        },
      });

      if (!tokenExists || tokenExists.isUsed) {
        return null;
      }
    } else {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

async function invalidateToken(token: string, type: 'otp' | 'reset') {
  try {
    if (type === 'reset') {
      await prisma.passwordResetToken.update({
        where: {
          token,
        },
        data: {
          isUsed: true,
        },
      });
    } else if (type === 'otp') {
      await prisma.oTPToken.update({
        where: {
          token,
        },
        data: {
          isUsed: true,
        },
      });
    } else {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error invalidating token:', error);
    return false;
  }
}