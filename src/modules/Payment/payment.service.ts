import Stripe from 'stripe';
import config from '../../config';
import { prisma } from '../../lib/prisma';

const stripe = new Stripe(config.stripe_secret_key as string);

const createPaymentIntent = async (payload: { amount: number; taskId: string }) => {
  const { amount } = payload;
  
  // Calculate the amount in cents
  const amountInCents = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'bdt',
    metadata: { taskId: payload.taskId },
  });

  return {
    client_secret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
};

const handleSuccessfulPayment = async (taskId: string) => {
  // Since 'is_paid' does not exist on Task natively, we update TaskPayment status:
  await prisma.taskPayment.upsert({
    where: { taskId },
    update: {
      status: 'ESCROWED',
      escrowedAt: new Date(),
    },
    create: {
      taskId,
      amount: 0, // Should ideally be calculated from task and payment intent
      platformFee: 0, 
      runnerPayout: 0,
      status: 'ESCROWED',
      escrowedAt: new Date(),
    }
  });

  // You can also update task status if needed:
  // await prisma.task.update({ where: { id: taskId }, data: { status: 'IN_PROGRESS' } });
};

export const PaymentService = {
  createPaymentIntent,
  handleSuccessfulPayment,
};
