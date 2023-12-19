/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomInt } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateContactPageDto } from 'src/modules/contact-page/dto/create-contact-page.dto';
import { tokensFactory } from 'src/test-utils/tokens-factory';
import { contactPageFactory } from 'src/test-utils/contact_page-factory';
import request from 'supertest';
import { userFactory } from '../src/test-utils/user-factory';
import { AppModule } from './../src/app.module';

describe('ContactPagesController (e2e)', () => {
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

  it('/contact-page/user-id/:userId (GET)', async () => {
    const createdUser = await userFactory();

    const createdPage = await contactPageFactory(createdUser.id);
    const { user_id, ...page } = createdPage;
    const expected = {
      ...page,
      userId: createdUser.id,
    };

    const { body, status } = await request(app.getHttpServer()).get(
      `/contact-page/user-id/${createdUser.id}`,
    );

    expect(status).toEqual(200);
    expect(body).toEqual(expected);
  });

  it('/contact-page (POST)', async () => {
    const createdUser = await userFactory();

    const randomTestId = randomBytes(10).toString('hex');
    const mockedData: CreateContactPageDto = {
      title: `${randomTestId} title`,
      description: `${randomTestId} description`,
      email: `${randomTestId}@email.com`,
      localization: `(${parseFloat(
        `-22.4191${randomInt(10, 100)}`,
      ).toLocaleString('en-US', {
        minimumFractionDigits: 7,
        useGrouping: false,
      })}, ${parseFloat(`-46.8320${randomInt(10, 100)}`).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 7,
          useGrouping: false,
        },
      )})`,
      userId: createdUser.id,
    };

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );

    const { body, status } = await request(app.getHttpServer())
      .post('/contact-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockedData);

    const createdPage = await pgp.db
      .one('select * from contact_pages where user_id=$1;', [createdUser.id])
      .then(({ localization, ...page }) => ({
        ...page,
        localization: `(${parseFloat(localization.x).toLocaleString('en-US', {
          minimumFractionDigits: 7,
          useGrouping: false,
        })}, ${parseFloat(localization.y).toLocaleString('en-US', {
          minimumFractionDigits: 7,
          useGrouping: false,
        })})`,
      }));
    const expected = {
      id: createdPage.id,
      title: mockedData.title,
      description: mockedData.description,
      email: mockedData.email,
      localization: mockedData.localization,
      user_id: createdUser.id,
    };

    expect(body).toEqual({});
    expect(status).toEqual(201);
    expect(createdPage).toEqual(expected);
  });

  it('/contact-page (PATCH)', async () => {
    const createdUser = await userFactory();
    const randomTestId = randomBytes(10).toString('hex');
    const newValues = {
      title: `New Title ${randomTestId}`,
      localization: `(${parseFloat(
        `-22.4191${randomInt(10, 100)}`,
      ).toLocaleString('en-US', {
        minimumFractionDigits: 7,
        useGrouping: false,
      })}, ${parseFloat(`-46.8320${randomInt(10, 100)}`).toLocaleString(
        'en-US',
        {
          minimumFractionDigits: 7,
          useGrouping: false,
        },
      )})`,
    };
    const existentPage = await contactPageFactory(createdUser.id);

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .patch('/contact-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newValues);

    const updatedPage = await pgp.db
      .one('select * from contact_pages where user_id=$1;', [createdUser.id])
      .then((page) => ({
        ...page,
        localization: `(${parseFloat(page.localization.x).toLocaleString(
          'en-US',
          {
            minimumFractionDigits: 7,
            useGrouping: false,
          },
        )}, ${parseFloat(page.localization.y).toLocaleString('en-US', {
          minimumFractionDigits: 7,
          useGrouping: false,
        })})`,
      }));
    const expected = {
      id: existentPage.id,
      title: newValues.title,
      description: existentPage.description,
      email: existentPage.email,
      localization: newValues.localization,
      user_id: createdUser.id,
    };

    expect(body).toEqual({});
    expect(status).toEqual(204);
    expect(updatedPage).toEqual(expected);
  });

  it('/contact-page (DELETE)', async () => {
    const createdUser = await userFactory();
    const contactPage = await contactPageFactory(createdUser.id);

    expect(contactPage).toBeDefined();

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .delete('/contact-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    const deletedPage = await pgp.db.oneOrNone({
      text: 'select * from contact_pages where user_id=$1',
      values: [createdUser.id],
    });

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedPage).toBeNull();
  });
});
