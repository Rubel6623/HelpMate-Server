import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { TaskStopsController } from './task-Stops.controller';
import { taskStopsValidationSchema } from './task-Stops.validation';
import validateRequest from '../../middlewares/validateRequest';


const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER),
  validateRequest(taskStopsValidationSchema.createTaskStopValidationSchema),
  TaskStopsController.createTaskStop
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  TaskStopsController.getAllTaskStops
);

router.get(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER, UserRole.RUNNER),
  TaskStopsController.getSingleTaskStop
);

router.patch(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER, UserRole.RUNNER),
  validateRequest(taskStopsValidationSchema.updateTaskStopValidationSchema),
  TaskStopsController.updateTaskStop
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER),
  TaskStopsController.deleteTaskStop
);

export const TaskStopsRoutes = router;


