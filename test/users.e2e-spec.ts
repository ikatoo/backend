/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { PgService } from 'src/infra/db/pg/pg.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let db: PgService;
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
    db = moduleFixture.get<PgService>(PgService);
    await app.init();
    await db.connect();
    await db.query('delete from users;');
  });

  afterEach(async () => {
    await db.end();
  });

  it('/users (GET)', async () => {
    await db.query('insert into users ($1) values $2;', [
      'name, email, hash_password',
      usersMock
        .map((user) => `(${user.name}, ${user.email}, ${user.password})`)
        .toString(),
    ]);

    const { body, status } = await request(app.getHttpServer()).get('/users');
    const result = body.map((user) => ({
      name: user.name,
      email: user.email,
      password: user.password,
    }));

    expect(status).toEqual(200);
    expect(result).toEqual(usersMock);
  });

  it('/user (POST)', async () => {
    const { body, status } = await request(app.getHttpServer())
      .post('/user')
      .send(usersMock[1]);

    const queryResult = await db.query(
      `select 
        id,
        name,
        email,
        hash_password as hash
      where email = $1;`,
      [usersMock[1].email],
    );
    const { id, name, email, hash } = queryResult.rows[0];

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
    const queryResult = await db.query(
      'insert into users($1) values ($2) returning id;',
      ['name, email, hash_password', Object.values(usersMock[0]).toString()],
    );
    const user = queryResult.rows[0];

    const { body, status } = await request(app.getHttpServer())
      .patch(`/user/${user.id}`)
      .send({ name: 'Updated User' });
    const updatedUser = await db.query(
      'select name, email, hash_password as password from users where id=$1;',
      [user.id],
    );

    expect(body).toEqual({});
    expect(status).toEqual(204);
    expect(updatedUser).toEqual({ ...user, name: 'Updated User' });
  });

  it('/user (DELETE)', async () => {
    const queryResult = await db.query(
      'insert into users($1) values ($2) returning id;',
      ['name, email, hash_password', Object.values(usersMock[0]).toString()],
    );
    const { id } = queryResult.rows[0];

    const { body, status } = await request(app.getHttpServer()).delete(
      `/user/${id}`,
    );
    const deletedUser = (
      await db.query(
        'select name, email, hash_password from users where id=$1',
        [id],
      )
    ).rows[0];

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedUser).toBeNull();
  });
});
