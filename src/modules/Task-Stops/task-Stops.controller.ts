import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskStopsService } from './task-Stops.service';

const createTaskStop = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskStopsService.createTaskStop(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Task stop created successfully',
    data: result,
  });
});

const getAllTaskStops = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskStopsService.getAllTaskStops();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task stops retrieved successfully',
    data: result,
  });
});

const getSingleTaskStop = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskStopsService.getSingleTaskStop(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task stop retrieved successfully',
    data: result,
  });
});

const updateTaskStop = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskStopsService.updateTaskStop(id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task stop updated successfully',
    data: result,
  });
});

const deleteTaskStop = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskStopsService.deleteTaskStop(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task stop deleted successfully',
    data: result,
  });
});

export const TaskStopsController = {
  createTaskStop,
  getAllTaskStops,
  getSingleTaskStop,
  updateTaskStop,
  deleteTaskStop,
};


