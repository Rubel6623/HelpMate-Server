import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { SosAlertsController } from './sos-Alerts.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.RUNNER),
  SosAlertsController.createAlert
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  SosAlertsController.getAllAlerts
);

router.patch(
  '/:id/resolve',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  SosAlertsController.resolveAlert
);

export const SosAlertsRoutes = router;
