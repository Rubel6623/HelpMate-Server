import { prisma } from "../../lib/prisma";

const createReview = async (reviewerId: string, payload: any) => {
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        ...payload,
        reviewerId
      }
    });

    // Update the average rating and total tasks done for the Runner if the reviewee is a Runner
    const runnerProfile = await tx.runnerProfile.findUnique({
      where: { userId: payload.revieweeId }
    });

    if (runnerProfile) {
       const allReviews = await tx.review.findMany({
         where: { revieweeId: payload.revieweeId }
       });
       
       const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
       
       await tx.runnerProfile.update({
         where: { userId: payload.revieweeId },
         data: {
           averageRating: avgRating,
           totalTasksDone: { increment: 1 }
         }
       });
    }

    return review;
  });

  return result;
};

const getReviewsForUser = async (userId: string) => {
  const result = await prisma.review.findMany({
    where: { revieweeId: userId },
    include: {
      reviewer: {
        select: {
          name: true,
          avatarUrl: true
        }
      },
      task: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

const getAllReviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      reviewer: true,
      reviewee: true,
      task: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

const deleteReview = async (id: string) => {
  const result = await prisma.review.delete({
    where: { id }
  });
  return result;
};

export const ReviewsService = {
  createReview,
  getReviewsForUser,
  getAllReviews,
  deleteReview
};
