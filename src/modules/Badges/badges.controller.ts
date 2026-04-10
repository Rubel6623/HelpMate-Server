import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BadgesService } from './badges.service';

const createBadge = catchAsync(async (req: Request, res: Response) => {
  const result = await BadgesService.createBadge(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Badge created successfully',
    data: result,
  });
});

const getAllBadges = catchAsync(async (req: Request, res: Response) => {
  const result = await BadgesService.getAllBadges();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Badges retrieved successfully',
    data: result,
  });
});

const deleteBadge = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await BadgesService.deleteBadge(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Badge deleted successfully',
    data: null,
  });
});

export const BadgesController = {
  createBadge,
  getAllBadges,
  deleteBadge,
};
