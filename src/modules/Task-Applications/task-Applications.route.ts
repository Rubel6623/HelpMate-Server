import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { TaskApplicationsController } from './task-Applications.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.RUNNER),
  TaskApplicationsController.applyForTask
);

router.get(
  '/my-applications',
  auth(UserRole.RUNNER),
  TaskApplicationsController.getMyApplications
);

router.get(
  '/task/:taskId',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN),
  TaskApplicationsController.getApplicationsByTask
);

router.patch(
  '/:id/status',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN),
  TaskApplicationsController.updateApplicationStatus
);

export const TaskApplicationsRoutes = router;
