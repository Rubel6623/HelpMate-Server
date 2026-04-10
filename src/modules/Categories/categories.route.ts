import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { CategoriesController } from './categories.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  CategoriesController.createCategory
);

router.get('/', CategoriesController.getAllCategories);

router.get('/:id', CategoriesController.getSingleCategory);

router.patch(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  CategoriesController.updateCategory
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  CategoriesController.deleteCategory
);

export const CategoriesRoutes = router;
