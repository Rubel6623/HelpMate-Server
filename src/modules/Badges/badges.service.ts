import { prisma } from "../../lib/prisma";

const createBadge = async (payload: { type: any; label: string; description: string; iconUrl?: string }) => {
  const result = await prisma.badge.create({
    data: payload
  });
  return result;
};

const getAllBadges = async () => {
  const result = await prisma.badge.findMany();
  return result;
};

const deleteBadge = async (id: string) => {
  const result = await prisma.badge.delete({
    where: { id }
  });
  return result;
};

export const BadgesService = {
  createBadge,
  getAllBadges,
  deleteBadge
};