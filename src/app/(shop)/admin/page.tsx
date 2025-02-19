import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Users, Package, ShoppingCart } from 'lucide-react';

const links = [
  {
    name: 'Users',
    href: '/admin/users',
    icon: <Users className='mr-2 h-5 w-5' />,
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: <Package className='mr-2 h-5 w-5' />,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: <ShoppingCart className='mr-2 h-5 w-5' />,
  },
];

export default function AdminPage() {
  return (
    <Card className='max-w-2xl mx-auto bg-primary'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold text-center text-white'>
          Admin Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='space-y-4'>
          {links.map((link) => (
            <li key={link.name}>
              <Button
                asChild
                variant='outline'
                className='w-full justify-start text-lg hover:text-ternary'
              >
                <Link href={link.href} className='flex items-center'>
                  {link.icon}
                  {link.name}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
