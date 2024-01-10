import { Test, TestingModule } from '@nestjs/testing';
import { NodeMailerService } from './node-mailer.service';
import nodemailer from 'nodemailer';

describe('NodeMailerService', () => {
  let mailerService: NodeMailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodeMailerService],
    }).compile();

    mailerService = module.get<NodeMailerService>(NodeMailerService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(mailerService).toBeDefined();
  });

  test('should sucess on send email', async () => {
    const mock = {
      from: 'from@email.com',
      to: 'to@email.com',
      subject: 'subject test',
      message: '<p>message</p>',
    };

    jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
      sendMail: jest.fn().mockResolvedValueOnce({
        response: '250 Accepted',
        envelope: {},
        messageId: 'messageID',
        accepted: 'accepted',
        rejected: '',
        pending: 'pending',
      }),
    } as any);

    const { accepted, response } = await mailerService.send(mock);

    expect(accepted).toBeTruthy();
    expect(response).toEqual('250 Accepted');
  });

  test('should fail on send mail with invalid email address', async () => {
    nodemailer.createTransport = jest.fn().mockResolvedValue({
      sendMail: jest.fn().mockResolvedValue({}),
    });

    await expect(
      mailerService.send({
        from: 'from@email.com',
        to: 'to@invalid-email',
        subject: 'subject test',
        message: '<p>message</p>',
      }),
    ).rejects.toThrowError('Invalid email address');
  });

  test('should fail on send mail with unknown error', async () => {
    nodemailer.createTransport = jest.fn().mockResolvedValue({
      sendMail: jest.fn().mockRejectedValue({}),
    });

    await expect(
      mailerService.send({
        from: 'from@email.com',
        to: 'to@email.com',
        subject: 'subject test',
        message: '<p>message</p>',
      }),
    ).rejects.toThrowError();
  });
});
