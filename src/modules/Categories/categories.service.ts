import { prisma } from "../../lib/prisma";

const createCategory = async (payload: { name: string; icon?: string; avgDurationMin?: number }) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    where: {
      isActive: true,
    },
  });
  return result;
};

const getSingleCategory = async (id: string) => {
  const result = await prisma.category.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

const updateCategory = async (id: string, payload: { name?: string; icon?: string; avgDurationMin?: number; isActive?: boolean }) => {
  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: { id },
  });
  return result;
};

export const CategoriesService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};