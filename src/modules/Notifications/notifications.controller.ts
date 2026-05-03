import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationsService } from './notifications.service';

const createNotification = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationsService.createNotification(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notification created successfully',
    data: result,
  });
});

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await NotificationsService.getMyNotifications(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notifications retrieved successfully',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = (req as any).user.id;
  const result = await NotificationsService.markAsRead(id, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notification marked as read',
    data: result,
  });
});

const sendMessageToRunner = catchAsync(async (req: Request, res: Response) => {
  const { runnerId, title, message } = req.body;
  const senderId = (req as any).user.id;
  const senderName = (req as any).user.name;

  const result = await NotificationsService.createNotification({
    userId: runnerId,
    type: 'DIRECT_MESSAGE' as any,
    title: title || `Message from ${senderName}`,
    message: message,
    data: { senderId, senderName }
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

export const NotificationsController = {
  createNotification,
  getMyNotifications,
  markAsRead,
  sendMessageToRunner,
};
