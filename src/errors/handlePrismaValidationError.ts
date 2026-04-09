import { Prisma } from '../../generated/prisma';
import { ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error.interface';

const handlePrismaValidationError = (
  err: Prisma.PrismaClientValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = (err as any).issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1] as string | number,
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handlePrismaValidationError;
