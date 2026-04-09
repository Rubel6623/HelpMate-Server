import { Prisma } from '../../generated/prisma';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error.interface';

const handlePrismaClientKnownRequestError = (
  err: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  let errorSources: TErrorSources = [];
  let message = 'Known Request Error';
  let statusCode = 400;

  if (err.code === 'P2002') {
    const field = (err.meta?.target as string[])?.join(', ') || 'field';
    message = `Duplicate value for ${field}`;
    errorSources = [
      {
        path: '',
        message: `${field} already exists`,
      },
    ];
  } else if (err.code === 'P2025') {
    message = 'Record not found';
    statusCode = 404;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else {
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaClientKnownRequestError;
