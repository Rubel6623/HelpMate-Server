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

export const ReviewsRoutes = router;
