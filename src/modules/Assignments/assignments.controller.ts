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

const submitAssignment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { proofUrls } = req.body;
  const result = await AssignmentsService.submitAssignment(id, proofUrls);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Assignment submitted for approval',
    data: result,
  });
});

const approveAssignment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { otp } = req.body;
  const userId = (req as any).user.id;
  const result = await AssignmentsService.approveAssignment(id, otp, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Assignment approved and payment released',
    data: result,
  });
});

export const AssignmentsController = {
  getMyAssignments,
  getSingleAssignment,
  startAssignment,
  submitAssignment,
  approveAssignment,
};
