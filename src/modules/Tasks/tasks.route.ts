import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { TasksController } from './tasks.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN),
  TasksController.createTask
);

router.get('/', TasksController.getAllTasks);

router.get(
  '/my-tasks',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  TasksController.getMyTasks
);

router.get('/:id', TasksController.getSingleTask);

router.patch(
  '/:id/status',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  TasksController.updateTaskStatus
);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN),
  TasksController.deleteTask
);

export const TasksRoutes = router;
