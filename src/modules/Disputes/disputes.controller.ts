import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DisputesService } from './disputes.service';

const raiseDispute = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await DisputesService.raiseDispute(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dispute raised successfully',
    data: result,
  });
});

const getAllDisputes = catchAsync(async (req: Request, res: Response) => {
  const result = await DisputesService.getAllDisputes();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Disputes retrieved successfully',
    data: result,
  });
});

const resolveDispute = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await DisputesService.resolveDispute(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dispute resolved successfully',
    data: result,
  });
});

export const DisputesController = {
  raiseDispute,
  getAllDisputes,
  resolveDispute,
};
