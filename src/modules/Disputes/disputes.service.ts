import { prisma } from "../../lib/prisma";
import { DisputeStatus } from "../../../generated/prisma";

const raiseDispute = async (raisedById: string, payload: any) => {
  const result = await prisma.dispute.create({
    data: {
      ...payload,
      raisedById
    }
  });
  return result;
};

const getAllDisputes = async () => {
  const result = await prisma.dispute.findMany({
    include: {
      task: true,
      raisedBy: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

const resolveDispute = async (id: string, payload: { status: DisputeStatus; adminNotes: string }) => {
  const result = await prisma.dispute.update({
    where: { id },
    data: {
      ...payload,
      resolvedAt: new Date()
    }
  });
  return result;
};

export const DisputesService = {
  raiseDispute,
  getAllDisputes,
  resolveDispute
};
