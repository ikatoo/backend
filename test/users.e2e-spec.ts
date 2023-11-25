/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { accessTokenFactory } from 'src/test-utils/access_token-factory';
import { UsersService } from 'src/modules/user/user.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let pgp: PgPromiseService;
  let usersService: UsersService;
  const { compareHash } = new CryptoService();
  const usersMock = [
    {
      name: 'Teste1',
      email: 'teste1@teste.com',
      password: 'teste1pass',
    },
    {
      name: 'Teste2',
      email: 'teste2@teste.com',
      password: 'teste2pass',
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    pgp = moduleFixture.get<PgPromiseService>(PgPromiseService);
    usersService = moduleFixture.get<UsersService>(UsersService);

    await app.init();
    await pgp.db.none('delete from users;');
  });

  it('/users (GET)', async () => {
    const values = [
      usersMock
        .map((user) => `('${user.name}', '${user.email}', '${user.password}')`)
        .toString(),
    ];
    await pgp.db.none(
      `insert into users(name, email, hash_password) values${values}`,
    );

    const { body, status } = await request(app.getHttpServer()).get('/users');
    const result = body.map((user) => ({
      name: user.name,
      email: user.email,
    }));
    const expected = usersMock.map((user) => ({
      name: user.name,
      email: user.email,
    }));

    expect(status).toEqual(200);
    expect(result).toEqual(expected);
  });

  it('/user (POST)', async () => {
    const { body, status } = await request(app.getHttpServer())
      .post('/user')
      .send(usersMock[1]);

    const user = await pgp.db.oneOrNone(
      'select id, name, email, hash_password as hash from users where email=$1;',
      [usersMock[1].email],
    );
    const { id, name, email, hash } = user;

    expect(body).toEqual({});
    expect(status).toEqual(201);
    expect(id).toBeDefined();
    expect({ name, email }).toEqual({
      name: usersMock[1].name,
      email: usersMock[1].email,
    });
    expect(await compareHash(usersMock[1].password, hash)).toBeTruthy();
  });

  it('/user (PATCH)', async () => {
    const values = Object.values(usersMock[0]).map((value) => `'${value}'`);
    const { id: userId } = await pgp.db.oneOrNone(
      `insert into users(name, email, hash_password) values(${values}) returning id;`,
    );

    const token = await accessTokenFactory(
      usersMock[0].email,
      usersMock[0].password,
    );
    const { body, status } = await request(app.getHttpServer())
      .patch(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User' });
    const { hash, ...updatedUser } = await pgp.db.oneOrNone(
      'select id, name, email, hash_password as hash from users where id=$1;',
      [userId],
    );

    expect(body).toEqual({});
    expect(status).toEqual(204);
    expect(updatedUser).toEqual({
      id: userId,
      name: 'Updated User',
      email: usersMock[0].email,
    });
  });

  it('/user (DELETE)', async () => {
    const values = Object.values(usersMock[0])
      .map((value) => `'${value}'`)
      .toString();
    const user = await pgp.db.oneOrNone(
      'insert into users($1:raw) values ($2:raw) returning id;',
      ['name, email, hash_password', values],
    );
    const { id } = user;

    const token = await accessTokenFactory(
      usersMock[0].email,
      usersMock[0].password,
    );
    const { body, status } = await request(app.getHttpServer())
      .delete(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    const deletedUser = await pgp.db.oneOrNone({
      text: 'select name, email, hash_password from users where id=$1',
      values: [id],
    });

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedUser).toBeNull();
  });
});
