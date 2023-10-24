import { Module } from '@nestjs/common';
import { DbModule } from 'src/infra/db/pg/db.module';
import { UsersServicePg } from 'src/infra/db/pg/user/user.service';
import { CryptoService } from '../../infra/security/crypto/crypto.service';
import { UserController } from './user.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [DbModule],
  controllers: [UserController, UsersController],
  providers: [UsersServicePg, CryptoService],
})
export class UserModule {}
