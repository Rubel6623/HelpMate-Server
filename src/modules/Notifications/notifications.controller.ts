import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationsService } from './notifications.service';

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
  const result = await NotificationsService.markAsRead(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notification marked as read',
    data: result,
  });
});

export const NotificationsController = {
  getMyNotifications,
  markAsRead,
};
