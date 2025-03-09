import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ProductDetailsProps } from './types';

/**
 * Component for handling basic product details
 * Includes name, description, price, and discount
 */
export function ProductDetails({ form }: Readonly<ProductDetailsProps>) {
  return (
    <>
      {/* Product Name */}
      <FormField
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-ternary'>Product Name</FormLabel>
            <FormControl>
              <Input
                placeholder='Premium Dog Food'
                className='bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                {...field}
              />
            </FormControl>
            <FormDescription className='text-white/50'>
              Enter the name of your product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name='description'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-ternary'>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder='High-quality premium dog food for all breeds...'
                className='min-h-32 bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                {...field}
              />
            </FormControl>
            <FormDescription className='text-white/50'>
              Provide a detailed description of your product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Price and Discount */}
      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-ternary'>Price ($)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
                  min='0'
                  className='bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                  {...field}
                />
              </FormControl>
              <FormDescription className='text-white/50'>
                Enter the product price
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='discount'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-ternary'>Discount (%)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min='0'
                  max='100'
                  className='bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                  {...field}
                />
              </FormControl>
              <FormDescription className='text-white/50'>
                Enter discount percentage (0-100)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
