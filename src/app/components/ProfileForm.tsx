'use client';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarImage } from '@/app/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  // SelectValue,
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

export default function ProfileForm({
  user: {
    name,
    email,
    image,
    firstName,
    lastName,
    address,
    address2,
    city,
    state,
    zip,
    country,
    phone,
  },
}: Readonly<Props>) {
  const [isEditable, setIsEditable] = useState(false);

  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState<{ code: string; name: string }[]>(
    [],
  );
  const [states, setStates] = useState<{ code: string; name: string }[]>([]);

  const defaultValues: SchemaProfile = {
    firstName: firstName ?? '',
    lastName: lastName ?? '',
    address: address ?? '',
    address2: address2 ?? '',
    city: city ?? '',
    state: state ?? '',
    zip: zip ?? '',
    country: country ?? '',
    phone: phone ?? '',
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
      form.reset();
      window.location.reload();
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      setCountries(await getCountriesAction());
      if (country) {
        setStates(await getStatesByCountryCodeAction(country));
      }
    };

    if (isEditable && countries.length === 0) {
      fetchCountries();
    }
  }, [isEditable, countries.length, country]);

  const handleCountryChange = async (countryCode: string) => {
    form.setValue('state', ''); // Reset state field
    form.setValue('zip', '');
    const statesData = await getStatesByCountryCodeAction(countryCode);
    setStates(statesData);
  };

  return (
    <div className='flex flex-col flex-nowrap gap-6 p-8'>
      <div className='flex flex-row flex-nowrap gap-8'>
        <Avatar className='h-20 w-20'>
          <AvatarImage src={image ?? '/default-contact.png'} alt='user icon' />
        </Avatar>
        <div className='flex flex-col flex-nowrap gap-4'>
          <h3>{name}</h3>
          <p className='text-gray-400'>{email}</p>
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
              {/* <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                name='firstName'
                disabled={!isEditable}
                defaultValue={firstName}
              /> */}
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
                        defaultValue={field.value}
                        disabled={!isEditable}
                      >
                        <SelectTrigger>{field.value}</SelectTrigger>

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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isEditable}
                      >
                        <SelectTrigger>{field.value}</SelectTrigger>

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
                      <Input type='text' disabled={!isEditable} {...field} />
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
                onClick={() => {
                  form.reset();
                  setIsEditable(false);
                }}
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
