import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import httpStatus from 'http-status';
import passport from 'passport';
import { ALL_ROLES, ROLE_RIGHTS } from '@/config/roles';
import { UserDocument } from '@/interfaces/users.interface';

const AUTH_ERR_MSG = 'Please authenticate';

const verifyCallback = (req: RequestWithUser, resolve, reject, requiredRights?: string[]) => async (err, user: UserDocument, info) => {
  if (err || info || !user) {
    return reject(new HttpException(httpStatus.UNAUTHORIZED, AUTH_ERR_MSG));
  }

  req.user = user;

  if (requiredRights && requiredRights.length && !user.role) {
    return reject(new HttpException(httpStatus.FORBIDDEN, 'Forbidden'));
  }
  if (requiredRights && requiredRights.length) {
    const userRights = ROLE_RIGHTS.get(user.role);
    const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight as any));
    if (!hasRequiredRights && req.params?.userId !== user.id) {
      return reject(new HttpException(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const _requiredRights = Object.values(ALL_ROLES)
  .map(role => role)
  .flat()
  .filter((role, index, self) => self.indexOf(role) === index);

type RequiredRights = typeof _requiredRights;

export const AuthMiddleware =
  (...requiredRights: RequiredRights) =>
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch(err => next(err));
  };
