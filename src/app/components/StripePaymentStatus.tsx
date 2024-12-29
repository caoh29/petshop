'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import { useStripe } from '@stripe/react-stripe-js';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

import { Card, CardContent, CardFooter } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

import { useAppDispatch } from '@/hooks';
import { clearCart } from '@/store/store';

export default function StripePaymentStatus() {
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) {
      return;
    }

    // Retrieve the PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      // Inspect the PaymentIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      setStatus(paymentIntent!.status);

      switch (paymentIntent!.status) {
        case 'succeeded':
          setMessage(
            'Your payment has been successfully processed! Thank you for your purchase.',
          );

          dispatch(clearCart());
          break;

        case 'processing':
          setMessage(
            "Your payment is being processed. We'll update you once the payment is complete.",
          );
          break;

        case 'canceled':
          setMessage(
            'The payment was canceled. Please try another payment method or contact support.',
          );
          break;

        case 'requires_confirmation':
          setMessage(
            'Your payment requires confirmation. Please wait while we verify the transaction.',
          );
          break;

        default:
          setMessage(
            'An unexpected error occurred. Please contact our support team for assistance.',
          );
          break;
      }
    });
  }, [stripe]);

  const getStatusIcon = () => {
    switch (status) {
      case 'succeeded':
        return (
          <CheckCircle2 className='h-16 w-16 text-green-500 animate-bounce' />
        );
      case 'processing':
        return <Clock className='h-16 w-16 text-blue-500 animate-spin' />;
      case 'canceled':
        return <XCircle className='h-16 w-16 text-red-500 animate-pulse' />;
      case 'requires_confirmation':
        return (
          <AlertCircle className='h-16 w-16 text-yellow-500 animate-pulse' />
        );
      default:
        return <AlertCircle className='h-16 w-16 text-gray-500' />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-50 border-green-200';
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'canceled':
        return 'bg-red-50 border-red-200';
      case 'requires_confirmation':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className={`w-full max-w-lg border-2 ${getStatusColor()}`}>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center space-y-4 text-center'>
            {getStatusIcon()}
            <Alert className='mt-4'>
              <AlertTitle className='text-xl font-semibold'>
                {status === 'succeeded'
                  ? 'Payment Successful!'
                  : status === 'processing'
                  ? 'Processing Payment...'
                  : status === 'canceled'
                  ? 'Payment Canceled'
                  : status === 'requires_confirmation'
                  ? 'Confirmation Required'
                  : 'Payment Status'}
              </AlertTitle>
              <AlertDescription className='mt-2 text-gray-600'>
                {message}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center gap-4 pt-6'>
          <Link href='/'>
            <Button variant='outline' className='gap-2'>
              Keep Shopping
              <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
          {status === 'canceled' && (
            <Link href='/checkout'>
              <Button className='gap-2'>
                Try Again
                <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
