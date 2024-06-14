import { Response } from 'express';
import { Container } from 'typedi';
import catchAsync from '@/utils/catchAsync';
import { RequestWithUser } from '@/interfaces/auth.interface';
import httpStatus from 'http-status';
import { CreateCourseChapterDto, CreateCourseDto, UpdateCourseDto } from '@/dtos/course.dto';
import { CourseService } from '@/services/courses.service';
import pick from '@/utils/pick';
import { CourseChapterService } from '@/services/courseChapter.service';
import { CourseLessonService } from '@/services/courseLesson.service';

export class CourseController {
  public course = Container.get(CourseService);
  public chapters = Container.get(CourseChapterService);
  public lesson = Container.get(CourseLessonService);

  public createCourse = catchAsync(async (req: RequestWithUser, res: Response) => {
    const courseData: CreateCourseDto = {
      ...req.body,
      author: req.user.id,
    };

    const newCourse = await this.course.createCourse(courseData);

    res.status(httpStatus.CREATED).json(newCourse);
  });

  public queryCourses = catchAsync(async (req: RequestWithUser, res: Response) => {
    const filter = pick(req.query, ['name', 'author']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    options.populate = 'author';

    const courses = await this.course.queryCourses(filter, options);

    res.status(httpStatus.OK).json(courses);
  });

  public getCourseById = catchAsync(async (req: RequestWithUser, res: Response) => {
    const courseId: string = req.params.id;

    const course = await this.course.getCourseById(courseId);

    res.status(httpStatus.OK).json(course);
  });

  public updateCourse = catchAsync(async (req: RequestWithUser, res: Response) => {
    const courseId: string = req.params.id;
    const courseData: UpdateCourseDto = req.body;

    const updateCourse = await this.course.updateCourse(courseId, courseData);

    res.status(httpStatus.OK).json(updateCourse);
  });

  public getCourseByAuthor = catchAsync(async (req: RequestWithUser, res: Response) => {
    const authorId: string = req.params.authorId;

    const courses = await this.course.getCourseByAuthor(authorId);

    res.status(httpStatus.OK).json(courses);
  });

  public createCourseChapter = catchAsync(async (req: RequestWithUser, res: Response) => {
    const courseId: string = req.params.courseId;
    const chapterData: CreateCourseChapterDto = req.body;

    const newChapter = await this.chapters.createCourseChapter({ ...chapterData, course: courseId });

    res.status(httpStatus.CREATED).json(newChapter);
  });

  public queryCourseChapters = catchAsync(async (req: RequestWithUser, res: Response) => {
    const courseId: string = req.params.courseId;

    const filter = pick(req.query, ['name']);
    filter.course = courseId;
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const chapters = await this.chapters.queryCourseChapters(filter, options);

    res.status(httpStatus.OK).json(chapters);
  });

  public getCourseChapterById = catchAsync(async (req: RequestWithUser, res: Response) => {
    const chapterId: string = req.params.chapterId;

    const chapter = await this.chapters.findCourseChapterById(chapterId);

    res.status(httpStatus.OK).json(chapter);
  });

  public updateCourseChapter = catchAsync(async (req: RequestWithUser, res: Response) => {
    const chapterId: string = req.params.chapterId;
    const chapterData: CreateCourseChapterDto = req.body;

    const updateChapter = await this.chapters.updateCourseChapter(chapterId, chapterData);

    res.status(httpStatus.OK).json(updateChapter);
  });
}
