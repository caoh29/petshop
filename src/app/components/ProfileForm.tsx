'use client';

import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarImage } from '@/app/components/ui/avatar';

import { useState } from 'react';

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

      <form
        className='flex flex-col flex-nowrap gap-4 items-center justify-center'
        onSubmit={(e) => console.log({ e })}
      >
        <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
          <div className='flex flex-col flex-nowrap gap-2 w-full'>
            <Label htmlFor='firstName'>First Name</Label>
            <Input
              id='firstName'
              name='firstName'
              disabled={!isEditable}
              defaultValue={firstName}
            />
          </div>
          <div className='flex flex-col flex-nowrap gap-2 w-full'>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input
              id='lastName'
              name='lastName'
              disabled={!isEditable}
              defaultValue={lastName}
            />
          </div>
        </div>
        <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
          <div className='flex flex-col flex-nowrap gap-2 w-full'>
            <Label htmlFor='address'>Address</Label>
            <Input
              id='address'
              name='address'
              disabled={!isEditable}
              defaultValue={address}
            />
          </div>
          <div className='flex flex-col flex-nowrap gap-2 w-full'>
            <Label htmlFor='address2'>Address 2</Label>
            <Input
              id='address2'
              name='address2'
              disabled={!isEditable}
              defaultValue={address2}
            />
          </div>
        </div>
        <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
          <div className='flex flex-col flex-nowrap gap-2 w-full'>
            <Label htmlFor='city'>City</Label>
            <Input
              id='city'
              name='city'
              disabled={!isEditable}
              defaultValue={city}
            />
          </div>
          <div className='flex flex-col flex-nowrap gap-2 w-full'>
            <Label htmlFor='state'>State</Label>
            <Input
              id='state'
              name='state'
              disabled={!isEditable}
              defaultValue={state}
            />
          </div>
        </div>
        <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
          <div className='flex flex-col flex-nowrap gap-2 w-full'>
            <Label htmlFor='zip'>Zip</Label>
            <Input
              id='zip'
              name='zip'
              disabled={!isEditable}
              defaultValue={zip}
            />
          </div>
          <div className='flex flex-col flex-nowrap gap-2 w-full'>
            <Label htmlFor='country'>Country</Label>
            <Input
              id='country'
              name='country'
              disabled={!isEditable}
              defaultValue={country}
            />
          </div>
        </div>
        <div className='flex flex-row flex-nowrap gap-4 w-full justify-between'>
          <div className='flex flex-col flex-nowrap gap-2 w-1/2'>
            <Label htmlFor='phone'>Phone</Label>
            <Input
              id='phone'
              name='phone'
              type='tel'
              pattern=''
              disabled={!isEditable}
              defaultValue={phone}
            />
          </div>
        </div>
        {isEditable && (
          <>
            <Button className='w-1/4 mt-4' type='submit'>
              Save
            </Button>
            <Button className='w-1/4 mt-4' onClick={() => setIsEditable(false)}>
              Discard
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
