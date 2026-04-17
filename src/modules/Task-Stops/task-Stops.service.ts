import { prisma } from '../../lib/prisma';
import { TaskStops } from './task-Stops.interface';

const createTaskStop = async (payload: TaskStops[]) => {
  const result = await prisma.taskStop.createMany({
    data: payload.map((item) => ({
      order: item.order,
      locationLabel: item.locationLabel,
      locationLat: item.locationLat,
      locationLng: item.locationLng,
      address: item.address,
      isCompleted: item.isCompleted,
      taskId: item.taskId,
    })),
  });
  return result;
};

const getAllTaskStops = async () => {
  const result = await prisma.taskStop.findMany();
  return result;
};

const getSingleTaskStop = async (id: string) => {
  const result = await prisma.taskStop.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

const updateTaskStop = async (id: string, payload: Partial<TaskStops>) => {
  const result = await prisma.taskStop.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteTaskStop = async (id: string) => {
  const result = await prisma.taskStop.delete({
    where: { id },
  });
  return result;
};

export const TaskStopsService = {
  createTaskStop,
  getAllTaskStops,
  getSingleTaskStop,
  updateTaskStop,
  deleteTaskStop,
};

