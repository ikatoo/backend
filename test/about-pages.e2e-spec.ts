/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateAboutPageDto } from 'src/modules/about-page/dto/create-about-page.dto';
import {
  aboutPageFactory,
  mockedAboutPage,
} from 'src/test-utils/about_page-factory';
import { accessTokenFactory } from 'src/test-utils/access_token-factory';
import request from 'supertest';
import { userFactory } from '../src/test-utils/user-factory';
import { AppModule } from './../src/app.module';

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

  it('/about-page/user-id/:userId (GET)', async () => {
    const createdUser = await userFactory();

    const createdPage = await aboutPageFactory(createdUser.id);

    const { body, status } = await request(app.getHttpServer()).get(
      `/about-page/user-id/${createdUser.id}`,
    );

    const { image_alt, image_url, user_id, ...page } = createdPage;
    const expected = {
      ...page,
      image: { alt: image_alt, url: image_url },
    };

    expect(status).toEqual(200);
    expect(body).toEqual(expected);
  });

  it('/about-page (POST)', async () => {
    const { id: userId, hash_password: password, email } = await userFactory();

    const data: CreateAboutPageDto = {
      title: mockedAboutPage.title,
      description: mockedAboutPage.description,
      image: {
        imageUrl: mockedAboutPage.image_url,
        imageAlt: mockedAboutPage.image_alt,
      },
    };

    const token = await accessTokenFactory(email, password);

    const { body, status } = await request(app.getHttpServer())
      .post('/about-page')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    const createdPage = await pgp.db.one(
      'select * from about_pages where user_id=$1;',
      [userId],
    );
    const expected = {
      id: createdPage.id,
      ...mockedAboutPage,
      user_id: userId,
    };

    expect(body).toEqual({});
    expect(status).toEqual(201);
    expect(createdPage).toEqual(expected);
  });

  it('/about-page (PATCH)', async () => {
    const { id: userId, email, hash_password: password } = await userFactory();
    const newValues = {
      title: 'New Title',
      image_url: 'new-image.jpg',
      image_alt: 'new-image alt',
    };
    const { id: pageId } = await aboutPageFactory(userId);

    const data = {
      title: newValues.title,
      image: {
        imageUrl: newValues.image_url,
        imageAlt: newValues.image_alt,
      },
    };

    const token = await accessTokenFactory(email, password);
    const { body, status } = await request(app.getHttpServer())
      .patch('/about-page')
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    const updatedPage = await pgp.db.one(
      'select * from about_pages where user_id=$1;',
      [userId],
    );
    const expected = {
      id: pageId,
      title: newValues.title,
      description: mockedAboutPage.description,
      image_url: newValues.image_url,
      image_alt: newValues.image_alt,
      user_id: userId,
    };

    expect(body).toEqual({});
    expect(status).toEqual(204);
    expect(updatedPage).toEqual(expected);
  });

  it('/about-page (DELETE)', async () => {
    const { id, email, hash_password: password } = await userFactory();
    const aboutPage = await aboutPageFactory(id);

    expect(aboutPage).toBeDefined();

    const token = await accessTokenFactory(email, password);
    const { body, status } = await request(app.getHttpServer())
      .delete('/about-page')
      .set('Authorization', `Bearer ${token}`)
      .send();
    const deletedPage = await pgp.db.oneOrNone({
      text: 'select * from about_pages where user_id=$1',
      values: [id],
    });

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedPage).toBeNull();
  });
});
