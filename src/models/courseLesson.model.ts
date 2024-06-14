import { model, Schema, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { paginate, PaginateOptions, PaginateResult } from './plugins/paginate.plugin';
import { CourseLessonDocument } from '@/interfaces/courses.interface';

interface CourseModel extends Model<CourseLessonDocument> {
  paginate(filter: Record<string, any>, options: PaginateOptions): Promise<PaginateResult<CourseLessonDocument>>;
}

const CourseLessonSchema = new Schema<CourseLessonDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    chapter: {
      type: Schema.Types.ObjectId,
      ref: 'CourseChapter',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      required: true,
    },
    media: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Media',
    },
    content: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

CourseLessonSchema.plugin(paginate);
CourseLessonSchema.plugin(toJSON);

export const CourseLessonModel = model<CourseLessonDocument, CourseModel>('CourseLesson', CourseLessonSchema);
