import { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  PAYSTACK = 'paystack',
}

export interface PaymentDocument extends Document {
  amount: number;
  amountPaid: number;
  currency: string;
  status: PaymentStatus;
  id?: Schema.Types.ObjectId;
  date: Date;
  createdBy: Schema.Types.ObjectId;
  paymentMethod: string;
  paymentRef: string;
  metadata: any;
  transactionId: string;
  completedAt?: Date;
}
