import { z } from 'zod';

export const schemaLogin = z.object({
  email: z.string().trim().min(1, { message: 'Email is required' }).email({
    message: 'Please enter a valid email address',
  }),
  password: z.string()
    .min(1, {
      message: 'Password is required'
    }).min(8, {
      message: 'Password must be more than 8 characters'
    }).max(32, {
      message: 'Password must be less than 32 characters',
    }),
});

export const defaultValues: SchemaLogin = {
  email: '',
  password: '',
};

export type SchemaLogin = z.infer<typeof schemaLogin>;