'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

import { registerUserAction } from '@/app/actions';

import {
  schemaRegister,
  SchemaRegister,
  defaultValues,
} from '@/lib/schemas/register-user';

export function SignupForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Define form
  const form = useForm<SchemaRegister>({
    resolver: zodResolver(schemaRegister),
    defaultValues: defaultValues,
  });

  // Handle submission.
  async function onSubmit(data: SchemaRegister) {
    setLoading(true);
    const res = await registerUserAction(data);
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
      router.push('/auth/signin');
      router.refresh();
    }
  }
  return (
    <div className='w-full max-w-md'>
      <Form {...form}>
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
                name='firstName'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='John' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </CardFooter>
          </Card>
          <div className='mt-4 text-center text-sm'>
            Have an account?
            <Link className='underline ml-2' href='/auth/signin'>
              Sign In
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
