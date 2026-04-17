import { prisma } from '../../lib/prisma';
import { TTaskPayment } from './task-Payments.interface';

const createTaskPayment = async (payload: NonNullable<TTaskPayment>) => {
  const result = await prisma.taskPayment.create({
    data: payload as any,
  });
  return result;
};

const getAllTaskPayments = async () => {
  const result = await prisma.taskPayment.findMany({
    include: {
      task: true
    }
  });
  return result;
};

const getSingleTaskPayment = async (id: string) => {
  const result = await prisma.taskPayment.findUniqueOrThrow({
    where: { id },
    include: {
      task: true
    }
  });
  return result;
};

const updateTaskPayment = async (id: string, payload: Partial<TTaskPayment>) => {
  const result = await prisma.taskPayment.update({
    where: { id },
    data: payload as any,
  });
  return result;
};

const deleteTaskPayment = async (id: string) => {
  const result = await prisma.taskPayment.delete({
    where: { id },
  });
  return result;
};

export const TaskPaymentsService = {
  createTaskPayment,
  getAllTaskPayments,
  getSingleTaskPayment,
  updateTaskPayment,
  deleteTaskPayment,
};
