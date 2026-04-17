import { z } from 'zod';

const createrunnerProfilesValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updaterunnerProfilesValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const runnerProfilesValidationSchema = {
  createrunnerProfilesValidationSchema,
  updaterunnerProfilesValidationSchema,
};
