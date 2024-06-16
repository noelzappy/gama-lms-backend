import { Response } from 'express';
import { Container } from 'typedi';
import catchAsync from '@/utils/catchAsync';
import { RequestWithUser } from '@/interfaces/auth.interface';
import httpStatus from 'http-status';
import pick from '@/utils/pick';
import { CourseCategoryService } from '@/services/courseCategory.service';
import { CreateCourseCategoryDto, UpdateCourseCategoryDto } from '@/dtos/course.dto';

export class CourseCategoryController {
  public courseCategory = Container.get(CourseCategoryService);

  public createCourseCategory = catchAsync(async (req: RequestWithUser, res: Response) => {
    const courseCategoryData: CreateCourseCategoryDto = req.body;

    const newCourseCategory = await this.courseCategory.createCourseCategory(courseCategoryData);

    res.status(httpStatus.CREATED).json(newCourseCategory);
  });

  public queryCourseCategories = catchAsync(async (req: RequestWithUser, res: Response) => {
    const filter = pick(req.query, ['name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    options.populate = 'image';
    const courseCategories = await this.courseCategory.queryCourseCategories(filter, options);
    res.status(httpStatus.OK).json(courseCategories);
  });

  public getCourseCategoryById = catchAsync(async (req: RequestWithUser, res: Response) => {
    const courseCategoryId: string = req.params.id;

    const courseCategory = await this.courseCategory.getCourseCategoryById(courseCategoryId);

    res.status(httpStatus.OK).json(courseCategory);
  });

  public updateCourseCategory = catchAsync(async (req: RequestWithUser, res: Response) => {
    const courseCategoryId: string = req.params.id;
    const courseCategoryData: UpdateCourseCategoryDto = req.body;

    const updateCourseCategory = await this.courseCategory.updateCourseCategory(courseCategoryId, courseCategoryData);

    res.status(httpStatus.CREATED).json(updateCourseCategory);
  });
}
