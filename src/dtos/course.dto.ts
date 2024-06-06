import { CourseStatus } from '@/interfaces/courses.interface';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public author: string;

  @IsString()
  @IsOptional()
  public tags: string;

  @IsString()
  @IsNotEmpty()
  public image: string;

  @IsNotEmpty()
  @IsInt()
  public price: number;

  @IsOptional()
  public rating: number;

  @IsOptional()
  public numberOfStudents: number;

  @IsOptional()
  public duration: string;

  @IsOptional()
  public date: Date;

  @IsOptional()
  @IsEnum(Object.values(CourseStatus))
  public status: CourseStatus;
}

export class UpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public author: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public tags: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public image: string;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  public price: number;

  @IsOptional()
  public rating: number;

  @IsOptional()
  public numberOfStudents: number;

  @IsOptional()
  public duration: string;

  @IsOptional()
  public date: Date;

  @IsOptional()
  @IsEnum(Object.values(CourseStatus))
  public status: CourseStatus;
}

export class QueryCourses {
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public author: string;

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
