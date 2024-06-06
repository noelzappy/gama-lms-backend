import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import httpStatus from 'http-status';
import { CourseDocument } from '@/interfaces/courses.interface';
import { CourseModel } from '@/models/course.model';
import { PaginateResult } from '@/models/plugins/paginate.plugin';
import { CreateCourseDto, UpdateCourseDto } from '@/dtos/course.dto';

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

  public async getCourseById(courseId: string): Promise<CourseDocument> {
    const course = await CourseModel.findById(courseId);
    if (!course) throw new HttpException(httpStatus.NOT_FOUND, 'Course not found');
    return course;
  }

  public async updateCourse(courseId: string, courseData: UpdateCourseDto): Promise<CourseDocument> {
    const course = await CourseModel.findById(courseId);
    if (!course) throw new HttpException(httpStatus.NOT_FOUND, 'Course not found');

    course.set(courseData);
    await course.save();
    return course;
  }

  public async getCourseByAuthor(authorId: string): Promise<CourseDocument[]> {
    const courses = await CourseModel.find({ author: authorId });
    return courses;
  }
}
