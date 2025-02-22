import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from './ui/card';

import { Badge } from './ui/badge';
import PromoteUserButton from './PromoteUserButton';
import InactivateUserButton from './InactivateUserButton';

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
    isActive: boolean | null;
  };
}

export default function UserDetails({ user }: Readonly<Props>) {
  return (
    <Card className='w-full max-w-2xl bg-primary'>
      <CardHeader className='space-y-4'>
        <CardTitle className='text-ternary'>ID: {user.id}</CardTitle>
        <div className='flex space-x-2'>
          {user.isAdmin && <Badge variant='secondary'>Admin</Badge>}
          {user.isVerified && <Badge variant='secondary'>Verified</Badge>}
          <Badge variant={user.isActive ? 'secondary' : 'destructive'}>
            {user.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4 text-white'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm font-medium text-accent'>Name</p>
            <p>
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div>
            <p className='text-sm font-medium text-accent'>Email</p>
            <p>{user.email}</p>
          </div>
        </div>
        <div>
          <p className='text-sm font-medium text-accent'>Phone</p>
          <p>{user.phone ?? 'N/A'}</p>
        </div>
        <div>
          <p className='text-sm font-medium text-accent'>Address</p>
          <p>{user.address ?? 'N/A'}</p>
          {user.address2 && <p>{user.address2}</p>}
          <p>
            {[user.city, user.state, user.zip, user.country]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm font-medium text-accent'>Created At</p>
            <p>{user.createdAt.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-accent'>Updated At</p>
            <p>{user.updatedAt.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        {!user.isAdmin && !user.isGuest && user.isActive && (
          <PromoteUserButton userId={user.id} />
        )}
        {user.isActive && <InactivateUserButton userId={user.id} />}
      </CardFooter>
    </Card>
  );
}
