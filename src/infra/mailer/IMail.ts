import { Email } from './entities/mailer.entity';

export type MailerResult = { accepted: boolean; response: string };

export interface IMail {
  send(mail: Email): Promise<MailerResult>;
}
