import { Document, Schema } from 'mongoose';

export enum CourseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DRAFT = 'draft',
}

export enum CourseProgress {
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  NOT_STARTED = 'notStarted',
}

export interface CourseDocument extends Document {
  id: string;
  name: string;
  description: string;
  author: Schema.Types.ObjectId;
  image: Schema.Types.ObjectId;
  price: number;
  rating?: number;
  numberOfStudents?: number;
  duration?: string;
  date: Date;
  status: CourseStatus;
  tags: string;
  category: Schema.Types.ObjectId;
}

export interface CourseChapterDocument extends Document {
  id: string;
  name: string;
  course: Schema.Types.ObjectId;
  description: string;
  duration: string;
  order: number;
  media: Schema.Types.ObjectId;
}

export interface CourseLessonDocument extends Document {
  id: string;
  name: string;
  chapter: Schema.Types.ObjectId;
  description?: string;
  duration: string;
  media: Schema.Types.ObjectId;
  content?: string;
  order: number;
}

export interface CourseCategoryDocument extends Document {
  id: string;
  name: string;
  description?: string;
  image: Schema.Types.ObjectId;
}

export enum CoursePurchaseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface CoursePurchaseDocument extends Document {
  id?: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  status: CoursePurchaseStatus;
  date: Date;
  payment: Schema.Types.ObjectId;
  completedAt?: Date;
}
