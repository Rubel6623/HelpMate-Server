import { z } from 'zod';

const createtaskPaymentsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updatetaskPaymentsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const taskPaymentsValidationSchema = {
  createtaskPaymentsValidationSchema,
  updatetaskPaymentsValidationSchema,
};
