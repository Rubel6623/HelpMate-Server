import { z } from 'zod';

const createsosAlertsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updatesosAlertsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const sosAlertsValidationSchema = {
  createsosAlertsValidationSchema,
  updatesosAlertsValidationSchema,
};
