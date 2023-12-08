/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomInt } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { accessTokenFactory } from 'src/test-utils/access_token-factory';
import request from 'supertest';
import { userFactory } from '../src/test-utils/user-factory';
import { AppModule } from './../src/app.module';
import { contactPageFactory } from 'src/test-utils/contact_page-factory';
import { CreateContactPageDto } from 'src/modules/contact-page/dto/create-contact-page.dto';

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

  it.only('/contact-page/user-id/:userId (GET)', async () => {
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
      localization: `()
        -22.4191${randomInt(10, 100)},
        -46.8320${randomInt(10, 100)}
      )`,
      userId: createdUser.id,
    };

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );

    const { body, status } = await request(app.getHttpServer())
      .post('/contact-page')
      .set('Authorization', `Bearer ${token}`)
      .send(mockedData);
    const createdPage = await pgp.db.one(
      'select * from contact_pages where user_id=$1;',
      [createdUser.id],
    );
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
      localization: `()
        -22.4191${randomInt(10, 100)},
        -46.8320${randomInt(10, 100)}
      )`,
    };
    const existentPage = await contactPageFactory(createdUser.id);

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .patch('/contact-page')
      .set('Authorization', `Bearer ${token}`)
      .send(newValues);

    const updatedPage = await pgp.db.one(
      'select * from contact_pages where user_id=$1;',
      [createdUser.id],
    );
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

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .delete('/contact-page')
      .set('Authorization', `Bearer ${token}`)
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
