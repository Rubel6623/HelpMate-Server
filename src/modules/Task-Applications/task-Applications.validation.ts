import { z } from 'zod';

const createtaskApplicationsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updatetaskApplicationsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const taskApplicationsValidationSchema = {
  createtaskApplicationsValidationSchema,
  updatetaskApplicationsValidationSchema,
};
