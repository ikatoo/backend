/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateAboutPageDto } from 'src/modules/about-page/dto/create-about-page.dto';
import { aboutPageFactory } from 'src/test-utils/about_page-factory';
import { tokensFactory } from 'src/test-utils/tokens-factory';
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
    const createdUser = await userFactory();

    const randomTestId = randomBytes(10).toString('hex');
    const mockedData: CreateAboutPageDto = {
      title: `${randomTestId} title`,
      description: `${randomTestId} description`,
      image: {
        imageUrl: `https://image_url.com/${randomTestId}.png`,
        imageAlt: `${randomTestId} image_alt`,
      },
    };

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );

    const { body, status } = await request(app.getHttpServer())
      .post('/about-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockedData);
    const createdPage = await pgp.db.one(
      'select * from about_pages where user_id=$1;',
      [createdUser.id],
    );
    const expected = {
      id: createdPage.id,
      title: mockedData.title,
      description: mockedData.description,
      image_url: mockedData.image.imageUrl,
      image_alt: mockedData.image.imageAlt,
      user_id: createdUser.id,
    };

    expect(body).toEqual({});
    expect(status).toEqual(201);
    expect(createdPage).toEqual(expected);
  });

  it('/about-page (PATCH)', async () => {
    const createdUser = await userFactory();
    const randomTestId = randomBytes(10).toString('hex');
    const newValues = {
      title: `New Title ${randomTestId}`,
      image_url: `https://image_url.com/new-image-${randomTestId}.jpg`,
      image_alt: `new-image alt ${randomTestId}`,
    };
    const existentPage = await aboutPageFactory(createdUser.id);

    const data = {
      title: newValues.title,
      image: {
        imageUrl: newValues.image_url,
        imageAlt: newValues.image_alt,
      },
    };

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .patch('/about-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data);

    const updatedPage = await pgp.db.one(
      'select * from about_pages where user_id=$1;',
      [createdUser.id],
    );
    const expected = {
      id: existentPage.id,
      title: newValues.title,
      description: existentPage.description,
      image_url: newValues.image_url,
      image_alt: newValues.image_alt,
      user_id: createdUser.id,
    };

    expect(body).toEqual({});
    expect(status).toEqual(204);
    expect(updatedPage).toEqual(expected);
  });

  it('/about-page (DELETE)', async () => {
    const createdUser = await userFactory();
    const aboutPage = await aboutPageFactory(createdUser.id);

    expect(aboutPage).toBeDefined();

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .delete('/about-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    const deletedPage = await pgp.db.oneOrNone({
      text: 'select * from about_pages where user_id=$1',
      values: [createdUser.id],
    });

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedPage).toBeNull();
  });
});
