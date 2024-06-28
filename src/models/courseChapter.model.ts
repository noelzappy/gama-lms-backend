import { model, Schema, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { paginate, PaginateOptions, PaginateResult } from './plugins/paginate.plugin';
import { CourseChapterDocument } from '@/interfaces/courses.interface';

interface CourseModel extends Model<CourseChapterDocument> {
  paginate(filter: Record<string, any>, options: PaginateOptions): Promise<PaginateResult<CourseChapterDocument>>;
}

const CourseChapterSchema = new Schema<CourseChapterDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    media: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

CourseChapterSchema.plugin(paginate);
CourseChapterSchema.plugin(toJSON);

export const CourseChapterModel = model<CourseChapterDocument, CourseModel>('CourseChapter', CourseChapterSchema);
