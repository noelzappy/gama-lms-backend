import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { PaginatedQueryParam } from './misc.dto';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  public url: string;

  @IsString()
  @IsNotEmpty()
  public type: string;

  @IsString()
  @IsNotEmpty()
  public bucket: string;

  @IsString()
  @IsNotEmpty()
  public key: string;

  @IsInt()
  @IsNotEmpty()
  public size: number;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public createdBy: string;

  @IsOptional()
  public deleted?: boolean;
}

export class PaginatedMediaQueryParam extends PaginatedQueryParam {
  @IsString()
  @IsOptional()
  public type: string;
}
