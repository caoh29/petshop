import { z } from 'zod';

export const schemaCheckout = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  address: z.string().min(5),
  address2: z.string().min(5).optional(),
  zip: z.string().min(6),
  city: z.string().min(4),
  state: z.string().min(2),
  country: z.string().min(2),
  phone: z.string().min(10),
  paymentMethod: z.enum(['stripe', 'paypal']),
  deliveryMethod: z.enum(['ship', 'pickup']),
  saveAddress: z.boolean().default(false).optional(),
  promoCode: z.string().optional()
});



export const defaultValues: SchemaCheckout = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  address2: '',
  zip: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  paymentMethod: 'stripe',
  deliveryMethod: 'ship',
  // Optionals
  saveAddress: false,
  promoCode: ''
};


export type SchemaCheckout = z.infer<typeof schemaCheckout>;