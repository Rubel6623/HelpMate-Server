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
    throw new Error('You have already accepted or applied for this task');
  }

  const task = await prisma.task.findUniqueOrThrow({ where: { id: payload.taskId } });
  if (task.status !== TaskStatus.PENDING) {
    throw new Error('This task is no longer available');
  }

  const runnerProfile = await prisma.runnerProfile.findUnique({
    where: { userId: runnerId }
  });

  if (!runnerProfile || !runnerProfile.nationalId || !runnerProfile.studentId) {
    throw new Error('You must provide both NID and Student ID in your profile before accepting tasks');
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the application as ACCEPTED immediately (Direct Accept model)
    const application = await tx.taskApplication.create({
      data: {
        ...payload,
        runnerId,
        status: ApplicationStatus.ACCEPTED
      }
    });

    // 2. Reject any other pending applications (unlikely in direct accept but good for safety)
    await tx.taskApplication.updateMany({
      where: {
        taskId: payload.taskId,
        id: { not: application.id }
      },
      data: { status: ApplicationStatus.REJECTED }
    });

    // 3. Update task status to ACCEPTED
    await tx.task.update({
      where: { id: payload.taskId },
      data: { status: TaskStatus.ACCEPTED }
    });

    // 4. Create the Assignment
    await tx.assignment.create({
      data: {
        taskId: payload.taskId,
        runnerId: runnerId,
        applicationId: application.id
      }
    });

    // 5. Log the status change
    await tx.taskStatusLog.create({
      data: {
        taskId: payload.taskId,
        status: TaskStatus.ACCEPTED,
        note: 'Task accepted by runner (Direct Accept)'
      }
    });

    return application;
  });

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
