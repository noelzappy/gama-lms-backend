import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CourseController } from '@/controllers/course.constroller';
import {
  CreateCourseChapterDto,
  CreateCourseDto,
  CreateCourseLessonDto,
  QueryCourseChapters,
  QueryCourses,
  UpdateCourseChapterDto,
  UpdateCourseDto,
  UpdateCourseLessonDto,
} from '@/dtos/course.dto';

export class CourseRoute implements Routes {
  public router = Router();
  public course = new CourseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/courses', AuthMiddleware('manageCourses'), ValidationMiddleware(CreateCourseDto), this.course.createCourse);
    this.router.get('/courses', AuthMiddleware(), ValidationMiddleware(QueryCourses, 'query', true), this.course.queryCourses);

    this.router.get('/courses/chapters', AuthMiddleware(), ValidationMiddleware(QueryCourseChapters, 'query', true), this.course.queryCourseChapters);
    this.router.post(
      '/courses/chapters',
      AuthMiddleware('manageCourses'),
      ValidationMiddleware(CreateCourseChapterDto),
      this.course.createCourseChapter,
    );

    this.router.get('/courses/chapters/:chapterId', AuthMiddleware(), this.course.getCourseChapterById);

    this.router.patch(
      '/courses/chapters/:chapterId',
      AuthMiddleware(),
      ValidationMiddleware(UpdateCourseChapterDto),
      this.course.updateCourseChapter,
    );

    this.router.get('/courses/chapters/:chapterId/lessons', AuthMiddleware(), this.course.queryCourseLessons);

    this.router.post(
      '/courses/chapters/:chapterId/lessons',
      AuthMiddleware(),
      ValidationMiddleware(CreateCourseLessonDto),
      this.course.createCourseLesson,
    );

    this.router.patch(
      '/courses/chapters/:chapterId/lessons/:lessonId',
      AuthMiddleware(),
      ValidationMiddleware(UpdateCourseLessonDto, 'body', true),
      this.course.updateCourseLesson,
    );

    this.router.get('/courses/:id', AuthMiddleware(), this.course.getCourseById);
    this.router.patch('/courses/:id', AuthMiddleware('manageCourses'), ValidationMiddleware(UpdateCourseDto), this.course.updateCourse);
    this.router.get('/courses/author/:authorId', AuthMiddleware(), this.course.getCourseByAuthor);
  }
}
