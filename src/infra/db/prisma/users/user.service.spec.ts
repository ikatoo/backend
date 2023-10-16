import { Test, TestingModule } from '@nestjs/testing';
import { UsersServicePrisma } from './user.service';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';

describe('UserService', () => {
  let service: UsersServicePrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersServicePrisma, PrismaService, CryptoService],
    }).compile();

    service = module.get<UsersServicePrisma>(UsersServicePrisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user without error', async () => {
    await expect(
      service.create({
        name: 'Tetste',
        email: 'asdf@asdf.com',
        password: 'asjdf',
      }),
    ).resolves.not.toThrowError();
  });
});
