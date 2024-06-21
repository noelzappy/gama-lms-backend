import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import httpStatus from 'http-status';
import { CourseLessonModel } from '@/models/courseLesson.model';
import { CourseLessonDocument } from '@/interfaces/courses.interface';
import { PaginateResult } from '@/models/plugins/paginate.plugin';
import { CreateCourseLessonDto, UpdateCourseLessonDto } from '@/dtos/course.dto';
import { cleanObject } from '@/utils/misc';

@Service()
export class CourseLessonService {
  public async queryCourseLessons(filter: Record<string, any>, options: Record<string, any>): Promise<PaginateResult<CourseLessonDocument>> {
    const courseLessons = await CourseLessonModel.paginate(filter, options);
    return courseLessons;
  }

  public async findCourseLessonById(courseLessonId: string): Promise<CourseLessonDocument> {
    const findCourseLesson = await CourseLessonModel.findOne({ _id: courseLessonId });
    if (!findCourseLesson) throw new HttpException(httpStatus.NOT_FOUND, "CourseLesson doesn't exist");

    return findCourseLesson;
  }

  public async createCourseLesson(courseLessonData: CreateCourseLessonDto): Promise<CourseLessonDocument> {
    const findCourseLesson = await CourseLessonModel.findOne({ name: courseLessonData.name });
    if (findCourseLesson) throw new HttpException(httpStatus.CONFLICT, `This name ${courseLessonData.name} already exists`);

    const createCourseLessonData = await CourseLessonModel.create({ ...courseLessonData });

    return createCourseLessonData;
  }

  public async updateCourseLesson(courseLessonId: string, courseLessonData: UpdateCourseLessonDto): Promise<CourseLessonDocument> {
    const _courseLesson = await CourseLessonModel.findById(courseLessonId);
    if (!_courseLesson) throw new HttpException(httpStatus.NOT_FOUND, "CourseLesson doesn't exist");

    Object.assign(_courseLesson, cleanObject(courseLessonData));
    await _courseLesson.save();
    return _courseLesson;
  }

  public async deleteCourseLesson(courseLessonId: string): Promise<CourseLessonDocument> {
    const deleteCourseLessonById = await CourseLessonModel.findByIdAndDelete(courseLessonId);
    if (!deleteCourseLessonById) throw new HttpException(409, "CourseLesson doesn't exist");

    return deleteCourseLessonById;
  }
}
