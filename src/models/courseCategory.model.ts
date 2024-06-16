import { model, Schema, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { paginate, PaginateOptions, PaginateResult } from './plugins/paginate.plugin';
import { CourseCategoryDocument } from '@/interfaces/courses.interface';

interface CourseCategoryModel extends Model<CourseCategoryDocument> {
  paginate(filter: Record<string, any>, options: PaginateOptions): Promise<PaginateResult<CourseCategoryDocument>>;
}

const CourseCategorySchema = new Schema<CourseCategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

CourseCategorySchema.plugin(toJSON);
CourseCategorySchema.plugin(paginate);

const CourseCategoryModel = model<CourseCategoryDocument, CourseCategoryModel>('CourseCategory', CourseCategorySchema);

export default CourseCategoryModel;
