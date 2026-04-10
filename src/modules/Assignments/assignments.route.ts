import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { AssignmentsController } from './assignments.controller';

const router = express.Router();

router.get(
  '/my-assignments',
  auth(UserRole.RUNNER),
  AssignmentsController.getMyAssignments
);

router.get(
  '/:id',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  AssignmentsController.getSingleAssignment
);

router.patch(
  '/:id/start',
  auth(UserRole.RUNNER),
  AssignmentsController.startAssignment
);

router.patch(
  '/:id/complete',
  auth(UserRole.RUNNER),
  AssignmentsController.completeAssignment
);

router.patch(
  '/:id/confirm',
  auth(UserRole.USER),
  AssignmentsController.confirmAssignment
);

export const AssignmentsRoutes = router;
