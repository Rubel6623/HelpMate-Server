import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TaskPaymentsController } from './task-Payments.controller';
import { taskPaymentsValidationSchema } from './task-Payments.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER),
  validateRequest(taskPaymentsValidationSchema.createtaskPaymentsValidationSchema),
  TaskPaymentsController.createTaskPayment
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  TaskPaymentsController.getAllTaskPayments
);

router.get(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER, UserRole.RUNNER),
  TaskPaymentsController.getSingleTaskPayment
);

router.patch(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  validateRequest(taskPaymentsValidationSchema.updatetaskPaymentsValidationSchema),
  TaskPaymentsController.updateTaskPayment
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  TaskPaymentsController.deleteTaskPayment
);

export const TaskPaymentsRoutes = router;
