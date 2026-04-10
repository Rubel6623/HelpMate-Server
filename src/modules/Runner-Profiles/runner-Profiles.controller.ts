import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RunnerProfilesService } from './runner-Profiles.service';

const upsertProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await RunnerProfilesService.upsertProfile(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Runner profile updated successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await RunnerProfilesService.getProfile(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const getAllRunners = catchAsync(async (req: Request, res: Response) => {
  const result = await RunnerProfilesService.getAllRunners(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Runners retrieved successfully',
    data: result,
  });
});

const verifyProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { isVerified } = req.body;
  const result = await RunnerProfilesService.verifyProfile(id, isVerified);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Runner verification status updated',
    data: result,
  });
});

export const RunnerProfilesController = {
  upsertProfile,
  getMyProfile,
  getAllRunners,
  verifyProfile,
};
