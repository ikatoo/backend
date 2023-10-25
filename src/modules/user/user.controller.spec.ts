import { Test, TestingModule } from '@nestjs/testing';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import config from 'src/infra/db/pg/config';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UserController } from './user.controller';
import { UsersService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestPgpromiseModule.register({
          isGlobal: false,
          connection: config,
        }),
      ],
      controllers: [UserController],
      providers: [UsersService, CryptoService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
