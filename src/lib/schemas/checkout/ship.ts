import { z } from 'zod';

export const schemaShip = z.object({
  address: z.string().min(5),
  address2: z.string().optional(),
  zip: z.string().min(6),
  city: z.string().min(4),
  state: z.string().min(2),
  country: z.string().min(2),
  saveAddress: z.boolean().default(false),
});



export const defaultValuesShip: SchemaShip = {
  address: '',
  address2: '',
  zip: '',
  city: '',
  state: '',
  country: '',
  // Optionals
  saveAddress: false,
};


export type SchemaShip = z.infer<typeof schemaShip>;