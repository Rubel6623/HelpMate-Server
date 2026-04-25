import { prisma } from "../../lib/prisma";
import { TaskStatus } from "../../../generated/prisma";
import { PaymentService } from "../Payment/payment.service";

const getMyAssignments = async (runnerId: string) => {
  const result = await prisma.assignment.findMany({
    where: { runnerId },
    include: {
      task: {
        include: {
          category: true,
          stops: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              avatarUrl: true
            }
          }
        }
      }
    },
    orderBy: {
      acceptedAt: 'desc'
    }
  });
  return result;
};

const getSingleAssignment = async (id: string) => {
  const result = await prisma.assignment.findUniqueOrThrow({
    where: { id },
    include: {
      task: {
        include: {
          category: true,
          stops: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              avatarUrl: true
            }
          }
        }
      },
      runner: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatarUrl: true,
          runnerProfile: true
        }
      }
    }
  });
  return result;
};

const startAssignment = async (id: string) => {
  const completionOTP = Math.floor(100000 + Math.random() * 900000).toString();

  const result = await prisma.$transaction(async (tx) => {
    const assignment = await tx.assignment.update({
      where: { id },
      data: {
        startedAt: new Date(),
        completionOTP
      }
    });

    await tx.task.update({
      where: { id: assignment.taskId },
      data: { status: TaskStatus.IN_PROGRESS }
    });

    await tx.taskStatusLog.create({
      data: {
        taskId: assignment.taskId,
        status: TaskStatus.IN_PROGRESS,
        note: 'Runner started the task'
      }
    });

    return assignment;
  });

  return result;
};

const submitAssignment = async (id: string, proofUrls: string[]) => {
  const result = await prisma.$transaction(async (tx) => {
    const assignment = await tx.assignment.update({
      where: { id },
      data: {
        completedAt: new Date(),
        proofUrls
      }
    });

    await tx.task.update({
      where: { id: assignment.taskId },
      data: { status: TaskStatus.SUBMITTED } // Rule 7.2
    });

    await tx.taskStatusLog.create({
      data: {
        taskId: assignment.taskId,
        status: TaskStatus.SUBMITTED,
        note: 'Runner submitted task for approval'
      }
    });

    return assignment;
  });

  return result;
};

const approveAssignment = async (id: string, otp?: string, userId?: string) => {
  const assignment = await prisma.assignment.findUniqueOrThrow({
    where: { id },
    include: {
      task: true,
      runner: {
        include: {
          runnerProfile: true
        }
      }
    }
  });

  const isPoster = userId && assignment.task.userId === userId;

  if (!isPoster && assignment.completionOTP !== otp) {
    throw new Error('Invalid Completion OTP or unauthorized action');
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedAssignment = await tx.assignment.update({
      where: { id },
      data: { confirmedAt: new Date() }
    });

    await tx.task.update({
      where: { id: updatedAssignment.taskId },
      data: { status: TaskStatus.COMPLETED } // Rule 7.3
    });

    await tx.taskStatusLog.create({
      data: {
        taskId: updatedAssignment.taskId,
        status: TaskStatus.COMPLETED,
        note: 'Buyer approved task'
      }
    });

    return updatedAssignment;
  });

  // Release payment (Rule 6.3 & 7.3)
  // If runner has no Stripe account yet, task is still COMPLETED but payout is deferred
  if (assignment.runner.runnerProfile?.stripeAccountId) {
    try {
      await PaymentService.releasePayment(assignment.taskId, assignment.runner.runnerProfile.stripeAccountId);
    } catch (paymentError) {
      console.error('Payment release failed after task approval:', paymentError);
      // Don't re-throw — task is already COMPLETED, admin can manually release
    }
  } else {
    console.warn(`Runner ${assignment.runnerId} has no Stripe account. Task ${assignment.taskId} confirmed but payment not released.`);
  }

  return result;
};

export const AssignmentsService = {
  getMyAssignments,
  getSingleAssignment,
  startAssignment,
  submitAssignment,
  approveAssignment
};
