import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from 'src/infra/db/pg/db.module';
import { UsersServicePg } from 'src/infra/db/pg/user/user.service';
import { CryptoService } from 'src/infra/security/crypto/crypto.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule],
      controllers: [UserController],
      providers: [UsersServicePg, CryptoService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
