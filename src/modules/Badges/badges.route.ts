import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { BadgesController } from './badges.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  BadgesController.createBadge
);

router.get(
  '/',
  BadgesController.getAllBadges
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  BadgesController.deleteBadge
);

export const BadgesRoutes = router;
