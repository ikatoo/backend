/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateAboutPageDto } from 'src/modules/about-page/dto/create-about-page.dto';

describe('AboutPagesController (e2e)', () => {
  let app: INestApplication;
  let pgp: PgPromiseService;

  const mockedPage = {
    title: 'Page❗',
    description: '<p>Description, page😄</p>',
    image_url: '/public/teste-page.img',
    image_alt: 'imagem de teste page',
  };
  const mockedUser = {
    name: 'Teste',
    email: 'teste@teste.com',
    password: 'pass',
  };

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
    const createdUser = await pgp.db.one<{ id: number }>(
      `insert into users(
        name,
        email,
        hash_password
      ) values($1:raw) returning id;`,
      [
        Object.values(mockedUser)
          .map((value) => `'${value}'`)
          .toString(),
      ],
    );

    const createdPage = await pgp.db.one<{ id: number }>(
      `insert into about_pages(
      title,
      description,
      image_url,
      image_alt,
      user_id
    ) values($1:raw,$2) returning id;`,
      [
        Object.values(mockedPage)
          .map((value) => `'${value}'`)
          .toString(),
        createdUser.id,
      ],
    );

    const { body, status } = await request(app.getHttpServer()).get(
      `/about/user-id/${createdUser.id}`,
    );

    const { image_alt, image_url, ...page } = mockedPage;
    const expected = {
      ...page,
      id: createdPage.id,
      image: { alt: image_alt, url: image_url },
    };

    expect(status).toEqual(200);
    expect(body).toEqual(expected);
  });

  it('/about (POST)', async () => {
    const { id: userId } = await pgp.db.one<{ id: number }>(
      `insert into users(
        name,
        email,
        hash_password
      ) values($1:raw) returning id;`,
      [
        Object.values(mockedUser)
          .map((value) => `'${value}'`)
          .toString(),
      ],
    );

    const data: CreateAboutPageDto = {
      title: mockedPage.title,
      description: mockedPage.description,
      image: {
        imageUrl: mockedPage.image_url,
        imageAlt: mockedPage.image_alt,
      },
      userId,
    };

    const { body, status } = await request(app.getHttpServer())
      .post('/about')
      .send(data);
    const createdPage = await pgp.db.one(
      'select * from about_pages where user_id=$1;',
      [userId],
    );
    const expected = {
      id: createdPage.id,
      ...mockedPage,
      user_id: userId,
    };

    expect(body).toEqual({});
    expect(status).toEqual(201);
    expect(createdPage).toEqual(expected);
  });

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
