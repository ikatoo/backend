/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateSkillsPageDto } from 'src/modules/skills-page/dto/create-skills-page.dto';
import { accessTokenFactory } from 'src/test-utils/access_token-factory';
import { skillPageFactory } from 'src/test-utils/skill_page-factory';
import request from 'supertest';
import { userFactory } from '../src/test-utils/user-factory';
import { AppModule } from './../src/app.module';

describe('SkillsPagesController (e2e)', () => {
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
    await pgp.db.none('delete from skills_pages;');
  });

  it('/skills-page/user-id/:userId (GET)', async () => {
    const createdUser = await userFactory();

    const createdPage = await skillPageFactory(createdUser.id);

    const { body, status } = await request(app.getHttpServer()).get(
      `/skills-page/user-id/${createdUser.id}`,
    );

    const { user_id: userId, ...page } = createdPage;
    const expected = {
      ...page,
      projects: [],
    };

    expect(status).toEqual(200);
    expect(body).toEqual(expected);
  });

  it('/skills-page (POST)', async () => {
    const createdUser = await userFactory();

    const randomTestId = randomBytes(3).toString('hex');

    const mockedData: CreateSkillsPageDto = {
      title: `${randomTestId} Skill Page❗`,
      description: `<p>Description, skill page😄 ${randomTestId}</p>`,
    };

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .post('/skills-page')
      .set('Authorization', `Bearer ${token}`)
      .send(mockedData);

    const createdPage = await pgp.db.one(
      'select * from skills_pages where user_id=$1;',
      [createdUser.id],
    );
    const expected = {
      id: createdPage.id,
      ...mockedData,
      user_id: createdUser.id,
    };

    expect(body).toEqual({});
    expect(status).toEqual(201);
    expect(createdPage).toEqual(expected);
  });

  it('/skills-page (PATCH)', async () => {
    const createdUser = await userFactory();
    const randomTestId = randomBytes(3).toString('hex');
    const newValues = {
      title: `New Title ${randomTestId}`,
    };
    const createdPage = await skillPageFactory(createdUser.id);

    const data = {
      title: newValues.title,
    };

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .patch('/skills-page')
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    const updatedPage = await pgp.db.one(
      'select * from skills_pages where user_id=$1;',
      [createdUser.id],
    );
    const expected = {
      id: createdPage.id,
      title: newValues.title,
      description: createdPage.description,
      user_id: createdUser.id,
    };

    expect(body).toEqual({});
    expect(status).toEqual(204);
    expect(updatedPage).toEqual(expected);
  });

  // it('/skills/user-id/:userId (DELETE)', async () => {
  //   const { id } = await userFactory();
  //   const aboutPage = await aboutPageFactory(id);

  //   expect(aboutPage).toBeDefined();

  //   const { body, status } = await request(app.getHttpServer()).delete(
  //     `/skills/user-id/${id}`,
  //   );
  //   const deletedPage = await pgp.db.oneOrNone({
  //     text: 'select * from about_pages where user_id=$1',
  //     values: [id],
  //   });

  //   expect(status).toEqual(204);
  //   expect(body).toEqual({});
  //   expect(deletedPage).toBeNull();
  // });
});
