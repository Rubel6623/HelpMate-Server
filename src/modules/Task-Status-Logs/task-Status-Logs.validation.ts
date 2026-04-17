import { z } from 'zod';
import { TaskStatus } from '../../../generated/prisma';

const createTaskStatusLogValidationSchema = z.object({
  body: z.object({
    status: z.nativeEnum(TaskStatus, { message: 'Valid TaskStatus is required' }),
    note: z.string().optional(),
    taskId: z.string({ message: 'Task ID is required' }),
  }),
});

const updateTaskStatusLogValidationSchema = z.object({
  body: z.object({
    status: z.nativeEnum(TaskStatus).optional(),
    note: z.string().optional(),
    taskId: z.string().optional(),
  }),
});

export const taskStatusLogsValidationSchema = {
  createTaskStatusLogValidationSchema,
  updateTaskStatusLogValidationSchema,
};
