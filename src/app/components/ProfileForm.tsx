'use client';

import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form';

import { Skeleton } from './ui/skeleton';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

import { zodResolver } from '@hookform/resolvers/zod';
import { schemaProfile, SchemaProfile } from '@/lib/schemas/profile-user';

import {
  getCountriesAction,
  getStatesByCountryCodeAction,
  updateUserAction,
} from '../api/actions';

interface Props {
  defaultValues: {
    firstName?: string;
    lastName?: string;
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
}

// Cache for countries and states data
const cache = {
  countries: null as { code: string; name: string }[] | null,
  states: {} as Record<string, { code: string; name: string }[]>,
};

export default function ProfileForm({
  defaultValues: userDefaultValues,
}: Readonly<Props>) {
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Separate loading states for better UX
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  const [countries, setCountries] = useState<{ code: string; name: string }[]>(
    [],
  );
  const [states, setStates] = useState<{ code: string; name: string }[]>([]);

  const defaultValues: SchemaProfile = {
    firstName: userDefaultValues.firstName ?? '',
    lastName: userDefaultValues.lastName ?? '',
    address: userDefaultValues.address ?? '',
    address2: userDefaultValues.address2 ?? '',
    city: userDefaultValues.city ?? '',
    state: userDefaultValues.state ?? '',
    zip: userDefaultValues.zip ?? '',
    country: userDefaultValues.country ?? '',
    phone: userDefaultValues.phone ?? '',
  };

  // Define form
  const form = useForm<SchemaProfile>({
    resolver: zodResolver(schemaProfile),
    defaultValues,
  });

  // Handle submission.
  async function onSubmit(data: SchemaProfile) {
    setLoading(true);
    const res = await updateUserAction({ data });
    setLoading(false);
    if (res.errors) {
      form.setError('root', { message: res.message });
    } else {
      setIsEditable(false);
    }
  }

  // Memoized fetch functions with caching
  const fetchCountries = useCallback(async () => {
    if (cache.countries) {
      setCountries(cache.countries);
      return;
    }

    try {
      setLoadingCountries(true);
      setError(null);
      const data = await getCountriesAction();
      cache.countries = data;
      setCountries(data);
    } catch (err) {
      setError('Failed to load countries. Please try again.');
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  const fetchStates = useCallback(async (countryCode: string) => {
    if (cache.states[countryCode]) {
      setStates(cache.states[countryCode]);
      return;
    }

    try {
      setLoadingStates(true);
      setError(null);
      const data = await getStatesByCountryCodeAction(countryCode);
      cache.states[countryCode] = data;
      setStates(data);
    } catch (err) {
      setError('Failed to load states/provinces. Please try again.');
    } finally {
      setLoadingStates(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (!countries.length) {
      fetchCountries();
    }
    if (userDefaultValues.country && !states.length) {
      fetchStates(userDefaultValues.country);
    }
  }, [
    fetchCountries,
    fetchStates,
    userDefaultValues.country,
    countries.length,
    states.length,
  ]);

  // handle different events
  const handleCountryChange = async (countryCode: string) => {
    await fetchStates(countryCode);
    form.setValue('state', '');
    form.setValue('zip', '');
  };

  const handleStateChange = () => {
    form.setValue('zip', '');
  };

  const handleReset = async () => {
    if (defaultValues.country) {
      await fetchStates(defaultValues.country);
    }
    form.reset(defaultValues);
    setIsEditable(false);
  };

  return (
    <>
      {error && (
        <div className='text-red-500 bg-red-50 p-4 rounded'>{error}</div>
      )}
      <div className='flex flex-row flex-nowrap gap-8'>
        <h2 className='text-2xl font-bold mb-4'>Shipping Information</h2>
        <Button
          className='ml-auto'
          disabled={isEditable}
          onClick={() => setIsEditable(true)}
        >
          Edit
        </Button>
      </div>

      <Form {...form}>
        <form
          className='flex flex-col flex-nowrap gap-4 items-center justify-center'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
            <div className='flex flex-col flex-nowrap gap-2 w-full'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-white'
                        type='text'
                        disabled={!isEditable}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col flex-nowrap gap-2 w-full'>
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-white'
                        type='text'
                        disabled={!isEditable}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
            <div className='flex flex-col flex-nowrap gap-2 w-full'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-white'
                        type='text'
                        disabled={!isEditable}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col flex-nowrap gap-2 w-full'>
              <FormField
                control={form.control}
                name='address2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-white'
                        type='text'
                        disabled={!isEditable}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
            <div className='flex flex-col flex-nowrap gap-2 w-full'>
              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-white'
                        type='text'
                        disabled={!isEditable}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col flex-nowrap gap-2 w-full'>
              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleCountryChange(value);
                        }}
                        disabled={!isEditable || loadingCountries}
                        {...field}
                      >
                        <SelectTrigger className='bg-white'>
                          {loadingCountries ? (
                            <Skeleton className='h-8 w-full' />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
            <div className='flex flex-col flex-nowrap gap-2 w-full'>
              <FormField
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Select
                        disabled={!isEditable || loadingStates}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleStateChange();
                        }}
                        {...field}
                      >
                        <SelectTrigger className='bg-white'>
                          {loadingStates ? (
                            <Skeleton className='h-8 w-full' />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent className='bg-white'>
                          {states.map((state) => (
                            <SelectItem key={state.code} value={state.code}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col flex-nowrap gap-2 w-full'>
              <FormField
                control={form.control}
                name='zip'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        className='uppercase bg-white'
                        type='text'
                        disabled={!isEditable}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
            <div className='flex flex-col flex-nowrap gap-2 w-1/2'>
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-white'
                        type='tel'
                        placeholder='+12223334444'
                        disabled={!isEditable}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {isEditable && (
            <div className='flex flex-row flex-nowrap gap-6 w-full justify-center'>
              <Button className='w-1/4 mt-4' type='submit' disabled={loading}>
                Save
              </Button>
              <Button
                className='w-1/4 mt-4'
                onClick={handleReset}
                disabled={loading}
              >
                Discard
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
