import { CourseStatus } from '@/interfaces/courses.interface';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt } from 'class-validator';
import { PaginatedQueryParam } from './misc.dto';
import { Schema } from 'mongoose';

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
  public image: Schema.Types.ObjectId;

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
  public name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public author?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public tags: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public image: Schema.Types.ObjectId;

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

export class CreateCourseChapterDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public course: string;

  @IsString()
  @IsOptional()
  public duration: string;

  @IsInt()
  @IsNotEmpty()
  public order: number;

  @IsString()
  @IsOptional()
  public media: Schema.Types.ObjectId;
}

export class UpdateCourseChapterDto {
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
  public course: string;

  @IsString()
  @IsOptional()
  public duration: string;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  public order: number;
}

export class CreateCourseLessonDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public chapter: Schema.Types.ObjectId;

  @IsString()
  @IsOptional()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public duration: string;

  @IsString()
  @IsNotEmpty()
  public media: Schema.Types.ObjectId;

  @IsString()
  @IsOptional()
  public content: string;

  @IsInt()
  @IsNotEmpty()
  public order: number;
}

export class UpdateCourseLessonDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public chapter: string;

  @IsString()
  @IsOptional()
  public description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public duration: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public media: string;

  @IsString()
  @IsOptional()
  public content: string;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  public order: number;
}

export class QueryCourseChapters extends PaginatedQueryParam {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsNotEmpty()
  public course: string;

  @IsInt()
  @IsOptional()
  public order?: number;
}

export class QueryCourseLessons extends PaginatedQueryParam {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public chapter?: string;

  @IsInt()
  @IsOptional()
  public order?: number;
}

export class CreateCourseCategoryDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsNotEmpty()
  public image: Schema.Types.ObjectId;
}

export class UpdateCourseCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public image?: Schema.Types.ObjectId;
}

export class QueryCourseCategories extends PaginatedQueryParam {
  @IsString()
  @IsOptional()
  public name?: string;
}

export class BuyCourseDto {
  @IsString()
  @IsNotEmpty()
  public courseId: Schema.Types.ObjectId;
}
