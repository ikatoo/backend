import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaService();
  const { compareHash } = new CryptoService();
  const usersMock = [
    {
      name: 'Teste1',
      email: 'teste1@teste.com',
      password: 'teste1pass',
    },
    {
      name: 'Teste2',
      email: 'teste2@teste.com',
      password: 'teste2pass',
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', async () => {
    await prisma.user.deleteMany();
    const user1 = await prisma.user.create({ data: usersMock[0] });
    const user2 = await prisma.user.create({ data: usersMock[1] });

    const { body, status } = await request(app.getHttpServer()).get('/users');

    expect(status).toEqual(200);
    expect(body).toEqual([user1, user2]);
  });

  it('/user (POST)', async () => {
    await prisma.user.deleteMany();

    const { body, status } = await request(app.getHttpServer())
      .post('/user')
      .send(usersMock[1]);

    const {
      id,
      name,
      email,
      password: hash,
    } = await prisma.user.findUnique({
      where: { email: usersMock[1].email },
    });

    expect(body).toEqual({});
    expect(status).toEqual(201);
    expect(id).toBeDefined();
    expect({ name, email }).toEqual({
      name: usersMock[1].name,
      email: usersMock[1].email,
    });
    expect(await compareHash(usersMock[1].password, hash)).toBeTruthy();
  });

  it('/user (PATCH)', async () => {
    await prisma.user.deleteMany();
    const user = await prisma.user.create({ data: usersMock[0] });

    const { body, status } = await request(app.getHttpServer())
      .patch(`/user/${user.id}`)
      .send({ name: 'Updated User' });
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(body).toEqual({});
    expect(status).toEqual(204);
    expect(updatedUser).toEqual({ ...user, name: 'Updated User' });
  });

  it('/user (DELETE)', async () => {
    await prisma.user.deleteMany();
    const { id } = await prisma.user.create({ data: usersMock[0] });

    const { body, status } = await request(app.getHttpServer()).delete(
      `/user/${id}`,
    );
    const deletedUser = await prisma.user.findUnique({ where: { id } });

    expect(status).toEqual(204);
    expect(body).toEqual({});
    expect(deletedUser).toBeNull();
  });
});
