import { NextRequest, NextResponse } from "next/server";

import prisma from "../../../../../prisma/db";

import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


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

  switch (event.type) {
    case 'payment_intent.processing':
      return await handlePaymentProcessing(event);


    case 'payment_intent.succeeded':
      return await handlePaymentSucceeded(event);

    case 'payment_intent.payment_failed':
      return await handlePaymentFailed(event);

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}

const handlePaymentProcessing = async (event: Stripe.PaymentIntentProcessingEvent) => {
  const { metadata } = event.data.object;

  const order = await prisma.order.update({
    where: {
      userId_timestamp: {
        userId: metadata.userId,
        timestamp: metadata.timestamp,
      }
    },
    data: {
      status: 'PROCESSING',
    }
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ orderId: order.id, status: order.status }, { status: 200 });
}


const handlePaymentSucceeded = async (event: Stripe.PaymentIntentSucceededEvent) => {
  const { metadata } = event.data.object;

  const order = await prisma.order.update({
    where: {
      userId_timestamp: {
        userId: metadata.userId,
        timestamp: metadata.timestamp,
      }
    },
    data: {
      status: 'SUCCEEDED',
    }
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ orderId: order.id, status: order.status }, { status: 200 });
}

const handlePaymentFailed = async (event: Stripe.PaymentIntentPaymentFailedEvent) => {
  const { metadata } = event.data.object;

  const order = await prisma.order.update({
    where: {
      userId_timestamp: {
        userId: metadata.userId,
        timestamp: metadata.timestamp,
      }
    },
    data: {
      status: 'FAILED',
    }
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ orderId: order.id, status: order.status }, { status: 200 });
}

