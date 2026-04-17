import { z } from 'zod';

const createTaskStopValidationSchema = z.object({
  body: z.array(
    z.object({
      order: z.number({ message: 'Order is required' }),
      locationLabel: z.string({ message: 'Location label is required' }),
      locationLat: z.number({ message: 'Latitude is required' }),
      locationLng: z.number({ message: 'Longitude is required' }),
      address: z.string().optional(),
      isCompleted: z.boolean().optional(),
      taskId: z.string({ message: 'Task ID is required' }),
    })
  ),
});


const updateTaskStopValidationSchema = z.object({
  body: z.object({
    order: z.number().optional(),
    locationLabel: z.string().optional(),
    locationLat: z.number().optional(),
    locationLng: z.number().optional(),
    address: z.string().optional(),
    isCompleted: z.boolean().optional(),
    taskId: z.string().optional(),
  }),
});

export const taskStopsValidationSchema = {
  createTaskStopValidationSchema,
  updateTaskStopValidationSchema,
};

