import { z } from 'zod';

export const schemaChangePassword = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmNewPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

export const defaultValues: SchemaChangePassword = {
  newPassword: '',
  confirmNewPassword: '',
};

export type SchemaChangePassword = z.infer<typeof schemaChangePassword>;