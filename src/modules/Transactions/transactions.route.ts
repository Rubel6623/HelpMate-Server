import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { TransactionsController } from './transactions.controller';

const router = express.Router();

router.get(
  '/my-transactions',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  TransactionsController.getMyTransactions
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  TransactionsController.getAllTransactions
);

router.get(
  '/:id',
  auth(UserRole.USER, UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  TransactionsController.getTransactionById
);

export const TransactionsRoutes = router;
