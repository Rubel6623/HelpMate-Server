import { z } from 'zod';

const createwalletsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updatewalletsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const walletsValidationSchema = {
  createwalletsValidationSchema,
  updatewalletsValidationSchema,
};
