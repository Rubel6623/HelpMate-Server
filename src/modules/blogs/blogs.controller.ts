import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogService } from './blogs.service';
import { blogFilterableFields } from './blogs.constant';
import pick from '../../utils/pick';

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await BlogService.createBlog(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, blogFilterableFields);
  const result = await BlogService.getAllBlogs(filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs retrieved successfully',
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BlogService.getSingleBlog(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await BlogService.getBlogBySlug(slug);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BlogService.updateBlog(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BlogService.deleteBlog(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
