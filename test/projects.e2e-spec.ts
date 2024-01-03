/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomInt } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { tokensFactory } from 'src/test-utils/tokens-factory';
import { projectFactory } from 'src/test-utils/project-factory';
import { projectOnUserFactory } from 'src/test-utils/project_on_user-factory';
import { skillFactory } from 'src/test-utils/skill-factory';
import { skillOnUserProjectFactory } from 'src/test-utils/skill_on_user_project-factory';
import { userFactory } from 'src/test-utils/user-factory';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProjectsController (e2e)', () => {
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

  it('/ (GET) - list all projects with users', async () => {
    const createdUser = await userFactory();
    const createdProject = await projectFactory();
    await projectOnUserFactory(createdProject.id, createdUser.id);

    const { body, status } = await request(app.getHttpServer()).get(
      '/projects',
    );

    const projects = await pgp.db.many(
      `select
        p.id as id,
        p.title as title,
        p.description as description,
        p.snapshot as snapshot,
        p.repository_link as "repositoryLink",
        p.start as start,
        p.last_update as "lastUpdate"
      from projects as p;`,
    );

    const expected = await Promise.all(
      projects.map(async (project) => {
        const users = await pgp.db.manyOrNone<{ id: number; name: string }>(
          `select
            users.id as id,
            users.name as name,
            users.email as email
          from
            users,
            projects,
            projects_on_users as pou 
          where
            pou.user_id=users.id and
            pou.project_id=projects.id and
            projects.id=$1
          ;`,
          [project.id],
        );

        return {
          ...project,
          users,
        };
      }),
    );
    const result = body.map((project) => ({
      ...project,
      start: new Date(project.start),
      lastUpdate: new Date(project.lastUpdate),
    }));

    expect(status).toBe(200);
    expect(result).toEqual(expected);
  });

  it('/projects/user-id/:userId (GET)', async () => {
    const createdUser = await userFactory();
    const createdProject1 = await projectFactory();
    const createdProject2 = await projectFactory();
    const userProject1 = await projectOnUserFactory(
      createdProject1.id,
      createdUser.id,
    );
    const userProject2 = await projectOnUserFactory(
      createdProject2.id,
      createdUser.id,
    );
    const skills1 = await Promise.all(
      Array.from({ length: randomInt(1, 5) }, async () => await skillFactory()),
    );
    const skills2 = await Promise.all(
      Array.from({ length: randomInt(1, 5) }, async () => await skillFactory()),
    );
    await Promise.all(
      skills1.map((skill) =>
        skillOnUserProjectFactory(skill.id, userProject1.id),
      ),
    );
    await Promise.all(
      skills2.map((skill) =>
        skillOnUserProjectFactory(skill.id, userProject2.id),
      ),
    );

    const { body, status } = await request(app.getHttpServer()).get(
      `/projects/user-id/${createdUser.id}`,
    );

    const result = body.map((project) => {
      const { start, lastUpdate, skills, ...rest } = project;

      return {
        start: new Date(start).toLocaleDateString(),
        lastUpdate: new Date(lastUpdate).toLocaleDateString(),
        skills: (skills as any[]).sort((a, b) => a.id - b.id),
        ...rest,
      };
    });

    const expected = [
      {
        id: createdProject1.id,
        title: createdProject1.title,
        description: createdProject1.description,
        snapshot: createdProject1.snapshot,
        repositoryLink: createdProject1.repository_link,
        start: createdProject1.start.toLocaleDateString(),
        lastUpdate: createdProject1.last_update.toLocaleDateString(),
        skills: skills1.sort((a, b) => a.id - b.id),
        userId: createdUser.id,
      },
      {
        id: createdProject2.id,
        title: createdProject2.title,
        description: createdProject2.description,
        snapshot: createdProject2.snapshot,
        repositoryLink: createdProject2.repository_link,
        start: createdProject2.start.toLocaleDateString(),
        lastUpdate: createdProject2.last_update.toLocaleDateString(),
        skills: skills2.sort((a, b) => a.id - b.id),
        userId: createdUser.id,
      },
    ];

    expect(status).toEqual(200);
    expect(result).toEqual(expected);
  });

  it('/project (POST)', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const createdUser = await userFactory();

    const mockedData = {
      title: `title ${randomTestId}`,
      description: `description ${randomTestId}`,
      snapshot: `snapshot ${randomTestId}`,
      repositoryLink: `repositoryLink ${randomTestId}`,
      start: new Date(2021, 7, 9),
      lastUpdate: new Date(2022, 3, 6),
      skills: [{ title: `skill ${randomTestId}` }],
      userId: createdUser.id,
    };

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .post('/project')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockedData);

    const createdProject = await pgp.db
      .oneOrNone('select * from projects where title=$1;', [mockedData.title])
      .then((project) => ({
        ...project,
        start: (project.start as Date).toLocaleDateString('en-US', {
          dateStyle: 'short',
        }),
        last_update: (project.last_update as Date).toLocaleDateString('en-US', {
          dateStyle: 'short',
        }),
      }));

    const expected = {
      id: createdProject.id,
      title: mockedData.title,
      description: mockedData.description,
      snapshot: mockedData.snapshot,
      repository_link: mockedData.repositoryLink,
      start: mockedData.start.toLocaleDateString('en-US', {
        dateStyle: 'short',
      }),
      last_update: mockedData.lastUpdate.toLocaleDateString('en-US', {
        dateStyle: 'short',
      }),
    };

    expect(body).toEqual({
      id: createdProject.id,
    });
    expect(status).toEqual(201);
    expect(createdProject).toEqual(expected);
  });

  it('/project/:id (PATCH)', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const createdUser = await userFactory();
    const createdProject = await projectFactory();
    await projectOnUserFactory(createdProject.id, createdUser.id);
    const newData = {
      title: `New title ${randomTestId}`,
      description: `New Desc ${randomTestId}`,
    };

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .patch(`/project/${createdProject.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newData);

    const updatedProject = await pgp.db.one(
      'select * from projects where id=$1;',
      [createdProject.id],
    );
    const expected = {
      ...createdProject,
      id: createdProject.id,
      title: newData.title,
      description: newData.description,
    };

    expect(body).toEqual({});
    expect(status).toEqual(204);
    expect(updatedProject).toEqual(expected);
  });

  it('/project/:id (DELETE)', async () => {
    const createdUser = await userFactory();
    const createdProject = await projectFactory();
    await projectOnUserFactory(createdProject.id, createdUser.id);

    const { accessToken } = await tokensFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .delete(`/project/${createdProject.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const deletedProject = await pgp.db.oneOrNone(
      'select * from projects where id=$1;',
      [createdProject.id],
    );

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedProject).toBeNull();
  });
});
