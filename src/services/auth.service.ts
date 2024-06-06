import { hash, compare } from 'bcrypt';
import Container, { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { TokenObj, TokenType } from '@interfaces/auth.interface';
import { UserModel } from '@models/users.model';
import httpStatus from 'http-status';
import { TokenService } from './token.service';
import { LoginUserDto, RegisterUserDto } from '@/dtos/users.dto';
import { TokenModel } from '@/models/token.model';
import EmailService from './email.service';
import { UserDocument } from '@/interfaces/users.interface';

@Service()
export class AuthService {
  public Token = Container.get(TokenService);
  public Email = Container.get(EmailService);

  public async signup(userData: RegisterUserDto): Promise<{
    tokenData: {
      access: TokenObj;
      refresh: TokenObj;
    };
    user: UserDocument;
  }> {
    const findUser = await UserModel.findOne({ email: userData.email });

    console.log('DDD', findUser, userData);

    if (findUser) throw new HttpException(httpStatus.BAD_REQUEST, 'Email already taken');

    const hashedPassword = await hash(userData.password, 10);

    const createUserData = await UserModel.create({ ...userData, password: hashedPassword });

    const tokenData = await this.Token.generateAuthTokens(createUserData);

    return { tokenData, user: createUserData };
  }

  public async login(userData: LoginUserDto): Promise<{
    tokenData: {
      access: TokenObj;
      refresh: TokenObj;
    };
    user: UserDocument;
  }> {
    const findUser = await UserModel.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);

    if (!isPasswordMatching) throw new HttpException(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

    const tokenData = await this.Token.generateAuthTokens(findUser);

    return { tokenData, user: findUser };
  }

  public async logout(userId: string, refreshToken: string): Promise<void> {
    await TokenModel.remove({ where: { token: refreshToken, type: TokenType.REFRESH, userId } });
  }

  public async refreshAuth(refreshToken: string): Promise<{
    access: TokenObj;
    refresh: TokenObj;
  }> {
    const verifiedToken = await this.Token.verifyToken(refreshToken, TokenType.REFRESH);

    if (!verifiedToken) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const findUser = await UserModel.findById(verifiedToken.user);

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const tokenData = await this.Token.generateAuthTokens(findUser);

    return tokenData;
  }

  public async verifyEmail(token: string): Promise<void> {
    const verifiedToken = await this.Token.verifyToken(token, TokenType.VERIFY_EMAIL);

    if (!verifiedToken) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const findUser = await UserModel.findById(verifiedToken.user);

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    Object.assign(findUser, { isEmailVerified: true });

    await TokenModel.deleteMany({ user: findUser.id, type: TokenType.VERIFY_EMAIL });
    await findUser.save();
  }

  public async resetPassword(token: string, password: string): Promise<void> {
    const verifiedToken = await this.Token.verifyToken(token, TokenType.RESET_PASSWORD);

    if (!verifiedToken) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const findUser = await UserModel.findById(verifiedToken.user);

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const hashedPassword = await hash(password, 10);
    Object.assign(findUser, { password: hashedPassword });
    await findUser.save();
  }

  public async forgotPassword(email: string): Promise<void> {
    const findUser = await UserModel.findOne({ email });

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid email');

    const token = await this.Token.generateResetPasswordToken(findUser.email);
    await this.Email.sendResetPasswordEmail(findUser.email, token);
  }

  public async resendVerificationEmail(email: string): Promise<void> {
    const findUser = await UserModel.findOne({ email });

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid email');

    const token = await this.Token.generateVerifyEmailToken(findUser);

    await this.Email.sendVerificationEmail(findUser.email, token);
  }
}
