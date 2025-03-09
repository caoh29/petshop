import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '../ui/form';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { ProductInventoryProps } from './types';

/**
 * Component for handling product inventory information
 * Includes stock, SKU, and out of stock status
 */
export function ProductInventory({ form }: Readonly<ProductInventoryProps>) {
  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        {/* Stock field */}
        <FormField
          control={form.control}
          name='stock'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-ternary'>Stock</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min='0'
                  className='bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                  {...field}
                />
              </FormControl>
              <FormDescription className='text-white/50'>
                Enter the current stock quantity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SKU field */}
        <FormField
          control={form.control}
          name='sku'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-ternary'>SKU</FormLabel>
              <FormControl>
                <Input
                  placeholder='PROD-12345'
                  className='bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                  {...field}
                />
              </FormControl>
              <FormDescription className='text-white/50'>
                Enter a unique product identifier
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Out of stock checkbox */}
      <FormField
        control={form.control}
        name='isOutOfStock'
        render={({ field }) => (
          <FormItem className='flex flex-row items-start space-x-3 space-y-0 mt-4'>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className='bg-secondary data-[state=checked]:bg-secondary'
              />
            </FormControl>
            <div className='space-y-1 leading-none'>
              <FormLabel className='text-ternary cursor-pointer'>
                Mark as Out of Stock
              </FormLabel>
              <FormDescription className='text-white/50'>
                This will make the product unavailable for purchase, even if
                there is stock in the system
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}
