import { z } from 'zod';

export const schemaForgotPassword = z.object({
  email: z.string().trim().min(1, { message: 'Email is required' }).email({
    message: 'Please enter a valid email address',
  }),
});

export const defaultValues: SchemaForgotPassword = {
  email: '',
};

export type SchemaForgotPassword = z.infer<typeof schemaForgotPassword>;