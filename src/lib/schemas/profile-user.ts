import { z } from 'zod';

export const schemaProfile = z.object({
  firstName: z.string().min(3, { message: 'First name is required' }),
  lastName: z.string().min(3, { message: 'Last name is required' }),
  address: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
});

export const defaultValues: SchemaProfile = {
  firstName: '',
  lastName: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  phone: '',
};

export type SchemaProfile = z.infer<typeof schemaProfile>;