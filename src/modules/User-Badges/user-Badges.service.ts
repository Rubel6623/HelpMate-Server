import { prisma } from "../../lib/prisma";

const awardBadge = async (payload: { userId: string; badgeId: string }) => {
  const result = await prisma.userBadge.create({
    data: payload,
    include: {
      user: true,
      badge: true
    }
  });
  return result;
};

const getUserBadges = async (userId: string) => {
  const result = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true
    }
  });
  return result;
};

const removeBadgeFromUser = async (id: string) => {
  const result = await prisma.userBadge.delete({
    where: { id }
  });
  return result;
};

export const UserBadgesService = {
  awardBadge,
  getUserBadges,
  removeBadgeFromUser
};
