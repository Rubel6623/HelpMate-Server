import { prisma } from "../../lib/prisma";
import { TaskStatus } from "../../../generated/prisma";

const createTask = async (userId: string, payload: any) => {
  const { stops, locationLabel, location, deadline, estimatedPrice, ...taskData } = payload;
  
  const result = await prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        ...taskData,
        offerPrice: estimatedPrice || payload.offerPrice,
        timeWindowStart: payload.timeWindowStart || new Date(),
        timeWindowEnd: deadline || payload.timeWindowEnd || new Date(),
        estimatedDuration: payload.estimatedDuration || 60,
        userId,
        ...(stops && Array.isArray(stops) && stops.length > 0 ? {
          stops: {
            create: stops.map((stop: any, index: number) => ({
              ...stop,
              order: index + 1
            }))
          }
        } : (location || locationLabel ? {
          stops: {
            create: [{
              locationLabel: locationLabel || location,
              locationLat: payload.locationLat || 0.0,
              locationLng: payload.locationLng || 0.0,
              order: 1
            }]
          }
        } : {}))
      },
      include: {
        stops: true
      }
    });
    
    // Create initial status log
    await tx.taskStatusLog.create({
      data: {
        taskId: task.id,
        status: TaskStatus.PENDING,
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
  
  if (status === "NOT_COMPLETED") {
    where.status = { 
      notIn: [TaskStatus.COMPLETED, TaskStatus.RELEASED, TaskStatus.CANCELLED] 
    };
  } else {
    where.status = status || TaskStatus.PENDING;
  }
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
      stops: true,
      _count: {
        select: {
          applications: true
        }
      }
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
        },
        orderBy: { createdAt: 'desc' }
      },
      assignment: {
        include: {
          runner: {
            select: {
              id: true,
              name: true,
              phone: true,
              avatarUrl: true
            }
          }
        }
      },
      payment: true,
      statusLogs: {
        orderBy: { createdAt: 'asc' }
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
      stops: true,
      assignment: {
        include: {
          runner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        }
      }
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

const deleteTask = async (taskId: string, userId: string) => {
  // First verify the task belongs to the user and is in a deletable state
  const task = await prisma.task.findUniqueOrThrow({
    where: { id: taskId }
  });

  if (task.userId !== userId) {
    throw new Error('Unauthorized: You can only delete your own tasks');
  }

  if (task.status !== TaskStatus.PENDING && task.status !== TaskStatus.CANCELLED) {
    throw new Error('Can only delete tasks that are OPEN or CANCELLED');
  }

  const result = await prisma.task.delete({
    where: { id: taskId }
  });
  
  return result;
};

export const TasksService = {
  createTask,
  getAllTasks,
  getSingleTask,
  getMyTasks,
  updateTaskStatus,
  deleteTask
};
