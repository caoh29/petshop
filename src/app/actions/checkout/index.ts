"use server";

import { ValidProduct } from "@/api/types";

import { capitalizeString, convertToCurrency } from "@/lib/utils";

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

// export const getTaxRateAction = async (country: string, state: string) => {
//   try {
//     const taxRate = await prisma.taxRate.findFirst({
//       where: {
//         country,
//         state
//       },
//       select: {
//         rate: true,
//       }
//     });

//     if (!taxRate) {
//       return 0;
//     }

//     return taxRate.rate;
//   } catch (error) {
//     console.error(error);
//   }
// }

const getAmount = async (products: ValidProduct[], extraCharges: number): Promise<number> => {
  const prices = await Promise.all(products.map(async (item) => {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId
      },
      select: {
        price: true,
      }
    });

    if (!product) {
      return 0;
    }

    return product.price * item.quantity
  }));

  return convertToCurrency(prices.reduce((acc, price) => acc + price, 0) + extraCharges);
}

export const createPaymentIntentAction = async (products: ValidProduct[], extraCharges: number = 0) => {
  const amount = await getAmount(products, extraCharges);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'cad',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return { clientSecret: paymentIntent.client_secret };
}

