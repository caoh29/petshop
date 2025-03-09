import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { SharedFormProps } from './types';

export function ProductInventory({
  form,
  isEditing,
}: Readonly<SharedFormProps>) {
  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='stock'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Stock</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  {...field}
                  readOnly={!isEditing}
                  className={
                    !isEditing
                      ? 'bg-primary-foreground/10 text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      : 'text-black'
                  }
                />
              </FormControl>
              {isEditing && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='sku'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>SKU</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly={!isEditing}
                  className={
                    !isEditing
                      ? 'bg-primary-foreground/10 text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      : 'text-black'
                  }
                />
              </FormControl>
              {isEditing && <FormMessage />}
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name='isOutOfStock'
        render={({ field }) => (
          <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!isEditing}
                className='bg-secondary data-[state=checked]:bg-secondary'
              />
            </FormControl>
            <div className='space-y-1 leading-none'>
              <FormLabel className='text-white cursor-pointer'>
                Mark as Out of Stock
              </FormLabel>
              <p className='text-sm text-gray-400'>
                This will make the product unavailable for purchase, even if
                there is stock in the system
              </p>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}
