import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskPaymentsService } from './task-Payments.service';

const createTaskPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskPaymentsService.createTaskPayment(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Task payment created successfully',
    data: result,
  });
});

const getAllTaskPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskPaymentsService.getAllTaskPayments();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task payments retrieved successfully',
    data: result,
  });
});

const getSingleTaskPayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskPaymentsService.getSingleTaskPayment(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task payment retrieved successfully',
    data: result,
  });
});

const updateTaskPayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskPaymentsService.updateTaskPayment(id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task payment updated successfully',
    data: result,
  });
});

const deleteTaskPayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskPaymentsService.deleteTaskPayment(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task payment deleted successfully',
    data: result,
  });
});

export const TaskPaymentsController = {
  createTaskPayment,
  getAllTaskPayments,
  getSingleTaskPayment,
  updateTaskPayment,
  deleteTaskPayment,
};

