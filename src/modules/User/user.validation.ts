import { z } from 'zod';

const createuserValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updateuserValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const userValidationSchema = {
  createuserValidationSchema,
  updateuserValidationSchema,
};
