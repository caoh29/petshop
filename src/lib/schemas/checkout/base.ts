import { z } from 'zod';

export const schemaBase = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  deliveryMethod: z.enum(['ship', 'pickup']),
  paymentMethod: z.enum(['stripe', 'paypal']),
  promoCode: z.string().optional(),
});



export const defaultValuesBase: SchemaBase = {
  paymentMethod: 'stripe',
  deliveryMethod: 'ship',
  promoCode: '',
  email: '',
  phone: '',
  firstName: '',
  lastName: ''
};


export type SchemaBase = z.infer<typeof schemaBase>;