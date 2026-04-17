import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post(
  '/create-payment-intent',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN),
  PaymentController.createPaymentIntent
);

export const PaymentRoutes = router;
