import { z } from 'zod';

export const schemaCreateProduct = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  }),
  discount: z.coerce.number().min(0).max(100).default(0),
  category: z.string({
    required_error: 'Please select a category.',
  }),
  subcategory: z.string({
    required_error: 'Please select a subcategory.',
  }),
  stock: z.coerce.number().int().positive({
    message: 'Stock must be a positive integer.',
  }),
  sku: z.string().min(6, { message: 'SKU must be at least 6 character.' }),
  sizes: z.array(z.string().min(1, { message: 'Size must be at least 1 character.' })).optional(),
  availableSizes: z.array(z.string().min(1, { message: 'Size must be at least 1 character.' })).optional(),
  colors: z.array(z.string().min(1, { message: 'Color must be at least 1 character.' })).optional(),
  availableColors: z.array(z.string().min(1, { message: 'Color must be at least 1 character.' })).optional(),
});

export type SchemaCreateProduct = z.infer<typeof schemaCreateProduct>;

export const defaultValues: SchemaCreateProduct = {
  name: '',
  description: '',
  price: 0,
  discount: 0,
  category: '',
  subcategory: '',
  stock: 1,
  sku: '',
  sizes: [],
  availableSizes: [],
  colors: [],
  availableColors: [],
};