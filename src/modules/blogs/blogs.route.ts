import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BlogController } from './blogs.controller';
import { BlogValidation } from './blogs.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  validateRequest(BlogValidation.createBlogValidationSchema),
  BlogController.createBlog
);

router.get('/', BlogController.getAllBlogs);

router.get('/:id', BlogController.getSingleBlog);

router.get('/slug/:slug', BlogController.getBlogBySlug);

router.patch(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  validateRequest(BlogValidation.updateBlogValidationSchema),
  BlogController.updateBlog
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  BlogController.deleteBlog
);

export const BlogRoutes = router;
