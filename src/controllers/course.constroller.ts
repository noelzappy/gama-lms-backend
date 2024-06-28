import { Response } from 'express';
import { Container } from 'typedi';
import catchAsync from '@/utils/catchAsync';
import { RequestWithUser } from '@/interfaces/auth.interface';
import httpStatus from 'http-status';
import pick from '@/utils/pick';
import {
  BuyCourseDto,
  CreateCourseChapterDto,
  CreateCourseDto,
  CreateCourseLessonDto,
  UpdateCourseDto,
  UpdateCourseLessonDto,
} from '@/dtos/course.dto';
import { CourseService } from '@/services/courses.service';
import { CourseChapterService } from '@/services/courseChapter.service';
import { CourseLessonService } from '@/services/courseLesson.service';
import { PaymentService } from '@/services/payment.service';
import { convertAmountToPesewas, generatePaymentReference } from '@/utils/misc';
import { PaymentDocument, PaymentMethod, PaymentStatus } from '@/interfaces/payment.interface';
import { PAYSTACK_PUBLIC_KEY } from '@/config';

export class CourseController {
  public course = Container.get(CourseService);
  public chapters = Container.get(CourseChapterService);
  public lesson = Container.get(CourseLessonService);
  public payment = Container.get(PaymentService);

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
    options.populate = 'author image category';

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

    if (!filter.course) {
      throw new Error('Course ID is required');
    }

    options.populate = 'course media';

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

    options.populate = 'chapter media';

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

  public getMyCourses = catchAsync(async (req: RequestWithUser, res: Response) => {
    const authorId: string = req.user.id;

    const filter = pick(req.query, ['name']);
    filter.author = authorId;
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    options.populate = 'author image category';

    const courses = await this.course.queryCourses(filter, options);

    res.status(httpStatus.OK).json(courses);
  });

  public buyCourse = catchAsync(async (req: RequestWithUser, res: Response) => {
    const { user } = req;

    const buyCourseData: BuyCourseDto = req.body;
    const course = await this.course.getCourseById(buyCourseData.courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    const alreadyPurchased = await this.course.getCoursePurchaseByCourseId(course.id, user.id);

    if (alreadyPurchased) {
      throw new Error('You have already purchased this course');
    }

    const ref = generatePaymentReference(course.id, req.user.id, course.price);

    const paymentData: Partial<PaymentDocument> = {
      amount: course.price,
      status: PaymentStatus.PENDING,
      createdBy: req.user.id as any,
      paymentMethod: PaymentMethod.PAYSTACK,
      paymentRef: ref,
      amountPaid: 0,
    };

    const payment = await this.payment.createPayment(paymentData as PaymentDocument);

    const coursePurchaseData = {
      course: course.id,
      user: req.user.id,
      payment: payment.id,
    };

    const purchase = await this.course.buyCourse(coursePurchaseData as any);

    res.status(httpStatus.OK).json({
      reference: ref,
      amount: convertAmountToPesewas(course.price),
      email: user.email,
      publicKey: PAYSTACK_PUBLIC_KEY,
      text: 'Pay Now',
      metadata: {
        name: user.firstName + ' ' + user.lastName,
        courseId: course.id,
        userId: user.id,
        paymentId: payment.id,
        purchaseId: purchase.id,
      },
      currency: 'GHS',
    });
  });
}
