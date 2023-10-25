import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UsersService } from './user.service';

describe('UserService', () => {
  let userService: UsersService;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, CryptoService, PgPromiseService],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    pgp = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a user without error', async () => {
    await userService.create({
      name: 'Tetste',
      email: 'asdf@asdf.com',
      password: 'asldfjasdf',
    });
  });
});
