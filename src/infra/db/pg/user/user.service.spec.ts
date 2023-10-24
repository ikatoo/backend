import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { DbModule } from '../db.module';
import { UsersServicePg } from './user.service';

describe('UserService', () => {
  let service: UsersServicePg;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule],
      providers: [UsersServicePg, CryptoService],
    }).compile();

    service = module.get<UsersServicePg>(UsersServicePg);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user without error', async () => {
    await expect(
      service.create({
        name: 'Tetste',
        email: 'asdf@asdf.com',
        password: 'asldfjasdf',
      }),
    ).resolves.not.toThrowError();
  });
});
