import { prisma } from "../../lib/prisma";
import { ApplicationStatus, TaskStatus } from "../../../generated/prisma";
import { PaymentService } from "../Payment/payment.service";

const applyForTask = async (runnerId: string, payload: { taskId: string; bidAmount?: number; message?: string }) => {
  const existingApp = await prisma.taskApplication.findUnique({
    where: {
      taskId_runnerId: {
        taskId: payload.taskId,
        runnerId
      }
    }
  });

  if (existingApp) {
    throw new Error('You have already applied for this task');
  }

  const task = await prisma.task.findUniqueOrThrow({ where: { id: payload.taskId } });
  if (task.status !== TaskStatus.PENDING) {
    throw new Error('This task is no longer available');
  }

  const runnerProfile = await prisma.runnerProfile.findUnique({
    where: { userId: runnerId }
  });

  if (!runnerProfile || !runnerProfile.nationalId || !runnerProfile.studentId) {
    throw new Error('You must provide both NID and Student ID in your profile before bidding on tasks');
  }

  const result = await prisma.$transaction(async (tx) => {
    const application = await tx.taskApplication.create({
      data: {
        ...payload,
        runnerId,
        status: ApplicationStatus.ACCEPTED
      }
    });

    await tx.task.update({
      where: { id: payload.taskId },
      data: { status: TaskStatus.ACCEPTED } // Rule 7.1
    });

    await tx.assignment.create({
      data: {
        taskId: payload.taskId,
        runnerId,
        applicationId: application.id
      }
    });

    await tx.taskStatusLog.create({
      data: {
        taskId: payload.taskId,
        status: TaskStatus.ACCEPTED,
        note: 'Task accepted and assigned to runner'
      }
    });

    return application;
  });

  // Capture payment when accepted (Rule 6.2 & 7.1)
  await PaymentService.capturePayment(payload.taskId);

  return result;
};

const getApplicationsByTask = async (taskId: string) => {
  const result = await prisma.taskApplication.findMany({
    where: { taskId },
    include: {
      runner: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          runnerProfile: true
        }
      }
    }
  });
  return result;
};

const getMyApplications = async (runnerId: string) => {
  const result = await prisma.taskApplication.findMany({
    where: { runnerId },
    include: {
      task: {
        include: {
          category: true
        }
      }
    }
  });
  return result;
};

const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
  const result = await prisma.$transaction(async (tx) => {
    const updatedApp = await tx.taskApplication.update({
      where: { id: applicationId },
      data: { status }
    });

    if (status === ApplicationStatus.ACCEPTED) {
      await tx.taskApplication.updateMany({
        where: {
          taskId: updatedApp.taskId,
          id: { not: applicationId }
        },
        data: { status: ApplicationStatus.REJECTED }
      });

      await tx.task.update({
        where: { id: updatedApp.taskId },
        data: { status: TaskStatus.ACCEPTED }
      });

      await tx.assignment.create({
        data: {
          taskId: updatedApp.taskId,
          runnerId: updatedApp.runnerId,
          applicationId: updatedApp.id
        }
      });

      await tx.taskStatusLog.create({
        data: {
          taskId: updatedApp.taskId,
          status: TaskStatus.ACCEPTED,
          note: 'Task assigned to runner'
        }
      });
    }

    return updatedApp;
  });

  if (status === ApplicationStatus.ACCEPTED) {
    const app = await prisma.taskApplication.findUnique({ where: { id: applicationId } });
    if (app) await PaymentService.capturePayment(app.taskId);
  }

  return result;
};

export const TaskApplicationsService = {
  applyForTask,
  getApplicationsByTask,
  getMyApplications,
  updateApplicationStatus
};
