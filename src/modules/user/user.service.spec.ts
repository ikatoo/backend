import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { IDatabase } from 'pg-promise';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { NodeMailerService } from 'src/infra/mailer/node-mailer/node-mailer.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { userFactory } from 'src/test-utils/user-factory';
import { UsersService } from './user.service';

describe('UserService', () => {
  let userService: UsersService;
  let pgp: PgPromiseService;
  let db: IDatabase<any>;
  const cryptoService = new CryptoService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        CryptoService,
        PgPromiseService,
        NodeMailerService,
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    pgp = module.get<PgPromiseService>(PgPromiseService);
    db = pgp.db;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a user without error', async () => {
    const testId = randomBytes(4).toString('hex');
    const mockedUser = {
      name: `${testId}Tetste`,
      email: `${testId}asdf@asdf.com`,
      password: `${testId}asldfjasdf`,
    };
    await userService.create(mockedUser);

    const { id, hash_password, ...createdUser } = await pgp.db.oneOrNone(
      'select * from users where email ilike $1',
      [mockedUser.email],
    );
    const { password, ...expected } = mockedUser;

    expect(createdUser).toEqual({ ...expected, enabled: false });
    expect(
      await cryptoService.compareHash(password, hash_password),
    ).toBeTruthy();
    expect(id).toBeGreaterThan(0);
  });

  it('shoud update user', async () => {
    const testId = randomBytes(4).toString('hex');
    const mockedUser = {
      name: `${testId}Tetste`,
      email: `${testId}asdf@asdf.com`,
      password: `${testId}asldfjasdf`,
    };
    const { id } = await db.oneOrNone(
      'insert into users values(default, $1:raw) returning id',
      [
        Object.values(mockedUser)
          .map((value) => `'${value}'`)
          .toString(),
      ],
    );

    const newValues = { name: '_new_name', password: '_new_password' };
    await userService.update(id, newValues);

    const updatedUser = await db.oneOrNone('select * from users where id=$1', [
      id,
    ]);
    const expected = {
      name: updatedUser.name,
      email: updatedUser.email,
    };

    expect(expected).toEqual({
      name: newValues.name,
      email: mockedUser.email,
    });
    expect(
      await cryptoService.compareHash(
        mockedUser.password,
        updatedUser.hash_password,
      ),
    ).toBeFalsy();

    expect(
      await cryptoService.compareHash(
        newValues.password,
        updatedUser.hash_password,
      ),
    ).toBeTruthy();
  });

  it('should delete user', async () => {
    const mockedUsers = await Promise.all(
      Array.from({ length: 4 }, async (_, i) => {
        const randomTestId = await randomBytes(4).toString('hex');
        return {
          name: `User ${i} ${randomTestId}`,
          email: `email${i}${randomTestId}@teste.com$`,
          password: `pass${i}${randomTestId}`,
        };
      }),
    );

    const values = mockedUsers
      .map((user) => `('${user.name}', '${user.email}', '${user.password}')`)
      .toString();
    await pgp.db.none(
      'insert into users(name, email, hash_password) values$1:raw',
      [values],
    );
    const user = await pgp.db.one('select * from users where email ilike $1;', [
      mockedUsers[2].email,
    ]);
    await userService.remove(user.id);
    const deletedUser = await pgp.db.oneOrNone(
      'select * from users where email ilike $1;',
      [mockedUsers[2].email],
    );

    expect(deletedUser).toBeNull();
  });

  it('should be send email with new password', async () => {
    const spy = jest
      .spyOn(NodeMailerService.prototype, 'send')
      .mockResolvedValueOnce({
        accepted: true,
        response: '250 Accepted',
      });
    const mockedUser = await userFactory();

    await userService.recoveryPassword(mockedUser.email);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
