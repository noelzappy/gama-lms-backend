import { model, Schema, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { paginate, PaginateOptions, PaginateResult } from './plugins/paginate.plugin';
import { CourseDocument, CourseStatus } from '@interfaces/courses.interface';

interface CourseModel extends Model<CourseDocument> {
  paginate(filter: Record<string, any>, options: PaginateOptions): Promise<PaginateResult<CourseDocument>>;
}

const CourseSchema = new Schema<CourseDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },

    numberOfStudents: {
      type: Number,
      default: 0,
    },

    duration: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.DRAFT,
    },
    tags: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

CourseSchema.plugin(toJSON);
CourseSchema.plugin(paginate);

export const CourseModel = model<CourseDocument, CourseModel>('Course', CourseSchema);
