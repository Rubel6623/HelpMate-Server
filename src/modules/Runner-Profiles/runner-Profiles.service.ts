import { prisma } from "../../lib/prisma";

const updateProfile = async (userId: string, payload: any) => {
  const result = await prisma.runnerProfile.update({
    where: { userId },
    data: payload,
  });
  return result;
};

const getProfile = async (userId: string) => {
  const result = await prisma.runnerProfile.findUniqueOrThrow({
    where: { userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          avatarUrl: true
        }
      }
    }
  });
  return result;
};

const getAllRunners = async (query: any) => {
  const { isVerified } = query;
  const where: any = {};
  if (isVerified !== undefined) where.isVerified = isVerified === 'true';

  const result = await prisma.runnerProfile.findMany({
    where,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      }
    }
  });
  return result;
};

const verifyProfile = async (id: string, isVerified: boolean) => {
  const result = await prisma.runnerProfile.update({
    where: { id },
    data: { 
      isVerified,
      verifiedAt: isVerified ? new Date() : null
    }
  });
  return result;
};

export const RunnerProfilesService = {
  updateProfile,
  getProfile,
  getAllRunners,
  verifyProfile
};