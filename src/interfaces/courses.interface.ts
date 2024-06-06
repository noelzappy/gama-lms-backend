import { Document, Schema } from 'mongoose';

export enum CourseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DRAFT = 'draft',
}

export interface CourseDocument extends Document {
  id: string;
  name: string;
  description: string;
  author: Schema.Types.ObjectId;
  image: string;
  price: number;
  rating?: number;
  numberOfStudents?: number;
  duration?: string;
  date: Date;
  status: CourseStatus;
  tags: string;
}
