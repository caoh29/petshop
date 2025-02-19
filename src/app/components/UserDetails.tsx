'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './ui/card';
// import { toast } from './ui/use-toast';

interface Props {
  user: {
    id: string;
    name: string | null;
    email: string;
    password: string | null;
    emailVerified: Date | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    address: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
    isAdmin: boolean | null;
    isVerified: boolean | null;
    isGuest: boolean | null;
  };
}

export default function UserDetails({ user: initialUser }: Readonly<Props>) {
  const [user, setUser] = useState(initialUser);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setUser((prevUser) => ({ ...prevUser, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
    // Here you would typically call an API to update the user details
    // For now, we'll just show a success message
    // toast({
    //   title: 'User details updated',
    //   description: 'The user details have been successfully updated.',
    // });
  };

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>View and edit user information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                name='firstName'
                value={user.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                name='lastName'
                value={user.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              value={user.email}
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone</Label>
            <Input
              id='phone'
              name='phone'
              value={user.phone ?? ''}
              onChange={handleInputChange}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='address'>Address</Label>
            <Input
              id='address'
              name='address'
              value={user.address ?? ''}
              onChange={handleInputChange}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='address2'>Address 2</Label>
            <Input
              id='address2'
              name='address2'
              value={user.address2 ?? ''}
              onChange={handleInputChange}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='city'>City</Label>
              <Input
                id='city'
                name='city'
                value={user.city ?? ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='state'>State</Label>
              <Input
                id='state'
                name='state'
                value={user.state ?? ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='zip'>ZIP Code</Label>
              <Input
                id='zip'
                name='zip'
                value={user.zip ?? ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='country'>Country</Label>
              <Input
                id='country'
                name='country'
                value={user.country ?? ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='isAdmin'
              checked={user.isAdmin ?? false}
              onCheckedChange={handleCheckboxChange('isAdmin')}
            />
            <Label htmlFor='isAdmin'>Is Admin</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='isVerified'
              checked={user.isVerified || false}
              onCheckedChange={handleCheckboxChange('isVerified')}
            />
            <Label htmlFor='isVerified'>Is Verified</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit'>Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
