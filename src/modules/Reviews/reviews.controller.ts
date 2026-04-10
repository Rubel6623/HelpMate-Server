import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewsService } from './reviews.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const reviewerId = (req as any).user.id;
  const result = await ReviewsService.createReview(reviewerId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getReviewsForUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const result = await ReviewsService.getReviewsForUser(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

export const ReviewsController = {
  createReview,
  getReviewsForUser,
};
