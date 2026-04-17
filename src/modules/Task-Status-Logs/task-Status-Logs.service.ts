import { prisma } from '../../lib/prisma';
import { TTaskStatusLog } from './task-Status-Logs.interface';

const createTaskStatusLog = async (payload: TTaskStatusLog) => {
  const result = await prisma.taskStatusLog.create({
    data: payload,
  });
  return result;
};

const getAllTaskStatusLogs = async () => {
  const result = await prisma.taskStatusLog.findMany();
  return result;
};

const getSingleTaskStatusLog = async (id: string) => {
  const result = await prisma.taskStatusLog.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

const updateTaskStatusLog = async (id: string, payload: Partial<TTaskStatusLog>) => {
  const result = await prisma.taskStatusLog.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteTaskStatusLog = async (id: string) => {
  const result = await prisma.taskStatusLog.delete({
    where: { id },
  });
  return result;
};

export const TaskStatusLogsService = {
  createTaskStatusLog,
  getAllTaskStatusLogs,
  getSingleTaskStatusLog,
  updateTaskStatusLog,
  deleteTaskStatusLog,
};
