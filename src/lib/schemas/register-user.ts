import { z } from 'zod';

export const schemaRegister = z.object({
  firstName: z.string().trim().min(3).max(20, {
    message: 'Text must be between 3 and 20 characters',
  }),
  lastName: z.string().trim().min(3).max(20, {
    message: 'Text must be between 3 and 20 characters',
  }),
  password: z.string().min(8).max(100, {
    message: 'Password must be between 6 and 100 characters',
  }),
  email: z.string().trim().email({
    message: 'Please enter a valid email address',
  }),
});

export const defaultValues: SchemaRegister = {
  firstName: '',
  lastName: '',
  password: '',
  email: '',
};

export type SchemaRegister = z.infer<typeof schemaRegister>;