'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { toast } from 'sonner';

import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
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
} from './ui/alert-dialog';
import { Checkbox } from './ui/checkbox';

import { Product } from '@/types/types';
import {
  updateProductAdminAction,
  deleteProductAdminAction,
} from '../api/actions';
import {
  schemaEditProduct,
  SchemaEditProduct,
} from '@/lib/schemas/edit-product';

interface Props {
  product: Product;
}

export default function EditProduct({ product }: Readonly<Props>) {
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
    setIsEditing(false);
  };

  // Helper functions for managing sizes and colors
  /**
   * Adds a new size to the product's sizes list
   * Also adds it to available sizes if it's not already there
   */
  const addSize = () => {
    if (newSize && !form.getValues().sizes?.includes(newSize)) {
      const currentSizes = form.getValues().sizes || [];
      const currentAvailableSizes = form.getValues().availableSizes || [];

      // Add to sizes
      form.setValue('sizes', [...currentSizes, newSize], {
        shouldDirty: true,
        shouldValidate: true,
      });

      // Add to available sizes if not already present
      if (!currentAvailableSizes.includes(newSize)) {
        form.setValue('availableSizes', [...currentAvailableSizes, newSize], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      setNewSize('');
    }
  };

  /**
   * Removes a size from both sizes and available sizes lists
   */
  const removeSize = (size: string) => {
    const currentSizes = form.getValues().sizes || [];
    const currentAvailableSizes = form.getValues().availableSizes || [];

    // Remove from sizes
    form.setValue(
      'sizes',
      currentSizes.filter((s) => s !== size),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    // Remove from available sizes
    form.setValue(
      'availableSizes',
      currentAvailableSizes.filter((s) => s !== size),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  /**
   * Adds a new available size to the product's available sizes list
   * Also adds it to sizes if it's not already there
   */
  const addAvailableSize = () => {
    if (
      newAvailableSize &&
      !form.getValues().availableSizes?.includes(newAvailableSize)
    ) {
      const currentSizes = form.getValues().sizes || [];
      const currentAvailableSizes = form.getValues().availableSizes || [];

      // Add to available sizes
      form.setValue(
        'availableSizes',
        [...currentAvailableSizes, newAvailableSize],
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );

      // Add to sizes if not already present
      if (!currentSizes.includes(newAvailableSize)) {
        form.setValue('sizes', [...currentSizes, newAvailableSize], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      setNewAvailableSize('');
    }
  };

  /**
   * Removes an available size from the available sizes list
   */
  const removeAvailableSize = (size: string) => {
    form.setValue(
      'availableSizes',
      form.getValues().availableSizes?.filter((s) => s !== size) || [],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  /**
   * Adds a new color to the product's colors list
   * Also adds it to available colors if it's not already there
   */
  const addColor = () => {
    if (newColor && !form.getValues().colors?.includes(newColor)) {
      const currentColors = form.getValues().colors || [];
      const currentAvailableColors = form.getValues().availableColors || [];

      // Add to colors
      form.setValue('colors', [...currentColors, newColor], {
        shouldDirty: true,
        shouldValidate: true,
      });

      // Add to available colors if not already present
      if (!currentAvailableColors.includes(newColor)) {
        form.setValue(
          'availableColors',
          [...currentAvailableColors, newColor],
          {
            shouldDirty: true,
            shouldValidate: true,
          },
        );
      }

      setNewColor('');
    }
  };

  /**
   * Removes a color from both colors and available colors lists
   */
  const removeColor = (color: string) => {
    const currentColors = form.getValues().colors || [];
    const currentAvailableColors = form.getValues().availableColors || [];

    // Remove from colors
    form.setValue(
      'colors',
      currentColors.filter((c) => c !== color),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    // Remove from available colors
    form.setValue(
      'availableColors',
      currentAvailableColors.filter((c) => c !== color),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  /**
   * Adds a new available color to the product's available colors list
   * Also adds it to colors if it's not already there
   */
  const addAvailableColor = () => {
    if (
      newAvailableColor &&
      !form.getValues().availableColors?.includes(newAvailableColor)
    ) {
      const currentColors = form.getValues().colors || [];
      const currentAvailableColors = form.getValues().availableColors || [];

      // Add to available colors
      form.setValue(
        'availableColors',
        [...currentAvailableColors, newAvailableColor],
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );

      // Add to colors if not already present
      if (!currentColors.includes(newAvailableColor)) {
        form.setValue('colors', [...currentColors, newAvailableColor], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      setNewAvailableColor('');
    }
  };

  /**
   * Removes an available color from the available colors list
   */
  const removeAvailableColor = (color: string) => {
    form.setValue(
      'availableColors',
      form.getValues().availableColors?.filter((c) => c !== color) || [],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('image', result, {
          shouldDirty: true,
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle additional images preview
  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const readers = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setAdditionalImagesPreview(results);
        form.setValue('additionalImages', results, {
          shouldDirty: true,
          shouldValidate: true,
        });
      });
    }
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
            {/* Image Upload Section - Only visible when editing */}
            {isEditing && (
              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name='image'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>
                        Primary Image
                      </FormLabel>
                      <div className='mt-2'>
                        {imagePreview ? (
                          <div className='relative h-40 w-40 mx-auto mb-4'>
                            <Image
                              src={imagePreview}
                              alt='Product preview'
                              fill
                              className='object-cover rounded-md'
                            />
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              className='absolute -top-2 -right-2'
                              onClick={() => {
                                setImagePreview(null);
                                field.onChange('');
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <div className='flex items-center justify-center w-full h-40 bg-primary-foreground/10 rounded-md'>
                            <p className='text-gray-400'>No image selected</p>
                          </div>
                        )}
                        <FormControl>
                          <Input
                            type='file'
                            accept='image/*'
                            onChange={(e) => {
                              handleImageChange(e);
                              field.onChange(e);
                            }}
                            className='mt-4 text-gray-400'
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='additionalImages'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>
                        Additional Images
                      </FormLabel>
                      <div className='mt-2'>
                        {additionalImagesPreview.length > 0 ? (
                          <div className='grid grid-cols-4 gap-4 mb-4'>
                            {additionalImagesPreview.map((img, index) => (
                              <div
                                key={img + index}
                                className='relative h-24 w-24'
                              >
                                <Image
                                  src={img}
                                  alt={`Product preview ${index + 1}`}
                                  fill
                                  className='object-cover rounded-md'
                                />
                                <Button
                                  type='button'
                                  variant='destructive'
                                  size='sm'
                                  className='absolute -top-2 -right-2'
                                  onClick={() => {
                                    const newPreviews =
                                      additionalImagesPreview.filter(
                                        (_, i) => i !== index,
                                      );
                                    setAdditionalImagesPreview(newPreviews);
                                    field.onChange(newPreviews);
                                  }}
                                >
                                  ✕
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className='flex items-center justify-center w-full h-24 bg-primary-foreground/10 rounded-md mb-4'>
                            <p className='text-gray-400'>
                              No additional images
                            </p>
                          </div>
                        )}
                        <FormControl>
                          <Input
                            type='file'
                            accept='image/*'
                            multiple
                            onChange={(e) => {
                              handleAdditionalImagesChange(e);
                              field.onChange(e);
                            }}
                            className='text-gray-400'
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

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

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-white'>Category</FormLabel>
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
                name='subcategory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-white'>Subcategory</FormLabel>
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

            {/* Out of Stock Checkbox */}
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
                      This will make the product unavailable for purchase, even
                      if there is stock in the system
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Sizes section */}
            <div>
              <FormLabel className='text-white'>Sizes</FormLabel>
              <div className='flex flex-wrap gap-2 mt-2 mb-2'>
                {form.getValues().sizes?.map((size) => (
                  <Badge key={size} variant='secondary' className='px-3 py-1'>
                    {size}
                    {isEditing && (
                      <button
                        type='button'
                        className='ml-2 text-xs'
                        onClick={() => removeSize(size)}
                      >
                        ✕
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className='flex gap-4'>
                  <Input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder='Add size'
                    className='flex-1 text-black placeholder:text-gray-400'
                  />
                  <Button type='button' variant='secondary' onClick={addSize}>
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Available Sizes section */}
            <div>
              <FormLabel className='text-white'>Available Sizes</FormLabel>
              <div className='flex flex-wrap gap-2 mt-2 mb-2'>
                {form.getValues().availableSizes?.map((size) => (
                  <Badge key={size} variant='secondary' className='px-3 py-1'>
                    {size}
                    {isEditing && (
                      <button
                        type='button'
                        className='ml-2 text-xs'
                        onClick={() => removeAvailableSize(size)}
                      >
                        ✕
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className='flex gap-4'>
                  <Input
                    value={newAvailableSize}
                    onChange={(e) => setNewAvailableSize(e.target.value)}
                    placeholder='Add available size'
                    className='flex-1 text-black placeholder:text-gray-400'
                  />
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={addAvailableSize}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Colors section */}
            <div>
              <FormLabel className='text-white'>Colors</FormLabel>
              <div className='flex flex-wrap gap-2 mt-2 mb-2'>
                {form.getValues().colors?.map((color) => (
                  <Badge key={color} variant='secondary' className='px-3 py-1'>
                    {color}
                    {isEditing && (
                      <button
                        type='button'
                        className='ml-2 text-xs'
                        onClick={() => removeColor(color)}
                      >
                        ✕
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className='flex gap-4'>
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder='Add color'
                    className='flex-1 text-black placeholder:text-gray-400'
                  />
                  <Button type='button' variant='secondary' onClick={addColor}>
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Available Colors section */}
            <div>
              <FormLabel className='text-white'>Available Colors</FormLabel>
              <div className='flex flex-wrap gap-2 mt-2 mb-2'>
                {form.getValues().availableColors?.map((color) => (
                  <Badge key={color} variant='secondary' className='px-3 py-1'>
                    {color}
                    {isEditing && (
                      <button
                        type='button'
                        className='ml-2 text-xs'
                        onClick={() => removeAvailableColor(color)}
                      >
                        ✕
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className='flex gap-4'>
                  <Input
                    value={newAvailableColor}
                    onChange={(e) => setNewAvailableColor(e.target.value)}
                    placeholder='Add available color'
                    className='flex-1 text-black placeholder:text-gray-400'
                  />
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={addAvailableColor}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>

            {!isEditing && product.createdAt && (
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-accent'>Created At</p>
                  <p>
                    {new Date(product.createdAt).toLocaleDateString('en-CA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {product.updatedAt && (
                  <div>
                    <p className='text-sm font-medium text-accent'>
                      Updated At
                    </p>
                    <p>
                      {new Date(product.updatedAt).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
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
