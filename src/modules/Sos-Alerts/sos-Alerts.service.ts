import { prisma } from "../../lib/prisma";

const createAlert = async (userId: string, payload: { lat: number; lng: number; message?: string; taskId?: string }) => {
  const result = await prisma.sosAlert.create({
    data: {
      ...payload,
      userId
    }
  });
  return result;
};

const getAllAlerts = async () => {
  const result = await prisma.sosAlert.findMany({
    include: {
      user: {
        select: {
          name: true,
          phone: true
        }
      },
      task: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

const resolveAlert = async (id: string) => {
  const result = await prisma.sosAlert.update({
    where: { id },
    data: {
      isResolved: true,
      resolvedAt: new Date()
    }
  });
  return result;
};

export const SosAlertsService = {
  createAlert,
  getAllAlerts,
  resolveAlert
};
