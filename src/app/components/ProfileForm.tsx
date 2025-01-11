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
import { Avatar, AvatarImage } from '@/app/components/ui/avatar';
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
} from '../actions';

interface Props {
  user: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    isVerified: boolean;

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

export default function ProfileForm({ user }: Readonly<Props>) {
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
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    address: user.address ?? '',
    address2: user.address2 ?? '',
    city: user.city ?? '',
    state: user.state ?? '',
    zip: user.zip ?? '',
    country: user.country ?? '',
    phone: user.phone ?? '',
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
    if (user.country && !states.length) {
      fetchStates(user.country);
    }
  }, [
    fetchCountries,
    fetchStates,
    user.country,
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
    <div className='flex flex-col flex-nowrap gap-6 p-8'>
      {error && (
        <div className='text-red-500 bg-red-50 p-4 rounded'>{error}</div>
      )}
      <div className='flex flex-row flex-nowrap gap-8'>
        <Avatar className='h-20 w-20'>
          <AvatarImage
            src={user.image ?? '/default-contact.png'}
            alt='user icon'
          />
        </Avatar>
        <div className='flex flex-col flex-nowrap gap-4'>
          <h3>{user.name}</h3>
          <p className='text-gray-400'>{user.email}</p>
        </div>
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
                      <Input type='text' disabled={!isEditable} {...field} />
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
                      <Input type='text' disabled={!isEditable} {...field} />
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
                      <Input type='text' disabled={!isEditable} {...field} />
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
                      <Input type='text' disabled={!isEditable} {...field} />
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
                      <Input type='text' disabled={!isEditable} {...field} />
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
                        <SelectTrigger>
                          {loadingCountries ? (
                            <Skeleton className='h-8 w-full' />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
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
                        <SelectTrigger>
                          {loadingStates ? (
                            <Skeleton className='h-8 w-full' />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
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
                        className='uppercase'
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
    </div>
  );
}
