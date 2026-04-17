import { z } from 'zod';

const createreviewsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updatereviewsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const reviewsValidationSchema = {
  createreviewsValidationSchema,
  updatereviewsValidationSchema,
};
