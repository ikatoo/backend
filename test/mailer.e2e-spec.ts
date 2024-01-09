/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { tokensFactory } from 'src/test-utils/tokens-factory';
import { userFactory } from 'src/test-utils/user-factory';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProjectsController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/ (POST) - success on send email', async () => {
    const createdUser = await userFactory();
    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const mock = {
      from: 'from@email.com',
      to: 'to@email.com',
      subject: 'subject test',
      message: '<p>message</p>',
    };

    const { body, status } = await request(app.getHttpServer())
      .post('/mailer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mock);

    expect(status).toEqual(200);
    expect(body).toEqual({
      accepted: true,
      response: 'ok',
    });
  });

  it('/ (POST) - failed on send email', async () => {
    const createdUser = await userFactory();
    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const mock = {
      from: 'from@email',
      to: 'to@email.com',
      subject: 'subject test',
      message: '<p>message</p>',
    };

    const { body, status } = await request(app.getHttpServer())
      .post('/mailer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mock);

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Invalid email address',
      statusCode: 400,
    });
    expect(status).toEqual(400);
  });
});
