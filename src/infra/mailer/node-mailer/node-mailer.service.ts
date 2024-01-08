import { Injectable } from '@nestjs/common';
import { IMail, Mail, MailerResult } from '../IMail';
import {
  SMTP_SERVER_ADDRESS,
  SMTP_SERVER_PORT,
  SMTP_SECURE,
  SMTP_USERNAME,
  SMTP_PASSWORD,
} from 'src/constants';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class NodeMailerService implements IMail {
  async send(mail: Mail): Promise<MailerResult> {
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

    const { response, ...info } = await transporter.sendMail(mail);

    const accepted = !!info.accepted.length && !info.rejected.length;

    return { accepted, response };
  }
}
