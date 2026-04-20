import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { RunnerProfilesController } from './runner-Profiles.controller';

const router = express.Router();

router.put(
  '/my-profile',
  auth(UserRole.RUNNER),
  RunnerProfilesController.updateProfile
);

router.get(
  '/my-profile',
  auth(UserRole.RUNNER),
  RunnerProfilesController.getMyProfile
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  RunnerProfilesController.getAllRunners
);

router.patch(
  '/:id/verify',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  RunnerProfilesController.verifyProfile
);

export const RunnerProfilesRoutes = router;
