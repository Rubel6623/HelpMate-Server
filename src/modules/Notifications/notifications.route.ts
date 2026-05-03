import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { NotificationsController } from './notifications.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  NotificationsController.createNotification
);

router.get(
  '/',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  NotificationsController.getMyNotifications
);

router.patch(
  '/:id/read',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  NotificationsController.markAsRead
);

router.post(
  '/send-message',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  NotificationsController.sendMessageToRunner
);

export const NotificationsRoutes = router;
