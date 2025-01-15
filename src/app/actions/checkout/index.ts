"use server";

import { BillingInfo, Cart, ShippingInfo, ValidProduct } from "@/api/types";

import { capitalizeString, convertToCurrency, isEmptyString } from "@/lib/utils";

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

export const getAmount = async (products: ValidProduct[], deliveryMethod: 'ship' | 'pickup', billingInfo: BillingInfo): Promise<number> => {
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

  return convertToCurrency(subtotal + shippingCharges + tax);
}

export const getTaxes = async ({ billingInfo, shippingCharges, products }: { billingInfo: BillingInfo; shippingCharges: number; products: { price: number; productId: string; isAvailable: boolean; quantity: number; }[] }): Promise<number> => {
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
  billingInfo: BillingInfo,
  userId: string | null;
  orderId: string;
  email: string;
}

export const createPaymentIntentAction = async ({ userId, orderId, products, deliveryMethod, billingInfo, email }: CreatePaymentIntentParams) => {
  const amount = await getAmount(products, deliveryMethod, billingInfo);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'cad',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
      email,
      userId: userId ?? '',
    },
  });

  if (!paymentIntent.client_secret) {
    throw new Error('No client secret');
  }

  return { clientSecret: paymentIntent.client_secret };
}

interface CreateGuestUserParams extends ShippingInfo {
  email: string;
}

const createGuestUser = async ({ email, ...rest }: CreateGuestUserParams) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (existingUser) {
    return existingUser.id;
  }

  const newUser = await prisma.user.create({
    data: {
      email: email,
      firstName: !isEmptyString(rest.firstName) ? rest.firstName.trim().toLowerCase() : 'unknown',
      lastName: !isEmptyString(rest.lastName) ? rest.lastName.trim().toLowerCase() : 'unknown',
      isAdmin: false,
      isVerified: false,
      isGuest: true,
    }
  });

  return newUser.id;
}

const updateUserAddress = async ({ userId, shippingInfo }: { userId: string, shippingInfo: ShippingInfo }) => {
  try {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        address: !isEmptyString(shippingInfo.address) ? shippingInfo.address.trim().toLowerCase() : undefined,
        address2: !isEmptyString(shippingInfo.address2) ? shippingInfo.address2!.trim().toLowerCase() : undefined,
        city: !isEmptyString(shippingInfo.city) ? shippingInfo.city.trim().toLowerCase() : undefined,
        state: !isEmptyString(shippingInfo.state) ? shippingInfo.state.trim() : undefined,
        zip: !isEmptyString(shippingInfo.zip) ? shippingInfo.zip.trim() : undefined,
        country: !isEmptyString(shippingInfo.country) ? shippingInfo.country.trim() : undefined,
      }
    });
  } catch (error) {
    console.error(error);
  }
}

const getPrices = async (products: ValidProduct[]) => {
  const prices = await Promise.all(products.map(async (product) => {
    const price = await prisma.product.findUnique({
      where: {
        id: product.productId
      },
      select: {
        price: true,
      }
    });

    if (!price) {
      return {
        id: product.productId,
        price: 0,
      };
    }

    return {
      id: product.productId,
      price: price.price,
    };
  }))
  return prices;
}

const deleteCartProducts = async (cartId: string) => {
  await prisma.selectedProduct.deleteMany({
    where: {
      cartId
    }
  });
}

interface CreateOrderParams {
  cart: Cart;
  email: string;
  shippingInfo: ShippingInfo;
  billingInfo: BillingInfo;
  userId: string | null;
  deliveryMethod: 'ship' | 'pickup';
  paymentMethod: 'stripe' | 'paypal' | 'cash';
  saveAddress: boolean;
}

export const createOrderAction = async ({ userId, email, cart, deliveryMethod, paymentMethod, shippingInfo, billingInfo, saveAddress }: CreateOrderParams) => {
  if (saveAddress && userId) {
    await updateUserAddress({ userId, shippingInfo })
  }

  let newUserId = userId;

  if (!newUserId) {
    newUserId = await createGuestUser({
      email,
      ...shippingInfo
    });
  }

  const amount = await getAmount(cart.validatedProducts, deliveryMethod, billingInfo);

  const prices = await getPrices(cart.validatedProducts);

  let shippingAddress;
  if (isEmptyString(shippingInfo.address2)) {
    shippingAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.zip}, ${shippingInfo.country}`
  } else {
    shippingAddress = `${shippingInfo.address2}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.zip}, ${shippingInfo.country}`
  }

  const order = await prisma.order.create({
    data: {
      userId: newUserId,
      total: amount / 100,
      status: 'CREATED',
      shippingAddress: deliveryMethod === 'ship' ? shippingAddress : '',
      paymentMethod,
      deliveryMethod,
      products: {
        create: cart.validatedProducts.map((product) => ({
          quantity: product.quantity,
          productId: product.productId,
          size: product.size,
          color: product.color,
          price: prices.find((price) => price.id === product.productId)?.price ?? 0,
        })),
      }
    }
  });

  // Delete all products from cart
  await deleteCartProducts(cart.id);


  return {
    id: order.id,
    userId: newUserId
  };
}