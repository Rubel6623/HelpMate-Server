import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskApplicationsService } from './task-Applications.service';

const applyForTask = catchAsync(async (req: Request, res: Response) => {
  const runnerId = (req as any).user.id;
  const result = await TaskApplicationsService.applyForTask(runnerId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Applied for task successfully',
    data: result,
  });
});

const getApplicationsByTask = catchAsync(async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;
  const result = await TaskApplicationsService.getApplicationsByTask(taskId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task applications retrieved successfully',
    data: result,
  });
});

const getMyApplications = catchAsync(async (req: Request, res: Response) => {
  const runnerId = (req as any).user.id;
  const result = await TaskApplicationsService.getMyApplications(runnerId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My applications retrieved successfully',
    data: result,
  });
});

const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const result = await TaskApplicationsService.updateApplicationStatus(id, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Application status updated successfully',
    data: result,
  });
});

export const TaskApplicationsController = {
  applyForTask,
  getApplicationsByTask,
  getMyApplications,
  updateApplicationStatus,
};
