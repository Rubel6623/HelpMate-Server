import { z } from 'zod';

const createuserBadgesValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updateuserBadgesValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const userBadgesValidationSchema = {
  createuserBadgesValidationSchema,
  updateuserBadgesValidationSchema,
};
