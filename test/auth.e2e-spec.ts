/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { advanceBy, clear } from 'jest-date-mock';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { tokensFactory } from 'src/test-utils/tokens-factory';
import { userFactory } from 'src/test-utils/user-factory';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('/auth (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  const { compareHash } = new CryptoService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  afterEach(() => {
    clear();
  });

  it('/sign-in (POST) - success', async () => {
    const createdUser = await userFactory();

    const { body, status } = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: createdUser.email,
        password: createdUser.password,
      });
    const expected = {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
    };

    expect(body).toEqual(expected);
    expect(status).toEqual(200);
  });

  it('/sign-in (POST) - fail - user not found', async () => {
    const { body, status } = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'fail@email.com',
        password: 'fail',
      });

    expect(body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
    expect(status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('/sign-in (POST) - fail - invalid email', async () => {
    const createdUser = await userFactory();

    const { body, status } = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'invalid@email.com',
        password: createdUser.password,
      });

    expect(body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
    expect(status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('/sign-in (POST) - fail - incorrect password', async () => {
    const createdUser = await userFactory();

    const { body, status } = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: createdUser.email,
        password: 'incorrect',
      });

    expect(body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
    expect(status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('/verify-token (POST) - success', async () => {
    const createdUser = await userFactory();

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .post('/auth/verify-token')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(body).toEqual({
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
    });
    expect(status).toEqual(HttpStatus.OK);
  });

  it('/verify-token (POST) - fail', async () => {
    const { body, status } = await request(app.getHttpServer())
      .post('/auth/verify-token')
      .set('Authorization', 'Bearer invalid-token');

    expect(status).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('/verify-token (POST) - fail after expiration', async () => {
    const createdUser = await userFactory();
    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );

    advanceBy(1000 * 60 * 60 * 2);

    const { body, status } = await request(app.getHttpServer())
      .post('/auth/verify-token')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('/refresh-token (POST) - failed when trying renew without refreshToken', async () => {
    const { body, status } = await request(app.getHttpServer()).post(
      '/auth/refresh-token',
    );

    expect(status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('/refresh-token (POST) - failed when trying renew with accessToken', async () => {
    const createdUser = await userFactory();
    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );

    advanceBy(1000 * 60 * 60 * 2);

    const { body, status } = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('/refresh-token (POST) - success with new expiration', async () => {
    const createdUser = await userFactory();
    const { refreshToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );

    advanceBy(1000 * 60 * 60 * 2);

    const { body, status } = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Authorization', `Bearer ${refreshToken}`);

    expect(status).toEqual(HttpStatus.OK);
    expect(body).toEqual({
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
    });
  });
});
