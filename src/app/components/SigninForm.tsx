'use client';

import Link from 'next/link';

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

import { loginUserAction } from '@/app/actions';

import {
  schemaLogin,
  SchemaLogin,
  defaultValues,
} from '@/lib/schemas/login-user';
export function SigninForm() {
  // Define form
  const form = useForm<SchemaLogin>({
    resolver: zodResolver(schemaLogin),
    defaultValues: defaultValues,
  });

  // Handle submission.
  async function onSubmit(data: SchemaLogin) {
    const res = await loginUserAction(data);
    if (!res.errors) form.reset();
  }
  return (
    <div className='w-full max-w-md'>
      <Form {...form}>
        {/* <form action={registerUserAction}> */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-3xl font-bold'>Sign Up</CardTitle>
              <CardDescription>
                Enter your details to create a new account
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
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
                        type='password'
                        placeholder='Password1+'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className='flex flex-col'>
              <Button type='submit' className='w-full'>
                Sign In
              </Button>
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
            <Link className='underline ml-2' href='/auth/reset'>
              Reset Password
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
