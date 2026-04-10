import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoriesService } from './categories.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoriesService.createCategory(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoriesService.getAllCategories();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CategoriesService.getSingleCategory(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CategoriesService.updateCategory(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await CategoriesService.deleteCategory(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category deleted successfully',
    data: null,
  });
});

export const CategoriesController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
