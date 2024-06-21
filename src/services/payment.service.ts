import { Service } from 'typedi';
import { PaymentDocument } from '@/interfaces/payment.interface';
import { PaymentModel } from '@/models/payment.model';
import { PaginateResult } from '@/models/plugins/paginate.plugin';
import { Schema } from 'mongoose';
import { cleanObject } from '@/utils/misc';

@Service()
export class PaymentService {
  public async createPayment(paymentData: PaymentDocument): Promise<PaymentDocument> {
    const payment = await PaymentModel.create(paymentData);
    return payment;
  }

  public async queryPayments(filter: Record<string, any>, options: Record<string, any>): Promise<PaginateResult<PaymentDocument>> {
    const payments = await PaymentModel.paginate(filter, options);
    return payments;
  }

  public async getPaymentById(paymentId: string): Promise<PaymentDocument> {
    const payment = await PaymentModel.findById(paymentId);
    return payment;
  }

  public async getPaymentByRef(paymentRef: string): Promise<PaymentDocument> {
    const payment = await PaymentModel.findOne({ paymentRef });
    return payment;
  }

  public async updatePaymentData(paymentId: string | Schema.Types.ObjectId, data: Partial<PaymentDocument>): Promise<PaymentDocument> {
    const payment = await PaymentModel.findById(paymentId);
    if (!payment) {
      return null;
    }
    payment.set(cleanObject(data));
    await payment.save();
    return payment;
  }
}
