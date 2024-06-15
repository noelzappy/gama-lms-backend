import { model, Schema, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { paginate, PaginateOptions, PaginateResult } from './plugins/paginate.plugin';
import { MediaDocument } from '@/interfaces/media.interface';

interface MediaModel extends Model<MediaDocument> {
  paginate(filter: Record<string, any>, options: PaginateOptions): Promise<PaginateResult<MediaDocument>>;
}

const MediaSchema = new Schema<MediaDocument>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    bucket: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

MediaSchema.plugin(paginate);
MediaSchema.plugin(toJSON);

export const MediaModel = model<MediaDocument, MediaModel>('Media', MediaSchema);
