import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  sub: string;
  iat: number;
  exp: number;
  type: TokenType;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail',
}
