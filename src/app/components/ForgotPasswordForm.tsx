'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from './ui/card';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form';

import { Input } from './ui/input';
import { Button } from './ui/button';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { checkIfUserExistsAction } from '@/app/api/actions';

import {
  schemaForgotPassword,
  SchemaForgotPassword,
  defaultValues,
} from '@/lib/schemas/forgot-password';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Define form
  const form = useForm<SchemaForgotPassword>({
    resolver: zodResolver(schemaForgotPassword),
    defaultValues: defaultValues,
  });

  // Handle submission.
  async function onSubmit(data: SchemaForgotPassword) {
    setLoading(true);
    const res = await checkIfUserExistsAction(data);
    if (res.errors) {
      if ('email' in res.errors && res.errors.email) {
        form.setError(
          'email',
          { message: res.errors.email[0] },
          { shouldFocus: true },
        );
      } else if ('server' in res.errors) {
        form.setError('root', { message: res.errors.server[0] });
      } else {
        form.setError('root', { message: res.message });
      }
    } else {
      form.reset();
      router.replace(`/auth/forgot-password/otp?token=${res.data.token}`);
    }
    setLoading(false);
  }
  return (
    <div className='w-full max-w-md'>
      <Form {...form}>
        <Card className='bg-primary text-white'>
          <CardHeader className='space-y-2'>
            <CardTitle className='text-3xl font-bold'>
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your email to receive a One Time Password (OTP) to reset
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className='text-black bg-white'
                        type='email'
                        placeholder='example@domain.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full mt-8'
                variant={'secondary'}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
