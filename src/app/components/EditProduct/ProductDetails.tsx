import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { SharedFormProps } from './types';

export function ProductDetails({ form, isEditing }: Readonly<SharedFormProps>) {
  return (
    <>
      <FormField
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-white'>Product Name</FormLabel>
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

      <FormField
        control={form.control}
        name='description'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-white'>Description</FormLabel>
            <FormControl>
              <Textarea
                rows={4}
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

      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Price ($)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
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
          name='discount'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Discount (%)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min='0'
                  max='100'
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
    </>
  );
}
