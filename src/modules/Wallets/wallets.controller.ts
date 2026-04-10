import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WalletsService } from './wallets.service';

const getMyWallet = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await WalletsService.getMyWallet(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Wallet retrieved successfully',
    data: result,
  });
});

const topUp = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { amount, reference } = req.body;
  const result = await WalletsService.topUp(userId, amount, reference);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Wallet topped up successfully',
    data: result,
  });
});

const withdraw = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { amount } = req.body;
  const result = await WalletsService.withdraw(userId, amount);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Withdrawal successful',
    data: result,
  });
});

export const WalletsController = {
  getMyWallet,
  topUp,
  withdraw,
};
