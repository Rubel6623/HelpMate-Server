import { z } from 'zod';

const createtransactionsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updatetransactionsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const transactionsValidationSchema = {
  createtransactionsValidationSchema,
  updatetransactionsValidationSchema,
};
