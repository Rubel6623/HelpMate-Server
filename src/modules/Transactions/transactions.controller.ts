import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TransactionsService } from './transactions.service';

const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await TransactionsService.getMyTransactions(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transactions retrieved successfully',
    data: result,
  });
});

const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TransactionsService.getTransactionById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transaction retrieved successfully',
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionsService.getAllTransactions();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All transactions retrieved successfully',
    data: result,
  });
});

export const TransactionsController = {
  getMyTransactions,
  getTransactionById,
  getAllTransactions,
};
