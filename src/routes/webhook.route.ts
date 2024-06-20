import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { PaymentController } from '@/controllers/payment.controller';

export class WebhookRoute implements Routes {
  public router = Router();
  public payment = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/hooks/paystack', this.payment.paystackWebhook);
  }
}
