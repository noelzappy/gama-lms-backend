import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CourseController } from '@/controllers/course.constroller';
import {
  BuyCourseDto,
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

    this.router.get('/courses/buy', AuthMiddleware(), ValidationMiddleware(BuyCourseDto), this.course.buyCourse);

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
      AuthMiddleware('manageCourses'),
      ValidationMiddleware(UpdateCourseChapterDto),
      this.course.updateCourseChapter,
    );

    this.router.get('/courses/chapters/:chapterId/lessons', AuthMiddleware(), this.course.queryCourseLessons);

    this.router.post(
      '/courses/chapters/:chapterId/lessons',
      AuthMiddleware('manageCourses'),
      ValidationMiddleware(CreateCourseLessonDto),
      this.course.createCourseLesson,
    );

    this.router.patch(
      '/courses/chapters/:chapterId/lessons/:lessonId',
      AuthMiddleware('manageCourses'),
      ValidationMiddleware(UpdateCourseLessonDto, 'body', true),
      this.course.updateCourseLesson,
    );

    this.router.get('/courses/my', AuthMiddleware('manageCourses'), ValidationMiddleware(QueryCourses, 'query', true), this.course.getMyCourses);

    this.router.get('/courses/:id', AuthMiddleware(), this.course.getCourseById);
    this.router.patch('/courses/:id', AuthMiddleware('manageCourses'), ValidationMiddleware(UpdateCourseDto, 'body', true), this.course.updateCourse);
    this.router.get('/courses/author/:authorId', AuthMiddleware(), this.course.getCourseByAuthor);
  }
}
