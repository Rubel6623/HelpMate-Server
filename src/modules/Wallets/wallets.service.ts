import { prisma } from "../../lib/prisma";
import { TransactionType, TransactionStatus, TransactionReason } from "../../../generated/prisma/enums";

const getMyWallet = async (userId: string) => {
  const result = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }
    }
  });

  if (!result) {
    // Auto-create wallet if it doesn't exist
    return await prisma.wallet.create({
      data: { userId }
    });
  }
  
  return result;
};

const topUp = async (userId: string, amount: number, reference?: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.update({
      where: { userId },
      data: {
        balance: { increment: amount }
      }
    });

    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: TransactionType.CREDIT,
        status: TransactionStatus.SUCCESS,
        reason: TransactionReason.TOP_UP,
        reference,
        note: 'Wallet top-up'
      }
    });

    return wallet;
  });

  return result;
};

const withdraw = async (userId: string, amount: number) => {
  const wallet = await prisma.wallet.findUniqueOrThrow({
    where: { userId }
  });

  if (Number(wallet.balance) < amount) {
    throw new Error('Insufficient balance');
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedWallet = await tx.wallet.update({
      where: { userId },
      data: {
        balance: { decrement: amount }
      }
    });

    await tx.transaction.create({
      data: {
        walletId: updatedWallet.id,
        amount,
        type: TransactionType.DEBIT,
        status: TransactionStatus.SUCCESS,
        reason: TransactionReason.WITHDRAWAL,
        note: 'Wallet withdrawal'
      }
    });

    return updatedWallet;
  });

  return result;
};

export const WalletsService = {
  getMyWallet,
  topUp,
  withdraw
};