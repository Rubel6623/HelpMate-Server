import { z } from 'zod';

const createtasksValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updatetasksValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const tasksValidationSchema = {
  createtasksValidationSchema,
  updatetasksValidationSchema,
};
