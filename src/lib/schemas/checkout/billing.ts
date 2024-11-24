import { z } from 'zod';

export const schemaBilling = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  address: z.string().min(5),
  address2: z.string().min(5).optional(),
  zip: z.string().min(6),
  city: z.string().min(4),
  state: z.string().min(2),
  country: z.string().min(2),
});



export const defaultValuesBilling: SchemaBilling = {
  firstName: '',
  lastName: '',
  address: '',
  address2: '',
  zip: '',
  city: '',
  state: '',
  country: '',
};


export type SchemaBilling = z.infer<typeof schemaBilling>;