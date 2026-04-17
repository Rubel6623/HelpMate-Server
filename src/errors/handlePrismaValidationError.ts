import { Prisma } from '../../generated/prisma';
import { ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error.interface';

const handlePrismaValidationError = (
  err: Prisma.PrismaClientValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: '',
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Prisma Validation Error',
    errorSources,
  };
};

export default handlePrismaValidationError;
