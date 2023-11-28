/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { User } from 'src/modules/user/IUserService';
import { accessTokenFactory } from 'src/test-utils/access_token-factory';
import { userFactory } from 'src/test-utils/user-factory';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
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
    await pgp.db.none('delete from users;');
  });

  it('/users (GET)', async () => {
    const {
      hash_password: hash_password1,
      password: password1,
      ...user1
    } = await userFactory();
    const {
      hash_password: hash_password2,
      password: password2,
      ...user2
    } = await userFactory();

    const { body, status } = await request(app.getHttpServer()).get('/users');

    const expected = [{ ...user1 }, { ...user2 }];

    expect(status).toEqual(200);
    expect(body).toEqual(expected);
  });

  it('/user (POST)', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const mockedUser: User = {
      name: `Name ${randomTestId}`,
      email: `email${randomTestId}@email.com`,
      password: 'password',
    };

    const { body, status } = await request(app.getHttpServer())
      .post('/user')
      .send(mockedUser);

    const { hash_password, ...createdUser } = await pgp.db.oneOrNone(
      'select id, name, email, hash_password from users where email=$1;',
      [mockedUser.email],
    );
    const expected = {
      id: createdUser.id,
      name: mockedUser.name,
      email: mockedUser.email,
    };

    expect(body).toEqual({});
    expect(status).toEqual(201);
    expect(createdUser).toEqual(expected);
    expect(await compareHash(mockedUser.password, hash_password)).toBeTruthy();
  });

  it('/user (PATCH)', async () => {
    await userFactory();
    const userMock = await userFactory();
    const newData = { name: 'Updated User' };

    const token = await accessTokenFactory(userMock.email, userMock.password);
    const { body, status } = await request(app.getHttpServer())
      .patch(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData);
    const { hash_password, ...updatedUser } = await pgp.db.oneOrNone(
      'select id, name, email, hash_password from users where id=$1;',
      [userMock.id],
    );
    const expected = {
      id: userMock.id,
      name: newData.name,
      email: userMock.email,
    };

    expect(body).toEqual({});
    expect(status).toEqual(204);
    expect(updatedUser).toEqual(expected);
    expect(await compareHash(userMock.password, hash_password)).toBeTruthy();
  });

  it('/user (DELETE)', async () => {
    await userFactory();
    const userMock = await userFactory();

    const token = await accessTokenFactory(userMock.email, userMock.password);
    const { body, status } = await request(app.getHttpServer())
      .delete(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    const deletedUser = await pgp.db.oneOrNone({
      text: 'select name, email, hash_password from users where id=$1',
      values: [userMock.id],
    });

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedUser).toBeNull();
  });
});
