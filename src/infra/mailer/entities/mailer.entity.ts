export class Email {
  from: string;
  to: string;
  subject: string;
  message: string;
  constructor(email: Email) {
    const emailValidator =
      /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
    const toIsValid = new RegExp(emailValidator).test(email.to);
    const fromIsValid = new RegExp(emailValidator).test(email.from);

    if (!toIsValid || !fromIsValid) {
      throw new Error('Invalid email address');
    } else {
      this.from = email.from;
      this.to = email.to;
      this.subject = email.subject;
      this.message = email.message;
    }
  }
}
