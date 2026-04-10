import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      verificationStatus: true,
      createdAt: true
    }
  });
  return result;
};

const getUserById = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      runnerProfile: true,
      wallet: true
    }
  });
  return result;
};

const updateUserStatus = async (id: string, isActive: boolean) => {
  const result = await prisma.user.update({
    where: { id },
    data: { isActive }
  });
  return result;
};

const deleteUser = async (id: string) => {
  const result = await prisma.user.delete({
    where: { id }
  });
  return result;
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser
};