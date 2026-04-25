import express from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { ReviewsController } from './reviews.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.RUNNER),
  ReviewsController.createReview
);

router.get(
  '/user/:userId',
  ReviewsController.getReviewsForUser
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  ReviewsController.getAllReviews
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  ReviewsController.deleteReview
);

export const ReviewsRoutes = router;
