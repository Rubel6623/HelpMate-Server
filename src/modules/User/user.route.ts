import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  UserController.getAllUsers
);

router.get(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  UserController.getUserById
);

router.patch(
  '/:id/status',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  UserController.updateUserStatus
);

router.delete(
  '/:id',
  auth(UserRole.SUPERADMIN),
  UserController.deleteUser
);

export const UserRoutes = router;
