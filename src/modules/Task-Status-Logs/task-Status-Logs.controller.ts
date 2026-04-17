import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskStatusLogsService } from './task-Status-Logs.service';

const createTaskStatusLog = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskStatusLogsService.createTaskStatusLog(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Task status log created successfully',
    data: result,
  });
});

const getAllTaskStatusLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskStatusLogsService.getAllTaskStatusLogs();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task status logs retrieved successfully',
    data: result,
  });
});

const getSingleTaskStatusLog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskStatusLogsService.getSingleTaskStatusLog(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task status log retrieved successfully',
    data: result,
  });
});

const updateTaskStatusLog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskStatusLogsService.updateTaskStatusLog(id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task status log updated successfully',
    data: result,
  });
});

const deleteTaskStatusLog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskStatusLogsService.deleteTaskStatusLog(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task status log deleted successfully',
    data: result,
  });
});

export const TaskStatusLogsController = {
  createTaskStatusLog,
  getAllTaskStatusLogs,
  getSingleTaskStatusLog,
  updateTaskStatusLog,
  deleteTaskStatusLog,
};

