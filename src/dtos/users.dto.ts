import { Role } from '@/config/roles';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsOptional()
  public role: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public country: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public phoneNumber: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class RegisterUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  public phoneNumber: string;

  @IsString()
  @IsOptional()
  @IsEnum(Object.values(Role))
  public role: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}

export class LogoutUserDto {
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  public token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  public token: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  public email: string;
}
