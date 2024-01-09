import { BadRequestException, Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  SMTP_PASSWORD,
  SMTP_SECURE,
  SMTP_SERVER_ADDRESS,
  SMTP_SERVER_PORT,
  SMTP_USERNAME,
} from 'src/constants';
import { IMail, MailerResult } from '../IMail';
import { Email } from '../entities/mailer.entity';

@Injectable()
export class NodeMailerService implements IMail {
  async send(email: Email): Promise<MailerResult> {
    try {
      const newEmail = new Email(email);
      const options: SMTPTransport.Options = {
        host: SMTP_SERVER_ADDRESS,
        port: SMTP_SERVER_PORT,
        secure: SMTP_SECURE,
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD,
        },
      };
      const transporter = createTransport(options);

      const { response, ...info } = await transporter.sendMail({
        ...newEmail,
        html: newEmail.message,
        text: newEmail.message,
      });

      const accepted = !!info.accepted.length && !info.rejected.length;

      return {
        accepted,
        response: response.startsWith('250 Accepted') ? 'ok' : 'failed',
      };
    } catch (error) {
      if (error.message === 'Invalid email address')
        throw new BadRequestException(error.message);
      throw new Error(error);
    }
  }
}
