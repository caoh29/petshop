"use server";

import { ValidProduct } from "@/api/types";

import { capitalizeString, convertToCurrency } from "@/lib/utils";

import prisma from "../../../../prisma/db";

import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 9.99;

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

const getAmount = async (products: ValidProduct[], deliveryMethod: 'ship' | 'pickup', zip: string, country: string): Promise<number> => {
  const productPrices = await Promise.all(products.map(async (item) => {
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

  const subtotal = productPrices.reduce((acc, price) => acc + price, 0);

  const shippingCharges = deliveryMethod === 'ship' ? subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST : 0;

  const tax = getTaxes(subtotal, zip, country, shippingCharges);

  return convertToCurrency(subtotal + shippingCharges + tax);
}

const getTaxes = (subtotal: number, zip: string, country: string, shippingCharges: number): number => {
  // This is a placeholder function. In a real application, you would fetch
  // the tax rate from a database or tax service based on the location.
  return subtotal * 0.13; // 8% tax rate as an example
}

interface CreatePaymentIntentParams {
  products: ValidProduct[];
  deliveryMethod: 'ship' | 'pickup';
  zip: string;
  country: string;
}

export const createPaymentIntentAction = async ({ products, deliveryMethod, zip, country }: CreatePaymentIntentParams) => {
  const amount = await getAmount(products, deliveryMethod, zip, country);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'cad',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return { clientSecret: paymentIntent.client_secret };
}