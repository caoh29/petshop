"use server";

import { BillingInfo, ValidProduct } from "@/api/types";

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

const getAmount = async (products: ValidProduct[], deliveryMethod: 'ship' | 'pickup', billingInfo: BillingInfo): Promise<number> => {
  const productsWithPrice = await Promise.all(products.map(async (item) => {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId
      },
      select: {
        price: true,
      }
    });

    if (!product) {
      return {
        ...item,
        price: 0,
      };
    }

    return {
      ...item,
      price: product.price,
    };
  }));

  const subtotal = productsWithPrice.map(prod => (prod.price * prod.quantity)).reduce((acc, price) => acc + price, 0);

  const shippingCharges = deliveryMethod === 'ship' ? subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST : 0;

  const tax = await getTaxes({
    billingInfo, shippingCharges,
    products: productsWithPrice
  });

  console.log({ subtotal, shippingCharges, tax });

  return convertToCurrency(subtotal + shippingCharges + tax);
}

export const getTaxes = async ({ billingInfo, shippingCharges, products }: { billingInfo: BillingInfo; shippingCharges: number; products: { price: number; productId: string; isAvailable: boolean; quantity: number; }[] }): Promise<number> => {
  // This is a placeholder function. In a real application, you would fetch
  // the tax rate from a database or tax service based on the location.

  // console.log({ products });

  const taxCalculation = await stripe.tax.calculations.create({
    currency: 'cad',
    customer_details: {
      address: {
        line1: billingInfo.address,
        line2: billingInfo.address2,
        city: billingInfo.city,
        state: billingInfo.state,
        postal_code: billingInfo.zip,
        country: billingInfo.country,
      },
      address_source: 'billing',
    },
    line_items: products.map((product) => ({
      amount: convertToCurrency(product.price),
      quantity: product.quantity,
      reference: product.productId,
      tax_behavior: 'exclusive',
    })),
    shipping_cost: {
      amount: shippingCharges > 0 ? convertToCurrency(shippingCharges) : undefined,
    },
  });

  // console.log(taxCalculation);

  let tax = 0;
  if (taxCalculation.id) {
    const lineItems = await stripe.tax.calculations.listLineItems(taxCalculation.id);
    const taxes = lineItems.data.map((item) => (item.amount_tax * item.quantity))
    tax = taxes.reduce((acc, tax) => acc + tax, 0);
  }

  if (taxCalculation.shipping_cost) {
    return (taxCalculation.shipping_cost.amount_tax + tax) / 100;
  }

  return tax / 100;
}

interface CreatePaymentIntentParams {
  products: ValidProduct[];
  deliveryMethod: 'ship' | 'pickup';
  billingInfo: BillingInfo
}

export const createPaymentIntentAction = async ({ products, deliveryMethod, billingInfo }: CreatePaymentIntentParams) => {
  const amount = await getAmount(products, deliveryMethod, billingInfo);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'cad',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return { clientSecret: paymentIntent.client_secret };
}