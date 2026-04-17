import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TaskStatusLogsController } from './task-Status-Logs.controller';
import { taskStatusLogsValidationSchema } from './task-Status-Logs.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER, UserRole.RUNNER),
  validateRequest(taskStatusLogsValidationSchema.createTaskStatusLogValidationSchema),
  TaskStatusLogsController.createTaskStatusLog
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  TaskStatusLogsController.getAllTaskStatusLogs
);

router.get(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER, UserRole.RUNNER),
  TaskStatusLogsController.getSingleTaskStatusLog
);

router.patch(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  validateRequest(taskStatusLogsValidationSchema.updateTaskStatusLogValidationSchema),
  TaskStatusLogsController.updateTaskStatusLog
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  TaskStatusLogsController.deleteTaskStatusLog
);

export const TaskStatusLogsRoutes = router;

