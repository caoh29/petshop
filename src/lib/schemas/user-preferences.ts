import { z } from 'zod';

export const schemaUserPreferences = z.object({
  emailNotifications: z.boolean(),
  smsAlerts: z.boolean(),
  marketingEmails: z.boolean(),
  dataSharing: z.boolean(),
});

export const defaultValues: SchemaUserPreferences = {
  emailNotifications: false,
  smsAlerts: false,
  marketingEmails: false,
  dataSharing: false
};

export type SchemaUserPreferences = z.infer<typeof schemaUserPreferences>;