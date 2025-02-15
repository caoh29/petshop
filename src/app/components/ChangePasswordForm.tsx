'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSearchParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form';
import { Input } from '@/app/components/ui/input';
import {
  defaultValues,
  SchemaChangePassword,
  schemaChangePassword,
} from '@/lib/schemas/change-password';
import {
  changePasswordAction,
  changePasswordWithTokenAction,
} from '../api/actions';

interface Props {
  userId: string | null;
  variant?: boolean;
}

export default function ChangePasswordForm({
  userId,
  variant,
}: Readonly<Props>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SchemaChangePassword>({
    resolver: zodResolver(schemaChangePassword),
    defaultValues,
  });

  async function onSubmit(data: SchemaChangePassword) {
    setIsLoading(true);
    if (userId) {
      await changePasswordAction(data);
      setIsLoading(false);
      form.reset();
    } else {
      const token = searchParams.get('token');
      if (!token) {
        return;
      }
      await changePasswordWithTokenAction(data, token);
      setIsLoading(false);
      form.reset();
      router.push('/auth/signin');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  className='max-w-md bg-white text-black'
                  type='password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmNewPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  className='max-w-md bg-white text-black'
                  type='password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={isLoading}
          variant={variant ? 'secondary' : 'default'}
          className={`${variant ? 'w-full' : ''}`}
        >
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </Button>
      </form>
    </Form>
  );
}
