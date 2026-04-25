import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';
import { WalletsService } from '../Wallets/wallets.service';
import { stripe } from '../../lib/stripe';
import config from '../../config';

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await PaymentService.createPaymentIntent(req.body, user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment intent created successfully',
    data: result,
  });
});

const capturePayment = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.body;
  await PaymentService.capturePayment(taskId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment captured (ESCROW)',
    data: { ok: true },
  });
});

const releasePayment = catchAsync(async (req: Request, res: Response) => {
  const { taskId, sellerStripeId } = req.body;
  await PaymentService.releasePayment(taskId, sellerStripeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment released to runner',
    data: { ok: true },
  });
});

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe_webhook_secret as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Rule 8: Webhook implementation
  if (event.type === 'payment_intent.payment_failed') {
    console.log('Payment failed');
  }

  // Handle successful payment (if immediate capture used or after manual capture)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any;
    const { taskId, userId, type } = paymentIntent.metadata;

    if (type === 'wallet_topup' && userId) {
      const amount = paymentIntent.amount / 100;
      await WalletsService.topUp(userId, amount, paymentIntent.id);
    }
  }

  res.json({ received: true });
});

const createConnectAccount = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await PaymentService.createConnectAccount(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Stripe Connect account created',
    data: result,
  });
});

const createOnboardingLink = catchAsync(async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const result = await PaymentService.createOnboardingLink(accountId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Onboarding link created',
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntent,
  capturePayment,
  releasePayment,
  createConnectAccount,
  createOnboardingLink,
  stripeWebhook,
};

