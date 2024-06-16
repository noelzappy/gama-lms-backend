import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CourseCategoryController } from '@/controllers/courseCategory.controller';
import { CreateCourseCategoryDto, QueryCourseCategories, UpdateCourseCategoryDto } from '@/dtos/course.dto';

export class CourseCategoryRoute implements Routes {
  public router = Router();
  public courseCategory = new CourseCategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/course-categories',
      AuthMiddleware('manageCategories'),
      ValidationMiddleware(CreateCourseCategoryDto),
      this.courseCategory.createCourseCategory,
    );
    this.router.get(
      '/course-categories',
      AuthMiddleware(),
      ValidationMiddleware(QueryCourseCategories, 'query', true),
      this.courseCategory.queryCourseCategories,
    );

    this.router.get('/course-categories/:id', AuthMiddleware(), this.courseCategory.getCourseCategoryById);

    this.router.patch(
      '/course-categories/:id',
      AuthMiddleware('manageCategories'),
      ValidationMiddleware(UpdateCourseCategoryDto),
      this.courseCategory.updateCourseCategory,
    );
  }
}
