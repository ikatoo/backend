import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { PgService } from '../pg.service';
import { UserServicePg } from './user.service';

describe('UserService', () => {
  let service: UserServicePg;
  // let pgClient: PgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserServicePg, PgService, CryptoService],
    }).compile();

    service = module.get<UserServicePg>(UserServicePg);
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
        password: 'asjdf',
      }),
    ).resolves.not.toThrowError();
  });
});
