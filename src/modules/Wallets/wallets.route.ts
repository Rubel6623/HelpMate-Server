import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { WalletsController } from './wallets.controller';

const router = express.Router();

router.get(
  '/my-wallet',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  WalletsController.getMyWallet
);

router.post(
  '/top-up',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN),
  WalletsController.topUp
);

router.post(
  '/withdraw',
  auth(UserRole.RUNNER),
  WalletsController.withdraw
);

export const WalletsRoutes = router;
