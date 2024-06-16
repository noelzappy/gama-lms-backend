import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import httpStatus from 'http-status';
import { PaginateResult } from '@/models/plugins/paginate.plugin';
import CourseCategoryModel from '@/models/courseCategory.model';
import { CreateCourseCategoryDto, UpdateCourseCategoryDto } from '@/dtos/course.dto';
import { CourseCategoryDocument } from '@/interfaces/courses.interface';

@Service()
export class CourseCategoryService {
  public async createCourseCategory(courseCategoryData: CreateCourseCategoryDto): Promise<CourseCategoryDocument> {
    const courseCategory = await CourseCategoryModel.create(courseCategoryData);
    return courseCategory;
  }

  public async queryCourseCategories(filter: Record<string, any>, options: Record<string, any>): Promise<PaginateResult<CourseCategoryDocument>> {
    const courseCategories = await CourseCategoryModel.paginate(filter, options);
    return courseCategories;
  }

  public async getCourseCategoryById(courseCategoryId: string): Promise<CourseCategoryDocument> {
    const courseCategory = await CourseCategoryModel.findById(courseCategoryId).populate('image');
    if (!courseCategory) throw new HttpException(httpStatus.NOT_FOUND, 'Course category not found');
    return courseCategory;
  }

  public async updateCourseCategory(courseCategoryId: string, courseCategoryData: UpdateCourseCategoryDto): Promise<CourseCategoryDocument> {
    const courseCategory = await CourseCategoryModel.findById(courseCategoryId);
    if (!courseCategory) throw new HttpException(httpStatus.NOT_FOUND, 'Course category not found');

    courseCategory.set(courseCategoryData);
    await courseCategory.save();
    return courseCategory;
  }
}
