import { prisma } from "../../lib/prisma";

const getMyTransactions = async (userId: string) => {
  const result = await prisma.transaction.findMany({
    where: {
      wallet: {
        userId
      }
    },
    include: {
      wallet: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

const getTransactionById = async (id: string) => {
  const result = await prisma.transaction.findUniqueOrThrow({
    where: { id },
    include: {
      wallet: true
    }
  });
  return result;
};

const getAllTransactions = async () => {
  const result = await prisma.transaction.findMany({
    include: {
      wallet: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

export const TransactionsService = {
  getMyTransactions,
  getTransactionById,
  getAllTransactions
};
