'use client';

import Link from 'next/link';

import { signIn } from 'next-auth/react';

import { useState } from 'react';

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
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

import { loginUserAction } from '@/app/api/actions';

import {
  schemaLogin,
  SchemaLogin,
  defaultValues,
} from '@/lib/schemas/login-user';

export function SigninForm() {
  const [loading, setLoading] = useState(false);

  // Define form
  const form = useForm<SchemaLogin>({
    resolver: zodResolver(schemaLogin),
    defaultValues: defaultValues,
  });

  // Handle submission.
  async function onSubmit(data: SchemaLogin) {
    setLoading(true);
    const res = await loginUserAction(data);
    setLoading(false);
    if (res.errors) {
      if ('email' in res.errors && res.errors.email && !res.errors.password) {
        form.setError(
          'email',
          { message: res.errors.email[0] },
          { shouldFocus: true },
        );
      } else if (
        'password' in res.errors &&
        res.errors.password &&
        !res.errors.email
      ) {
        form.setError(
          'password',
          { message: res.errors.password[0] },
          { shouldFocus: true },
        );
      } else if (
        'email' in res.errors &&
        'password' in res.errors &&
        res.errors.password &&
        res.errors.email
      ) {
        form.setError('email', { message: res.errors.email[0] });
        form.setError('password', { message: res.errors.password[0] });
      } else {
        form.setError('root', { message: res.message });
      }
    } else {
      form.reset();
      window.location.replace('/');
    }
  }
  return (
    <div className='w-full max-w-md'>
      <Form {...form}>
        <Card className='bg-primary text-white'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-3xl font-bold'>Sign In</CardTitle>
            <CardDescription>
              Enter your details to login using username and password, else use
              these providers
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
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className='text-black bg-white'
                        type='password'
                        placeholder='Password1+'
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
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className='flex flex-col'>
            <div className='flex items-center text-slate-500 my-4'>
              <span className='mx-4 font-medium'>OR</span>
            </div>
            <div className='mt-4 text-center text-sm'>
              <Button
                variant={'secondary'}
                onClick={() =>
                  signIn('google', {
                    redirectTo: '/',
                  })
                }
              >
                Google
              </Button>
            </div>
          </CardFooter>
        </Card>
        <div className='mt-4 text-center text-sm'>
          Do not have an account?
          <Link className='underline ml-2' href='/auth/signup'>
            Sign Up
          </Link>
        </div>
        <div className='mt-4 text-center text-sm'>
          Forgot your password?
          <Link className='underline ml-2' href='/auth/forgot-password'>
            Reset Password
          </Link>
        </div>
      </Form>
    </div>
  );
}
