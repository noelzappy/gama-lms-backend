import { sign, verify } from 'jsonwebtoken';
import Container, { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenObj, TokenType } from '@interfaces/auth.interface';
import { TokenModel } from '@/models/token.model';
import httpStatus from 'http-status';
import { UserService } from './users.service';
import { UserDocument } from '@/interfaces/users.interface';

@Service()
export class TokenService {
  public _users = Container.get(UserService);

  generateToken = ({ expires, userId, type }: { userId: string; type: TokenType; expires?: number }): string => {
    const dataStoredInToken: DataStoredInToken = {
      sub: userId,
      iat: Date.now(),
      exp: expires || Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      type,
    };

    return sign(dataStoredInToken, SECRET_KEY);
  };

  public async saveToken(token: string, userId: string, expires: Date, type: TokenType, blacklisted = false) {
    return TokenModel.create({ token, user: userId, expires, type, blacklisted });
  }

  public async verifyToken(token: string, type: TokenType) {
    const payload = verify(token, SECRET_KEY) as DataStoredInToken;

    const tokenData = await TokenModel.findOne({
      token,
      type,
      user: payload.sub,
      expires: { $gt: new Date() },
      blacklisted: false,
    });

    if (!tokenData) {
      throw new HttpException(httpStatus.UNAUTHORIZED, 'Token not found or expired');
    }

    return tokenData;
  }

  public async generateAuthTokens(user: UserDocument): Promise<{
    access: TokenObj;
    refresh: TokenObj;
  }> {
    const tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const accessToken = this.generateToken({
      userId: user.id,
      type: TokenType.ACCESS,
      expires: tokenExpires.getTime(),
    });
    const refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const refreshToken = this.generateToken({
      userId: user.id,
      type: TokenType.REFRESH,
      expires: refreshTokenExpires.getTime(),
    });

    await this.saveToken(accessToken, user.id, tokenExpires, TokenType.ACCESS);
    await this.saveToken(refreshToken, user.id, refreshTokenExpires, TokenType.REFRESH);

    return {
      access: { token: accessToken, expires: tokenExpires },
      refresh: { token: refreshToken, expires: refreshTokenExpires },
    };
  }

  public async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this._users.findUserByEmail(email);

    if (!user) {
      throw new HttpException(httpStatus.NOT_FOUND, 'User not found');
    }

    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const token = this.generateToken({
      userId: user.id,
      type: TokenType.RESET_PASSWORD,
      expires: expires.getTime(),
    });

    await this.saveToken(token, user.id, expires, TokenType.RESET_PASSWORD);

    return token;
  }

  public async generateVerifyEmailToken(user: UserDocument): Promise<string> {
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const token = this.generateToken({
      userId: user.id,
      type: TokenType.VERIFY_EMAIL,
      expires: expires.getTime(),
    });

    await this.saveToken(token, user.id, expires, TokenType.VERIFY_EMAIL);

    return token;
  }
}
