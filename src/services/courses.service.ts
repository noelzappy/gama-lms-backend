import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import httpStatus from 'http-status';
import { PaginateResult } from '@/models/plugins/paginate.plugin';
import { CourseDocument, CoursePurchaseDocument, CoursePurchaseStatus } from '@/interfaces/courses.interface';
import { CourseModel } from '@/models/course.model';
import { CreateCourseDto, UpdateCourseDto } from '@/dtos/course.dto';
import { CoursePurchaseModel } from '@/models/coursePurchase.model';
import { Schema } from 'mongoose';

@Service()
export class CourseService {
  public async createCourse(courseData: CreateCourseDto): Promise<CourseDocument> {
    const course = await CourseModel.create(courseData);
    return course;
  }

  public async queryCourses(filter: Record<string, any>, options: Record<string, any>): Promise<PaginateResult<CourseDocument>> {
    const courses = await CourseModel.paginate(filter, options);
    return courses;
  }

  public async getCourseById(courseId: string | Schema.Types.ObjectId): Promise<CourseDocument> {
    const course = await CourseModel.findById(courseId).populate('author image category');
    if (!course) throw new HttpException(httpStatus.NOT_FOUND, 'Course not found');
    return course;
  }

  public async updateCourse(courseId: string, courseData: UpdateCourseDto): Promise<CourseDocument> {
    const course = await CourseModel.findById(courseId);
    if (!course) throw new HttpException(httpStatus.NOT_FOUND, 'Course not found');

    Object.assign(course, courseData);

    await course.save();
    return course;
  }

  public async getCourseByAuthor(authorId: string): Promise<CourseDocument[]> {
    const courses = await CourseModel.find({ author: authorId }).populate('author image category');
    return courses;
  }

  public async buyCourse(purchaseData: CoursePurchaseDocument): Promise<CoursePurchaseDocument> {
    const purchase = await CoursePurchaseModel.create(purchaseData);
    return purchase;
  }

  public async getCoursePurchaseByPayment(paymentId: Schema.Types.ObjectId): Promise<CoursePurchaseDocument> {
    const purchase = await CoursePurchaseModel.findOne({ payment: paymentId }).populate('course payment');
    return purchase;
  }

  public async updateCoursePurchaseStatus(purchaseId: Schema.Types.ObjectId, status: CoursePurchaseStatus): Promise<CoursePurchaseDocument> {
    const purchase = await CoursePurchaseModel.findById(purchaseId);
    if (!purchase) throw new HttpException(httpStatus.NOT_FOUND, 'Course purchase not found');

    purchase.set({
      status,
      completedAt: status === CoursePurchaseStatus.COMPLETED ? new Date() : undefined,
    });
    await purchase.save();

    return purchase;
  }

  public async getCoursePurchaseByCourseId(
    courseId: string | Schema.Types.ObjectId,
    userId: string | Schema.Types.ObjectId,
  ): Promise<CoursePurchaseDocument> {
    const purchase = await CoursePurchaseModel.findOne({
      course: courseId,
      status: CoursePurchaseStatus.COMPLETED,
      user: userId,
    });
    return purchase;
  }
}
