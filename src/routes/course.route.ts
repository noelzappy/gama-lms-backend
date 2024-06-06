import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CourseController } from '@/controllers/course.constroller';
import { CreateCourseDto, QueryCourses, UpdateCourseDto } from '@/dtos/course.dto';

export class CourseRoute implements Routes {
  public router = Router();
  public course = new CourseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/courses', AuthMiddleware('manageCourses'), ValidationMiddleware(CreateCourseDto), this.course.createCourse);
    this.router.get('/courses', AuthMiddleware(), ValidationMiddleware(QueryCourses, 'query', true), this.course.queryCourses);
    this.router.get('/courses/:id', AuthMiddleware(), this.course.getCourseById);
    this.router.patch('/courses/:id', AuthMiddleware('manageCourses'), ValidationMiddleware(UpdateCourseDto), this.course.updateCourse);
    this.router.get('/courses/author/:authorId', AuthMiddleware(), this.course.getCourseByAuthor);
  }
}
