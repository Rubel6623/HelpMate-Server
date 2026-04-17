import { TaskStatus } from '../../../generated/prisma';

export type TTaskStatusLog = {
  status: TaskStatus;
  note?: string;
  taskId: string;
};
