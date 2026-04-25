import { prisma } from "../lib/prisma";
import { TaskStatus } from "../../generated/prisma";
import { PaymentService } from "../modules/Payment/payment.service";

export async function runAutoComplete() {
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // Find jobs submitted more than 48 hours ago
  const jobs = await prisma.task.findMany({
    where: {
      status: TaskStatus.SUBMITTED,
      updatedAt: {
        lt: fortyEightHoursAgo,
      },
    },
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

  for (const job of jobs) {
    try {
      await prisma.task.update({
        where: { id: job.id },
        data: { status: TaskStatus.COMPLETED },
      });

      // Release payment if runner has a stripe account
      if (job.assignment?.runner?.runnerProfile?.stripeAccountId) {
        await PaymentService.releasePayment(job.id, job.assignment.runner.runnerProfile.stripeAccountId);
      }
      
      console.log(`Auto-completed job ${job.id}`);
    } catch (error) {
      console.error(`Failed to auto-complete job ${job.id}:`, error);
    }
  }
}
