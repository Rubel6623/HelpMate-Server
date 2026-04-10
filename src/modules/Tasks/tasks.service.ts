import { prisma } from "../../lib/prisma";
import { TaskStatus } from "../../../generated/prisma/enums";

const createTask = async (userId: string, payload: any) => {
  const { stops, ...taskData } = payload;
  
  const result = await prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        ...taskData,
        userId,
        stops: {
          create: stops.map((stop: any, index: number) => ({
            ...stop,
            order: index + 1
          }))
        }
      },
      include: {
        stops: true
      }
    });
    
    // Create initial status log
    await tx.taskStatusLog.create({
      data: {
        taskId: task.id,
        status: TaskStatus.OPEN,
        note: 'Task posted'
      }
    });
    
    return task;
  });
  
  return result;
};

const getAllTasks = async (filters: any) => {
  const { categoryId, minPrice, maxPrice, status } = filters;
  
  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;
  if (minPrice || maxPrice) {
    where.offerPrice = {};
    if (minPrice) where.offerPrice.gte = minPrice;
    if (maxPrice) where.offerPrice.lte = maxPrice;
  }

  const result = await prisma.task.findMany({
    where,
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true
        }
      },
      stops: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

const getSingleTask = async (id: string) => {
  const result = await prisma.task.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true
        }
      },
      stops: true,
      applications: {
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
      },
      assignment: {
        include: {
          runner: true
        }
      }
    }
  });
  return result;
};

const getMyTasks = async (userId: string) => {
  const result = await prisma.task.findMany({
    where: { userId },
    include: {
      category: true,
      stops: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

const updateTaskStatus = async (taskId: string, status: TaskStatus, note?: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const updatedTask = await tx.task.update({
      where: { id: taskId },
      data: { status }
    });
    
    await tx.taskStatusLog.create({
      data: {
        taskId,
        status,
        note
      }
    });
    
    return updatedTask;
  });
  
  return result;
};

export const TasksService = {
  createTask,
  getAllTasks,
  getSingleTask,
  getMyTasks,
  updateTaskStatus
};