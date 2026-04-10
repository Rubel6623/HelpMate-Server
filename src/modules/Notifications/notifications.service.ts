import { prisma } from "../../lib/prisma";

const createNotification = async (payload: { userId: string; type: any; title: string; message: string; data?: any }) => {
  const result = await prisma.notification.create({
    data: payload
  });
  return result;
};

const getMyNotifications = async (userId: string) => {
  const result = await prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

const markAsRead = async (id: string) => {
  const result = await prisma.notification.update({
    where: { id },
    data: { read: true }
  });
  return result;
};

export const NotificationsService = {
  createNotification,
  getMyNotifications,
  markAsRead
};