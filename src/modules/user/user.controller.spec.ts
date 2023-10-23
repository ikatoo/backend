import { Test, TestingModule } from '@nestjs/testing';
import { PgService } from 'src/infra/db/pg/pg.service';
import { UsersServicePg } from 'src/infra/db/pg/user/user.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UsersServicePg, PgService, CryptoService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
