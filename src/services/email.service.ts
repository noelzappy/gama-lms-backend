import { Service } from 'typedi';
import nodemailer from 'nodemailer';
import { CLIENT_URL, MAIL_FROM, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from '@/config';
import { logger } from '@/utils/logger';

@Service()
export default class EmailService {
  private static instance: EmailService;

  private transporter: nodemailer.Transporter;

  constructor() {
    this.createConnection();
    this.verifyConnection();
  }

  static getInstance() {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  //CREATE A CONNECTION TO THE SMTP SERVER
  async createConnection() {
    this.transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: Number(MAIL_PORT),
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });
  }

  //VERIFY CONNECTION
  async verifyConnection() {
    try {
      await this.transporter.verify();

      logger.info('Email Service Verified');
    } catch (error) {
      logger.error('Error initializing email service');
      logger.error(error);

      // throw error;
    }
  }

  //CREATE TRANSPORTER
  public getTransporter() {
    return this.transporter;
  }

  public async sendEmail(to: string, subject: string, html: string): Promise<void> {
    return this.transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject,
      html,
    });
  }

  public sendVerificationEmail(to: string, token: string): Promise<void> {
    const subject = 'Verify your email';
    const html = `<div xmlns="http://www.w3.org/1999/html">

<H1>Verify your email</H1>

<p>
Thanks for signing up for GAMA LMS. To continue, please verify your email address.
</p>

<a href="${CLIENT_URL}/auth/verify-email?token=${token}">
<button style="background-color: #4CAF50; /* Green */ border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">
Verify Email</a>

</button>
</a>

<p>
If you did not create an account, no further action is required.
</p>

<p>
Regards,
</p>

</div>

`;
    return this.sendEmail(to, subject, html);
  }

  public sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = 'Reset your password';
    const html = `Please click the link below to reset your password: <br/> <a href="${CLIENT_URL}/auth/reset-password?token=${token}">
    <button
    style="background-color: #4CAF50; /* Green */ border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;"
    >Reset Password</button>

    </a>`;
    return this.sendEmail(to, subject, html);
  }
}
