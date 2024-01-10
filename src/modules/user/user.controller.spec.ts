import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { randomBytes } from 'crypto';
import { User } from './IUserService';
import { NodeMailerService } from 'src/infra/mailer/node-mailer/node-mailer.service';

describe('UserController', () => {
  let userController: UserController;
  let pgp: PgPromiseService;
  let crypto: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UsersService,
        CryptoService,
        PgPromiseService,
        NodeMailerService,
      ],
      imports: [AppModule],
    }).compile();

    userController = module.get<UserController>(UserController);
    pgp = module.get<PgPromiseService>(PgPromiseService);
    crypto = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should create user', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const mockUser: User = {
      email: `email-${randomTestId}@domain.com`,
      name: `Name ${randomTestId}`,
      password: `password-${randomTestId}`,
    };

    const body = await userController.create(mockUser);
    const { hash_password, ...createdUser } = await pgp.db.one(
      'select * from users where email=$1',
      [mockUser.email],
    );

    expect(body).toEqual({ id: createdUser.id });
    expect(createdUser).toEqual({
      id: createdUser.id,
      name: mockUser.name,
      email: mockUser.email,
      enabled: false,
    });
    expect(
      await crypto.compareHash(mockUser.password, hash_password),
    ).toBeTruthy();
  });
});
