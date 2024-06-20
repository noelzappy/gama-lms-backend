import { Request, Response } from 'express';
import { Container } from 'typedi';
import catchAsync from '@/utils/catchAsync';
import { RequestWithUser } from '@/interfaces/auth.interface';
import httpStatus from 'http-status';
import pick from '@/utils/pick';
import { PaymentService } from '@/services/payment.service';
import { CourseService } from '@/services/courses.service';
import axios from 'axios';
import { PAYSTACK_SECRET_KEY } from '@/config';
import { HttpException } from '@/exceptions/HttpException';
import { CoursePurchaseStatus } from '@/interfaces/courses.interface';
import { PaymentStatus } from '@/interfaces/payment.interface';

export class PaymentController {
  public payment = Container.get(PaymentService);
  public course = Container.get(CourseService);

  public queryPayments = catchAsync(async (req: RequestWithUser, res: Response) => {
    const filter = pick(req.query, ['status', 'paymentMethod']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const payments = await this.payment.queryPayments(filter, options);

    res.status(httpStatus.OK).json(payments);
  });

  public getPaymentById = catchAsync(async (req: RequestWithUser, res: Response) => {
    const paymentId: string = req.params.id;

    const payment = await this.payment.getPaymentById(paymentId);

    res.status(httpStatus.OK).json(payment);
  });

  public paystackWebhook = catchAsync(async (req: Request, res: Response) => {
    const reference = req.body?.data?.reference || '';
    const { data } = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const paymentData = data?.data;

    if (paymentData.status !== 'success' || paymentData.reference !== reference) {
      throw new HttpException(httpStatus.BAD_REQUEST, 'Payment failed');
    }

    const payment = await this.payment.getPaymentByRef(reference);
    if (!payment) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Payment failed');
    }

    const purchase = await this.course.getCoursePurchaseByPayment(payment.id);

    await this.course.updateCoursePurchaseStatus(purchase.id, CoursePurchaseStatus.COMPLETED);

    const _paymentData = {
      status: PaymentStatus.SUCCESS,
      completedAt: new Date(),
      metadata: data.data,
      transactionId: paymentData.id,
      amountPaid: paymentData.amount,
    };
    await this.payment.updatePaymentData(payment.id, _paymentData);

    res.status(httpStatus.OK).json({ message: 'Payment successful' });
  });
}
