/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { accessTokenFactory } from 'src/test-utils/access_token-factory';
import { userFactory } from 'src/test-utils/user-factory';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('/auth (e2e)', () => {
  let app: INestApplication;
  let pgp: PgPromiseService;
  const { compareHash } = new CryptoService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    pgp = moduleFixture.get<PgPromiseService>(PgPromiseService);

    await app.init();
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

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .post('/auth/verify-token')
      .set('Authorization', `Bearer ${token}`);

    expect(body).toEqual({
      user: {
        exp: body.user.exp,
        iat: body.user.iat,
        sub: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
        },
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
});
