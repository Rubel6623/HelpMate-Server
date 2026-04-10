import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AssignmentsService } from './assignments.service';

const getMyAssignments = catchAsync(async (req: Request, res: Response) => {
  const runnerId = (req as any).user.id;
  const result = await AssignmentsService.getMyAssignments(runnerId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My assignments retrieved successfully',
    data: result,
  });
});

const getSingleAssignment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AssignmentsService.getSingleAssignment(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Assignment retrieved successfully',
    data: result,
  });
});

const startAssignment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AssignmentsService.startAssignment(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Assignment started successfully. Use the OTP to complete with User.',
    data: result,
  });
});

const completeAssignment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { proofUrls } = req.body;
  const result = await AssignmentsService.completeAssignment(id, proofUrls);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Assignment marked as completed',
    data: result,
  });
});

const confirmAssignment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { otp } = req.body;
  const result = await AssignmentsService.confirmAssignment(id, otp);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Assignment confirmed successfully',
    data: result,
  });
});

export const AssignmentsController = {
  getMyAssignments,
  getSingleAssignment,
  startAssignment,
  completeAssignment,
  confirmAssignment,
};
