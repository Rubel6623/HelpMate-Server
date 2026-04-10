import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../../generated/prisma/enums';
import { prisma } from '../lib/prisma';

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error('You are not authorized!');
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET?.trim() as string,
      ) as JwtPayload;

      const { id, role } = decoded;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error('This user is not found!');
      }

      if (user.isActive === false) {
        throw new Error('This user is blocked!');
      }

      if (roles.length && !roles.includes(role)) {
        throw new Error('You are not authorized');
      }

      (req as any).user = decoded;
      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Unauthorized',
      });
    }
  };
};

export default auth;
export { UserRole };
