import { model, Schema, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { paginate, PaginateOptions, PaginateResult } from './plugins/paginate.plugin';
import { PaymentDocument, PaymentMethod, PaymentStatus } from '@/interfaces/payment.interface';

interface IPaymentModel extends Model<PaymentDocument> {
  paginate(filter: Record<string, any>, options: PaginateOptions): Promise<PaginateResult<PaymentDocument>>;
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'GHS',
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    paymentRef: {
      type: String,
      required: true,
      unique: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    transactionId: {
      type: String,
      default: '',
    },
    amountPaid: {
      type: Number,
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

PaymentSchema.plugin(paginate);
PaymentSchema.plugin(toJSON);

export const PaymentModel = model<PaymentDocument, IPaymentModel>('Payment', PaymentSchema);
