import { model, Schema, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { paginate, PaginateOptions, PaginateResult } from './plugins/paginate.plugin';
import { CoursePurchaseDocument, CoursePurchaseStatus } from '@/interfaces/courses.interface';

interface CoursePurchaseModel extends Model<CoursePurchaseDocument> {
  paginate(filter: Record<string, any>, options: PaginateOptions): Promise<PaginateResult<CoursePurchaseDocument>>;
}

const CoursePurchaseSchema = new Schema<CoursePurchaseDocument>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CoursePurchaseStatus),
      default: CoursePurchaseStatus.PENDING,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

CoursePurchaseSchema.plugin(paginate);
CoursePurchaseSchema.plugin(toJSON);

export const CoursePurchaseModel = model<CoursePurchaseDocument, CoursePurchaseModel>('CoursePurchase', CoursePurchaseSchema);
