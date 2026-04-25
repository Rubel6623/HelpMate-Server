import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post(
  '/create-payment-intent',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN),
  PaymentController.createPaymentIntent
);

router.post(
  '/capture-payment',
  auth(UserRole.RUNNER, UserRole.ADMIN, UserRole.SUPERADMIN),
  PaymentController.capturePayment
);

router.post(
  '/release-payment',
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN),
  PaymentController.releasePayment
);

router.post(
  '/create-account',
  auth(UserRole.RUNNER),
  PaymentController.createConnectAccount
);

router.post(
  '/onboarding-link',
  auth(UserRole.RUNNER),
  PaymentController.createOnboardingLink
);

export const PaymentRoutes = router;

