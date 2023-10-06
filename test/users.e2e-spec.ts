import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaService();
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

    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([user1, user2]);
  });
});
