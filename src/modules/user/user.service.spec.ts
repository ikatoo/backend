import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UsersService } from './user.service';

describe('UserService', () => {
  let userService: UsersService;
  let pgp: PgPromiseService;
  const crypto = new CryptoService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, CryptoService, PgPromiseService],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    pgp = module.get<PgPromiseService>(PgPromiseService);
    pgp.db.none('delete from users;');
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a user without error', async () => {
    const mockedUser = {
      name: 'Tetste',
      email: 'asdf@asdf.com',
      password: 'asldfjasdf',
    };
    await userService.create(mockedUser);

    const { id, hash_password, ...createdUser } = await pgp.db.oneOrNone(
      'select * from users where email=$1',
      [mockedUser.email],
    );
    const { password, ...expected } = mockedUser;

    expect(createdUser).toEqual(expected);
    expect(await crypto.compareHash(password, hash_password)).toBeTruthy();
    expect(id).toBeGreaterThan(0);
  });
});
