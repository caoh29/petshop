import { z } from 'zod';

export const schemaProfile = z.object({
  firstName: z.string().min(3, { message: 'First name is required' }),
  lastName: z.string().min(3, { message: 'Last name is required' }),
  address: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  country: z.string(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().regex(/^\+[1-9][0-9]{1,3}[0-9]{6,14}$/, 'Invalid phone number format').optional(),
}).refine((data) => {
  if (data.country) {
    return data.state !== undefined && data.state !== '';
  }
  return true;
}, {
  message: "State is required when country is selected",
  path: ["state"]
}).refine((data) => {
  if (data.state) {
    return data.zip !== undefined && data.zip !== '';
  }
  return true;
}, {
  message: "Postal code is required when state is selected",
  path: ["zip"]
}).refine((data) => {
  if (data.zip && data.country === 'US') {
    return /^\d{5}(-\d{4})?$/.test(data.zip);
  }
  return true;
}, {
  message: "Invalid US ZIP code format",
  path: ["zip"]
}).refine((data) => {
  if (data.zip && data.country === 'CA') {
    return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/i.test(data.zip);
  }
  return true;
}, {
  message: "Invalid Canadian postal code format",
  path: ["zip"]
});

export type SchemaProfile = z.infer<typeof schemaProfile>;

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