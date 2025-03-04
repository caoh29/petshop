'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash2, Loader2, Plus } from 'lucide-react';
import { z } from 'zod';
import Image from 'next/image';

import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

import { createProductAdminAction } from '@/app/api/actions';
import {
  schemaCreateProduct,
  SchemaCreateProduct,
  defaultValues,
} from '@/lib/schemas/create-product';

export function CreateProductForm() {
  const router = useRouter();
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  const form = useForm<SchemaCreateProduct>({
    resolver: zodResolver(schemaCreateProduct),
    defaultValues,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAdditionalImages((prev) => [...prev, ...newFiles]);

      // Create previews for each new file
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize && !form.getValues().sizes?.includes(newSize)) {
      form.setValue('sizes', [...(form.getValues().sizes || []), newSize]);
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    form.setValue(
      'sizes',
      form.getValues().sizes?.filter((s) => s !== size) || [],
    );
  };

  const addColor = () => {
    if (newColor && !form.getValues().colors?.includes(newColor)) {
      form.setValue('colors', [...(form.getValues().colors || []), newColor]);
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    form.setValue(
      'colors',
      form.getValues().colors?.filter((c) => c !== color) || [],
    );
  };

  async function onSubmit(values: SchemaCreateProduct) {
    try {
      setIsSubmitting(true);

      // // Create FormData to handle file uploads
      // const formData = new FormData();

      // // Add form values to FormData
      // Object.entries(values).forEach(([key, value]) => {
      //   if (Array.isArray(value)) {
      //     formData.append(key, JSON.stringify(value));
      //   } else if (value !== undefined) {
      //     formData.append(key, String(value));
      //   }
      // });

      // // Add avatar image
      // if (avatarImage) {
      //   formData.append('avatarImage', avatarImage);
      // }

      // // Add additional images
      // additionalImages.forEach((file, index) => {
      //   formData.append(`additionalImage-${index}`, file);
      // });

      // Call server action
      const result = await createProductAdminAction(values);

      if (result.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        console.error('Error creating product:', result.error);
        // Handle error state
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Premium Dog Food' {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the name of your product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='High-quality premium dog food for all breeds...'
                      className='min-h-32'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of your product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type='number' step='0.01' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='discount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input type='number' min='0' max='100' {...field} />
                    </FormControl>
                    <FormMessage />
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
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='food'>Pet Food</SelectItem>
                        <SelectItem value='toys'>Toys</SelectItem>
                        <SelectItem value='accessories'>Accessories</SelectItem>
                        <SelectItem value='health'>
                          Health & Wellness
                        </SelectItem>
                        <SelectItem value='grooming'>Grooming</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type='number' min='0' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='space-y-8'>
            {/* Avatar Image Upload */}
            <div>
              <FormLabel>Product Avatar Image</FormLabel>
              <div className='mt-2 flex flex-col items-center justify-center gap-4'>
                {avatarPreview ? (
                  <div className='relative h-40 w-40'>
                    <Image
                      src={avatarPreview || '/placeholder.svg'}
                      alt='Avatar preview'
                      fill
                      className='rounded-md object-cover'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute -right-2 -top-2'
                      onClick={() => {
                        setAvatarImage(null);
                        setAvatarPreview(null);
                      }}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ) : (
                  <div className='flex h-40 w-40 items-center justify-center rounded-md border border-dashed'>
                    <p className='text-sm text-muted-foreground'>
                      No image selected
                    </p>
                  </div>
                )}
                <div className='flex w-full items-center justify-center'>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='w-full max-w-xs'
                  />
                </div>
              </div>
            </div>

            {/* Additional Images Upload */}
            <div>
              <FormLabel>Additional Images</FormLabel>
              <div className='mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3'>
                {additionalPreviews.map((preview, index) => (
                  <div key={index} className='relative h-24 w-full'>
                    <Image
                      src={preview || '/placeholder.svg'}
                      alt={`Preview ${index}`}
                      fill
                      className='rounded-md object-cover'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute -right-2 -top-2 h-6 w-6'
                      onClick={() => removeAdditionalImage(index)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                ))}
                <div className='flex h-24 w-full items-center justify-center rounded-md border border-dashed'>
                  <label
                    htmlFor='additional-images'
                    className='flex cursor-pointer flex-col items-center justify-center'
                  >
                    <Plus className='h-6 w-6 text-muted-foreground' />
                    <span className='mt-1 text-xs text-muted-foreground'>
                      Add Image
                    </span>
                    <Input
                      id='additional-images'
                      type='file'
                      accept='image/*'
                      onChange={handleAdditionalImagesChange}
                      className='hidden'
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <FormLabel>Sizes</FormLabel>
              <div className='mt-2 flex flex-wrap gap-2'>
                {form.getValues().sizes?.map((size) => (
                  <Badge key={size} variant='secondary' className='text-sm'>
                    {size}
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='ml-1 h-4 w-4'
                      onClick={() => removeSize(size)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className='mt-2 flex gap-2'>
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder='Add size (e.g., Small, Medium, Large)'
                  className='flex-1'
                />
                <Button type='button' onClick={addSize} size='sm'>
                  Add
                </Button>
              </div>
            </div>

            {/* Colors */}
            <div>
              <FormLabel>Colors</FormLabel>
              <div className='mt-2 flex flex-wrap gap-2'>
                {form.getValues().colors?.map((color) => (
                  <Badge key={color} variant='secondary' className='text-sm'>
                    {color}
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='ml-1 h-4 w-4'
                      onClick={() => removeColor(color)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className='mt-2 flex gap-2'>
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder='Add color (e.g., Red, Blue, Green)'
                  className='flex-1'
                />
                <Button type='button' onClick={addColor} size='sm'>
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Create Product
          </Button>
        </div>
      </form>
    </Form>
  );
}
