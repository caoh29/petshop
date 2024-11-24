"use server";

import { capitalizeString } from "@/lib/utils";

import prisma from "../../../../prisma/db";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

export const getUserDefaultValuesAction = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        address: true,
        address2: true,
        zip: true,
        city: true,
        state: true,
        country: true,
        phone: true,
      }
    });

    if (!user) {
      return null;
    }

    return {
      firstName: capitalizeString(user.firstName),
      lastName: capitalizeString(user.lastName),
      email: user.email,
      address: capitalizeString(user.address ?? ''),
      address2: capitalizeString(user.address2 ?? ''),
      city: capitalizeString(user.city ?? ''),
      state: user.state ?? '',
      zip: user.zip ?? '',
      country: user.country ?? '',
      phone: user.phone ?? '',
    };
  } catch (error) {
    console.error(error);
  }
}

export const createPaymentIntentAction = async (amount: number, description: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    description,
    currency: 'CAD',
  });

  return paymentIntent.client_secret;
}