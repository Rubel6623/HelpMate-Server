import { prisma } from "../../lib/prisma";

const updateProfile = async (userId: string, payload: any) => {
  if (payload.studentId === "" || payload.nationalId === "") {
    throw new Error('Student ID and National ID cannot be empty');
  }

  const result = await prisma.runnerProfile.upsert({
    where: { userId },
    update: payload,
    create: {
      userId,
      ...payload,
      // fallback for mandatory fields if not in payload
      university: payload.university || "Unknown",
      studentId: payload.studentId || "Unknown",
    },
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
  
  const where: any = {
    role: 'RUNNER'
  };

  // If isVerified is provided, we filter based on the runnerProfile's isVerified status
  // Note: if isVerified=false, it will also include those who don't have a profile yet
  
  const result = await prisma.user.findMany({
    where,
    include: {
      runnerProfile: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Client side filtering for isVerified if needed, or refine the prisma query
  let filteredResult = result;
  if (isVerified !== undefined) {
    const isVerifiedBool = isVerified === 'true';
    filteredResult = result.filter(user => {
      if (!user.runnerProfile) return !isVerifiedBool; // If no profile, they are unverified
      return user.runnerProfile.isVerified === isVerifiedBool;
    });
  }

  return filteredResult;
};

const verifyProfile = async (id: string, isVerified: boolean) => {
  try {
    // Try to update by RunnerProfile ID
    return await prisma.runnerProfile.update({
      where: { id },
      data: { 
        isVerified,
        verifiedAt: isVerified ? new Date() : null
      }
    });
  } catch (error) {
    // Fallback: Try to update by User ID if the provided ID was a userId
    return await prisma.runnerProfile.update({
      where: { userId: id },
      data: { 
        isVerified,
        verifiedAt: isVerified ? new Date() : null
      }
    });
  }
};

export const RunnerProfilesService = {
  updateProfile,
  getProfile,
  getAllRunners,
  verifyProfile
};
