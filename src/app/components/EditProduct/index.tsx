'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { toast } from 'sonner';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

import {
  updateProductAdminAction,
  deleteProductAdminAction,
} from '../../api/actions';
import {
  schemaEditProduct,
  SchemaEditProduct,
} from '@/lib/schemas/edit-product';
import { EditProductProps } from './types';

import { ImageUpload } from './ImageUpload';
import { ProductDetails } from './ProductDetails';
import { ProductCategories } from './ProductCategories';
import { ProductInventory } from './ProductInventory';
import { ProductVariants } from './ProductVariants';
import { ProductDates } from './ProductDates';

export default function EditProduct({
  product,
  categories,
}: Readonly<EditProductProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newAvailableSize, setNewAvailableSize] = useState('');
  const [newAvailableColor, setNewAvailableColor] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(
    product.image ?? null,
  );
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<
    string[]
  >(product.additionalImages ?? []);
  const router = useRouter();

  // Get Default Values
  const defaultValues: SchemaEditProduct = {
    name: product.name,
    description: product.description,
    price: product.price,
    discount: product.discount,
    category: product.category,
    subcategory: product.subcategory,
    stock: product.stock,
    sku: product.sku,
    isOutOfStock: product.isOutOfStock,
    sizes: product.sizes,
    availableSizes: product.availableSizes,
    colors: product.colors,
    availableColors: product.availableColors,
    image: product.image,
    additionalImages: product.additionalImages,
  };

  // Initialize form with product data
  const form = useForm<SchemaEditProduct>({
    resolver: zodResolver(schemaEditProduct),
    defaultValues,
  });

  // Handle form submission
  async function onSubmit(values: SchemaEditProduct) {
    try {
      setIsSubmitting(true);
      // Call server action
      const result = await updateProductAdminAction(product.id, values);

      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(result.message || 'Error updating product');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error updating product');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle product deletion
  const handleDelete = async () => {
    try {
      const result = await deleteProductAdminAction(product.id);
      if (result.success) {
        toast.success(result.message);
        router.push('/admin/products');
        router.refresh();
      } else {
        toast.error(result.message || 'Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  // Handle form reset
  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    form.reset(defaultValues);
    setNewSize('');
    setNewColor('');
    setNewAvailableSize('');
    setNewAvailableColor('');
    setImagePreview(product.image ?? null);
    setAdditionalImagesPreview(product.additionalImages ?? []);
    setIsEditing(false);
  };

  return (
    <Card className='w-full max-w-2xl bg-primary'>
      <CardHeader className='space-y-4'>
        <CardTitle className='text-ternary'>
          {isEditing ? 'Edit Product' : `ID: ${product.id}`}
        </CardTitle>
        {!isEditing && (
          <div className='flex space-x-2'>
            <Badge variant='secondary'>SKU: {product.sku || 'N/A'}</Badge>
            {product.isOutOfStock ? (
              <Badge variant='destructive'>Out of Stock</Badge>
            ) : (
              <Badge variant='secondary'>In Stock</Badge>
            )}
            {product.discount > 0 && (
              <Badge variant='secondary'>Discount: {product.discount}%</Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className='space-y-4 text-white'>
        {!isEditing && product.image && (
          <div className='flex justify-center mb-4'>
            <div className='relative h-40 w-40'>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className='object-cover rounded-md'
              />
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <ImageUpload
              form={form}
              isEditing={isEditing}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              additionalImagesPreview={additionalImagesPreview}
              setAdditionalImagesPreview={setAdditionalImagesPreview}
            />

            <ProductDetails form={form} isEditing={isEditing} />

            <ProductCategories
              form={form}
              isEditing={isEditing}
              categories={categories}
            />

            <ProductInventory form={form} isEditing={isEditing} />

            <ProductVariants
              form={form}
              isEditing={isEditing}
              newSize={newSize}
              setNewSize={setNewSize}
              newColor={newColor}
              setNewColor={setNewColor}
              newAvailableSize={newAvailableSize}
              setNewAvailableSize={setNewAvailableSize}
              newAvailableColor={newAvailableColor}
              setNewAvailableColor={setNewAvailableColor}
            />

            {!isEditing && product.createdAt && (
              <ProductDates
                createdAt={product.createdAt}
                updatedAt={product.updatedAt}
                isEditing={isEditing}
              />
            )}

            <div className='flex justify-between pt-4'>
              {isEditing ? (
                <>
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={handleReset}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='secondary'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant='secondary'
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Product
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='destructive'>Delete Product</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-primary'>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='text-ternary'>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-white'>
                          This action cannot be undone. This will permanently
                          delete the product from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          <Button variant='destructive'>Delete</Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
