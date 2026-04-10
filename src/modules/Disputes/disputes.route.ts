import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { DisputesController } from './disputes.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.RUNNER),
  DisputesController.raiseDispute
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  DisputesController.getAllDisputes
);

router.patch(
  '/:id/resolve',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  DisputesController.resolveDispute
);

export const DisputesRoutes = router;
