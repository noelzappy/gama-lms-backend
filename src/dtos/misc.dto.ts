import { IsString, IsOptional } from 'class-validator';

export class PaginatedQueryParam {
  @IsString()
  @IsOptional()
  public search: string;

  @IsString()
  @IsOptional()
  public sortBy: string;

  @IsString()
  @IsOptional()
  public limit: string;

  @IsString()
  @IsOptional()
  public page: string;
}
