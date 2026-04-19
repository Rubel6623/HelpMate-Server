import { Prisma } from '../../generated/prisma';
import {
  TErrorSources,
  TGenericErrorResponse,
} from '../interfaces/error.interface';

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
    message: 'Validation Error',
    errorSources,
  };
};

export default handlePrismaValidationError;

