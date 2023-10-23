import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { PgService } from '../pg.service';
import { UsersServicePg } from './user.service';

describe('UserService', () => {
  let service: UsersServicePg;
  // let pgClient: PgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersServicePg, PgService, CryptoService],
    }).compile();

    service = module.get<UsersServicePg>(UsersServicePg);
    // pgClient = module.get<PgService>(PgService);
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
