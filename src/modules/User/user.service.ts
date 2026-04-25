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

const updateUserStatus = async (id: string, data: { isActive?: boolean, verificationStatus?: string }) => {
  const result = await prisma.user.update({
    where: { id },
    data: {
      isActive: data.isActive,
      verificationStatus: data.verificationStatus as any
    }
  });
  return result;
};

const updateUserRole = async (id: string, role: string) => {
  const result = await prisma.user.update({
    where: { id },
    data: { role: role.toUpperCase() as any }
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
  updateUserRole,
  deleteUser
};
