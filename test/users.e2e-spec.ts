/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
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
    await app.init();
    await db.none('delete from users;');
  });

  it('/users (GET)', async () => {
    const values = [
      usersMock
        .map((user) => `('${user.name}', '${user.email}', '${user.password}')`)
        .toString(),
    ];
    await db.none('insert into users(name, email, hash_password) values$1', [
      values,
    ]);

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

    const user = await db.oneOrNone(
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

  it.only('/user (PATCH)', async () => {
    const values = Object.values(usersMock[0]).map((value) => `'${value}'`);
    const rows = await db.manyOrNone(
      "insert into users(name, email, hash_password) values('$1', '$2', '$3') returning id;",
      [usersMock[0].name, usersMock[0].email, usersMock[0].password],
    );
    // const queryTransaction = `
    //   insert into users(name, email, hash_password)
    //   values(${values})
    //   returning id;`;
    // const rows = await transaction(queryTransaction);
    // const user = rows[0];

    // const { body, status } = await request(app.getHttpServer())
    //   .patch(`/user/${user.id}`)
    //   .send({ name: 'Updated User' });
    // const updatedUser = (
    //   await query(
    //     'select name, email, hash_password as password from users where id=$1;',
    //     [user.id],
    //   )
    // )[0];

    // expect(body).toEqual({});
    // expect(status).toEqual(204);
    // expect(updatedUser).toEqual({ ...user, name: 'Updated User' });
  });

  it('/user (DELETE)', async () => {
    const user = await db.oneOrNone(
      'insert into users($1) values ($2) returning id;',
      ['name, email, hash_password', Object.values(usersMock[0]).toString()],
    );
    const { id } = user;

    const { body, status } = await request(app.getHttpServer()).delete(
      `/user/${id}`,
    );
    const deletedUser = (
      await db.oneOrNone({
        text: 'select name, email, hash_password from users where id=$1',
        values: [id],
      })
    )[0];

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedUser).toBeNull();
  });
});
