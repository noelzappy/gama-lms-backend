import { Document, Schema } from 'mongoose';

export interface MediaDocument extends Document {
  url: string;
  type: string;
  size: number;
  bucket: string;
  key: string;
  deleted?: boolean;
  id?: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  name: string;
}
