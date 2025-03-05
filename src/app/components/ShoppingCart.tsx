import Link from 'next/link';

import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';

import { Cart } from '@/types/types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import CartDeleteSelector from './CartDeleteSelector';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table';

interface Props {
  className?: string;
  cart: Cart;
}

export default function ShoppingCart({ className, cart }: Readonly<Props>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          className={`relative hover:scale-110 hover:cursor-pointer ${
            className ?? ''
          }`}
        >
          <span className='absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-secondary text-white'>
            {cart.products.reduce((acc, product) => acc + product.quantity, 0)}
          </span>
          <ShoppingCartIcon color='white' />
        </div>
      </SheetTrigger>
      <SheetContent side='right' className='bg-primary'>
        <h3 className='text-2xl font-bold text-center text-white mb-4'>
          Your Cart
        </h3>
        {cart.products.length === 0 ? (
          <p className='text-center text-muted my-6'>Your cart is empty.</p>
        ) : (
          <ScrollArea className='max-h-max w-full mb-8'>
            <Table>
              <TableHeader>
                <TableRow className='bg-secondary/50 hover:bg-secondary/50'>
                  <TableHead className='text-center'>Product</TableHead>
                  <TableHead className='text-center'>Quantity</TableHead>
                  <TableHead className='text-center'>Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.products.map((product, index) => (
                  <TableRow
                    key={index}
                    className='bg-secondary hover:bg-secondary text-white text-center'
                  >
                    <TableCell className='font-medium'>
                      {product.productName}
                      {product.size && ` (${product.size})`}
                      {product.color && ` (${product.color})`}
                    </TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <CartDeleteSelector
                        id={product.productId}
                        size={product.size}
                        color={product.color}
                        userId={cart.userId}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        <SheetClose
          className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 bg-secondary text-white hover:bg-secondary/80 w-full px-4 py-2'
          asChild
        >
          <Link href='/cart' prefetch={null}>
            Review Cart
          </Link>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
