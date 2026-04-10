import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SosAlertsService } from './sos-Alerts.service';

const createAlert = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await SosAlertsService.createAlert(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SOS Alert raised. help is on the way!',
    data: result,
  });
});

const getAllAlerts = catchAsync(async (req: Request, res: Response) => {
  const result = await SosAlertsService.getAllAlerts();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SOS Alerts retrieved successfully',
    data: result,
  });
});

const resolveAlert = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await SosAlertsService.resolveAlert(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SOS Alert resolved',
    data: result,
  });
});

export const SosAlertsController = {
  createAlert,
  getAllAlerts,
  resolveAlert,
};
