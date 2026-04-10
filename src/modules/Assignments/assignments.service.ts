import { prisma } from "../../lib/prisma";
import { TaskStatus } from "../../../generated/prisma/enums";

const getMyAssignments = async (runnerId: string) => {
  const result = await prisma.assignment.findMany({
    where: { runnerId },
    include: {
      task: {
        include: {
          category: true,
          stops: true
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
          avatarUrl: true
        }
      }
    }
  });
  return result;
};

const startAssignment = async (id: string) => {
  // Generate a random 6-digit OTP for completion
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

const completeAssignment = async (id: string, proofUrls: string[]) => {
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
      data: { status: TaskStatus.COMPLETED }
    });

    await tx.taskStatusLog.create({
      data: {
        taskId: assignment.taskId,
        status: TaskStatus.COMPLETED,
        note: 'Runner marked task as completed'
      }
    });

    return assignment;
  });

  return result;
};

const confirmAssignment = async (id: string, otp: string) => {
  const assignment = await prisma.assignment.findUniqueOrThrow({
    where: { id }
  });

  if (assignment.completionOTP !== otp) {
    throw new Error('Invalid Completion OTP');
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedAssignment = await tx.assignment.update({
      where: { id },
      data: { confirmedAt: new Date() }
    });

    await tx.task.update({
      where: { id: updatedAssignment.taskId },
      data: { status: TaskStatus.CONFIRMED }
    });

    await tx.taskStatusLog.create({
      data: {
        taskId: updatedAssignment.taskId,
        status: TaskStatus.CONFIRMED,
        note: 'User confirmed task completion'
      }
    });

    return updatedAssignment;
  });

  return result;
};

export const AssignmentsService = {
  getMyAssignments,
  getSingleAssignment,
  startAssignment,
  completeAssignment,
  confirmAssignment
};