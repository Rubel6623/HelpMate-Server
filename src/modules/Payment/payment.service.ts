import Stripe from 'stripe';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { PaymentStatus, TaskStatus } from '../../../generated/prisma';

const stripe = new Stripe(config.stripe_secret_key as string);

const createPaymentIntent = async (payload: { amount?: number; taskId?: string }, userId: string) => {
  let finalAmount = payload.amount || 0;
  let metadata: any = { userId };

  if (payload.taskId) {
    const task = await prisma.task.findUnique({
      where: { id: payload.taskId },
      include: { 
        assignment: { 
          include: { 
            runner: { 
              include: { 
                runnerProfile: true 
              } 
            } 
          } 
        } 
      }
    });

    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    
    finalAmount = payload.amount || Number(task.offerPrice);
    metadata.taskId = task.id;
    metadata.type = 'task_payment';
  }

  if (finalAmount <= 0) {
    throw new AppError(400, 'Invalid payment amount');
  }

  const amountInCents = Math.round(finalAmount * 100);
  const idempotencyKey = `pi_${payload.taskId || 'topup'}_${userId}_${finalAmount}_${Date.now().toString().slice(0, -5)}`;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    capture_method: 'manual', // Rule 6.1: AUTHORIZED phase
    metadata,
  }, {
    idempotencyKey
  });

  if (payload.taskId) {
    await prisma.taskPayment.upsert({
      where: { taskId: payload.taskId },
      update: {
        status: PaymentStatus.AUTHORIZED,
        amount: finalAmount,
        paymentIntentId: paymentIntent.id,
      },
      create: {
        taskId: payload.taskId,
        amount: finalAmount,
        platformFee: finalAmount * 0.1, // 10% as per 6.3
        runnerPayout: finalAmount * 0.9,
        status: PaymentStatus.AUTHORIZED,
        paymentIntentId: paymentIntent.id,
      }
    });
  }

  return {
    client_secret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
};

const capturePayment = async (taskId: string) => {
  const payment = await prisma.taskPayment.findUnique({ where: { taskId } });
  if (!payment) throw new AppError(404, "Payment record not found");
  if (!payment.paymentIntentId) throw new AppError(400, "Payment Intent ID missing");

  // Rule 6.2: Capture (ESCROW phase)
  await stripe.paymentIntents.capture(payment.paymentIntentId);

  await prisma.taskPayment.update({
    where: { taskId },
    data: { status: PaymentStatus.ESCROW, escrowedAt: new Date() },
  });
};

const releasePayment = async (taskId: string, sellerStripeId: string) => {
  const payment = await prisma.taskPayment.findUnique({ 
    where: { taskId },
    include: { task: true }
  });

  if (!payment) throw new AppError(404, "Payment record not found");
  if (payment.status === PaymentStatus.RELEASED) return;

  const payout = Number(payment.runnerPayout);

  // Rule 6.3: Release (Transfer to runner)
  const transfer = await stripe.transfers.create({
    amount: Math.round(payout * 100),
    currency: "usd",
    destination: sellerStripeId,
  });

  await prisma.$transaction([
    prisma.transfer.create({
      data: {
        paymentId: payment.id,
        stripeId: transfer.id,
        amount: payout,
      },
    }),
    prisma.taskPayment.update({
      where: { taskId },
      data: { status: PaymentStatus.RELEASED, releasedAt: new Date() },
    }),
    prisma.task.update({
      where: { id: taskId },
      data: { status: TaskStatus.RELEASED }
    })
  ]);
};

const createConnectAccount = async (userId: string) => {
  const runnerProfile = await prisma.runnerProfile.findUnique({ where: { userId } });
  if (runnerProfile?.stripeAccountId) return { accountId: runnerProfile.stripeAccountId };

  const account = await stripe.accounts.create({
    type: 'express',
    capabilities: {
      transfers: { requested: true },
    },
  });

  await prisma.runnerProfile.update({
    where: { userId },
    data: { stripeAccountId: account.id },
  });

  return { accountId: account.id };
};

const createOnboardingLink = async (accountId: string) => {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${config.frontend_url}/dashboard/runner/profile`,
    return_url: `${config.frontend_url}/dashboard/runner/profile`,
    type: 'account_onboarding',
  });

  return { url: accountLink.url };
};

export const PaymentService = {
  createPaymentIntent,
  capturePayment,
  releasePayment,
  createConnectAccount,
  createOnboardingLink,
};

