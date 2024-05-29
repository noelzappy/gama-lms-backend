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
  expires: number;
  user: string;
  blacklisted: boolean;
  type: TokenType;
}

export interface TokenObj {
  token: string;
  expires: Date;
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
