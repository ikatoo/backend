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
import { projectFactory } from 'src/test-utils/project-factory';
import { projectOnUserFactory } from 'src/test-utils/project_on_user-factory';
import { skillFactory } from 'src/test-utils/skill-factory';
import { skillOnUserProjectFactory } from 'src/test-utils/skill_on_user_project-factory';

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
    const createdProject1 = await projectFactory().then(
      ({ last_update, start, repository_link, ...project }) => ({
        ...project,
        lastUpdate: last_update.toLocaleDateString(),
        start: start.toLocaleDateString(),
        repositoryLink: repository_link,
        userId: createdUser.id,
      }),
    );
    const createdProject2 = await projectFactory().then(
      ({ last_update, start, repository_link, ...project }) => ({
        ...project,
        lastUpdate: last_update.toLocaleDateString(),
        start: start.toLocaleDateString(),
        repositoryLink: repository_link,
        userId: createdUser.id,
      }),
    );
    const projectOnUser1 = await projectOnUserFactory(
      createdProject1.id,
      createdUser.id,
    );
    const projectOnUser2 = await projectOnUserFactory(
      createdProject2.id,
      createdUser.id,
    );
    const commonSkill1 = await skillFactory();
    const commonSkill2 = await skillFactory();
    const skillOfProject1 = await skillFactory();
    const skillOfProject2 = await skillFactory();
    await Promise.all([
      skillOnUserProjectFactory(commonSkill1.id, projectOnUser1.id),
      skillOnUserProjectFactory(commonSkill2.id, projectOnUser1.id),
      skillOnUserProjectFactory(commonSkill1.id, projectOnUser2.id),
      skillOnUserProjectFactory(commonSkill2.id, projectOnUser2.id),
      skillOnUserProjectFactory(skillOfProject1.id, projectOnUser1.id),
      skillOnUserProjectFactory(skillOfProject2.id, projectOnUser2.id),
    ]);

    const createdPage = await skillPageFactory(createdUser.id);

    const { body, status } = await request(app.getHttpServer()).get(
      `/skills-page/user-id/${createdUser.id}`,
    );

    const { user_id: userId, ...page } = createdPage;
    const expected = {
      ...page,
      projects: [
        {
          ...createdProject1,
          skills: [commonSkill1, commonSkill2, skillOfProject1],
        },
        {
          ...createdProject2,
          skills: [commonSkill1, commonSkill2, skillOfProject2],
        },
      ],
    };
    const { projects, ...rest } = body;
    const result = {
      ...rest,
      projects: projects.map(({ lastUpdate, start, ...project }) => ({
        ...project,
        start: new Date(start).toLocaleDateString(),
        lastUpdate: new Date(lastUpdate).toLocaleDateString(),
      })),
    };

    expect(status).toEqual(200);
    expect(result).toEqual(expected);
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

  it('/skills/user-id/:userId (DELETE)', async () => {
    const createdUser = await userFactory();
    await skillPageFactory(createdUser.id);

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .delete(`/skills-page`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    const deletedPage = await pgp.db.oneOrNone({
      text: 'select * from skills_pages where user_id=$1',
      values: [createdUser.id],
    });

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedPage).toBeNull();
  });
});
