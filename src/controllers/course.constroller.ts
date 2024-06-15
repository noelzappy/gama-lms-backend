import { Response } from 'express';
import { Container } from 'typedi';
import catchAsync from '@/utils/catchAsync';
import { RequestWithUser } from '@/interfaces/auth.interface';
import httpStatus from 'http-status';
import pick from '@/utils/pick';
import { CreateCourseChapterDto, CreateCourseDto, CreateCourseLessonDto, UpdateCourseDto, UpdateCourseLessonDto } from '@/dtos/course.dto';
import { CourseService } from '@/services/courses.service';
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
    options.populate = 'author image';

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
    const chapterData: CreateCourseChapterDto = req.body;

    const newChapter = await this.chapters.createCourseChapter(chapterData);

    res.status(httpStatus.CREATED).json(newChapter);
  });

  public queryCourseChapters = catchAsync(async (req: RequestWithUser, res: Response) => {
    const filter = pick(req.query, ['name', 'course']);
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

  public queryCourseLessons = catchAsync(async (req: RequestWithUser, res: Response) => {
    const chapterId: string = req.params.chapterId;

    const filter = pick(req.query, ['name']);
    filter.chapter = chapterId;

    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const lessons = await this.lesson.queryCourseLessons(filter, options);

    res.status(httpStatus.OK).json(lessons);
  });

  public createCourseLesson = catchAsync(async (req: RequestWithUser, res: Response) => {
    const lessonData: CreateCourseLessonDto = { ...req.body, chapter: req.params.chapterId };
    const newLesson = await this.lesson.createCourseLesson(lessonData);
    res.status(httpStatus.CREATED).json(newLesson);
  });

  public getCourseLessonById = catchAsync(async (req: RequestWithUser, res: Response) => {
    const lessonId: string = req.params.lessonId;
    const lesson = await this.lesson.findCourseLessonById(lessonId);
    res.status(httpStatus.OK).json(lesson);
  });

  public updateCourseLesson = catchAsync(async (req: RequestWithUser, res: Response) => {
    const lessonId: string = req.params.lessonId;
    const lessonData: UpdateCourseLessonDto = req.body;
    const updateLesson = await this.lesson.updateCourseLesson(lessonId, lessonData);
    res.status(httpStatus.OK).json(updateLesson);
  });

  public deleteCourseLesson = catchAsync(async (req: RequestWithUser, res: Response) => {
    const lessonId: string = req.params.lessonId;
    const deleteLesson = await this.lesson.deleteCourseLesson(lessonId);
    res.status(httpStatus.OK).json(deleteLesson);
  });
}
