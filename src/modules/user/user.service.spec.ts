import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { IDatabase } from 'pg-promise';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UsersService } from './user.service';

describe('UserService', () => {
  let userService: UsersService;
  let pgp: PgPromiseService;
  let db: IDatabase<any>;
  const crypto = new CryptoService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, CryptoService, PgPromiseService],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    pgp = module.get<PgPromiseService>(PgPromiseService);
    db = pgp.db;
    db.none('delete from users;');
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

  it('shoud update user', async () => {
    const testId = randomBytes(4).toString('hex');
    const mockedUser = {
      name: 'Tetste',
      email: 'asdf@asdf.com',
      password: 'asldfjasdf',
    };
    const newValues = { name: '_new_name', password: '_new_password' };
    const { id } = await db.oneOrNone(
      'insert into users values(default, $1:raw) returning id',
      [
        Object.values(mockedUser)
          .map((value) => `'${testId + value}'`)
          .toString(),
      ],
    );

    await userService.update(id, newValues);
  });
});
