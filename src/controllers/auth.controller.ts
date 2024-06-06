import { Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import EmailService from '@/services/email.service';
import { TokenService } from '@/services/token.service';
import catchAsync from '@/utils/catchAsync';
import { ForgotPasswordDto, LoginUserDto, LogoutUserDto, RegisterUserDto, ResetPasswordDto, VerifyEmailDto } from '@/dtos/users.dto';
import httpStatus from 'http-status';

export class AuthController {
  public auth = Container.get(AuthService);
  public email = Container.get(EmailService);
  public token = Container.get(TokenService);

  public signUp = catchAsync(async (req: Request, res: Response) => {
    const userData: RegisterUserDto = req.body;
    const signupData = await this.auth.signup(userData);
    const verifyEmailToken = await this.token.generateVerifyEmailToken(signupData.user);
    this.email.sendVerificationEmail(signupData.user.email, verifyEmailToken);
    res.status(httpStatus.CREATED).send(signupData);
  });

  public logIn = catchAsync(async (req: Request, res: Response) => {
    const userData: LoginUserDto = req.body;
    const loginData = await this.auth.login(userData);
    res.status(httpStatus.OK).send(loginData);
  });

  public logOut = catchAsync(async (req: RequestWithUser, res: Response) => {
    const userData = req.user;
    const body: LogoutUserDto = req.body;
    await this.auth.logout(userData, body.refreshToken);
    res.sendStatus(httpStatus.NO_CONTENT);
  });

  public refreshAuth = catchAsync(async (req: Request, res: Response) => {
    const body: LogoutUserDto = req.body;
    const tokenData = await this.auth.refreshAuth(body.refreshToken);
    res.status(httpStatus.OK).send(tokenData);
  });

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const body: ResetPasswordDto = req.body;
    await this.auth.resetPassword(body.token, body.password);
    res.sendStatus(httpStatus.NO_CONTENT);
  });

  public verifyEmail = catchAsync(async (req: Request, res: Response) => {
    try {
      const body: VerifyEmailDto = req.body;
      await this.auth.verifyEmail(body.token);
      res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      throw new Error('Email verification failed');
    }
  });

  public forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const body: ForgotPasswordDto = req.body;
    await this.auth.forgotPassword(body.email);
    res.sendStatus(httpStatus.NO_CONTENT);
  });

  public sendEmailVerification = catchAsync(async (req: RequestWithUser, res: Response) => {
    const body: ForgotPasswordDto = req.body;
    await this.auth.resendVerificationEmail(body.email);
    res.sendStatus(httpStatus.NO_CONTENT);
  });
}
