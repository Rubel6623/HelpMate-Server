import { z } from 'zod';

const createnotificationsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

const updatenotificationsValidationSchema = z.object({
  body: z.object({}).passthrough(),
});

export const notificationsValidationSchema = {
  createnotificationsValidationSchema,
  updatenotificationsValidationSchema,
};
