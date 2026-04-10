import { prisma } from "../../lib/prisma";
import { ApplicationStatus, TaskStatus } from "../../../generated/prisma/enums";

const applyForTask = async (runnerId: string, payload: { taskId: string; bidAmount?: number; message?: string }) => {
  // Check if runner already applied
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

  const result = await prisma.taskApplication.create({
    data: {
      ...payload,
      runnerId
    }
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

    // If application is accepted, assign the task to this runner and update task status
    if (status === ApplicationStatus.ACCEPTED) {
       // Reject other applications for the same task
       await tx.taskApplication.updateMany({
         where: {
           taskId: updatedApp.taskId,
           id: { not: applicationId }
         },
         data: { status: ApplicationStatus.REJECTED }
       });

       // Update task status
       await tx.task.update({
         where: { id: updatedApp.taskId },
         data: { status: TaskStatus.ASSIGNED }
       });

       // Create Assignment
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
           status: TaskStatus.ASSIGNED,
           note: 'Task assigned to runner'
         }
       });
    }

    return updatedApp;
  });
  
  return result;
};

export const TaskApplicationsService = {
  applyForTask,
  getApplicationsByTask,
  getMyApplications,
  updateApplicationStatus
};