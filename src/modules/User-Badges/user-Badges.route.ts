import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { UserBadgesController } from './user-Badges.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  UserBadgesController.awardBadge
);

router.get(
  '/my-badges',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  UserBadgesController.getMyBadges
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  UserBadgesController.removeBadge
);

export const UserBadgesRoutes = router;
