import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import httpStatus from 'http-status';
import { CourseChapterModel } from '@/models/courseChapter.model';
import { CourseChapterDocument } from '@/interfaces/courses.interface';
import { CreateCourseChapterDto, UpdateCourseChapterDto } from '@/dtos/course.dto';
import { PaginateResult } from '@/models/plugins/paginate.plugin';
import { cleanObject } from '@/utils/misc';

@Service()
export class CourseChapterService {
  public async queryCourseChapters(filter: Record<string, any>, options: Record<string, any>): Promise<PaginateResult<CourseChapterDocument>> {
    const courseChapters = await CourseChapterModel.paginate(filter, options);
    return courseChapters;
  }

  public async findCourseChapterById(courseChapterId: string): Promise<CourseChapterDocument> {
    const findCourseChapter = await CourseChapterModel.findById(courseChapterId).populate('course media');
    if (!findCourseChapter) throw new HttpException(httpStatus.NOT_FOUND, "CourseChapter doesn't exist");

    return findCourseChapter;
  }

  public async createCourseChapter(courseChapterData: CreateCourseChapterDto): Promise<CourseChapterDocument> {
    const findCourseChapter = await CourseChapterModel.findOne({ name: courseChapterData.name, course: courseChapterData.course });
    if (findCourseChapter) throw new HttpException(httpStatus.CONFLICT, `This name ${courseChapterData.name} already exists`);

    const createCourseChapterData = await CourseChapterModel.create({ ...courseChapterData });

    return createCourseChapterData;
  }

  public async updateCourseChapter(courseChapterId: string, courseChapterData: UpdateCourseChapterDto): Promise<CourseChapterDocument> {
    const _courseChapter = await CourseChapterModel.findById(courseChapterId);
    if (!_courseChapter) throw new HttpException(httpStatus.NOT_FOUND, "CourseChapter doesn't exist");

    Object.assign(_courseChapter, cleanObject(courseChapterData));
    await _courseChapter.save();
    return _courseChapter;
  }

  public async deleteCourseChapter(courseChapterId: string): Promise<CourseChapterDocument> {
    const deleteCourseChapterById = await CourseChapterModel.findByIdAndDelete(courseChapterId);
    if (!deleteCourseChapterById) throw new HttpException(409, "CourseChapter doesn't exist");

    return deleteCourseChapterById;
  }
}
