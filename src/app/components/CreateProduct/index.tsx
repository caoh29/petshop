'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Separator } from '../ui/separator';

import { createProductAdminAction } from '@/app/api/actions';
import {
  schemaCreateProduct,
  SchemaCreateProduct,
  defaultValues,
} from '@/lib/schemas/create-product';
import { CreateProductProps } from './types';

import { ImageUpload } from './ImageUpload';
import { ProductDetails } from './ProductDetails';
import { ProductCategories } from './ProductCategories';
import { ProductInventory } from './ProductInventory';
import { ProductVariants } from './ProductVariants';

/**
 * Main component for creating a new product
 * Integrates all subcomponents and handles form submission
 */
export default function CreateProduct({
  categories,
}: Readonly<CreateProductProps>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for image handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<
    string[]
  >([]);

  // State for variants
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newAvailableSize, setNewAvailableSize] = useState('');
  const [newAvailableColor, setNewAvailableColor] = useState('');

  // Initialize form with default values
  const form = useForm<SchemaCreateProduct>({
    resolver: zodResolver(schemaCreateProduct),
    defaultValues,
  });

  /**
   * Handle form submission
   * Calls the server action to create a new product
   */
  const onSubmit = async (formValues: SchemaCreateProduct) => {
    try {
      setIsSubmitting(true);

      // Note: In a real implementation, you would handle image uploads here
      // and update the formValues with the image URLs

      // Call server action with form values
      const result = await createProductAdminAction(formValues);

      if (result.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        console.error('Error creating product:', result.error);
        // You could add toast notification here
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {/* Left Column */}
          <div className='space-y-8 bg-primary p-6 rounded-md'>
            {/* Product Details Section */}
            <ProductDetails form={form} />

            {/* Categories Section */}
            <ProductCategories form={form} categories={categories} />

            {/* Inventory Section */}
            <ProductInventory form={form} />
          </div>

          <Separator className='md:hidden' />

          {/* Right Column */}
          <div className='space-y-8 bg-primary p-6 rounded-md'>
            {/* Image Upload Section */}
            <ImageUpload
              form={form}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              additionalImagesPreview={additionalImagesPreview}
              setAdditionalImagesPreview={setAdditionalImagesPreview}
            />

            {/* Variants Section */}
            <ProductVariants
              form={form}
              newSize={newSize}
              setNewSize={setNewSize}
              newColor={newColor}
              setNewColor={setNewColor}
              newAvailableSize={newAvailableSize}
              setNewAvailableSize={setNewAvailableSize}
              newAvailableColor={newAvailableColor}
              setNewAvailableColor={setNewAvailableColor}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='destructive'
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
          <Button type='submit' variant='secondary' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Create Product
          </Button>
        </div>
      </form>
    </Form>
  );
}
