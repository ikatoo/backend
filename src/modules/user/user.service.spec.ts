import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UsersService } from './user.service';

describe('UserService', () => {
  let service: UsersService;
  // let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, CryptoService, PgPromiseService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    // pgp = module.get<PgPromiseService>(PgPromiseService);
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
