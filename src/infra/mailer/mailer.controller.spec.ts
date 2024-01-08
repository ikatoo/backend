import { MailerController } from './mailer.controller';
import { NodeMailerService } from './node-mailer/node-mailer.service';

describe('MailerController', () => {
  let mailController: MailerController;
  let mailService: NodeMailerService;

  beforeEach(async () => {
    mailService = new NodeMailerService();
    mailController = new MailerController(mailService);
  });

  it('should be defined', () => {
    expect(mailController).toBeDefined();
  });

  it('should be send email with success', async () => {
    jest.spyOn(mailService, 'send').mockResolvedValue({
      accepted: true,
      response: 'ok',
    });
    const mock = {
      from: 'from@email.com',
      to: 'to@email.com',
      subject: 'subject test',
      message: '<p>message</p>',
    };

    const { accepted, response } = await mailController.send(mock);

    expect(response).toBe('ok');
    expect(accepted).toBe(true);
  });

  it('should be fail on send email when invalid destination email address', async () => {
    const mock = {
      from: 'from@email.com',
      to: 'toemail.com',
      subject: 'subject test',
      message: '<p>message</p>',
    };

    await expect(mailController.send(mock)).rejects.toThrowError(
      'Invalid email address',
    );
  });

  it('should be fail on send email when invalid sender email address', async () => {
    const mock = {
      from: 'from@emailcom',
      to: 'to@email.com',
      subject: 'subject test',
      message: '<p>message</p>',
    };

    await expect(mailController.send(mock)).rejects.toThrowError(
      'Invalid email address',
    );
  });
});
