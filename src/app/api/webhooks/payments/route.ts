import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

import { Resend } from 'resend';

import prisma from "../../../../../prisma/db";

import EmailOrderTemplate from "@/app/components/EmailOrderTemplate";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(req: NextRequest) {
  if (!endpointSecret) {
    return NextResponse.json({ error: 'Webhook secret not set' }, { status: 500 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  const signature = req.headers.get("stripe-signature");

  try {
    if (!signature) {
      throw new Error("No signature");
    }
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  let response;

  switch (event.type) {
    case 'payment_intent.processing':
      response = await handlePaymentProcessing(event);
      break;
    case 'payment_intent.succeeded':
      response = await handlePaymentSucceeded(event);
      break;

    case 'payment_intent.payment_failed':
      response = await handlePaymentFailed(event);
      break

    default:
      response = `Unhandled event type ${event.type}`;
      break;
  }

  if (response) {
    return NextResponse.json(response, { status: 200 });
  } else {
    return NextResponse.json({ error: 'No response' }, { status: 500 });
  }
}

const handlePaymentProcessing = async (event: Stripe.PaymentIntentProcessingEvent) => {
  const { metadata } = event.data.object;

  const order = await prisma.order.update({
    where: {
      id: metadata.orderId
    },
    data: {
      status: 'PROCESSING',
    }
  })

  if (!order) {
    return { error: 'Order not found' };
  }

  return { orderId: order.id, status: order.status };
}


const handlePaymentSucceeded = async (event: Stripe.PaymentIntentSucceededEvent) => {
  const { metadata } = event.data.object;

  const order = await prisma.order.update({
    where: {
      id: metadata.orderId
    },
    data: {
      status: 'SUCCEEDED',
    }
  })

  if (!order) {
    return { error: 'Order not found' };
  }
  const { data, error } = await resend.emails.send({
    from: 'PetShop <orders@store.caoh29.dev>',
    to: [metadata.email],
    subject: 'Thanks for your order with PetShop',
    react: EmailOrderTemplate({ orderId: metadata.orderId }),
  });

  if (error) {
    return { error: 'Error sending order confirmation email' };
  }

  return { orderId: order.id, status: order.status };
}

const handlePaymentFailed = async (event: Stripe.PaymentIntentPaymentFailedEvent) => {
  const { metadata } = event.data.object;

  const order = await prisma.order.update({
    where: {
      id: metadata.orderId
    },
    data: {
      status: 'FAILED',
    }
  })

  if (!order) {
    return { error: 'Order not found' };
  }

  return { orderId: order.id, status: order.status };
}

