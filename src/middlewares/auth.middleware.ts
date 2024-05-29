import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/httpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import httpStatus from 'http-status';
import { User } from '@/interfaces/users.interface';
import passport from 'passport';
import { ROLE_RIGHTS } from '@/config/roles';

const AUTH_ERR_MSG = 'Please authenticate';

const verifyCallback = (req: RequestWithUser, resolve, reject, requiredRights?: string[]) => async (err, user: User, info) => {
  if (err || info || !user) {
    return reject(new HttpException(httpStatus.UNAUTHORIZED, AUTH_ERR_MSG));
  }

  req.user = user;

  if (requiredRights && requiredRights.length && !user.role) {
    return reject(new HttpException(httpStatus.FORBIDDEN, 'Forbidden'));
  }
  if (requiredRights.length) {
    const userRights = ROLE_RIGHTS.get(user.role);
    const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight as any));
    if (!hasRequiredRights && req.params?.userId !== user.id) {
      return reject(new HttpException(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

export const AuthMiddleware = (requiredRights?: string[]) => async (req: RequestWithUser, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch(err => next(err));
};
