export class Mail {
  from: string;
  to: string;
  subject: string;
  message: string;
  constructor(from: string, to: string, subject: string, message: string) {
    const emailValidator =
      /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
    const toIsValid = new RegExp(emailValidator).test(to);
    const fromIsValid = new RegExp(emailValidator).test(from);

    if (!toIsValid || !fromIsValid) {
      throw new Error('Invalid email address');
    } else {
      this.from = from;
      this.to = to;
      this.subject = subject;
      this.message = message;
    }
  }
}

export type MailerResult = { accepted: boolean; response: string };

export interface IMail {
  send(mail: Mail): Promise<MailerResult>;
}
