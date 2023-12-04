/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomInt } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { accessTokenFactory } from 'src/test-utils/access_token-factory';
import { projectFactory } from 'src/test-utils/project-factory';
import { projectOnUserFactory } from 'src/test-utils/project_on_user-factory';
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

  it('/projects/user-id/:userId (GET)', async () => {
    // const {
    //   hash_password: hash_password1,
    //   password: password1,
    //   ...user1
    // } = await userFactory();
    // const {
    //   hash_password: hash_password2,
    //   password: password2,
    //   ...user2
    // } = await userFactory();
    // const { body, status } = await request(app.getHttpServer()).get('/users');
    // const expected = [{ ...user1 }, { ...user2 }];
    // expect(status).toEqual(200);
    // expect(body).toEqual(expected);
  });

  it('/projects/title/:partialTitle (GET)', async () => {
    // const randomTestId = randomBytes(3).toString('hex');
    // const mockedUser: User = {
    //   name: `Name ${randomTestId}`,
    //   email: `email${randomTestId}@email.com`,
    //   password: 'password',
    // };
    // const { body, status } = await request(app.getHttpServer())
    //   .post('/user')
    //   .send(mockedUser);
    // const { hash_password, ...createdUser } = await pgp.db.oneOrNone(
    //   'select id, name, email, hash_password from users where email=$1;',
    //   [mockedUser.email],
    // );
    // const expected = {
    //   id: createdUser.id,
    //   name: mockedUser.name,
    //   email: mockedUser.email,
    // };
    // expect(body).toEqual({});
    // expect(status).toEqual(201);
    // expect(createdUser).toEqual(expected);
    // expect(await compareHash(mockedUser.password, hash_password)).toBeTruthy();
  });

  it('/project (POST)', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const createdUser = await userFactory();
    const start = new Date(`2021/${randomInt(1, 13)}/${randomInt(1, 28)}`);
    const lastUpdate = new Date();
    lastUpdate.setDate(start.getDate() + randomInt(500));
    const mockedData = {
      title: `title ${randomTestId}`,
      description: `description ${randomTestId}`,
      snapshot: `snapshot ${randomTestId}`,
      repositoryLink: `repositoryLink ${randomTestId}`,
      start,
      lastUpdate,
      skills: [{ title: `skill ${randomTestId}` }],
      userId: createdUser.id,
    };

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .post('/project')
      .set('Authorization', `Bearer ${token}`)
      .send(mockedData);

    const createdProject = await pgp.db.oneOrNone(
      'select * from projects where title=$1;',
      [mockedData.title],
    );

    const expected = {
      id: createdProject.id,
      title: mockedData.title,
      description: mockedData.description,
      snapshot: mockedData.snapshot,
      repository_link: mockedData.repositoryLink,
      start: mockedData.start.toLocaleDateString(),
      last_update: mockedData.lastUpdate.toLocaleDateString(),
    };

    expect(body).toEqual({});
    expect(status).toEqual(201);
    expect({
      ...createdProject,
      last_update: createdProject.last_update.toLocaleDateString(),
      start: createdProject.start.toLocaleDateString(),
    }).toEqual(expected);
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

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .patch(`/project/${createdProject.id}`)
      .set('Authorization', `Bearer ${token}`)
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

    const token = await accessTokenFactory(
      createdUser.email,
      createdUser.password,
    );
    const { body, status } = await request(app.getHttpServer())
      .delete(`/project/${createdProject.id}`)
      .set('Authorization', `Bearer ${token}`)
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
