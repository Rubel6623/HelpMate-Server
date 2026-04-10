import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserBadgesService } from './user-Badges.service';

const awardBadge = catchAsync(async (req: Request, res: Response) => {
  const result = await UserBadgesService.awardBadge(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Badge awarded successfully',
    data: result,
  });
});

const getMyBadges = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await UserBadgesService.getUserBadges(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My badges retrieved successfully',
    data: result,
  });
});

const removeBadge = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await UserBadgesService.removeBadgeFromUser(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Badge removed from user',
    data: null,
  });
});

export const UserBadgesController = {
  awardBadge,
  getMyBadges,
  removeBadge,
};
