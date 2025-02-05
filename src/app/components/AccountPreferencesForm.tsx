'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from './ui/form';
import { Switch } from '@/app/components/ui/switch';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  defaultValues,
  SchemaUserPreferences,
  schemaUserPreferences,
} from '@/lib/schemas/user-preferences';

export default function AccountPreferencesForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SchemaUserPreferences>({
    resolver: zodResolver(schemaUserPreferences),
    defaultValues,
  });

  async function onSubmit(data: SchemaUserPreferences) {
    setIsLoading(true);
    console.log(data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='emailNotifications'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 bg-white'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Email Notifications</FormLabel>
                <FormDescription className='text-secondary'>
                  Receive email notifications about your account activity.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='smsAlerts'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 bg-white'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>SMS Alerts</FormLabel>
                <FormDescription className='text-secondary'>
                  Receive SMS alerts for important updates.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='marketingEmails'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 bg-white'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Marketing Emails</FormLabel>
                <FormDescription className='text-secondary'>
                  Receive emails about new products, features, and more.
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dataSharing'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 bg-white'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Data Sharing</FormLabel>
                <FormDescription className='text-secondary'>
                  Allow us to share your data with our partners.
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Saving Preferences...' : 'Save Preferences'}
        </Button>
      </form>
    </Form>
  );
}
