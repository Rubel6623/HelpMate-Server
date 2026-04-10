import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TasksService } from './tasks.service';

const createTask = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await TasksService.createTask(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task created successfully',
    data: result,
  });
});

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await TasksService.getAllTasks(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tasks retrieved successfully',
    data: result,
  });
});

const getSingleTask = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TasksService.getSingleTask(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task retrieved successfully',
    data: result,
  });
});

const getMyTasks = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await TasksService.getMyTasks(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My tasks retrieved successfully',
    data: result,
  });
});

const updateTaskStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status, note } = req.body;
  const result = await TasksService.updateTaskStatus(id, status, note);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task status updated successfully',
    data: result,
  });
});

export const TasksController = {
  createTask,
  getAllTasks,
  getSingleTask,
  getMyTasks,
  updateTaskStatus,
};
