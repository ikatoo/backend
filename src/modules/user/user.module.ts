import { Module } from '@nestjs/common';
import { PgService } from 'src/infra/db/pg/pg.service';
import { UsersServicePg } from 'src/infra/db/pg/user/user.service';
import { CryptoService } from '../../infra/security/crypto/crypto.service';
import { UserController } from './user.controller';
import { UsersController } from './users.controller';

@Module({
  controllers: [UserController, UsersController],
  providers: [UsersServicePg, PgService, CryptoService],
})
export class UserModule {}
