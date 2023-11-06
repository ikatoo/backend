/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';

describe('AboutPagesController (e2e)', () => {
  let app: INestApplication;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    pgp = moduleFixture.get<PgPromiseService>(PgPromiseService);
    await app.init();
    await pgp.db.none('delete from users;');
    await pgp.db.none('delete from about_pages;');
  });

  it('/about/user-id/:userId (GET)', async () => {
    const mockedPages = Array.from({ length: 2 }, (_, i) => ({
      title: `Page ${i}❗`,
      description: `<p>Description, page ${i}😄</p>`,
      image_url: `/public/teste-page${i}.img`,
      image_alt: `imagem de teste page ${i}`,
    }));
    const mockedUsers = Array.from({ length: 2 }, (_, i) => ({
      name: `Teste ${i}`,
      email: `teste${i}@teste.com`,
      password: `pass${i}`,
    }));

    const createdUsers = await pgp.db.many(
      `insert into about_pages(
        name,
        email,
        hash_password
      ) values($1),($2) returning id;`,
      [mockedUsers.map((user) => `${Object.values(user).toString()}`)],
    );

    console.log(createdUsers);

    // const { body, status } = await request(app.getHttpServer()).get(
    //   `/about/user-id/${userId}`,
    // );
    // const result = body.map((user) => ({
    //   name: user.name,
    //   email: user.email,
    // }));
    // const expected = usersMock.map((user) => ({
    //   name: user.name,
    //   email: user.email,
    // }));

    // expect(status).toEqual(200);
    // expect(result).toEqual(expected);
  });

  // it('/about (POST)', async () => {
  //   const { body, status } = await request(app.getHttpServer())
  //     .post('/user')
  //     .send(usersMock[1]);

  //   const user = await pgp.db.oneOrNone(
  //     'select id, name, email, hash_password as hash from users where email=$1;',
  //     [usersMock[1].email],
  //   );
  //   const { id, name, email, hash } = user;

  //   expect(body).toEqual({});
  //   expect(status).toEqual(201);
  //   expect(id).toBeDefined();
  //   expect({ name, email }).toEqual({
  //     name: usersMock[1].name,
  //     email: usersMock[1].email,
  //   });
  //   expect(await compareHash(usersMock[1].password, hash)).toBeTruthy();
  // });

  // it('/user (PATCH)', async () => {
  //   const values = Object.values(usersMock[0]).map((value) => `'${value}'`);
  //   const { id: userId } = await pgp.db.oneOrNone(
  //     `insert into users(name, email, hash_password) values(${values}) returning id;`,
  //   );

  //   const { body, status } = await request(app.getHttpServer())
  //     .patch(`/user/${userId}`)
  //     .send({ name: 'Updated User' });
  //   const { hash, ...updatedUser } = await pgp.db.oneOrNone(
  //     'select id, name, email, hash_password as hash from users where id=$1;',
  //     [userId],
  //   );

  //   expect(body).toEqual({});
  //   expect(status).toEqual(204);
  //   expect(updatedUser).toEqual({
  //     id: userId,
  //     name: 'Updated User',
  //     email: usersMock[0].email,
  //   });
  // });

  // it('/user (DELETE)', async () => {
  //   const values = Object.values(usersMock[0])
  //     .map((value) => `'${value}'`)
  //     .toString();
  //   const user = await pgp.db.oneOrNone(
  //     'insert into users($1:raw) values ($2:raw) returning id;',
  //     ['name, email, hash_password', values],
  //   );
  //   const { id } = user;

  //   const { body, status } = await request(app.getHttpServer()).delete(
  //     `/user/${id}`,
  //   );
  //   const deletedUser = await pgp.db.oneOrNone({
  //     text: 'select name, email, hash_password from users where id=$1',
  //     values: [id],
  //   });

  //   expect(status).toEqual(204);
  //   expect(body).toEqual({});
  //   expect(deletedUser).toBeNull();
  // });
});
